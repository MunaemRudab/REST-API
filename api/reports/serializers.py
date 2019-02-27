from django.contrib.auth.models import User
from rest_framework import serializers

from reports.models import Report


class ReportSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Report
        fields = ('id', 'title', 'report_type', 'description', 'created_by', 
            'resolved_by', 'resolved_on', 'is_resolved')
