from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'phone_number', 'name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            name=validated_data['name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    otp = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        email = data.get('email')
        phone_number = data.get('phone_number')
        password = data.get('password')
        otp = data.get('otp')

        if email and password:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                return user
            raise serializers.ValidationError('Invalid email or password')

        if phone_number and otp:
            user = User.objects.filter(phone_number=phone_number).first()
            if user and otp == '123456':  # Simple OTP validation for demo purposes
                return user
            raise serializers.ValidationError('Invalid phone number or OTP')

        raise serializers.ValidationError('Must include "email" and "password" or "phone_number" and "otp"')
