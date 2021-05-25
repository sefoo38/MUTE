"""
WSGI config for mute_site project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os, sys
from django.core.wsgi import get_wsgi_application

_production_settings = 'mute_site.production_settings'

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ['DJANGO_SETTINGS_MODULE'] = _production_settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', _production_settings)

application = get_wsgi_application()
