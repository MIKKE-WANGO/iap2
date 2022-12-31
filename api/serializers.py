from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class StudentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student_Application
        fields = "__all__"


class StaffApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff_Member_Application
        fields = "__all__"


class StudentUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students_Units
        fields = "__all__"

class UnitActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit_Activities
        fields = "__all__"


class UnitMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit_Message
        fields = "__all__"


class AnnouncementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff_Anouncements
        fields = "__all__"