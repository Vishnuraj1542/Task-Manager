from rest_framework import serializers
from .models import Task, TaskDocument

class TaskDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDocument
        fields = ["id", "file"]

class TaskSerializer(serializers.ModelSerializer):
    documents = TaskDocumentSerializer(many=True, read_only=True)
    assigned_to_email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = Task
        fields = ["id","title","description","status","priority","due_date",
                  "assigned_to","assigned_to_email","documents","created_by"]
        read_only_fields = ["id","created_by","assigned_to"]

    def create(self, validated_data):
        request = self.context["request"]
        assigned_email = validated_data.pop("assigned_to_email", None)
        task = Task.objects.create(created_by=request.user, **validated_data)
        if assigned_email:
            from accounts.models import User
            try:
                task.assigned_to = User.objects.get(email=assigned_email)
                task.save()
            except User.DoesNotExist:
                pass
        return task