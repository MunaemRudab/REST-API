from django.contrib import admin

from reports.models import Report


class ReportAdmin(admin.ModelAdmin):
    readonly_fields = ('resolved_on',)

admin.site.register(Report, ReportAdmin)
