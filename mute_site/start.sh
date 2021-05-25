find . -name __pycache__ -type d -exec rm -r "{}" ";"
find . -type f -regex "./MUTE/migrations/[0-9]+.+\.py$" -exec rm "{}" ";"
rm db.sqlite3
python3.7 -m pip install --upgrade -r requirements.txt
python3.7 manage.py makemigrations
python3.7 manage.py migrate --run-syncdb
python3.7 manage.py loaddata fixtures/objects.json
chown www-data:www-data db.sqlite3
apachectl restart
