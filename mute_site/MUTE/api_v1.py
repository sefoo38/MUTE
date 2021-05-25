"""

contains all class-based api views,
the apis are mostly RESTful

"""

import os
from django.contrib.auth import authenticate, login
from django.core.exceptions import FieldError
from django.http import Http404, HttpResponseBadRequest, HttpResponseNotFound
from django.urls import path, re_path, include
from django.core.files import File
from rest_framework import permissions, viewsets, routers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins, generics
from mute_site.dev_settings import MEDIA_ROOT
from MUTE.helpers import create_random_code, child_login_required, parent_login_required, get_child_by_lecture_code, \
    is_valid_image, select_random_avatar
from MUTE.serializers import *
from MUTE.constants import *


class ChildDetail(mixins.CreateModelMixin, APIView):
    """

    RESTful API for `MUTE.models.Child`.

    """
    permission_classes = [permissions.AllowAny, ]

    # noinspection PyUnusedLocal
    def get_serializer(self, *args, **kwargs):
        """
        get serializer for the current model,
        necessary for `CreateModelMixin`.

        Keyword Args:
            data (dict): dictionary with key as `MUTE.models.Child` field name
            and key as corresponding data

        Returns:
            `MUTE.serializers.ChildSerializer`: instance with given data

        """
        return ChildSerializer(data=kwargs.get('data'))

    @child_login_required
    def get(self, request):
        """
        retrieve serialized data of the currently logged in `MUTE.models.Child` user,
        requires the `MUTE.models.Child` user to be logged in.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json

        """
        child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
        serializer = ChildSerializer(child)
        return Response(serializer.data)

    def post(self, request):
        """
        creates new `MUTE.models.Child` object and writes it to the database.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_201_CREATED`:  data serialized as json

        """
        code = create_random_code()
        request.data[LECTURE_CODE] = code
        response = self.create(request)
        child = authenticate(request, lecture_code=code)
        child.image = select_random_avatar()
        child.save()
        login(request, child, backend=CHILD_BACKEND)
        return response

    @child_login_required
    def put(self, request):
        """
        updates the data of the currently logged in `MUTE.models.Child` user,
        requires the `MUTE.models.Child` user to be logged in.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json

        """
        child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
        serializer = ChildSerializer(child, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildCoins(APIView):
    """

    API for updating **coins** of the currently logged in `MUTE.models.Child` user,
    updates maximum `maxCoinsUpdate` at once.

    """
    permission_classes = [permissions.AllowAny]
    maxCoinsUpdate: int = 100
    """ maximum amount of coins that can be updated at once """

    @child_login_required
    def put(self, request):
        """
        updates the data of the currently logged in `MUTE.models.Child` user,
        requires the `MUTE.models.Child` user to be logged in.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json if request was successful

            rest_framework.response.Response: `status.HTTP_400_BAD_REQUEST`: \
            no *island* value was set in the current session, \
            one of the `MUTE.views.IslandsView.templates` islands must be called before

            rest_framework.response.Response: `status.HTTP_422_UNPROCESSABLE_ENTITY`: \
            required parameter *coins* is missing

        """
        island_name = request.session.get('island')
        if island_name:
            coins = request.data.get('coins')
            if not coins:
                return Response({'error': True, 'message': "missing parameter 'coins'"},
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            coins = coins if coins <= self.maxCoinsUpdate else self.maxCoinsUpdate
            child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
            if island_name == 'home':
                child.home_coins += coins
            elif island_name == 'school':
                child.school_coins += coins
            elif island_name == 'playground':
                child.playground_coins += coins
            elif island_name == 'zoo':
                child.zoo_coins += coins
            child.save()
            return Response(ChildSerializer(child).data, status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ChildAuth(APIView):
    """

    API for logging in with `MUTE.models.Child.lecture_session_code`.

    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        authenticates and logs in the `MUTE.models.Child` user.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json if request was successful

            rest_framework.response.Response: `status.HTTP_404_NOT_FOUND`: \
            corresponding `MUTE.models.Child` user not found

            rest_framework.response.Response: `status.HTTP_422_UNPROCESSABLE_ENTITY`: \
            required parameter *lecture_code* is missing

        """
        lecture_code = request.data.get(LECTURE_CODE)
        if lecture_code:
            child = authenticate(request, lecture_code=lecture_code)
            if child:
                login(request, child, backend=CHILD_BACKEND)
                return Response(ChildSerializer(child).data)
            raise Http404
        return Response({'error': True, 'message': 'lecture_code cannot be empty'},
                        status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class ChildChangeAvatar(APIView):
    """

    updates `MUTE.models.Child.image`

    """
    permission_classes = [permissions.AllowAny, ]

    def _get_extension(self, filename):
        """
        retrieves image file extension.

        Args:
            filename: image file name

        Returns:
            str: file extension e.g. png, jpg, gif
        """
        return filename.split('.')[-1]

    def _from_static(self, request):
        """
        updates the avatar from existing images under **/media/image/userAvatarIcons/**

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`: data serialized as json

        """
        image_path = request.data.get('image')
        child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
        child.image = image_path
        child.save()
        return Response(ChildSerializer(child).data, status=status.HTTP_200_OK)

    def _from_upload(self, request):
        """
        updates the avatar from user's uploaded image,
        validates the uploaded image

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`: data serialized as json
            rest_framework.response.Response: `status.HTTP_400_BAD_REQUEST`: invalid image file

        """
        if not is_valid_image(request.FILES['image']):
            return Response({'error': True, 'message': 'file is not a valid image'}, status.HTTP_400_BAD_REQUEST)
        child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
        file = File(request.FILES['image'])
        file_extension = self._get_extension(file.name)
        child.image.save(f"{child.lecture_session_code}.{file_extension}", file, save=True)
        return Response(ChildSerializer(child).data)

    @child_login_required
    def put(self, request):
        """
        updates the avatar of the currently logged in `MUTE.models.Child` user,
        requires the `MUTE.models.Child` user to be logged in,
        decides on MIME type whether update from **/media/image/userAvatarIcons/**
        or from user's upload:

        - "application/json": take the path to the image from the request
        - "multipart/form-data": take the image (binary) from the request

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`: data serialized as json
            rest_framework.response.Response: `status.HTTP_400_BAD_REQUEST`: invalid image file
            rest_framework.response.Response: `status.HTTP_400_BAD_REQUEST`: incorrect MIME type

        """
        mime_type = request.META.get('CONTENT_TYPE')
        if "application/json" in mime_type:
            return self._from_static(request)
        elif "multipart/form-data" in mime_type:
            return self._from_upload(request)
        return HttpResponseBadRequest()


class ParentDetail(mixins.CreateModelMixin,
                   generics.GenericAPIView):
    """

    RESTful API for `MUTE.models.Parent`

    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ParentSerializer
    lookup_field = 'username'

    def create(self, request, *args, **kwargs):
        """
        creates new `MUTE.models.Parent` object and writes it to the database.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_201_CREATED`:  data serialized as json

        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        username = request.data.get('username')
        password = request.data.get('password')
        parent = authenticate(username=username, password=password)
        login(request, parent, backend=PARENT_BACKEND)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @parent_login_required
    def get(self, request):
        """
        retrieve serialized data of the currently logged in `MUTE.models.Parent` user,
        requires the user to be logged in.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json

        """
        parent = Parent.objects.get(pk=request.user.id)
        return Response(ParentSerializer(parent).data)

    def post(self, request, *args, **kwargs):
        """
        calls and returns `self.create()`

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_201_CREATED`:  data serialized as json

        """
        return self.create(request, *args, **kwargs)

    @parent_login_required
    def put(self, request):
        """
        updates the avatar of the currently logged in `MUTE.models.Parent` user,
        requires the user to be logged in,

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json

        """
        parent = Parent.objects.get(pk=request.user.id)
        serializer = ParentSerializer(parent, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class ParentAuth(APIView):
    """

    API for logging in the `MUTE.models.Parent` user

    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        authenticates and logs in the `MUTE.models.Parent` user.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json if request was successful,\
            the request is even then successful if the password was incorrect

            rest_framework.response.Response: `status.HTTP_404_NOT_FOUND`: \
            corresponding `MUTE.models.Parent` user not found

        """
        parent = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if not parent:
            if Parent.objects.filter(username=request.data.get('username')).exists():
                return Response({'error': True, 'message': 'incorrect password', 'incorrect_password': True})
            return HttpResponseNotFound()
        login(request, parent, backend=PARENT_BACKEND)
        return Response({'error': False, 'is_authenticated': parent.is_authenticated})


class ParentAddChild(APIView):
    """

    API for parents, allows them to add a child as theirs.

    """
    permission_classes = [permissions.IsAuthenticated, ]

    def put(self, request):
        """
        searches for `MUTE.models.Child` object associated with the given `MUTE.models.Child.lecture_session_code`

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json if request was successful,\
            the request is even then successful if the code was already taken

            rest_framework.response.Response: `status.HTTP_422_UNPROCESSABLE_ENTITY`: missing/invalid parameter

            rest_framework.response.Response: `status.HTTP_400_BAD_REQUEST`

        """
        lecture_code = request.data.get(LECTURE_CODE)
        if not lecture_code:
            return Response(
                {'error': True,
                 'message': f'missing parameter {LECTURE_CODE}',
                 'missing_parameter': True},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        child = get_child_by_lecture_code(lecture_code)
        parent = Parent.objects.get(id=request.user.id)
        if child.parent_id:
            return Response({'error': True, 'message': 'code already taken'})
        child.parent_id = parent
        serializer = ChildSerializer(child, data=request.data)
        if serializer.is_valid():
            serializer.save()
            parent.children += 1
            parent.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParentChildOverview(APIView):
    """

    API for parents, list of all children of the currently logged in `MUTE.models.Parent` user.

    """
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        """
        searches for all `MUTE.models.Child` objects associated with the `MUTE.models.Parent.id`
        and returns them as array of JSON objects.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json if request was successful
            rest_framework.response.Response: `status.HTTP_204_NO_CONTENT`: \
            there are no children associated with the currently logged in user

        """
        children = Child.objects.filter(parent_id=request.user.id)
        if len(children) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = ParentChildOverviewSerializer(children, many=True)
        return Response(serializer.data)


class AvatarImageList(APIView):
    """

    API for avatar images, requires the `MUTE.models.Child` user to be logged in.

    """
    permission_classes = [permissions.AllowAny, ]

    @child_login_required
    def get(self, request):
        """
        creates a list of relative paths to the images under **/media/image/userAvatarIcons/**.

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  array serialized as json

        """
        path_to_images = os.path.join(MEDIA_ROOT, 'image', 'userAvatarIcons')
        images = [image for image in os.listdir(path_to_images) if os.path.isfile(os.path.join(path_to_images, image))]
        data = []
        for image in images:
            _data = {
                "image_path": f"image/userAvatarIcons/{image}"
            }
            data.append(_data)
        return Response(data)


class SLWordViewSet(viewsets.ReadOnlyModelViewSet):
    """

    API for `MUTE.models.SLWord` objects (Sign Language Words).

    Examples:
        one `MUTE.models.SLWord` objects looks something like this:

        {
            "id": 1,
            "word": "<Word>",
            "category": "<Category>",
            "island": "<One of the four islands>",
            "image": "url/to/image",
            "sound": "url/to/sound",
            "video": "url/to/video"
        }

    """
    permission_classes = (permissions.AllowAny,)
    queryset = SLWord.objects.all()
    serializer_class = SLWordSerializer
    lookup_field = 'word__iexact'
    """
    used for query, \
    __iexact stands for "ignore exact" and means that capitalization (lower and upper case) doesn't matter
    
    Examples:
        /api/v1/objects/sOmeWoRd
    
    """

    @child_login_required
    def list(self, request, *args, **kwargs):
        """
        serializes all `MUTE.models.SLWord` objects as array of JSON objects.

        Examples:
            GET /api/v1/objects

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  array serialized as json

        """
        q_params = self.convert_query_params(request.query_params) or self.convert_query_params(request.data)
        if q_params:
            try:
                queryset = SLWord.objects.filter(**q_params)
            except FieldError:
                return Response(data={"error": True, "message": "incorrect query params"},
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            queryset = SLWord.objects.all()
        if len(queryset) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @child_login_required
    def retrieve(self, request, *args, **kwargs):
        """
        acts as get() for one single `MUTE.models.SLWord` object

        Examples:
            GET /api/v1/object/*sOmeWoRd*

        Args:
            request (rest_framework.request.Request): DRF request object

        Returns:
            rest_framework.response.Response: `status.HTTP_200_OK`:  data serialized as json

        """
        word = kwargs.get(self.lookup_field)
        if self.queryset.filter(word__iexact=word).exists():
            child = Child.objects.get(lecture_session_code=request.user.lecture_session_code)
            if word in child.words_stats:
                child.words_stats[word] += 1
            else:
                child.words_stats[word] = 1
            child.save()
        return super(SLWordViewSet, self).retrieve(request, *args, **kwargs)

    def convert_query_params(self, query_params):
        """
        converts all query parameters to qparam**__iexact**, so that capitalization doesn't matter

        Args:
            query_params: query parameters that passed either as query string or as json in the GET request body

        Returns:
            dict: converted query params
            None: no query params passed

        """
        if len(query_params) == 0:
            return None
        new_query_params = {}
        for key, value in query_params.items():
            new_key = f"{key}__iexact"
            new_query_params[new_key] = value
        return new_query_params


router = routers.DefaultRouter()
router.register(r'objects', SLWordViewSet)

urlpatterns = [
    re_path(r'^', include(router.urls)),
    path('auth/child', ChildAuth.as_view()),
    path('auth/parent', ParentAuth.as_view()),
    path('child', ChildDetail.as_view()),
    path('child/coins', ChildCoins.as_view()),
    path('child/avatar', ChildChangeAvatar.as_view()),
    path('parent', ParentDetail.as_view()),
    path('parent/addchild', ParentAddChild.as_view()),
    path('parent/childoverview/', ParentChildOverview.as_view()),
    path('avatars/', AvatarImageList.as_view()),
]
