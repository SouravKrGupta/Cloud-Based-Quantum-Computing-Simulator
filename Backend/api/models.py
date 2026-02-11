from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import json


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


class OTPVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = 'OTP Verification'
        verbose_name_plural = 'OTP Verifications'

    def __str__(self):
        return f"OTP for {self.user.email}"


class QuantumCircuit(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='circuits')
    name = models.CharField(max_length=255, default='Untitled Circuit')
    description = models.TextField(blank=True, null=True)
    qubits = models.IntegerField(default=5)
    gates = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    shared_with = models.ManyToManyField(CustomUser, related_name='shared_circuits', blank=True)

    class Meta:
        verbose_name = 'Quantum Circuit'
        verbose_name_plural = 'Quantum Circuits'
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} by {self.user.email}"


class SimulationResult(models.Model):
    circuit = models.ForeignKey(QuantumCircuit, on_delete=models.CASCADE, related_name='simulations')
    state_vector = models.JSONField()
    probability_distribution = models.JSONField()
    measurements = models.JSONField()
    execution_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    qubit_count = models.IntegerField()
    gate_count = models.IntegerField()

    class Meta:
        verbose_name = 'Simulation Result'
        verbose_name_plural = 'Simulation Results'
        ordering = ['-created_at']

    def __str__(self):
        return f"Simulation of {self.circuit.name} at {self.created_at}"
