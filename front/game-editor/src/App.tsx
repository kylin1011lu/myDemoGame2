import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
  Connection,
  Edge,
  NodeTypes,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Upload, message, Spin, Modal, Tabs } from 'antd';
import { UploadOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import './App.css';

// 自定义节点组件
import SystemMessageNode from './components/nodes/SystemMessageNode';
import HostDialogueNode from './components/nodes/HostDialogueNode';
import PlayerChoiceNode from './components/nodes/PlayerChoiceNode';
import SystemPlayerDialogueNode from './components/nodes/SystemPlayerDialogueNode';
import SystemActionNode from './components/nodes/SystemActionNode';
import StoryEndNode from './components/nodes/StoryEndNode';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import { GameNode, GameEdge, GameData } from './types';
import { convertGameDataToFlow } from './utils/dataConversion';

// 注册自定义节点类型
const nodeTypes: NodeTypes = {
  SYSTEM_MESSAGE: SystemMessageNode,
  HOST_DIALOGUE: HostDialogueNode,
  PLAYER_CHOICE: PlayerChoiceNode,
  SYSTEM_PLAYER_DIALOGUE: SystemPlayerDialogueNode,
  SYSTEM_ACTION: SystemActionNode,
  STORY_END_FLAG: StoryEndNode,
};

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GameNode | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState<boolean>(false);
  
  // 默认加载数据
  useEffect(() => {
    setLoading(true);
    fetch('/data/scene1.json')
      .then(res => res.json())
      .then(data => {
        setGameData(data);
        const { flowNodes, flowEdges } = convertGameDataToFlow(data);
        setNodes(flowNodes);
        setEdges(flowEdges);
        message.success('场景数据加载成功');
      })
      .catch((err) => {
        console.error('加载数据失败:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setNodes, setEdges]);

  // 处理上传JSON文件
  const handleFileUpload = (file: RcFile) => {
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setGameData(data);
        
        // 转换数据到ReactFlow格式
        const { flowNodes, flowEdges } = convertGameDataToFlow(data);
        setNodes(flowNodes);
        setEdges(flowEdges);
        
        message.success('场景数据加载成功');
      } catch (error) {
        message.error('解析JSON文件失败');
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      message.error('读取文件失败');
      setLoading(false);
    };
    
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 保存当前编辑结果
  const handleSave = () => {
    if (!gameData) return;
    
    message.info('保存功能将在后续版本中实现');
    // TODO: 实现从ReactFlow数据转回游戏数据，并保存文件的功能
  };

  // 连接边的处理
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  // 节点选中处理
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node as GameNode);
    setIsDetailPanelOpen(true);
  }, []);

  // 更新节点内容
  const handleNodeUpdate = (updatedNode: GameNode) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === updatedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedNode.data,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="app-container">
      <Spin spinning={loading} tip="加载中..." className="global-spinner">
        <div style={{ height: '100%', width: '100%' }}>
          <ReactFlowProvider>
            <div className="flow-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                style={{ width: '100%', height: '100%' }}
                defaultEdgeOptions={{ animated: true }}
              >
                <Controls />
                <MiniMap />
                <Background color="#aaa" gap={16} />
                <Panel position="top-right">
                  <div className="toolbar">
                    <Upload
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                      accept=".json"
                    >
                      <Button icon={<UploadOutlined />}>加载JSON</Button>
                    </Upload>
                    <Button 
                      icon={<SaveOutlined />} 
                      onClick={handleSave}
                      disabled={!gameData}
                    >
                      保存
                    </Button>
                    <Button 
                      icon={<EditOutlined />} 
                      onClick={() => setIsDetailPanelOpen(true)}
                      disabled={!selectedNode}
                    >
                      编辑节点
                    </Button>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
        
        <NodeDetailsPanel 
          node={selectedNode}
          open={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
          onUpdate={handleNodeUpdate}
        />
      </Spin>
    </div>
  );
};

export default App;
