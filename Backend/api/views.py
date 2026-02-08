import random
import string
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import redirect
from social_django.utils import psa
from .models import CustomUser, OTPVerification
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    OTPVerificationSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'status': 'ok',
            'message': 'API is working fine and ready to serve requests. Welcome to QuantumSim API! 🚀',
            'timestamp': timezone.now().isoformat(),
            'application': {
                'name': 'QuantumSim',
                'version': '1.0.0',
                'description': 'Cloud-based quantum computing simulator',
                'author': 'Zypject.com'
            },
            'endpoints': {
                'register': '/api/register/',
                'login': '/api/login/',
                'verify-otp': '/api/verify-otp/',
                'resend-otp': '/api/resend-otp/',
                'profile': '/api/profile/',
                'forgot-password': '/api/forgot-password/',
                'reset-password': '/api/reset-password/'
            },
            'health': {
                'database': 'connected',
                'email_service': 'available',
                'social_auth': 'enabled'
            }
        }, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'status': 'ok',
            'message': 'API is working fine and ready to serve requests. Welcome to QuantumSim API! 🚀 create by zypject.com',
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_200_OK)


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def generate_otp_expiry():
    return timezone.now() + timedelta(minutes=1)


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate OTP for verification
            otp_code = generate_otp()
            expires_at = generate_otp_expiry()
            OTPVerification.objects.create(
                user=user,
                otp_code=otp_code,
                expires_at=expires_at
            )
            
            # Send OTP to user's email
            from django.core.mail import send_mail
            subject = 'Your OTP Verification Code'
            message = f'Your OTP verification code is: {otp_code}\n\nThis code will expire in 1 minutes.'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
            
            try:
                send_mail(subject, message, email_from, recipient_list)
            except Exception as e:
                print(f"Error sending email: {e}")
                # For debugging, print the OTP to console so we can test without email
                print(f"OTP Code for {user.email}: {otp_code} (expires in 1 minutes)")
            
            return Response({
                "message": "User registered successfully. Please verify your email with the OTP sent to your email address.",
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(email=email, password=password)
            
            if user:
                if user.is_verified:
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': UserSerializer(user).data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'Email not verified. Please verify your email first.'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            try:
                user = CustomUser.objects.get(email=email)
                otp_verification = OTPVerification.objects.get(user=user)
                
                if timezone.now() > otp_verification.expires_at:
                    return Response({
                        'error': 'OTP has expired. Please request a new one.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if otp_verification.otp_code == otp_code:
                    user.is_verified = True
                    user.save()
                    otp_verification.delete()
                    
                    return Response({
                        'message': 'Email verified successfully. You can now login.'
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'Invalid OTP code.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except CustomUser.DoesNotExist:
                return Response({
                    'error': 'User with this email does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)
            except OTPVerification.DoesNotExist:
                return Response({
                    'error': 'No OTP found for this user. Please register again.'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
            
            if user.is_verified:
                return Response({
                    'error': 'Email already verified.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete existing OTP if exists
            OTPVerification.objects.filter(user=user).delete()
            
            # Generate new OTP
            otp_code = generate_otp()
            expires_at = generate_otp_expiry()
            OTPVerification.objects.create(
                user=user,
                otp_code=otp_code,
                expires_at=expires_at
            )
            
            # Send OTP to user's email
            from django.core.mail import send_mail
            subject = 'Your OTP Verification Code'
            message = f'Your OTP verification code is: {otp_code}\n\nThis code will expire in 10 minutes.'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
            
            try:
                send_mail(subject, message, email_from, recipient_list)
            except Exception as e:
                print(f"Error sending email: {e}")
                # For debugging, print the OTP to console so we can test without email
                print(f"OTP Code for {user.email}: {otp_code} (expires in 10 minutes)")
            
            return Response({
                'message': 'New OTP sent to your email address.'
            }, status=status.HTTP_200_OK)
            
        except CustomUser.DoesNotExist:
            return Response({
                'error': 'User with this email does not exist.'
            }, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = CustomUser.objects.get(email=email)
                
                # Generate password reset token
                from django.contrib.auth.tokens import default_token_generator
                from django.utils.http import urlsafe_base64_encode
                from django.utils.encoding import force_bytes
                
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                
                # Send password reset email
                reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
                
                from django.core.mail import send_mail
                subject = 'Password Reset Request'
                message = f'You requested a password reset for your QuantumSim account.\n\n' \
                          f'Please click the link below to reset your password:\n{reset_url}\n\n' \
                          f'This link will expire in 1 hour.\n\n' \
                          f'If you did not request this password reset, please ignore this email.'
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [user.email]
                
                try:
                    send_mail(subject, message, email_from, recipient_list)
                except Exception as e:
                    print(f"Error sending email: {e}")
                
                return Response({
                    "message": "Password reset link has been sent to your email address."
                }, status=status.HTTP_200_OK)
                
            except CustomUser.DoesNotExist:
                return Response({
                    'error': 'User with this email does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            from django.utils.http import urlsafe_base64_decode
            from django.utils.encoding import force_str
            from django.contrib.auth.tokens import default_token_generator
            
            try:
                # Decode UID
                user_id = force_str(urlsafe_base64_decode(uid))
                user = CustomUser.objects.get(pk=user_id)
                
                # Verify token
                if not default_token_generator.check_token(user, token):
                    return Response({
                        'error': 'Invalid or expired token. Please request a new password reset link.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Set new password
                user.set_password(password)
                user.save()
                
                return Response({
                    'message': 'Password has been reset successfully. You can now login with your new password.'
                }, status=status.HTTP_200_OK)
                
            except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
                return Response({
                    'error': 'Invalid user. Please request a new password reset link.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Google OAuth Views

