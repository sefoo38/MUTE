find ./mute_site/ -exec rm -rf -v !\(db.sqlite3|admin\) {} +
unzip -o mute_site.zip; rm mute_site.zip
sudo chown -R www-data:www-data mute_site/
python3 mute_site/manage.py makemigrations
python3 mute_site/manage.py migrate
sudo apache2ctl restart

