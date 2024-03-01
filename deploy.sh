source .prod.env

echo "================"
echo "Building project"
echo "================"
npm run build

echo "================"
echo "Copying project files to $HOST"
echo "================"
rsync -av --exclude 'node_modules' . root@${HOST}:/var/www/rest
rsync -av .prod.env root@${HOST}:/var/www/rest/.env

ssh root@${HOST} '
  source ~/.nvm/nvm.sh
  cd /var/www/rest
  source .env

  # to avoid node permissions bug
  chown -R root:root .

  nvm use 16
  npm install

  echo "================"
  echo $BE_PORT
  echo "================"

  # stop current node demon
  kill -9 $(lsof -t -i:${BE_PORT}) > /dev/null 2>&1 &

  echo "Node will start in detouch mode"
  nohup npm run start:prod > /dev/null 2>&1 &
'
