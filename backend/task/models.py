from django.db import models
from django.conf import settings

# Create your models here.
class Task(models.Model):
    STATUS = (("todo","To Do"), ("in_progress","In Progress"), ("done","Done"))
    PRIORITY = (("low","Low"), ("medium","Medium"), ("high","High"))

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="todo")
    priority = models.CharField(max_length=20, choices=PRIORITY, default="medium")
    due_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_tasks")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_tasks")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return self.title

class TaskDocument(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="documents")
    file = models.FileField(upload_to="task_docs/",null=True,blank=True)

    def clean(self):
        
        if self.file and not self.file.name.lower().endswith(".pdf"):
            from django.core.exceptions import ValidationError
            raise ValidationError("Only PDF files are allowed.")
