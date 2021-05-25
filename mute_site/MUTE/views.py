"""

Contains all class-based views that are responsible for rendering html only.

"""

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotFound
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView, FormView
from MUTE.constants import CHILD_BACKEND, LECTURE_CODE


class IndexView(TemplateView):
    """
    renders index.html, the start page

    """
    template_name = 'MUTE/index.html'

    def get(self, request, *args, **kwargs):
        """
        checks whether lecture_session_code cookie is set,
        redirects to **/learn** if true, returns index.html otherwise

        Args:
            request (django.http.HttpRequest): django request object
        Returns:
            `django.http.HttpResponse` with rendered index.html or `redirect()` to **/learn**

        """
        if request.COOKIES.get(LECTURE_CODE):
            return redirect(to='/learn')
        return render(
            request=request,
            template_name=self.template_name
        )


class LearnView(TemplateView):
    """
    renders learn.html, the main page for the child-user

    """
    template_name = 'MUTE/learn.html'

    def get(self, request, *args, **kwargs):
        """
        checks whether lecture_session_code cookie is set,
        redirects to **/** if not,
        also checks if lecture_session_code is valid,
        deletes the cookie and redirects to **/** if not,
        authenticates the user with the associated lecture_session_code otherwise

        Args:
            request (django.http.HttpRequest): django request object
        Returns:
            `django.http.HttpResponse` with rendered learn.html or `redirect()` to **/**

        """
        lecture_session_id = request.COOKIES.get(LECTURE_CODE)
        if lecture_session_id:
            child = authenticate(request=request, lecture_code=lecture_session_id)
            if not child:
                del request.COOKIES[LECTURE_CODE]
                return redirect('/')
            login(request, child, backend=CHILD_BACKEND)
            response = render(
                request=request,
                template_name=self.template_name,
                context={'child': child}
            )
            response.set_cookie(LECTURE_CODE, child.lecture_session_code)
        else:
            response = redirect('/')
        return response


class ParentLoginRegisterView(FormView):
    """
    renders parentLoginRegister.html with matching context

    """
    template_name = 'MUTE/parentLoginRegister.html'

    def get(self, request, *args, **kwargs):
        """
        renders the parentLoginRegister.html depending on *'action='* argument,
        if *action=login*, renders the page with login functionality,
        if *action=register*, render the page with register functionality,
        same template for two functionalities

        Args:
            request (django.http.HttpRequest): django request object
            kwargs: action=login or action=register

        Returns:
            `django.http.HttpResponse` with rendered parentLoginRegister.html

        """
        return render(
            request=request,
            template_name=self.template_name,
            context={'action': kwargs.get('action')}
        )


@method_decorator(login_required, name='dispatch')
class ParentProfileView(TemplateView):
    """
    renders parentprofile.html, the main page for parents

    """
    template_name = 'MUTE/parentprofile.html'

    def get(self, request, *args, **kwargs):
        """
        ordinary get request

        Args:
            request (django.http.HttpRequest): django request object

        Returns:
            `django.http.HttpResponse`

        """
        return render(
            request=request,
            template_name=self.template_name,
            context={'parent': request.user})


class AboutView(TemplateView):
    """
    renders about.html, the *'about'* page

    """
    template_name = 'MUTE/about.html'

    def get(self, request, *args, **kwargs):
        """
        ordinary get request

        Args:
            request (django.http.HttpRequest): django request object

        Returns:
            `django.http.HttpResponse`

        """
        return render(
            request=request,
            template_name=self.template_name
        )


class ImpressumView(TemplateView):
    """
    renders impressum.html, the *'impressum'* page

    """
    template_name = 'MUTE/impressum.html'

    def get(self, request, *args, **kwargs):
        """
        ordinary get request

        Args:
            request (django.http.HttpRequest): django request object

        Returns:
            `django.http.HttpResponse`

        """
        return render(
            request=request,
            template_name=self.template_name
        )

class CreditsView(TemplateView):
    """
    renders credits.html, the *'credits'* page

    """
    template_name = 'MUTE/credits.html'

    def get(self, request, *args, **kwargs):
        """
        ordinary get request

        Args:
            request (django.http.HttpRequest): django request object

        Returns:
            `django.http.HttpResponse`

        """
        return render(
            request=request,
            template_name=self.template_name
        )


class IslandsView(TemplateView):
    """
    renders one of the islands depending on the request

    """
    templates = {
        'home': 'MUTE/includes/learning/home.html',
        'school': 'MUTE/includes/learning/school.html',
        'zoo': 'MUTE/includes/learning/zoo.html',
        'playground': 'MUTE/includes/learning/playground.html',
        'overview': 'MUTE/includes/learning/overview.html',
    }

    def get(self, request, *args, **kwargs):
        """
        checks whether the passed parameter 'island_name' is one of the available templates,
        and if so, the requested template will be rendered,
        returns `django.http.HttpResponseNotFound` otherwise.
        `request.session[island]` is being set so that we can keep track of which page the child is currently on,
        we need this to update the `MUTE.models.Child` coins for each island separately

        Args:
            request (django.http.HttpRequest): django request object
            kwargs: `island_name=`'island_name', one of the available islands

        Returns:
            `django.http.HttpResponse`

        """
        if kwargs.get('island_name') in self.templates:
            request.session['island'] = kwargs.get('island_name')
            return render(
                request=request,
                template_name=self.templates.get(kwargs.get('island_name'))
            )
        return HttpResponseNotFound()
