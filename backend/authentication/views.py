from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Player
from .serializers import PlayerRegistrationSerializer, PlayerSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    POST /api/auth/register/
    """
    queryset = Player.objects.all()
    serializer_class = PlayerRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        player = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(player)

        return Response({
            'user': PlayerSerializer(player).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    API endpoint for user login.
    POST /api/auth/login/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # Authenticate user
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)

                return Response({
                    'user': PlayerSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Account is disabled'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    API endpoint for user logout.
    POST /api/auth/logout/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({
                    'message': 'Logout successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Refresh token required'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveAPIView):
    """
    API endpoint for user profile.
    GET /api/auth/profile/
    """
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user