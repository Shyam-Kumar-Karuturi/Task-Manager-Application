from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Task

User = get_user_model()


class TaskTests(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            email='testuser@example.com',
            phone_number='1234567890',
            name='Test User',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)

        # Define URLs
        self.task_list_url = reverse('task-list-create')
        self.task_detail_url = lambda pk: reverse('task-detail', args=[pk])

        # Create a task
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Task Description',
            status='To Do',
            due_date='2024-07-30',
            user=self.user
        )

    def test_create_task(self):
        data = {
            'title': 'New Task',
            'description': 'New Task Description',
            'status': 'In Progress',
            'due_date': '2024-08-01'
        }
        response = self.client.post(self.task_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Task')

    def test_list_tasks(self):
        response = self.client.get(self.task_list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Task')

    def test_list_tasks_with_filters(self):
        response = self.client.get(self.task_list_url, {'title': 'Test Task'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get(self.task_list_url, {'status': 'To Do'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get(self.task_list_url, {'from_date': '2024-07-29'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_task(self):
        response = self.client.get(self.task_detail_url(self.task.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Task')

    def test_update_task(self):
        data = {
            'title': 'Updated Task',
            'description': 'Updated Description',
            'status': 'Done',
            'due_date': '2024-08-02'
        }
        response = self.client.put(self.task_detail_url(self.task.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Task')

    def test_delete_task(self):
        response = self.client.delete(self.task_detail_url(self.task.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())
