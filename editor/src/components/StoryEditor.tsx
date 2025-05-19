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
  Panel,
  useNodesInitialized,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, Button, Space, Drawer, Typography, message, List } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Story } from '../types/story'
import { MyNode, nodeTypes } from '../types/define'
import { parseScene } from '../types/parser'
import { caculateNodePositions } from '../utils/layout'
const { Text, Title } = Typography

const StoryEditorInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<MyNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodesInitialized = useNodesInitialized();
  const calculateLayoutRef = useRef<() => void>();
  const [storyData, setStoryData] = useState<Story | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

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
    setSelectedNode(node as MyNode)
  }, [])

  // 切换场景
  const handleSceneChange = useCallback((index: number) => {
    if (!storyData) return;
    setCurrentSceneIndex(index);
    setIsVisible(false);
    const { initialNodes, initialEdges } = parseScene(storyData.scenes[index]);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => {
      setIsVisible(true);
    }, 200);
  }, [storyData, setNodes, setEdges]);

  // 文件选择并解析
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as Story
        if (!json.scenes || !json.scenes[0] || !json.scenes[0].nodes) {
          message.error('文件格式不正确')
          return
        }
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

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#f5f5f5' }}>
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
      <div style={{ opacity: isVisible ? 1 : 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          style={{ width: '100vw', height: '100vh' }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <Space>
              <Button>保存</Button>
              <Button>导出</Button>
            </Space>
          </Panel>
        </ReactFlow>
      </div>
      <Drawer
        title="节点详情"
        placement="right"
        onClose={() => setSelectedNode(null)}
        open={!!selectedNode}
        width={400}
      >
        {selectedNode && (
          <div>
            <Text strong>节点ID：</Text>
            <Text>{selectedNode.id}</Text>
            <br />
            <Text strong>节点类型：</Text>
            <Text>{selectedNode.data.nodeType}</Text>
            <br />
            {selectedNode.data.characterId && (
              <>
                <Text strong>角色ID：</Text>
                <Text>{selectedNode.data.characterId}</Text>
                <br />
              </>
            )}
            {selectedNode.data.emotion && (
              <>
                <Text strong>情绪：</Text>
                <Text>{selectedNode.data.emotion}</Text>
                <br />
              </>
            )}
            {selectedNode.data.content && (
              <>
                <Text strong>内容：</Text>
                <br />
                {selectedNode.data.content.map((text: string, index: number) => (
                  <Text key={index} style={{ display: 'block', marginBottom: 8 }}>
                    {text}
                  </Text>
                ))}
              </>
            )}
          </div>
        )}
      </Drawer>
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