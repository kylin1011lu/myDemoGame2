import { StoryNode } from '../types/story'

interface Position {
  x: number
  y: number
}

// export const calculateNodePositions = (nodes: StoryNode[]): Record<string, Position> => {
//   const positions: Record<string, Position> = {}
//   const nodeMap = new Map<string, StoryNode>()
//   const visited = new Set<string>()
//   const levels: string[][] = []

//   // 构建节点映射
//   nodes.forEach(node => nodeMap.set(node.node_id, node))

//   // 找到所有起始节点（没有其他节点指向它的节点）
//   const startNodes = nodes.filter(node => 
//     !nodes.some(n => n.next_node_id === node.node_id)
//   )

//   // 使用BFS进行层级遍历
//   const queue = startNodes.map(node => ({ node, level: 0 }))
  
//   while (queue.length > 0) {
//     const { node, level } = queue.shift()!
    
//     if (visited.has(node.node_id)) continue
//     visited.add(node.node_id)
    
//     if (!levels[level]) levels[level] = []
//     levels[level].push(node.node_id)
    
//     if (node.next_node_id) {
//       const nextNode = nodeMap.get(node.next_node_id)
//       if (nextNode) {
//         queue.push({ node: nextNode, level: level + 1 })
//       }
//     }
//   }

//   // 计算每个节点的位置
//   const HORIZONTAL_SPACING = 250
//   const VERTICAL_SPACING = 150

//   levels.forEach((levelNodes, levelIndex) => {
//     const levelWidth = levelNodes.length * HORIZONTAL_SPACING
//     const startX = -levelWidth / 2

//     levelNodes.forEach((nodeId, index) => {
//       positions[nodeId] = {
//         x: startX + index * HORIZONTAL_SPACING,
//         y: levelIndex * VERTICAL_SPACING
//       }
//     })
//   })

//   return positions
// } 