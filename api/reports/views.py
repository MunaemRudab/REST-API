# reports/views.py
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from reports.models import Report
from reports.permissions import IsOwner
from reports.serializers import ReportSerializer


def index(request):
    latest_report_list = Report.objects.order_by('title')[:5]
    context = {
        'latest_report_list': latest_report_list,
    }
    return render(request, "index.html", context)


@csrf_exempt
@api_view(["POST"])
def login(request):
    """
    Returns token for the user,

    Returns:
        response : token key.
    """
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({'error': 'Please provide both username and password'},
                        status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=status.HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token': token.key}, status=status.HTTP_200_OK)


class ReportList(generics.ListCreateAPIView):
    """
    Creates a read-only endpoint that lists all available report instances 
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete for detail view of individual report.
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwner, )
