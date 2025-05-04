from django.contrib import admin
from .models import Folder, File

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'parent', 'created_at')
    list_filter = ('owner', 'created_at')
    search_fields = ('name',)
    ordering = ('name', 'created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('name', 'owner', 'parent')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'folder', 'uploaded_at')
    list_filter = ('owner', 'folder', 'uploaded_at')
    search_fields = ('name', 'file')
    ordering = ('name', 'uploaded_at')
    readonly_fields = ('uploaded_at',)
    fieldsets = (
        (None, {
            'fields': ('name', 'owner', 'folder', 'file')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',)
        }),
    )