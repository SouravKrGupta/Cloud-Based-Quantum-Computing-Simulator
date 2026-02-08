from django.conf import settings
from django.shortcuts import redirect
from social_core.pipeline.user import get_username as social_get_username
from social_core.pipeline.user import create_user as social_create_user
from social_core.pipeline.social_auth import associate_user
from social_core.pipeline.user import update_user_details
from social_core.pipeline.social_auth import load_extra_data
from social_core.pipeline.mail import send_validation
from social_core.pipeline.validation import validate_email
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken


def get_username(strategy, details, user=None, *args, **kwargs):
    if user:
        return {'username': user.email}
    
    email = details.get('email')
    if email:
        return {'username': email}
    
    return social_get_username(strategy, details, user, *args, **kwargs)


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}
    
    email = details.get('email')
    if email:
        user, created = CustomUser.objects.get_or_create(email=email)
        
        if created:
            user.name = details.get('fullname') or details.get('first_name', '') + ' ' + details.get('last_name', '')
            user.is_verified = True
            user.save()
        
        return {'user': user, 'is_new': created}
    
    return social_create_user(strategy, details, backend, user, *args, **kwargs)


def redirect_after_auth(strategy, details, user=None, *args, **kwargs):
    if user:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Redirect to a page with tokens
        return redirect(f'/api/google/success/?access={access_token}&refresh={refresh_token}&user_id={user.id}')


def complete_google_auth(strategy, details, user=None, *args, **kwargs):
    if user:
        return {'user': user}
