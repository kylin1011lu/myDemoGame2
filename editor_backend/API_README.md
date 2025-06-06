# 文字互动游戏剧情编辑器 - API文档

## 概述

这是一个基于TSRPC框架开发的文字互动游戏剧情编辑器后端服务，提供完整的故事、场景和节点管理功能。

## 项目结构

```
editor_backend/
├── src/
│   ├── api/                    # API处理器
│   │   ├── ApiGetStoryList.ts  # 获取故事列表
│   │   ├── ApiGetStory.ts      # 获取故事详情
│   │   ├── ApiCreateStory.ts   # 创建新故事
│   │   ├── ApiGetStoryScenes.ts # 获取场景列表
│   │   ├── ApiGetScene.ts      # 获取场景详情
│   │   ├── ApiCreateScene.ts   # 创建新场景
│   │   ├── ApiUpdateScene.ts   # 更新场景
│   │   ├── ApiGetSceneNodes.ts # 获取节点列表
│   │   ├── ApiCreateNode.ts    # 创建新节点
│   │   ├── ApiValidateStory.ts # 验证故事结构
│   │   └── ApiExportStory.ts   # 导出故事
│   ├── shared/protocols/       # 协议定义
│   │   ├── models.ts          # 数据模型
│   │   ├── PtlStoryManagement.ts # 故事管理协议
│   │   ├── PtlSceneManagement.ts # 场景管理协议
│   │   ├── PtlNodeManagement.ts  # 节点管理协议
│   │   ├── PtlUtilities.ts    # 工具协议
│   │   └── serviceProto.ts    # 服务协议
│   └── utils/
│       └── StoryFileManager.ts # 文件管理工具
├── data/                      # 数据存储
│   └── stories/               # 故事文件
│       └── STORY_0001/
│           ├── meta.json      # 故事元数据
│           └── scenes/        # 场景文件
└── tools/                     # 工具脚本
    ├── split-story.js         # 分拆故事文件
    └── test-apis.js          # API测试脚本
```

## 数据模型

### 故事 (Story)
```typescript
interface Story {
    story_id: string;           // 故事ID
    story_title: string;        // 故事标题
    description: string;        // 故事描述
    start_scene_id: string;     // 起始场景ID
    scenes: SceneInfo[];        // 场景列表
    created_at: string;         // 创建时间
    updated_at: string;         // 更新时间
    version: string;            // 版本号
}
```

### 场景 (Scene)
```typescript
interface Scene {
    scene_id: string;           // 场景ID
    start_node_id: string;      // 起始节点ID
    scene_title: string;        // 场景标题
    nodes: Node[];              // 节点列表
    created_at: string;         // 创建时间
    updated_at: string;         // 更新时间
    node_count: number;         // 节点数量
}
```

### 节点 (Node)
```typescript
interface Node {
    node_id: string;                    // 节点ID
    node_type: NodeType;                // 节点类型
    content?: string[];                 // 内容文本
    prompt?: string;                    // 提示文本
    choices?: Choice[];                 // 选择项
    effects?: Effect[];                 // 效果
    next_node_id?: string;              // 下一个节点ID
    trigger_conditions?: TriggerCondition[]; // 触发条件
    random_events?: RandomEvent[];      // 随机事件
}
```

### 节点类型 (NodeType)
- `SYSTEM_MESSAGE`: 系统消息
- `HOST_DIALOGUE`: 主角对话
- `PLAYER_CHOICE`: 玩家选择
- `SCENE_TRANSITION`: 场景转换
- `ATTRIBUTE_CHECK`: 属性检查
- `ENDING`: 结局

## API接口

### 故事管理

#### 获取故事列表
```typescript
API: GetStoryList
Request: {
    pagination?: { page: number, pageSize: number };
    search?: string;
    status?: 'published' | 'draft';
}
Response: {
    success: boolean;
    data: PaginatedResponse<StoryListItem>;
}
```

#### 获取故事详情
```typescript
API: GetStory
Request: { story_id: string }
Response: { success: boolean; data: Story }
```

#### 创建新故事
```typescript
API: CreateStory
Request: {
    story_title: string;
    description: string;
    template_id?: string;
}
Response: {
    success: boolean;
    data: { story_id: string; story: Story }
}
```

