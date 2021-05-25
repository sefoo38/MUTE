"""
custom backend for authenticating `MUTE.models.Child`,
needed because we don't use *username* and *password* to authenticate the user,
instead only `MUTE.models.Child.lecture_session_code` is being used for authentication.

"""

from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist

from MUTE.models import Child


class ChildBackend(BaseBackend):
    """
    custom `MUTE.models.Child.is_logged_in` attribute is being used \
    instead of the standard *.is_authenticated*,
    because of that we need manually set the attribute to `True` on successful login.

    """
    def authenticate(self, request, lecture_code=None):
        try:
            child = Child.objects.get(lecture_session_code=lecture_code)
            if child:
                child.is_logged_in = True
                child.save()
                return child
            else:
                print("something went wrong")
        except ObjectDoesNotExist:
            return None

    def get_user(self, child_id):
        try:
            return Child.objects.get(pk=child_id)
        except Child.DoesNotExist:
            return None
