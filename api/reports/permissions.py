from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
	"""
	Defines permissions for delete operation.

	Returns:
		created_by <user> : created by user
	"""

	def has_object_permission(self, request, view, obj):
		if request.method in permissions.SAFE_METHODS:
			return True

		return obj.created_by == request.user
