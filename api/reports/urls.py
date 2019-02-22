from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from reports import views

urlpatterns = [
    path('', views.index, name='index'),
    path('reports/', views.ReportList.as_view()),
    path('reports/<int:pk>/', views.ReportDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
