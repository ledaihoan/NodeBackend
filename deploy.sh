#!/usr/bin/env bash
USER=sampleuser
SERVER=sample.server.com
DEPLOY_PATH=/data/services/storeapp
rsync -auvr --delete --exclude '.git' --exclude 'node_modules' . ${USER}@${SERVER}:${DEPLOY_PATH}