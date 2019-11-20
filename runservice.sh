#!/usr/bin/env bash
echo "removing node_modules"
rm -rf ./node_modules
echo "Installing dependencies"
npm i
if [ "x$2" != "x" ]; then
APP_PROF="$2"
else
APP_PROF="production"
fi
APP_NAME="StoreApp"
case "$1" in
	start)
    echo "Starting app with 1 instance..."
    pm2 delete $APP_NAME
    NODE_ENV=$APP_PROF pm2 --node-args="-r esm" start index.js --name $APP_NAME
		exit 1
		;;
	stop)
		echo "Stopping $APP_NAME"
		pm2 stop $APP_NAME
		echo "$APP_NAME was stopped"
		exit 1
		;;
	restart)
		pm2 reload $APP_NAME
		exit 1
		;;
	delete)
		echo "Deleting $APP_NAME"
		pm2 delete $APP_NAME
esac
