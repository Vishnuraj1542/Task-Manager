from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.role == "admin":
            return True
        return obj.id == request.user.id

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"