from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Player


@admin.register(Player)
class PlayerAdmin(UserAdmin):
    """Admin interface for Player model."""
    list_display = ('username', 'email', 'created_at', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)

    fieldsets = UserAdmin.fieldsets + (
        ('Game Stats', {'fields': ('created_at',)}),
    )
    readonly_fields = ('created_at',)