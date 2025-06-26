#!/bin/bash

# 部署配置
SERVER_USER="root"
SERVER_IP="47.113.98.224"
REMOTE_PATH="/var/www/mygame2/editor_backend"
APP_NAME="editor_backend"
LOCAL_DIST_PATH="./dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 命令未找到，请先安装"
        exit 1
    fi
}

# 检查必要的命令
check_command "rsync"
check_command "ssh"

# 1. 清理旧的构建文件
log_info "清理旧的构建文件..."
rm -rf $LOCAL_DIST_PATH

# 2. 安装依赖
log_info "安装依赖..."
npm install

# 3. 构建项目
log_info "构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    log_error "构建失败，dist 目录不存在"
    exit 1
fi

# 4. 上传dist目录到服务器
log_info "上传dist目录到服务器..."
rsync -avz --delete --progress $LOCAL_DIST_PATH/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/dist/

# 5. 上传package.json和.env
log_info "上传package.json和.env到服务器..."
rsync -avz package.json $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
if [ -f .env ]; then
  rsync -avz .env $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
fi

# 6. 在服务器上安装依赖并启动服务
log_info "在服务器上安装依赖并启动服务..."
ssh $SERVER_USER@$SERVER_IP << EOF
    cd $REMOTE_PATH
    npm install --production
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    pm2 start dist/index.js --name $APP_NAME
    pm2 save
    pm2 status
EOF

log_info "部署完成！"