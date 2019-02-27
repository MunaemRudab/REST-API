# reports/urls.py
from django.urls import path
from django.views.generic import TemplateView
from rest_framework.urlpatterns import format_suffix_patterns

from reports import views

urlpatterns = [
   	path('', TemplateView.as_view(template_name="index.html")),
    path('reports/', views.ReportList.as_view()),
    path('reports/<int:pk>/', views.ReportDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
