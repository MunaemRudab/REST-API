# reports/urls.py
from rest_framework.authtoken import views as auth
from rest_framework.urlpatterns import format_suffix_patterns

from django.urls import path

from reports import views

urlpatterns = [
    path('reports/', views.ReportList.as_view()),
    path('reports/<int:pk>/', views.ReportDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
