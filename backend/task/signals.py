from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import TaskDocument

@receiver(pre_save, sender=TaskDocument)
def validate_doc_limit(sender, instance, **kwargs):
    if instance.task_id:
        count = TaskDocument.objects.filter(task_id=instance.task_id).exclude(pk=instance.pk).count()
        if count >= 3:
            from django.core.exceptions import ValidationError
            raise ValidationError("Max 3 documents per task.")