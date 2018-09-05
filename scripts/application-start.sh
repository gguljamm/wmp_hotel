source /home/ubuntu/.bashrc

export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

if [[ $DEPLOYMENT_GROUP_NAME = *"Live"* ]]; then
    NODE_ENV="production"
elif [[ $DEPLOYMENT_GROUP_NAME = *"Pre"* ]]; then
    NODE_ENV="production"
elif [[ $DEPLOYMENT_GROUP_NAME = *"Stage"* ]]; then
    NODE_ENV="staging"
else
    NODE_ENV="development"
fi

## 디렉토리로 이동
cd /home/ubuntu/hms-front

if [[ $NODE_ENV == "production" ]]; then
    # 데몬 시작..
    #pm2 start pm2.json
    sudo service nginx restart
else
    # 2018.07.03 왕효근 / webpack-dev-server 를 통한 구동으로 변경
    NODE_ENV="development"
    #nohup npm run dev &>/dev/null &
fi
