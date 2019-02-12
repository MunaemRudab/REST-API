from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from datetime import date


class Report(models.Model):
	"""
	Report model definition
	"""
	report_type_choices = (
		('AN', 'annual'),
		('MO', 'monthly'),
		('WE', 'weekly')
	)
	title = models.CharField(max_length=50)
	report_type = models.CharField(max_length=2, choices=report_type_choices)
	description =  models.CharField(max_length=250, blank=True, null=True)
	resolved_by = models.CharField(max_length=30, blank=True, null=True)
	resolved_on = models.DateField(blank=True, null=True)
	is_resolved = models.BooleanField(default=False)
	created_by = models.ForeignKey('auth.User', related_name='created_by', on_delete=models.CASCADE) # new

	class Meta:
		"""
		Sets ordering of the data by title.
		"""
		ordering = ('title',)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
	"""
	Creates token for existing users for authorization. 
	"""

	if created:
		Token.objects.create(user=instance)
