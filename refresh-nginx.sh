set -o allexport
source .env
set +o allexport

echo "Updating Rest nginx config"

envsubst "`printf '${%s} ' $(bash -c "compgen -A variable")`" < nginx.conf > nginx.conf.tmp
ssh root@164.90.183.72 "service nginx stop"
scp nginx.conf.tmp root@164.90.183.72:/etc/nginx/sites-available/rest
rm nginx.conf.tmp
# ssh root@164.90.183.72 "ln -s /etc/nginx/sites-available/rest /etc/nginx/sites-enabled/"
ssh root@164.90.183.72 "service nginx start"
