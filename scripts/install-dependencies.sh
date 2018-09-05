#!/bin/bash

sudo apt-get update

# Mornitoring Services
if [[ $DEPLOYMENT_GROUP_NAME = *"Live"* || $DEPLOYMENT_GROUP_NAME = *"Pre"* ]]; then
    sudo service filebeat restart || true
    sudo service packetbeat restart || true
    sudo service auditbeat restart || true
    sudo service ds_agent restart || true
else
    sudo service filebeat stop || true
    sudo service packetbeat stop || true
    sudo service auditbeat stop || true
    sudo service ds_agent stop || true
fi

# Instance metric collection
if [[ $(sudo service --status-all | grep -E "collectd") == "" ]]; then
  sudo apt-get -y install collectd
fi
cd /home/ubuntu
rm -rf ./collectd-cloudwatch
git clone https://github.com/awslabs/collectd-cloudwatch
cd collectd-cloudwatch/src
sudo ./setup.py --non_interactive -m recommended

if [[ $(service --status-all | grep nginx) == "" ]]; then
    sudo apt-get -y install nginx
fi

cd /home/ubuntu

if [[ ! -d "/home/ubuntu/.nvm" ]]; then
    # install nvm
    curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
    chmod 755 install_nvm.sh
    ./install_nvm.sh

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    # install node specify version
    nvm install 8.11.3
    npm install pm2 -g
fi

if [[ $DEPLOYMENT_GROUP_NAME = *"Live"* ]]; then
    DOMAIN="mhotel.wonders.app"
elif [[ $DEPLOYMENT_GROUP_NAME = *"Pre"* ]]; then
    DOMAIN="mhotel.pre.wonders.app"
elif [[ $DEPLOYMENT_GROUP_NAME = *"Stg"* ]]; then
    DOMAIN="mhotel.dev.wonders.app"
elif [[ $DEPLOYMENT_GROUP_NAME = *"Dev"* ]]; then
    DOMAIN="mhotel.dev.wonders.app"
fi

# nginx /etc/nginx/sites-enabled
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/*
sudo rm -f /etc/nginx/conf.d/*

sudo perl -pi -e "s/#domain#/$DOMAIN/g" /opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive/scripts/default.conf

sudo cp /opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive/scripts/default.conf /etc/nginx/conf.d/default.conf

sudo service nginx restart