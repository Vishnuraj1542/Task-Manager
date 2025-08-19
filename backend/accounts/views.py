from django.shortcuts import render
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer, UserListSerializer
from .permissions import IsAdmin, IsAdminOrSelf

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    filterset_fields = ["role", "email"]
    search_fields = ["email", "username"]
    ordering_fields = ["id","email","username"]

    def get_permissions(self):
        if self.action in ["create"]:
            return [AllowAny()]
        if self.action in ["list", "destroy"]:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return UserListSerializer
        return UserSerializer

    def perform_update(self, serializer):
        user = self.get_object()

        self.check_object_permissions(self.request, user)
        return super().perform_update(serializer)

    def get_object(self):
        obj = super().get_object()
        if self.action in ["retrieve","update","partial_update"]:
            self.check_object_permissions(self.request, obj)
        return obj

    def check_object_permissions(self, request, obj):
        from rest_framework.exceptions import PermissionDenied
        if request.user.role == "admin" or obj.id == request.user.id:
            return
        raise PermissionDenied("Not allowed")
