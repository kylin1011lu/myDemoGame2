#!/bin/bash

# 配置参数
SERVER_USER="root"
SERVER_HOST="47.113.98.224"
SERVER_PATH="/var/www/mygame2/editor"

# 1. 打包前端
echo "开始打包前端..."
npm run build

if [ $? -ne 0 ]; then
  echo "打包失败，终止部署。"
  exit 1
fi

# 2. 使用rsync上传dist目录到服务器
echo "上传文件到服务器..."
rsync -avz --delete ./dist/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if [ $? -eq 0 ]; then
  echo "部署成功！"
else
  echo "部署失败！"
  exit 1
fi