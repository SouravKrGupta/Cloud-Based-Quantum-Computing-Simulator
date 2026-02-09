from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    OTPVerificationView,
    ResendOTPView,
    UserProfileView,
    ForgotPasswordView,
    ResetPasswordView,
    HealthCheckView
)
from .google_views import google_success_view

urlpatterns = [
    path('', HealthCheckView.as_view(), name='health-check'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('google/success/', google_success_view, name='google-success'),
]
