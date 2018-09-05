#!/usr/bin/env bash

if [ -d /home/ubuntu/hms-front ]; then
  # 소스 디렉토리로 이동
  cd /home/ubuntu/hms-front

  # 데몬 중지 및 PM2에서 삭제
  #pm2 delete hms-front
  #pm2 kill

  # 2018.07.03 왕효근 / webpack-dev-server 를 통한 구동으로 변경
  sudo kill $(ps aux | grep webpack-dev-server | awk '{print $2}') > /dev/null 2> /dev/null || :

  # 소스 디렉토리 삭제
  rm -rf /home/ubuntu/hms-front
  rm -f /home/ubuntu/.pm2/logs/*
fi
