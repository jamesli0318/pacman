from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone


class GameSession(models.Model):
    """
    Model to store individual game session data.
    Tracks score, level reached, duration, and links to the player.
    """
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='game_sessions',
        help_text='Player who played this game session'
    )
    score = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Total score achieved in this game session'
    )
    level_reached = models.IntegerField(
        validators=[MinValueValidator(1)],
        default=1,
        help_text='Highest level reached in this game session'
    )
    duration_seconds = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Duration of the game session in seconds'
    )
    completed_at = models.DateTimeField(
        default=timezone.now,
        help_text='Timestamp when the game session was completed'
    )
    lives_remaining = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Number of lives remaining when game ended'
    )
    dots_collected = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Total dots collected during the session'
    )
    ghosts_eaten = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text='Total ghosts eaten during the session'
    )

    class Meta:
        db_table = 'game_sessions'
        ordering = ['-completed_at']
        verbose_name = 'Game Session'
        verbose_name_plural = 'Game Sessions'
        indexes = [
            models.Index(fields=['-score', 'completed_at']),
            models.Index(fields=['player', '-completed_at']),
        ]

    def __str__(self):
        return f"{self.player.username} - Score: {self.score} - Level: {self.level_reached}"

    @property
    def duration_formatted(self):
        """Return formatted duration string (MM:SS)."""
        minutes = self.duration_seconds // 60
        seconds = self.duration_seconds % 60
        return f"{minutes:02d}:{seconds:02d}"