### 场景管理

#### 获取故事场景列表
```typescript
API: GetStoryScenes
Request: { story_id: string }
Response: {
    success: boolean;
    data: {
        story_id: string;
        story_title: string;
        scenes: SceneInfo[];
    }
}
```

#### 获取场景详情
```typescript
API: GetScene
Request: { story_id: string; scene_id: string }
Response: { success: boolean; data: Scene }
```

#### 创建新场景
```typescript
API: CreateScene
Request: {
    story_id: string;
    scene_title: string;
    insert_after?: string;
}
Response: {
    success: boolean;
    data: { scene_id: string; scene: Scene }
}
```

### 节点管理

#### 获取场景节点列表
```typescript
API: GetSceneNodes
Request: { story_id: string; scene_id: string }
Response: {
    success: boolean;
    data: {
        scene_id: string;
        scene_title: string;
        start_node_id: string;
        nodes: Node[];
    }
}
```

#### 创建新节点
```typescript
API: CreateNode
Request: {
    story_id: string;
    scene_id: string;
    node_type: NodeType;
    content?: string[];
    prompt?: string;
    choices?: Choice[];
    effects?: Effect[];
    insert_after?: string;
}
Response: {
    success: boolean;
    data: { node_id: string; node: Node }
}
```

### 工具功能

#### 验证故事结构
```typescript
API: ValidateStory
Request: { story_id: string }
Response: {
    success: boolean;
    data: {
        is_valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
    }
}
```

#### 导出故事
```typescript
API: ExportStory
Request: {
    story_id: string;
    format?: 'json' | 'merged_json';
}
Response: {
    success: boolean;
    data: {
        story_id: string;
        file_content: string;
        file_name: string;
    }
}
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务
```bash
npm start
```

### 3. 运行测试
```bash
# 分拆示例故事文件
node tools/split-story.js

# 测试API功能
node tools/test-apis.js
```

## 文件存储结构

```
data/stories/
├── STORY_0001/
│   ├── meta.json                    # 故事元数据
│   └── scenes/
│       ├── SCENE_ACT1_CRISIS.json  # 场景1
│       └── SCENE_ACT2_AWAKENING.json # 场景2
└── STORY_0002/
    ├── meta.json
    └── scenes/
        └── ...
```

### meta.json 示例
```json
{
  "story_id": "STORY_0001",
  "story_title": "与唐朝小公主的羁绊",
  "description": "玩家与病危的晋阳公主首次建立链接...",
  "start_scene_id": "SCENE_ACT1_CRISIS",
  "scenes": [
    {
      "scene_id": "SCENE_ACT1_CRISIS",
      "scene_title": "第一幕：绝境中的链接",
      "start_node_id": "NODE_ACT1_001",
      "file_path": "scenes/SCENE_ACT1_CRISIS.json"
    }
  ],
  "created_at": "2025-06-06T08:50:28.530Z",
  "updated_at": "2025-06-06T08:50:28.534Z",
  "version": "1.0.0"
}
```

## 开发指南

### 添加新API
1. 在 `src/shared/protocols/` 下定义协议接口
2. 在 `src/api/` 下创建API处理器
3. 在 `serviceProto.ts` 中注册新接口
4. 运行 `npm run proto` 重新生成协议

### 错误处理
所有API都使用统一的错误处理格式：
```typescript
{
    success: false,
    error: {
        code: string,
        message: string,
        details?: any
    }
}
```

常见错误代码：
- `INVALID_PARAMS`: 参数错误
- `STORY_NOT_FOUND`: 故事不存在
- `SCENE_NOT_FOUND`: 场景不存在
- `NODE_NOT_FOUND`: 节点不存在
- `INTERNAL_ERROR`: 内部错误

## 扩展功能

### 计划中的功能
- [ ] 用户权限管理
- [ ] 故事模板系统
- [ ] 版本控制和回滚
- [ ] 实时协作编辑
- [ ] 自动保存功能
- [ ] 导入/导出多种格式
- [ ] 故事预览和测试
- [ ] 性能监控和日志

### 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证
[MIT License](LICENSE)
