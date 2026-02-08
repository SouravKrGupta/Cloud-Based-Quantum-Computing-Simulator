from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
@csrf_exempt
def google_success_view(request):
    """
    Success view to display tokens after Google authentication
    """
    access_token = request.GET.get('access')
    refresh_token = request.GET.get('refresh')
    user_id = request.GET.get('user_id')
    
    if not access_token or not refresh_token or not user_id:
        return Response({'error': 'Missing required parameters'}, status=400)
    
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    return render(request, 'google_success.html', {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user
    })
