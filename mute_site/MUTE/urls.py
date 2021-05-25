from django.urls import path, include
from MUTE import views

urlpatterns = [
    path('', views.IndexView.as_view()),
    path('learn/', views.LearnView.as_view()),
    path('profile/', views.ParentProfileView.as_view()),
    path('register/', view=views.ParentLoginRegisterView.as_view(),
         kwargs={'action': 'register'}),
    path('login/', view=views.ParentLoginRegisterView.as_view(),
         kwargs={'action': 'login'}),
    path('api/v1/', include('MUTE.api_v1')),
    path('about/', views.AboutView.as_view()),
    path('island/<str:island_name>/', views.IslandsView.as_view()),
    path('impressum/', views.ImpressumView.as_view()),
    path('credits/', views.CreditsView.as_view()),
]
