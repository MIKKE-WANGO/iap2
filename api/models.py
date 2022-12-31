from datetime import datetime, timedelta
from statistics import mean
from django.conf import settings
from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from cloudinary.models import CloudinaryField

# Create your models here.

#custom user manager
class UserAccountManager(BaseUserManager):

    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have email address')

        #ensure emails are consistent
        email = self.normalize_email(email)
        email = email.lower()

        #create user
        user = self.model(
            email = email,
            name = name,
            
        )
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name,  password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user  

    def create_student(self, email, name, password=None):
        user = self.create_user(email, name,  password)
        user.is_student = True
        user.save()

        return user   

    def create_lecturer(self, email, name, password=None):
        user = self.create_user(email, name,  password)
        user.is_lecturer = True
        user.save()

        return user   

    def create_staff_member(self, email, name, password=None):
        user = self.create_user(email, name,  password)
        user.is_staff_member = True
        user.save()

        return user   
class UserAccount(AbstractBaseUser, PermissionsMixin):

    
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    is_lecturer = models.BooleanField(default=False)
    is_staff_member = models.BooleanField(default=False)

    objects = UserAccountManager()

    #determine what default login will be 
    #Normally it is 'username' but i want to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name',  ]

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return self.email



class Course(models.Model):
    name = models.CharField( max_length=100, null=True,blank=True, unique=True)
    code = models.CharField(max_length=10,null=True)
    def __str__(self):
        return self.name

class Lecturer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True,)
    

class Staff_Member(models.Model):
    class Department(models.TextChoices):
        Finance = 'Finance'      
        CLEANING = 'Cleaning'
        COOKING = 'Cooking'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True,)
    department =  models.CharField(max_length=20,choices=Department.choices, default=Department.Finance)
    def __str__(self):
        return self.user.email

class Staff_Member_Application(models.Model):
    class Department(models.TextChoices):
        Finance = 'Finance'      
        CLEANING = 'Cleaning'
        COOKING = 'Cooking'
    class Status(models.TextChoices):
        PENDING = 'Pending'      
        Accepted = 'Accepted'
        REJECTED = 'Rejected'

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, null=True)
    department =  models.CharField(max_length=20,choices=Department.choices, default=Department.Finance)
    status =  models.CharField(max_length=20,choices=Status.choices, default=Status.PENDING)
    def __str__(self):
        return self.email
class Student_Application(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending'      
        ACCEPTED = 'Accepted'
        REJECTED = 'Rejected'

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True,)
    status =  models.CharField(max_length=20,choices=Status.choices, default=Status.PENDING)
    def __str__(self):
        return self.email

class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True,)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True,)
    
    def __str__(self):
        return self.user.email
class Unit(models.Model):
    course = models.OneToOneField (Course, on_delete=models.CASCADE, null=True,)
    Lecturer = models.OneToOneField(Lecturer, on_delete=models.CASCADE, null=True,)
    name = models.CharField( max_length=100, null=True,blank=True, unique=True)
    code = models.CharField(max_length=10,null=True)
    def __str__(self):
        return self.name


class Staff_Anouncements(models.Model):
    title = models.CharField( max_length=100, null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    def __str__(self):
        return self.title

class Students_Units(models.Model):
    class Status(models.TextChoices):
        UNREGISTERED = 'Registered'      
        REGISTERED = 'Unregistered'
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True,)
    unit =  models.ForeignKey(Unit, on_delete=models.CASCADE, null=True,)
    status =  models.CharField(max_length=20,choices=Status.choices, default=Status.UNREGISTERED)
    def __str__(self):
        return self.unit.name
class Unit_Message(models.Model):
    unit =  models.ForeignKey(Unit, on_delete=models.CASCADE, null=True,)
    title = models.CharField( max_length=100, null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    def __str__(self):
        return self.title
   

class Unit_Activities(models.Model):
    unit =  models.ForeignKey(Unit, on_delete=models.CASCADE, null=True,)
    title = models.CharField( max_length=100, null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    def __str__(self):
        return self.title
   