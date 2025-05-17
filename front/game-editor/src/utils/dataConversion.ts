import { GameData, GameNode, GameNodeData } from '../types';
import { Node, Edge } from 'reactflow';

// 计算分层布局的位置
const calculateNodePosition = (
  nodesMap: Map<string, { node: GameNodeData, depth: number, index: number }>,
  nodeId: string, 
  depth: number = 0,
  visited: Set<string> = new Set()
): void => {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);

  const node = nodesMap.get(nodeId);
  if (!node) return;
  
  node.depth = Math.max(node.depth, depth);
  
  // 处理常规下一个节点
  if (node.node.next_node_id) {
    calculateNodePosition(nodesMap, node.node.next_node_id, depth + 1, visited);
  }
  
  // 处理选择分支
  if (node.node.choices) {
    node.node.choices.forEach((choice) => {
      if (choice.next_node_id) {
        calculateNodePosition(nodesMap, choice.next_node_id, depth + 1, visited);
      }
    });
  }
};

// 将游戏数据转换为ReactFlow格式
export const convertGameDataToFlow = (
  gameData: GameData
): { flowNodes: Node[], flowEdges: Edge[] } => {
  if (!gameData || !gameData.scenes || gameData.scenes.length === 0) {
    return { flowNodes: [], flowEdges: [] };
  }

  const scene = gameData.scenes[0]; // 默认处理第一个场景
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 建立节点ID到节点的映射
  const nodesMap = new Map<string, { node: GameNodeData, depth: number, index: number }>();
  scene.nodes.forEach((node, index) => {
    nodesMap.set(node.node_id, { node, depth: 0, index });
  });
  
  // 计算节点位置
  calculateNodePosition(nodesMap, gameData.start_node_id);
  
  // 按深度分组节点
  const nodesByDepth: Map<number, GameNodeData[]> = new Map();
  nodesMap.forEach(({ node, depth }) => {
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)?.push(node);
  });
  
  // 创建节点
  const horizontalGap = 300;
  const verticalGap = 150;
  
  nodesByDepth.forEach((depthNodes, depth) => {
    depthNodes.forEach((nodeData, index) => {
      // 计算位置，确保节点不会重叠
      const x = depth * horizontalGap;
      const y = index * verticalGap - (depthNodes.length - 1) * verticalGap / 2;
      
      nodes.push({
        id: nodeData.node_id,
        type: nodeData.node_type,
        position: { x, y },
        data: nodeData,
      });
    });
  });
  
  // 创建边
  scene.nodes.forEach((node) => {
    // 基本连接
    if (node.next_node_id) {
      edges.push({
        id: `${node.node_id}-${node.next_node_id}`,
        source: node.node_id,
        target: node.next_node_id,
        animated: false,
        label: '',
      });
    }
    
    // 选择分支连接
    if (node.choices && node.choices.length > 0) {
      node.choices.forEach((choice) => {
        edges.push({
          id: `${node.node_id}-${choice.next_node_id}-choice-${choice.choice_id}`,
          source: node.node_id,
          target: choice.next_node_id,
          animated: true,
          label: choice.text,
          style: { stroke: '#007bff' },
        });
      });
    }
  });
  
  return { flowNodes: nodes, flowEdges: edges };
};
