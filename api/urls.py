from django.urls import path,include
from .views import *


urlpatterns = [
  path('user-details', RetrieveUserView.as_view()),
  path('student-application', StudentApplicationView.as_view()),
  path('staff-application', StaffApplicationView.as_view()),
  path('student-application/<str:pk>', ManageStudentApplication.as_view()),
  path('staff-application/<str:pk>', ManageStaffApplication.as_view()),
  path('student-units/<str:action>', StudentUnitsView.as_view()),
  path('unit-activities/<str:pk>', StudentUnitActivitiesView.as_view()),
  path('lec-unit-activities', LecturerUnitActivitiesView.as_view()),
  path('register-unit/<str:pk>', RegisterUnitView.as_view()),
  path('handle-unit-activities', HandleUnitActivities.as_view()),
  path('handle-unit-messages', HandleUnitMessages.as_view()),
  path('announcements', StaffAnouncementsView.as_view()),
]