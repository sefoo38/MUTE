"""
contains all the models used for MUTE project,
the model classes and their fields represent the database objects

"""

from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, User, UserManager
import hashlib


class Parent(AbstractBaseUser):
    """
    model represents the Parent.

    """
    username_validator = UnicodeUsernameValidator()

    username = models.CharField('username', max_length=25, unique=True,
                                help_text='Required. 25 characters or fewer. Letters, digits and @/./+/-/_ only.',
                                validators=[username_validator],
                                error_messages={
                                    'unique': "A user with that username already exists.",
                                }, )
    email = models.EmailField('email address', blank=True)
    _children = models.IntegerField(default=0)
    has_children = models.BooleanField(default=False)

    @property
    def children(self):
        return self._children

    @children.setter
    def children(self, value):
        self._children = value
        if self._children > 0:
            self.has_children = True
        else:
            self.has_children = False

    # attributes needed by django for authenticating the user as well as for displaying on the admin page

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    is_staff = models.BooleanField(default=False, editable=False)

    is_superuser = models.BooleanField(default=False, editable=False)

    is_active = models.BooleanField(default=True)

    def has_perm(self, _):
        return False

    def has_module_perms(self, _):
        return False


def create_file_name(instance, filename):
    return f"image/{hashlib.blake2b(instance.lecture_session_code.encode(), digest_size=16).hexdigest()}/{filename}"


class Child(models.Model):
    """
    model represents the child. \n
    We use separate coin-fields for each 'island' so that we can use them later for statistics,
    like 'which island was visited the most'.

    """
    name = models.CharField(max_length=25)
    parent_id = models.ForeignKey(Parent, on_delete=models.CASCADE, null=True)
    lecture_session_code = models.CharField(max_length=25, unique=True, null=True)
    image = models.ImageField(upload_to=create_file_name, null=True, blank=True)

    home_coins = models.IntegerField(default=0)
    school_coins = models.IntegerField(default=0)
    playground_coins = models.IntegerField(default=0)
    zoo_coins = models.IntegerField(default=0)

    words_stats = models.JSONField(null=False, default=dict)

    @property
    def coins(self):
        return self.home_coins + self.school_coins + self.playground_coins + self.zoo_coins

    @coins.setter
    def coins(self, value):
        return

    # attributes needed by django for authenticating the user as well as for displaying on the admin page
    is_logged_in = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True)
    is_staff = models.BooleanField(default=False, editable=False)
    is_superuser = models.BooleanField(default=False, editable=False)
    is_active = models.BooleanField(default=True)
    is_authenticated = models.BooleanField(default=False)

    def has_perm(self, _):
        return False

    def has_module_perms(self, _):
        return False

    def get_username(self):
        return str(self.lecture_session_code)


class SLWord(models.Model):
    """
    model for sign language word objects,
    containing the word, image that represents the word
    as well as the video with sign language,
    *category* and *island* may be used for filtering.

    """
    word = models.CharField(max_length=25)
    category = models.CharField(max_length=25, blank=True)
    island = models.CharField(max_length=25, blank=True)
    image = models.FileField(upload_to='image/', null=True, blank=True)
    sound = models.FileField(upload_to='sound/', null=True, blank=True)
    video = models.FileField(upload_to='video/')
