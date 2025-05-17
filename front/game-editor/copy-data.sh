#!/bin/bash
# 复制数据文件到游戏编辑器的public目录，以便开发服务器能够直接访问
mkdir -p /Users/zonst/myDemoGame2/front/game-editor/public/data
cp /Users/zonst/myDemoGame2/front/data/scene1.json /Users/zonst/myDemoGame2/front/game-editor/public/data/
echo "数据文件已复制到编辑器的public目录"
