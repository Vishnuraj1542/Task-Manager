from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Task, TaskDocument
from .serializers import TaskSerializer, TaskDocumentSerializer
from .permissions import IsAdminOrCreatorOrAssignee
from django.db.models import Q 

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer
    filterset_fields = ["status","priority"]
    search_fields = ["title","description"]
    ordering_fields = ["due_date","priority","status","created_at"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Task.objects.all().order_by("-created_at")
        return Task.objects.filter(Q(created_by=user) | Q(assigned_to=user)).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save()

    def get_permissions(self):
        if self.action in ["list","retrieve","create","update","partial_update","destroy","upload","download"]:
            return [IsAdminOrCreatorOrAssignee()]
        return super().get_permissions()

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload(self, request, pk=None):
        task = self.get_object()
        files = request.FILES.getlist("files")
        created = []
        for f in files:
            doc_ser = TaskDocumentSerializer(data={"file": f})
            doc_ser.is_valid(raise_exception=True)
            doc_ser.save(task=task)
            created.append(doc_ser.data)
        return Response({"created": created}, status=201)

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        task = self.get_object()
        docs = TaskDocument.objects.filter(task=task)
        return Response(TaskDocumentSerializer(docs, many=True).data)
