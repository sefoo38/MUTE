@echo off
python3.9 -m pip install --upgrade -r requirements.txt 2>nul
if %errorlevel%==9009 echo python not installed or not found && goto:eof
if %errorlevel%==1 echo failed to install packages from requirements.txt && goto:eof
python3.9 manage.py makemigrations
if %errorlevel%==1 echo failed to make migrations && goto:eof
python3.9 manage.py migrate --run-syncdb
if %errorlevel%==1 echo failed to migrate && goto:eof
python3.9 manage.py loaddata fixtures/objects.json
if %errorlevel%==1 echo failed to load data from fixtures/objects.json
python3.9 manage.py runserver
timeout 5
start "" http://127.0.0.1:8000