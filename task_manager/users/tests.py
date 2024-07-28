from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserRegistrationTests(APITestCase):
    def setUp(self):
        self.url = reverse('register')
        self.data = {
            'email': 'testuser@example.com',
            'phone_number': '1234567890',
            'name': 'Test User',
            'password': 'testpassword'
        }

    def test_user_registration(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['email'], self.data['email'])

    def test_user_registration_missing_email(self):
        data = self.data.copy()
        data.pop('email')
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_user_registration_missing_phone_number(self):
        data = self.data.copy()
        data.pop('phone_number')
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone_number', response.data)

    def test_user_registration_missing_name(self):
        data = self.data.copy()
        data.pop('name')
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)


class UserRegistrationTokenTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'email': 'testuser@example.com',
            'phone_number': '1234567890',
            'name': 'Test User',
            'password': 'testpassword'
        }
        self.client.post(self.register_url, self.user_data, format='json')

    def test_token_obtain_pair(self):
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

        # Verify token is valid
        refresh_token = response.data['refresh']
        access_token = response.data['access']
        try:
            RefreshToken(refresh_token)
            RefreshToken(access_token)
        except Exception as e:
            self.fail(f"Token is not valid: {e}")