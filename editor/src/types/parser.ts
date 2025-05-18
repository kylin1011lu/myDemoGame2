import { Edge, Node } from "@xyflow/react";
import { Scene, StoryNode as StoryNodeType } from "./story";
import { nodeNameToType } from "./define";

export function parseScene(scene: Scene) {

    const initialNodes: Node[] = []
    const initialEdges: Edge[] = []
    // 先构建节点id到节点的映射，方便查找上一个节点
    const nodeIdMap = new Map<string, StoryNodeType>()
    scene.nodes.forEach((n) => nodeIdMap.set(n.node_id, n))

    // 记录每个节点的前驱节点id（用于连线）
    const prevMap = new Map<string, string[]>();
    scene.nodes.forEach((n) => {
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
    const nodePos: Record<string, { x: number, y: number }> = {}
    scene.nodes.forEach((node, idx) => {
        nodePos[node.node_id] = { x: HORIZONTAL_CENTER, y }
        y += VERTICAL_SPACING
    })

    scene.nodes.forEach((node: StoryNodeType) => {
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
                },
            })

            // 为每个choice创建一个独立的节点
            const choices = node.choices
            choices.forEach((choice, idx) => {
                const choiceNodeId = `${node.node_id}-choice-${idx}`
                initialNodes.push({
                    id: choiceNodeId,
                    type: 'choiceNode',
                    parentId: node.node_id,
                    extent: 'parent',
                    position: {
                        x: (idx - (choices.length - 1) / 2) * 150,
                        y: 0
                    },
                    data: {
                        label: 'CHOICE',
                        nodeType: 'CHOICE',
                        text: choice.text,
                        choice_id: choice.choice_id
                    },
                })

                // 添加从PLAYER_CHOICE到CHOICE的连接
                initialEdges.push({
                    id: `${node.node_id}-${choiceNodeId}`,
                    source: node.node_id,
                    target: choiceNodeId,
                    animated: true,
                    style: { stroke: '#faad14' }
                })

                // 如果choice有next_node_id，添加从CHOICE到next_node的连接
                if (choice.next_node_id) {
                    initialEdges.push({
                        id: `${choiceNodeId}-${choice.next_node_id}`,
                        source: choiceNodeId,
                        target: choice.next_node_id,
                        animated: true,
                        style: { stroke: '#faad14' }
                    })
                }
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
    return {
        initialNodes,
        initialEdges
    }
}