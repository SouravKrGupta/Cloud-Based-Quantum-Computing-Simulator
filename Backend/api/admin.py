from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OTPVerification


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'name', 'phone_number', 'address', 'is_verified', 'is_staff', 'date_joined']
    list_filter = ['is_verified', 'is_staff', 'is_active']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone_number', 'address')}),
        ('Permissions', {'fields': ('is_verified', 'is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'phone_number', 'address', 'is_verified', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ['email', 'name']
    ordering = ['email']
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(OTPVerification)
