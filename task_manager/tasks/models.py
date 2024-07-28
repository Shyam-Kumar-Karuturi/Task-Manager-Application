from users.models import User
from django.db import models


class Task(models.Model):
    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    ]
    title = models.CharField(max_length=255, null=False)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
