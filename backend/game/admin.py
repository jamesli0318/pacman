from django.contrib import admin
from .models import GameSession


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    """Admin interface for GameSession model."""
    list_display = ('player', 'score', 'level_reached', 'duration_formatted', 'completed_at')
    list_filter = ('level_reached', 'completed_at')
    search_fields = ('player__username',)
    ordering = ('-completed_at',)
    readonly_fields = ('completed_at', 'duration_formatted')

    fieldsets = (
        ('Player Info', {
            'fields': ('player',)
        }),
        ('Game Stats', {
            'fields': ('score', 'level_reached', 'duration_seconds', 'duration_formatted', 'lives_remaining')
        }),
        ('Collection Stats', {
            'fields': ('dots_collected', 'ghosts_eaten')
        }),
        ('Timestamps', {
            'fields': ('completed_at',)
        }),
    )