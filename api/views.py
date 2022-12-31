
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
from asyncio import events
import email
from django.core.mail import EmailMessage
from unicodedata import name
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response 
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.contrib.auth import get_user_model
User = get_user_model()

from .serializers import *
from .models import *
import random
from datetime import datetime,timedelta

from django.http import FileResponse

import math
from django.utils.timezone import make_aware
from django.core.mail import send_mail
from django.contrib.postgres.search import SearchQuery,  SearchVector
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny

import secrets
import string
# Create your views here.

#get user details
class RetrieveUserView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            print(user)
            user = UserSerializer(user)
            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving the user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentApplicationView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request,format=None):
        data = request.data
        name = data['name']
        email = data['email']
        email = email.lower()
        course = data['course']
        course = Course.objects.get(name=course)

        new_application = Student_Application(name=name, email=email, course=course)
        new_application.save()

        return Response(
            {'success': 'Application sent successfully'},
            status=status.HTTP_201_CREATED
        )

    def get(self,request,format=None):
        user = request.user
        if user.is_superuser == True:
            student_applications = Student_Application.objects.filter(status='Pending')
            student_applications = StudentApplicationSerializer(student_applications)
            return Response(
                {'student_applications': student_applications.data},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )


class StaffApplicationView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request,format=None):
        data = request.data
        name = data['name']
        email = data['email']
        email = email.lower()
        department = data['department']
        
        new_application = Staff_Member_Application(name=name, email=email, department=department)
        new_application.save()

        return Response(
            {'success': 'Application sent successfully'},
            status=status.HTTP_201_CREATED
        )

    def get(self,request,format=None):
        user = request.user
        if user.is_superuser == True:
            staff_applications = Staff_Member_Application.objects.filter(status='Pending')
            staff_applications = StaffApplicationSerializer(staff_applications)
            return Response(
                {'student_applications': staff_applications.data},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
def createPassword():
    letters = string.ascii_letters
    digits = string.digits
    special_chars = string.punctuation
    alphabet = letters + digits + special_chars
    pwd_length = 8
    pwd = ''
    for i in range(pwd_length):
        pwd += ''.join(secrets.choice(alphabet))

    return pwd


#Accept or reject application
class ManageStudentApplication(APIView):
    def post(self, request, pk):
        data = request.data
        action = data['action']
        student_application = Student_Application.objects.get(id=pk)

        user = request.user
        if user.is_superuser == True:

            if action == 'accept':
                student_application.status = 'Accepted'
                student_application.save()
                course = Course.objects.get(name=student_application.course)

                password = createPassword()

                new_user = User.objects.create_student(name=student_application.name, email=student_application.email, password=password)
                new_student = Student(user= new_user, course= course)
                new_student.save()

                student_units = Course.unit_set.all()
                for unit in student_units:
                    new_unit = Students_Units(student = new_student, unit=unit)
                    new_unit.save()
                

                send_mail("Enrolled", "Your have been successfully enrolled to the  " + student_application.course + "course.\n" + 
                            "Use your email and this password , " + password + " to login into your account" + 
                            "Once logged in go to unregistered units and register all of them", 
                            "mikemundati@gmail.com",[ student_application.email], fail_silently=False)

                return Response(
                {'success': 'Enrolled  successfully'},
                status=status.HTTP_200_OK
            )
            else:
                student_application.status = 'Rejected'
                student_application.save()
                return Response(
                    {'success': 'Application failed'},
                    status=status.HTTP_200_OK
                )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

class ManageStaffApplication(APIView):
    def post(self, request, pk):
        data = request.data
        action = data['action']
        staff_application = Staff_Member_Application.objects.get(id=pk)

        user = request.user
        if user.is_superuser == True:

            if action == 'accept':
                staff_application.status = 'Accepted'
                staff_application.save()
                
                password = createPassword()
               

                new_user = User.objects.create_staff_member(name=staff_application.name, email=staff_application.email, password=password)
                new_staff = Staff_Member(user= new_user, department = staff_application.department   )
                new_staff.save()

                send_mail("Employed", "Your have been successfully employed.\n" + 
                            "Use your email and this password , " + password + " to login into your account", 
                            "mikemundati@gmail.com",[ staff_application.email], fail_silently=False)

                return Response(
                {'success': 'Employed  successfully'},
                status=status.HTTP_200_OK
            )
            else:
                staff_application.status = 'Rejected'
                staff_application.save()
                return Response(
                    {'success': 'Application failed'},
                    status=status.HTTP_200_OK
                )
                
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

#fetch registered or unregistered units for a specific student
class StudentUnitsView(APIView):
    def get(self, request, action):
        user = request.user
        if user.is_student == True:
            if action == 'registered':
                student = Student.objects.get(user=user)
                units = Students_Units.objects.filter(status='Registered',student=student)
                units = StudentUnitSerializer(units)
                return Response(
                    {'units': units.data},
                    status=status.HTTP_200_OK
                )
            else:
                units = Students_Units.objects.filter(status='Unregistered',student=student)
                units = StudentUnitSerializer(units)
                return Response(
                    {'units': units.data},
                    status=status.HTTP_200_OK
                )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

class RegisterUnitView(APIView):
    def post(self, request, pk):
        user = request.user
        if user.is_student == True:
            student = Student.objects.get(user=user)
            unit = Students_Units.objects.get(student=student, id=pk)
            unit.status = 'Registered'
            unit.save()
            return Response(
                        {'success': 'Unit registered successfully'},
                        status=status.HTTP_200_OK
                    )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )




