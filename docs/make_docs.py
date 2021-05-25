import argparse
import django
import os
import sys
import subprocess
import pkg_resources

# check if pdoc3 is installed, install if not
required = {"pdoc3"}
installed = {pkg.key for pkg in pkg_resources.working_set}
missing = required - installed

if missing:
    python = sys.executable
    subprocess.check_call(
        [python, '-m', 'pip', 'install', *missing], stdout=subprocess.DEVNULL)

from pdoc.cli import *

sys.path.append(os.path.abspath('../mute_site/'))

# Specify settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mute_site.dev_settings')

# Setup Django
django.setup()

# docs build output
build_output = "build"
if not os.path.isdir(build_output):
    os.makedirs(build_output)


main(parser.parse_args(("--html", "--output-dir", "build", "../mute_site/MUTE")))
