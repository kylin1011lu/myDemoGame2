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
import { Card, Button, Space, Drawer, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Story } from '../types/story'
import { MyNode, nodeTypes } from '../types/define'
import { parseScene } from '../types/parser'
const { Text } = Typography

const StoryEditorInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<MyNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodesInitialized = useNodesInitialized();
  const calculateLayoutRef = useRef<() => void>();


  // 默认展示
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 计算节点布局
  calculateLayoutRef.current = () => {
    if (!nodesInitialized || nodes.length === 0) return

    // 获取ReactFlow容器的尺寸
    const flowContainer = document.querySelector('.react-flow')
    if (!flowContainer) return
    const containerRect = flowContainer.getBoundingClientRect()
    const containerCenterX = containerRect.width / 2

    // 通过计算choiceNode所有子节点的宽度，来计算父节点的宽度
    let nodesHasChild: { [key: string]: Node[] } = {};
    nodes.map((node) => {
      if (node.type === 'choiceNode') {
        if (!node.parentId) {
          return node;
        }

        if (!nodesHasChild[node.parentId]) {
          nodesHasChild[node.parentId] = [];
        }
        nodesHasChild[node.parentId].push(node);
      }
    })

    // 计算有子节点的父节点的宽度和子节点的位置
    Object.keys(nodesHasChild).forEach((parentId) => {
      const parentNode = nodes.find((node) => node.id === parentId)
      if (!parentNode) {
        return
      }

      let totoalWidth = 0;
      let padding = 5;
      let margin = 10;

      let childNodes = nodesHasChild[parentId];

      let childX = 0;
      childX += padding;

      childNodes.forEach((childNode) => {
        const childNodeElement = document.querySelector(`[data-id="${childNode.id}"]`)
        if (!childNodeElement) {
          return
        }
        const childNodeWidth = childNodeElement.getBoundingClientRect().width
        totoalWidth += childNodeWidth;

        childNode.position.x = childX;
        childX += childNodeWidth + margin;
        childNode.position.y = 60;
      })

      totoalWidth += padding * 2;
      totoalWidth += margin * (childNodes.length - 1);

      const nodeElement = document.querySelector(`[data-id="${parentNode.id}"]`) as HTMLElement;
      if (nodeElement) {
        nodeElement.style.width = totoalWidth + 'px';
      }
    })

    console.log("======", nodes)

    const VERTICAL_SPACING = 50 // 恢复垂直间距
    let currentY = 0

    // let levelNodes: { [key: number]: MyNode[] } = {};

    // nodes.forEach((node) => {
    //   if (node.type === 'choiceNode') {
    //     return node;
    //   }

    //   if (!levelNodes[Number(node.data.level)]) {
    //     levelNodes[Number(node.data.level)] = [];
    //   }
    //   levelNodes[Number(node.data.level)].push(node as MyNode);
    // })

    // const nodeMargin = 10;
    // // 最大99层
    // for (let i = 0; i < 99; i++) {
    //   if (!levelNodes[i]) {
    //     continue;
    //   }

    //   if (i == 0) {
    //     const nodeElement = document.querySelector(`[data-id="${levelNodes[0][0].id}"]`)
    //     if (nodeElement) {
    //       const nodeHeight = nodeElement.getBoundingClientRect().height
    //       const nodeWidth = nodeElement.getBoundingClientRect().width

    //       // 计算节点位置，使其中心点与容器中心对齐
    //       const newPosition = {
    //         x: containerCenterX - nodeWidth / 2,
    //         y: currentY
    //       }

    //       levelNodes[0][0].position.x = newPosition.x;
    //       levelNodes[0][0].position.y = newPosition.y;

    //       currentY += nodeHeight + VERTICAL_SPACING;
    //     }
    //   } else {

    //     if (levelNodes[i].length > 1) {

    //       let totalWidth = 0;
    //       let maxHeight = 0;

    //       levelNodes[i].forEach((node) => {
    //         const nodeElement = document.querySelector(`[data-id="${node.id}"]`)

    //         const nodeHeight = nodeElement!.getBoundingClientRect().height
    //         const nodeWidth = nodeElement!.getBoundingClientRect().width

    //         totalWidth += nodeWidth;
    //         maxHeight = Math.max(maxHeight, nodeHeight);
    //       })

    //       totalWidth += nodeMargin * (levelNodes[i].length - 1);

    //       let preNode = nodes.find((node) => node.id === levelNodes[i][0].data.preIds[0])

    //       const preNodeElement = document.querySelector(`[data-id="${preNode!.id}"]`)
    //       let startX = preNodeElement!.getBoundingClientRect().width / 2 - totalWidth / 2;

    //       levelNodes[i].forEach((node) => {
    //         const nodeElement = document.querySelector(`[data-id="${node.id}"]`)
    //         if (nodeElement) {
    //           node.position.x = startX;
    //           node.position.y = currentY;

    //           startX += nodeElement.getBoundingClientRect().width + nodeMargin;
    //         }
    //       })

    //       currentY += maxHeight + VERTICAL_SPACING;
    //     } else {

    //       let preNode = nodes.find((node) => node.id === levelNodes[i][0].data.preIds[0])
    //       const preNodeElement = document.querySelector(`[data-id="${preNode!.id}"]`)

    //       const nodeElement = document.querySelector(`[data-id="${levelNodes[i][0].id}"]`)
    //       if (nodeElement) {
    //         levelNodes[i][0].position.x = preNode!.position.x + preNodeElement!.getBoundingClientRect().width / 2 - nodeElement.getBoundingClientRect().width / 2;
    //         levelNodes[i][0].position.y = currentY;

    //         currentY += nodeElement.getBoundingClientRect().height + VERTICAL_SPACING;
    //       }

    //     }
    //   }
    // }


    const updatedNodes = nodes.map((node) => {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`)
      if (!nodeElement) {
        console.warn('nodeElement is null', node.id)
        return node
      }

      if (node.type === 'choiceNode') {
        return node;
      } else {
        const nodeHeight = nodeElement.getBoundingClientRect().height
        const nodeWidth = nodeElement.getBoundingClientRect().width

        // 计算节点位置，使其中心点与容器中心对齐
        const newPosition = {
          x: containerCenterX - nodeWidth / 2,
          y: currentY
        }

        console.log(node.id, 'containerCenterX', containerCenterX, 'nodeWidth', nodeWidth, 'x', newPosition.x)

        currentY += nodeHeight + VERTICAL_SPACING

        return {
          ...node,
          position: newPosition
        }
      }
    })

    setNodes(updatedNodes)
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
      <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={handleLoadClick} icon={<PlusOutlined />}>加载故事数据</Button>
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