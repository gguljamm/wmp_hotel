source /home/ubuntu/.bashrc

export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

## 디렉토리로 이동
cd /home/ubuntu/hms-front

# NPM 업데이트
npm install
npm run build