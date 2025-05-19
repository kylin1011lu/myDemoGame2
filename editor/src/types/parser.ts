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
            n.choices.forEach((choice, idx) => {
                if (choice.next_node_id) {
                    if (!prevMap.has(choice.next_node_id)) prevMap.set(choice.next_node_id, [])
                    prevMap.get(choice.next_node_id)!.push(`${n.node_id}-choice-${idx}`)
                }
            })
        }
    })

    scene.nodes.forEach((node: StoryNodeType) => {
        if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
            // 创建一个PLAYER_CHOICE节点
            initialNodes.push({
                id: node.node_id,
                type: nodeNameToType[node.node_type],
                position: {
                    x: 0,
                    y: 0
                },
                data: {
                    preIds: prevMap.get(node.node_id) || [],
                    level: 0,
                    label: '请选择',
                    nodeType: 'PLAYER_CHOICE',
                    content: node.content,
                    prompt: node.prompt
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
                    draggable: false,
                    position: {
                        x: 0,
                        y: 0
                    },
                    data: {
                        level: 0,
                        label: 'CHOICE',
                        nodeType: 'CHOICE',
                        text: choice.text,
                        choice_id: choice.choice_id
                    },
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
        } else {
            initialNodes.push({
                id: node.node_id,
                type: nodeNameToType[node.node_type],
                position: {
                    x: 0,
                    y: 0
                },
                data: {
                    preIds: prevMap.get(node.node_id) || [],
                    level: 0,
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

    // first node level is 0
    initialNodes[0].data.level = "0";

    // 根据Edges计算每个节点的level
    initialEdges.forEach((edge) => {
        const sourceNode = initialNodes.find((node) => node.id === edge.source)
        const targetNode = initialNodes.find((node) => node.id === edge.target)

        if (sourceNode?.type === 'choiceNode') {
            const parentNode = initialNodes.find((node) => node.id === sourceNode.parentId)
            if (parentNode) {
                sourceNode.data.level = parentNode.data.level;
            }
        }

        if (sourceNode && targetNode) {
            if (targetNode.type == "playerChoiceNode" && targetNode.data.level != 0) {
                // 不处理
            } else {
                targetNode.data.level = (Math.max(Number(targetNode.data.level || 0), Number(sourceNode.data.level || 0) + 1)) + "";
            }
        }
    })

    // console.log(initialNodes)
    // console.log(initialEdges)

    return {
        initialNodes,
        initialEdges
    }
}