from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Player


class PlayerRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = Player
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': True}
        }

    def validate(self, attrs):
        """Validate password confirmation matches."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Password fields did not match.'
            })
        return attrs

    def validate_username(self, value):
        """Additional username validation."""
        if Player.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value

    def validate_email(self, value):
        """Additional email validation."""
        if Player.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        """Create a new player with hashed password."""
        validated_data.pop('password_confirm')
        player = Player.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return player


class PlayerSerializer(serializers.ModelSerializer):
    """Serializer for player profile."""
    total_games = serializers.SerializerMethodField()
    best_score = serializers.SerializerMethodField()
    highest_level = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('id', 'username', 'email', 'created_at', 'total_games', 'best_score', 'highest_level')
        read_only_fields = ('id', 'created_at')

    def get_total_games(self, obj):
        """Get total number of games played."""
        return obj.get_total_games()

    def get_best_score(self, obj):
        """Get player's best score."""
        return obj.get_best_score()

    def get_highest_level(self, obj):
        """Get player's highest level reached."""
        return obj.get_highest_level()


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )