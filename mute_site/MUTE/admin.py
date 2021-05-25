"""

module for registration of your models,
register them so that they can be shown on **/admin page**

"""

from django.contrib import admin

# Register your models here.
from MUTE.models import Parent, Child

admin.site.register(Parent)
admin.site.register(Child)
