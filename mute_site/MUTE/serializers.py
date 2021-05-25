"""

serializer classes that serialize the `MUTE.models` into JSON objects

"""

from django.contrib.auth.models import User
from rest_framework import serializers
from MUTE.models import Parent, Child, SLWord


class ParentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for `MUTE.models.Parent` user,
    used e.g. for parent profile page

    """
    class Meta:
        model = Parent
        fields = ['username', 'id', 'children', 'has_children', 'password']
        extra_kwargs = {
            'children': {'read_only': True},
            'has_children': {'read_only': True},
            'id': {'read_only': True},
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        parent = Parent.objects.create_user(**validated_data)
        parent.set_password(validated_data['password'])
        return parent


class ChildSerializer(serializers.ModelSerializer):
    """
    Serializer for `MUTE.models.Child` user,
    used e.g. for displaying information on **/learn** page

    """
    class Meta:
        model = Child
        fields = ['id', 'parent_id', 'lecture_session_code', 'image', 'coins']
        extra_kwargs = {
            'id': {'read_only': True},
            'coins': {'read_only': True}
        }


class ParentChildOverviewSerializer(serializers.ModelSerializer):
    """
    Serializer for `MUTE.models.Parent` user,
    used for displaying child associated with the user,
    contains additional information like *words_stats* and all *coins* for each island,
    may be used for child statistics

    """
    coins = serializers.SerializerMethodField()

    class Meta:
        model = Child
        fields = ['id', 'lecture_session_code', 'image', 'coins', 'words_stats']
        extra_kwargs = {
            'id': {'read_only': True},
            'coins': {'read_only': True},
            'words_stats': {'read_only': True}
        }

    def get_coins(self, instance):
        return {
            'home_coins': instance.home_coins,
            'school_coins': instance.school_coins,
            'playground_coins': instance.playground_coins,
            'zoo_coins': instance.zoo_coins
        }


class AdminSerializer(serializers.ModelSerializer):
    """ serializer for admin user """
    class Meta:
        model = User
        fields = ['username', 'id', 'password', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'id': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True},
            'password': {'write_only': True}
        }


class SLWordSerializer(serializers.ModelSerializer):
    """ serializer for `MUTE.models.SLWord` objects """
    class Meta:
        model = SLWord
        fields = '__all__'
