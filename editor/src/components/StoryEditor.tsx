import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Node,
  Edge,
  Controls,
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useNodesInitialized,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, Button, Space, Typography, message, List } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { MyNode, nodeTypes } from '../types/define'
import { parseScene } from '../types/parser'
import { caculateNodePositions } from '../utils/layout'
import SystemMessageEditor from './editors/SystemMessageEditor'
import HostDialogueEditor from './editors/HostDialogueEditor'
import PlayerChoiceEditor from './editors/PlayerChoiceEditor'
import SystemActionEditor from './editors/SystemActionEditor'
import SystemPlayerDialogueEditor from './editors/SystemPlayerDialogueEditor'
import StoryEndFlagEditor from './editors/StoryEndFlagEditor'
import ChoiceEditor from './editors/ChoiceEditor'
import { IStoryData } from '../types/story'
import { saveAs } from 'file-saver'
import { checkOrphanNodes } from '../utils/storyExport'
const { Text, Title } = Typography

const StoryEditorInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<MyNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodesInitialized = useNodesInitialized();
  const calculateLayoutRef = useRef<() => void>();
  const [storyData, setStoryData] = useState<IStoryData | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const { setViewport } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { getNodes } = useReactFlow();


  // console.log('nodes', nodes.length);
  // 默认展示
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 计算节点布局
  calculateLayoutRef.current = () => {
    if (!nodesInitialized || nodes.length === 0) return

    const  nodePostions = caculateNodePositions(nodes);

    setNodes(nodes.map((node) => {
      return {
        ...node,
        position: nodePostions[node.id] || node.position
      }
    }))
  }

  useEffect(() => {
    if (nodesInitialized && calculateLayoutRef.current) {
      calculateLayoutRef.current()
      setTimeout(() => {
        setIsVisible(true)
      }, 200)
    }
  }, [nodesInitialized])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id)
    setSelectedNode(node as MyNode)
  }, [])

  // 切换场景
  const handleSceneChange = useCallback((index: number) => {
    if (!storyData) return;
    setCurrentSceneIndex(index);
    setIsVisible(false);
    setViewport({ x: 0, y: 0, zoom: 1 });
    const { initialNodes, initialEdges } = parseScene(storyData.scenes[index]);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
  }, [storyData, setNodes, setEdges]);

  // 文件选择并解析
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as IStoryData
        if (!json.scenes || !json.scenes[0] || !json.scenes[0].nodes) {
          message.error('文件格式不正确')
          return
        }
        setViewport({ x: 0, y: 0, zoom: 1 })
        setStoryData(json);
        setCurrentSceneIndex(0);
        setIsVisible(false)
        const { initialNodes, initialEdges } = parseScene(json.scenes[0]);
        setNodes(initialNodes)
        setEdges(initialEdges)
        message.success('故事数据加载成功')
      } catch (error) {
        message.error('解析文件失败')
      }
    }
    reader.readAsText(file)
  }, [setNodes, setEdges])

  // 点击按钮弹出文件选择
  const handleLoadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // 节点高亮处理
  const getNodeWithHighlight = (node: Node) => {
    return {
      ...node,
      data: {
        ...node.data,
        selected: node.id === selectedNodeId
      }
    }
  }

  // 新增：用于高亮choiceNode
  const handleSelectChoiceNode = useCallback((choiceNodeId: string) => {
    setSelectedNodeId(choiceNodeId);
    const node = getNodes().find(node => node.id === choiceNodeId);
    
    if (!node) {
      console.warn(`节点不存在: ${choiceNodeId}`);
      return;
    }
    
    setSelectedNode(node as MyNode);
  }, [getNodes]); // 添加 nodes 作为依赖项

  // 编辑面板渲染
  const renderNodeEditor = () => {
    if (!selectedNode) return <div style={{ color: '#aaa', padding: 24 }}>请选择一个节点进行编辑</div>;
    const handleNodeChange = (newNode: any, opInfo?: any) => {
      // 针对PLAYER_CHOICE节点，处理choiceNode的增删
      if (selectedNode?.data.nodeType === 'PLAYER_CHOICE' && opInfo) {
        setNodes((nds) => {
          let updatedNodes = nds.map((n) => (n.id === selectedNode.id ? { ...n, ...newNode } : n));
          if (opInfo.type === 'add') {
            // 新增ChoiceNode
            const choice = opInfo.choice;
            updatedNodes.push({
              id: choice.choice_id,
              type: 'choiceNode',
              parentId: selectedNode.id,
              extent: 'parent',
              draggable: false,
              position: { x: 0, y: 0 },
              data: {
                level: 0,
                label: 'CHOICE',
                nodeType: 'CHOICE',
                text: choice.text,
                choice_id: choice.choice_id
              }
            });
          } else if (opInfo.type === 'remove') {
            // 删除ChoiceNode
            const choiceId = opInfo.choiceId;
            updatedNodes = updatedNodes.filter(n => n.id !== choiceId);
          }
          return updatedNodes;
        });

        setEdges((eds) => {
          if(opInfo.type === 'remove'){
            return eds.filter(e => e.source !== opInfo.choiceId);
          }
          return eds;
        });

        return;
      }
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedNode.id ? { ...n, ...newNode } : n))
      );
    };
    switch (selectedNode.data.nodeType) {
      case 'SYSTEM_MESSAGE':
        return <SystemMessageEditor node={selectedNode} onChange={handleNodeChange} />;
      case 'HOST_DIALOGUE':
        return <HostDialogueEditor node={selectedNode} onChange={handleNodeChange} />;
      case 'PLAYER_CHOICE':
        return <PlayerChoiceEditor node={selectedNode} onChange={handleNodeChange} onSelectChoiceNode={handleSelectChoiceNode} />;
      case 'SYSTEM_ACTION':
        return <SystemActionEditor node={selectedNode} onChange={handleNodeChange} />;
      case 'SYSTEM_PLAYER_DIALOGUE':
        return <SystemPlayerDialogueEditor node={selectedNode} onChange={handleNodeChange} />;
      case 'STORY_END_FLAG':
        return <StoryEndFlagEditor node={selectedNode} onChange={handleNodeChange} />;
      case 'CHOICE':
        return <ChoiceEditor node={selectedNode} onChange={handleNodeChange} />;
      default:
        return (
          <div style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>节点ID：{selectedNode.id}</div>
            <div style={{ marginBottom: 8 }}>类型：{selectedNode.data.nodeType}</div>
            <div style={{ color: '#aaa' }}>（该类型节点编辑UI开发中...）</div>
          </div>
        );
    }
  };

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodeId(null);
  }, []);

  const exportCurrentScene = () => {
    if (!storyData) return;
    const scene = storyData.scenes[currentSceneIndex];
    // 1. 检查孤立节点
    const orphanNodes = checkOrphanNodes(nodes, edges, storyData.start_node_id);
    console.log(orphanNodes);
    if (orphanNodes.length > 0) {
      message.error(`存在${orphanNodes.length}个孤立节点，无法导出！`);
      return;
    }
    // 2. 组装nodes为json结构
    const exportNodes = nodes.filter(n => n.type !== 'choiceNode').map(n => {
      const d = n.data;
      // 还原choices
      let choices = undefined;
      if (d.nodeType === 'PLAYER_CHOICE' && Array.isArray(d.choices)) {
        choices = d.choices.map((c: any) => ({
          choice_id: c.choice_id,
          text: c.text,
          next_node_id: c.next_node_id,
          effects: c.effects
        }));
      }
      return {
        node_id: n.id,
        node_type: d.nodeType,
        content: d.content,
        character_id: d.characterId || d.character_id,
        prompt: d.prompt,
        choices,
        action_type: d.action_type,
        parameters: d.parameters,
        feedback_message_to_player: d.feedback_message_to_player,
        next_node_id: d.nextNodeId || d.next_node_id || null,
        effects: d.effects
      };
    });
    const exportScene = {
      scene_id: scene.scene_id,
      scene_title: scene.scene_title,
      nodes: exportNodes
    };
    // 3. 组装完整story结构
    const exportStory = {
      ...storyData,
      scenes: storyData.scenes.map((s, idx) => idx === currentSceneIndex ? exportScene : s)
    };
    // 4. 导出为json文件
    const blob = new Blob([JSON.stringify(exportStory, null, 2)], { type: 'application/json' });
    saveAs(blob, `${storyData.story_title || 'story'}.json`);
    message.success('导出成功！');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'row' }}>
      {/* 左侧面板 */}
      <div style={{ flex: 'none' }}>
        <input
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, width: 300 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={handleLoadClick} icon={<PlusOutlined />} block>加载故事数据</Button>
            {storyData && (
              <>
                <Title level={4}>{storyData.story_title}</Title>
                <Text type="secondary">{storyData.description}</Text>
                <List
                  size="small"
                  bordered
                  dataSource={storyData.scenes}
                  renderItem={(scene, index) => (
                    <List.Item
                      style={{ 
                        cursor: 'pointer',
                        background: currentSceneIndex === index ? '#e6f7ff' : 'transparent'
                      }}
                      onClick={() => handleSceneChange(index)}
                    >
                      <Text>{scene.scene_title}</Text>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Space>
        </Card>
      </div>
      {/* 中间画布 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ opacity: isVisible ? 1 : 0, width: '100%', height: '100vh', overflow: 'auto' }}>
          <ReactFlow
            nodes={nodes.map(getNodeWithHighlight)}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            style={{ width: '100%', height: '100vh' }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            onPaneClick={handlePaneClick}
          >
            <Background />
            <Controls />
            <Panel position="top-right">
              <Space>
                <Button>保存</Button>
                <Button onClick={exportCurrentScene}>导出</Button>
              </Space>
            </Panel>
          </ReactFlow>
        </div>
        {/* 悬浮编辑面板 */}
        {selectedNode && (
          <div style={{
            position: 'absolute',
            top: 60,
            right: 15,
            zIndex: 100,
            width: 340,
            background: '#fff',
            borderRadius: 10,
            border: '1px solid #eee',
            padding: 0,
            overflow: 'visible',
            minHeight: 60
          }}>
            {renderNodeEditor()}
          </div>
        )}
      </div>
    </div>
  )
}

const StoryEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <StoryEditorInner />
    </ReactFlowProvider>
  )
}

export default StoryEditor 