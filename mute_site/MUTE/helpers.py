"""
this module contains helper functions and decorators.

Attributes:
    lower_case_chars (list): lower case characters from a to z
    upper_case_chars (list): upper case characters from A to Z
    ALLOWED_CHARS (list): List of lower and upper case letters and numbers

"""

import os
import secrets
import random
from functools import wraps
from PIL import Image, UnidentifiedImageError
from django.contrib.auth import authenticate, login
from django.http import HttpResponseForbidden, HttpResponseNotFound, Http404
from mute_site.dev_settings import MEDIA_ROOT
from MUTE.models import Child
from MUTE.constants import CHILD_BACKEND

lower_case_chars = [chr(c) for c in range(97, 123)]
upper_case_chars = [chr(c) for c in range(65, 91)]
ALLOWED_CHARS = lower_case_chars + upper_case_chars + [str(n) for n in range(0, 10)]


def create_random_code() -> str:
    """
    generates a random code from `ALLOWED_CHARS`.

    Returns:
        str: random code
    """
    randgen = secrets.SystemRandom()
    code = ''
    while True:
        for n in range(randgen.randint(6, 10)):
            code += secrets.choice(ALLOWED_CHARS)
        if not Child.objects.filter(lecture_session_code=code).exists():
            break
        else:
            code = ""
    return code


def create_new_child(request) -> Child:
    """
    creates new child object with random generated lecture_session_code.

    Args:
        request (django.http.HttpRequest): django request object
    Returns:
        `MUTE.models.Child`: instance

    """
    code = create_random_code()
    child = Child(lecture_session_code=code)
    child.save()
    _child = authenticate(request=request, lecture_code=code)
    login(request, _child, backend=CHILD_BACKEND)
    return _child


def get_child_by_lecture_code(lecture_code) -> Child:
    """
    tries perform the query and return a single `MUTE.models.Child` object matching the given
        `lecture_code` argument.

    Args:
        lecture_code: `MUTE.models.Child.lecture_session_code`

    Returns:
        `MUTE.models.Child`: instance

    Raises:
        `django.http.Http404`: raises if no object matching the given `lecture_code` was found

    """
    try:
        return Child.objects.get(lecture_session_code=lecture_code)
    except Child.DoesNotExist:
        raise Http404


def select_random_avatar() -> str:
    """
    lists all images in **/media/images/userAvatarIcons/**
    and creates a list with relative paths to them.
    Examples:
        /media/image/userAvatarIcons/bear.png

    Returns:
        str: random selected image path

    """
    path_to_images = os.path.join(MEDIA_ROOT, 'image', 'userAvatarIcons')
    images = [image for image in os.listdir(path_to_images) if os.path.isfile(os.path.join(path_to_images, image))]
    img_paths = []
    for image in images:
        img_paths.append(f"image/userAvatarIcons/{image}")
    return random.choice(img_paths)


def child_login_required(func):
    """
    Decorator for class-based views that checks that the `MUTE.models.Child` user is logged in.

    Args:
        func: request method (e.g. *get()*, *post()* ) of a class-based view

    Returns:
        func: if user is logged in
        django.http.HttpResponseNotFound: if user is not logged in or the user is not an instance of `MUTE.models.Child`

    """
    @wraps(func)
    def func_wrapper(self, request, *args, **kwargs):
        if hasattr(request.user, 'is_logged_in'):
            if not request.user.is_logged_in:
                return HttpResponseForbidden()
            return func(self, request, *args, **kwargs)
        return HttpResponseNotFound()

    return func_wrapper


def parent_login_required(func):
    """
    Decorator for class-based views that checks that the user is logged in.
    Very similar to `django.contrib.auth.decorators.login_required`.

    Args:
        func: request method (e.g. *get()*, *post()* ) of a class-based view

    Returns:
        func: if user is logged in
        django.http.HttpResponseNotFound: if user is not logged in

    """

    @wraps(func)
    def func_wrapper(self, request, *args, **kwargs):
        if hasattr(request.user, 'is_authenticated'):
            if not request.user.is_authenticated:
                return HttpResponseForbidden()
            return func(self, request, *args, **kwargs)
        return HttpResponseNotFound()

    return func_wrapper


def is_valid_image(image):
    """
    uses pillow package to check if an image is a valid one

    Args:
        image: file pointer to an image

    Returns:
        bool: true if image is valid, false otherwise

    """
    try:
        im = Image.open(image)
        im.verify()
        return True
    except (FileNotFoundError, UnidentifiedImageError, ValueError, TypeError):
        return False
