"""For serializing our data in json """
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
	"""
	Serializes data into the specified model.
	"""
	created_by = serializers.ReadOnlyField(source='created_by.username') # new

	class Meta:
		"""
		Definition of the model in which data needs to be serialized.
		"""
		model = Report
		fields = ('id', 'title', 'report_type', 'description',
			'created_by', 'resolved_by', 'resolved_on', 'is_resolved')


class UserSerializer(serializers.ModelSerializer):
	"""
	Sets permission, user who created the report can only perform deletion.
	"""
	created_by = serializers.PrimaryKeyRelatedField(
		many=True, queryset=Report.objects.all())


	class Meta:
		model = User
		fields = ('id', 'username', 'created_by')
