import { Node, Edge } from '@xyflow/react';

/**
 * 检查孤立节点（未与start_node_id连通且不是choiceNode）
 * @param nodes 当前画布所有节点
 * @param edges 当前画布所有边
 * @param startNodeId 起始节点ID
 * @returns 孤立节点数组（不含choiceNode）
 */
export function checkOrphanNodes(nodes: Node[], edges: Edge[], startNodeId: string) {
  // 1. 构建完整的邻接表（包括父子节点关系）
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });

  // 添加显式的边连接
  edges.forEach(e => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  // 添加 PLAYER_CHOICE 与其 choiceNode 的连接关系
  nodes.forEach(node => {
    if (node.type === 'choiceNode' && node.parentId) {
      // PLAYER_CHOICE → choiceNode 的连接
      if (adj[node.parentId]) {
        adj[node.parentId].push(node.id);
      }
    }
  });

  // 2. BFS遍历所有可达节点
  const visited = new Set<string>();
  const queue = [startNodeId];

  while (queue.length) {
    const cur = queue.shift()!;
    if (!visited.has(cur)) {
      visited.add(cur);
      (adj[cur] || []).forEach(next => {
        if (!visited.has(next)) queue.push(next);
      });
    }
  }

  // 3. 简单过滤：只排除 choiceNode，其他未访问的都是孤立节点
  const orphanNodes = nodes.filter(n =>
    !visited.has(n.id) && n.type !== 'choiceNode'
  );

  return orphanNodes;
}