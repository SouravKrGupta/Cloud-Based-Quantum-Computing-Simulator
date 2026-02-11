from rest_framework import serializers
from .models import CustomUser, QuantumCircuit, SimulationResult


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'confirm_password', 'phone_number', 'address']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number'),
            address=validated_data.get('address')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'phone_number', 'address', 'is_verified', 'date_joined']


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs


class QuantumCircuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuantumCircuit
        fields = ['id', 'user', 'name', 'description', 'qubits', 'gates', 'created_at', 'updated_at', 'is_public']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class SimulationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationResult
        fields = ['id', 'circuit', 'state_vector', 'probability_distribution', 'measurements', 'execution_time', 'created_at', 'qubit_count', 'gate_count']
        read_only_fields = ['id', 'created_at']