#fetch unit messages and activities
class StudentUnitActivitiesView(APIView):
    def get(self, request, pk):
        user = request.user
        if user.is_student == True or user.is_lecturer ==True:
            student_unit = Students_Units.objects.get(id=pk)
            unit = Unit.objects.get(name=student_unit.unit)
            unit_messages = Unit_Message.objects.filter(unit=unit)
            unit_messages = UnitMessagesSerializer(unit_messages)
            unit_activities = Unit_Activities.objects.filter(unit)
            unit_activities = UnitActivitiesSerializer(unit_activities)
            return Response(
                    {'unit_messages': unit_messages.data, 'unit_activities':unit_activities.data},
                    status=status.HTTP_200_OK
                )

        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

class HandleUnitActivities(APIView):
    #create activity
    def post(self, request):
        user = request.user
        lecturer = Lecturer.objects.get(user=user)
        unit = Unit.objects.get(lecturer=lecturer)
        if user.is_lecturer == True:
            data = request.data
            title = data['title']
            message = data['message']
            new_activity = Unit_Activities(unit=unit,title=title,message=message)
            new_activity.save()
            return Response(
                        {'success': 'Unit activity created successfully'},
                        status=status.HTTP_201_CREATED
                    )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
    def delete(self, request):
        data = request.data
        id = data['id']
        user = request.user
        lecturer = Lecturer.objects.get(user=user)
        unit = Unit.objects.get(lecturer=lecturer)
        if user.is_lecturer == True:
            activity = Unit_Activities.objects.get(unit=unit,id=id) 
            activity.delete()
            return Response(
                        {'success': 'Unit activity deleted successfully'},
                        status=status.HTTP_201_CREATED
                    )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

class HandleUnitMessages(APIView):
    #create activity
    def post(self, request):
        user = request.user
        lecturer = Lecturer.objects.get(user=user)
        unit = Unit.objects.get(lecturer=lecturer)
        if user.is_lecturer == True:
            data = request.data
            title = data['title']
            message = data['message']
            new_activity = Unit_Message(unit=unit,title=title,message=message)
            new_activity.save()
            return Response(
                        {'success': 'Unit message created successfully'},
                        status=status.HTTP_201_CREATED
                    )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
    def delete(self, request):
        data = request.data
        id = data['id']
        user = request.user
        lecturer = Lecturer.objects.get(user=user)
        unit = Unit.objects.get(lecturer=lecturer)
        if user.is_lecturer == True:
            activity = Unit_Message.objects.get(unit=unit,id=id) 
            activity.delete()
            return Response(
                        {'success': 'Unit message deleted successfully'},
                        status=status.HTTP_200_OK
                    )
        else:
            return Response(
                    {'error': 'Unauthorised'},
                    status=status.HTTP_401_UNAUTHORIZED
                )


class StaffAnouncementsView(APIView):
    def post(self,request):
        data = request.data
        user = request.user
        
        if user.is_superuser == True:
            title = data['title']
            message = data['message']
            new_announcement = Staff_Anouncements(title=title,message=message)
            new_announcement.save()
            return Response(
                        {'success': 'Unit message deleted successfully'},
                        status=status.HTTP_201_CREATED
                    )

    def get(self,request):
        user = request.user
        
        if user.is_staff_member == True or user.is_lecturer:
            announcements = Staff_Anouncements.objects.all()
            announcements = AnnouncementsSerializer(announcements)
            return Response(
                        {'announcements': announcements.data},
                        status=status.HTTP_200_OK
                    )