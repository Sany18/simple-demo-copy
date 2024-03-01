set -o allexport
source .env
set +o allexport

echo "Updating Rest nginx config"

envsubst "`printf '${%s} ' $(bash -c "compgen -A variable")`" < nginx.conf > nginx.conf.tmp
ssh root@xxx.xxx.xxx.xxx "service nginx stop"
scp nginx.conf.tmp root@xxx.xxx.xxx.xxx:/etc/nginx/sites-available/rest
rm nginx.conf.tmp
# ssh root@xxx.xxx.xxx.xxx "ln -s /etc/nginx/sites-available/rest /etc/nginx/sites-enabled/"
ssh root@xxx.xxx.xxx.xxx "service nginx start"
