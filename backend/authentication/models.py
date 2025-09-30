from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.utils import timezone


class Player(AbstractUser):
    """
    Custom user model for Pacman game players.
    Extends Django's AbstractUser with game-specific fields.
    """
    username_validator = RegexValidator(
        regex=r'^[a-zA-Z0-9_]{3,20}$',
        message='Username must be 3-20 characters and contain only letters, numbers, and underscores.'
    )

    username = models.CharField(
        max_length=20,
        unique=True,
        validators=[username_validator],
        help_text='Required. 3-20 characters. Letters, numbers, and underscores only.'
    )
    email = models.EmailField(
        unique=True,
        help_text='Required. Valid email address.'
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text='Timestamp when the player account was created.'
    )

    # Required fields for user creation
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'players'
        ordering = ['-created_at']
        verbose_name = 'Player'
        verbose_name_plural = 'Players'

    def __str__(self):
        return self.username

    def get_total_games(self):
        """Return total number of games played by this player."""
        return self.game_sessions.count()

    def get_best_score(self):
        """Return the player's highest score."""
        best_game = self.game_sessions.order_by('-score').first()
        return best_game.score if best_game else 0

    def get_highest_level(self):
        """Return the highest level reached by this player."""
        best_level = self.game_sessions.order_by('-level_reached').first()
        return best_level.level_reached if best_level else 0