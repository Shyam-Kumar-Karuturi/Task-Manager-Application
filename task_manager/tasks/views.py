from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer
from rest_framework import status
from django.utils.dateparse import parse_date
from rest_framework.permissions import IsAuthenticated

class TaskListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)

        title = request.query_params.get('title')
        task_status = request.query_params.get('status')
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        filters = Q(user=request.user)
        if title:
            filters &= Q(title__icontains=title)
        if task_status:
            filters &= Q(status=task_status)
        if from_date:
            filters &= Q(due_date__gte=parse_date(from_date))
        if to_date:
            filters &= Q(due_date__lte=parse_date(to_date))

        tasks = tasks.filter(filters)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        task = get_object_or_404(Task, pk=pk, user=request.user)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = get_object_or_404(Task, pk=pk, user=request.user)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = get_object_or_404(Task, pk=pk, user=request.user)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
