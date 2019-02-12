# reports/urls.py
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from reports import views
from rest_framework.authtoken import views as auth

urlpatterns = [
    path('reports/', views.ReportList.as_view()),
    path('reports/<int:pk>/', views.ReportDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
