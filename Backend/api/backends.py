from social_core.backends.google import GoogleOAuth2

class CustomGoogleOAuth2(GoogleOAuth2):
    name = 'custom-google-oauth2'
    
    def get_redirect_uri(self, state=None):
        """
        Override the redirect URI to ensure it matches the one configured in Google Cloud Console
        """
        return 'http://localhost:8000/api/google/callback/'
