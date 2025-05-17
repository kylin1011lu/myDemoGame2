import React, { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  NodeTypes
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, Button, Space, Drawer, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
// import { calculateNodePositions } from '../utils/layout'
import { Story, StoryNode as StoryNodeType } from '../types/story'
import PlayerChoiceNode from './nodes/PlayerChoiceNode'
import SystemMessageNode from './nodes/SystemMessageNode'
import SystemPlayerDialogueNode from './nodes/SystemPlayerDialogueNode'
import StoryEndFlagNode from './nodes/StoryEndFlagNode'
import HostDialogueNode from './nodes/HostDialogueNode'
const { Text } = Typography

const nodeTypes: NodeTypes = {
  playerChoiceNode: PlayerChoiceNode,
  systemMessageNode: SystemMessageNode,
  systemPlayerDialogueNode: SystemPlayerDialogueNode,
  storyEndFlagNode: StoryEndFlagNode,
  hostDialogueNode: HostDialogueNode
}

const nodeNameToType: Record<string, string> = {
  SYSTEM_MESSAGE: 'systemMessageNode',
  HOST_DIALOGUE: 'hostDialogueNode',
  PLAYER_CHOICE: 'playerChoiceNode',
  SYSTEM_PLAYER_DIALOGUE: 'systemPlayerDialogueNode',
  STORY_END_FLAG: 'storyEndFlagNode'
}

const StoryEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
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
        const initialNodes: Node[] = []
        const initialEdges: Edge[] = []
        // const positions = calculateNodePositions(json.scenes[0].nodes)
        // 先构建节点id到节点的映射，方便查找上一个节点
        const nodeIdMap = new Map<string, StoryNodeType>()
        json.scenes[0].nodes.forEach((n) => nodeIdMap.set(n.node_id, n))

        // 记录每个节点的前驱节点id（用于连线）
        const prevMap = new Map<string, string[]>();
        json.scenes[0].nodes.forEach((n) => {
          if (n.next_node_id) {
            if (!prevMap.has(n.next_node_id)) prevMap.set(n.next_node_id, [])
            prevMap.get(n.next_node_id)!.push(n.node_id)
          }
          if (n.node_type === 'PLAYER_CHOICE' && n.choices) {
            n.choices.forEach(choice => {
              if (choice.next_node_id) {
                if (!prevMap.has(choice.next_node_id)) prevMap.set(choice.next_node_id, [])
                prevMap.get(choice.next_node_id)!.push(n.node_id)
              }
            })
          }
        })

        // 顺序布局：每个节点y轴递增，x轴居中，choice节点横向分布
        let y = 0
        const VERTICAL_SPACING = 200
        const HORIZONTAL_CENTER = 0
        const CHOICE_X_SPACING = 260
        const CHOICE_Y_OFFSET = 100
        const nodePos: Record<string, {x: number, y: number}> = {}
        json.scenes[0].nodes.forEach((node, idx) => {
          nodePos[node.node_id] = { x: HORIZONTAL_CENTER, y }
          y += VERTICAL_SPACING
        })
        // 记录choice节点的布局
        const choiceNodePos: Record<string, {x: number, y: number}> = {}
        json.scenes[0].nodes.forEach((node, idx) => {
          if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
            const baseY = (nodePos[node.node_id]?.y ?? 0) + CHOICE_Y_OFFSET
            const total = node.choices.length
            node.choices.forEach((choice, cidx) => {
              const choiceNodeId = `${node.node_id}_CHOICE_${cidx}`
              choiceNodePos[choiceNodeId] = {
                x: HORIZONTAL_CENTER + (cidx - (total - 1) / 2) * CHOICE_X_SPACING,
                y: baseY
              }
            })
          }
        })

        json.scenes[0].nodes.forEach((node: StoryNodeType) => {
          if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
            // 创建一个PLAYER_CHOICE节点
            initialNodes.push({
              id: node.node_id,
              type: nodeNameToType[node.node_type],
              position: nodePos[node.node_id],
              data: {
                label: 'PLAYER_CHOICE',
                nodeType: 'PLAYER_CHOICE',
                content: node.content,
                choices: node.choices,
              },
            })
            // 找到所有指向当前PLAYER_CHOICE的前驱节点
            const prevs = prevMap.get(node.node_id) || []
            prevs.forEach(prevId => {
              initialEdges.push({
                id: `${prevId}-${node.node_id}`,
                source: prevId,
                target: node.node_id,
                animated: true,
                style: { stroke: '#faad14' }
              })
            })
            // 每个choice指向对应的next_node_id
            node.choices.forEach((choice, idx) => {
              if (choice.next_node_id) {
                initialEdges.push({
                  id: `${node.node_id}-choice-${idx}-${choice.next_node_id}`,
                  source: node.node_id,
                  sourceHandle: `choice-${idx}`,
                  target: choice.next_node_id,
                  animated: true,
                  style: { stroke: '#faad14' }
                })
              }
            })
          } else {
            initialNodes.push({
              id: node.node_id,
              type: nodeNameToType[node.node_type],
              position: nodePos[node.node_id],
              data: {
                label: node.node_type,
                nodeType: node.node_type,
                content: node.content,
                emotion: node.emotion,
                characterId: node.character_id,
                choices: node.choices,
              },
            })
            if (node.next_node_id) {
              initialEdges.push({
                id: `${node.node_id}-${node.next_node_id}`,
                source: node.node_id,
                target: node.next_node_id,
                animated: true,
                style: { stroke: '#1890ff' }
              })
            }
          }
        })
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