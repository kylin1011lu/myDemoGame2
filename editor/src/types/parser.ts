import { Edge, Node } from "@xyflow/react";
import { Scene, StoryNode as StoryNodeType } from "./story";
import { nodeNameToType } from "./define";

export function parseScene(scene: Scene) {

    const initialNodes: Node[] = []
    const initialEdges: Edge[] = []
    // 先构建节点id到节点的映射，方便查找上一个节点
    const nodeIdMap = new Map<string, StoryNodeType>()
    scene.nodes.forEach((n) => nodeIdMap.set(n.node_id, n))


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
                    draggable: false,
                    position: {
                        x: 0,
                        y: 0
                    },
                    data: {
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

    // console.log(initialNodes)
    // console.log(initialEdges)
    return {
        initialNodes,
        initialEdges
    }
}