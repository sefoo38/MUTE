"""
custom backend for authenticating `MUTE.models.Parent`.
"""

from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist

from MUTE.models import Parent


class ParentBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            parent = Parent.objects.get(username=username)
            if parent.check_password(password):
                return parent
            else:
                return None
        except ObjectDoesNotExist:
            return None

    def get_user(self, parent_id):
        try:
            return Parent.objects.get(pk=parent_id)
        except Parent.DoesNotExist:
            return None
