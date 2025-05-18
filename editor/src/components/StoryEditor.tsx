import React, { useState, useCallback, useRef } from 'react'
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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, Button, Space, Drawer, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Story } from '../types/story'
import { MyNode, nodeTypes } from '../types/define'
import { parseScene } from '../types/parser'
const { Text } = Typography


const StoryEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNode, setSelectedNode] = useState<MyNode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )


  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as MyNode)
  }, [])


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
      <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={handleLoadClick} icon={<PlusOutlined />}>加载故事数据</Button>
        </Space>
      </Card>
      <div style={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: '100vw', height: '100vh' }}
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

export default StoryEditor 