from django.contrib import admin
from .models import Task, TaskDocument

admin.site.register(Task)
admin.site.register(TaskDocument)
