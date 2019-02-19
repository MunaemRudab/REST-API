# reports/views.py
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from reports.models import Report
from reports.permissions import IsOwner
from reports.serializers import ReportSerializer, UserSerializer

@csrf_exempt
@api_view(["POST"])
def login(request):
    """
    Creates and returns token for the user by validating given username and password.

    Args:
        username (str) : username
        password (str) : password

    Returns:
        response : token key and status.

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
    Lists all reports irrespective of current logged in user.

    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Returns detail of the respective report item. 
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwner, ) 
