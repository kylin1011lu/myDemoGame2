import { Edge, Node } from "@xyflow/react";
import { nodeNameToType } from "./define";
import { INodeData, ISceneData } from "./story";

export function parseScene(scene: ISceneData) {

    const initialNodes: Node[] = []
    const initialEdges: Edge[] = []

    // 记录每个节点的前驱节点id（用于连线）
    const prevMap = new Map<string, string[]>();
    scene.nodes.forEach((n) => {
        if (n.next_node_id) {
            if (!prevMap.has(n.next_node_id)) prevMap.set(n.next_node_id, [])
            prevMap.get(n.next_node_id)!.push(n.node_id)
        }
        if (n.node_type === 'PLAYER_CHOICE' && n.choices) {
            n.choices.forEach((choice) => {
                if (choice.next_node_id) {
                    if (!prevMap.has(choice.next_node_id)) prevMap.set(choice.next_node_id, [])
                    prevMap.get(choice.next_node_id)!.push(choice.choice_id)
                }
            })
        }
    })

    // 先构建节点id到节点的映射，方便查找上一个节点
    const nodeIdMap = new Map<string, INodeData>()
    scene.nodes.forEach((n) => nodeIdMap.set(n.node_id, n))

    let traversedNodeIds: string[] = []

    // 使用递归的方式遍历节点
    const traverseNode = (nodeId: string, level: number) => {
        // console.log('traverseNode', nodeId, level)
        if (traversedNodeIds.includes(nodeId)) {

            // 已经遍历过，判定是否需要更新level
            const uiNode = initialNodes.find((n) => n.id === nodeId)

            // 如果节点是PLAYER_CHOICE，则不更新level
            if (uiNode && uiNode.data.nodeType == 'PLAYER_CHOICE') {
                return
            }

            if (uiNode && (uiNode.data.level as number) < level) {
                uiNode.data.level = level
            }

            const node = nodeIdMap.get(nodeId)
            if (node) {
                if (node.next_node_id && nodeIdMap.has(node.next_node_id)) {
                    traverseNode(node.next_node_id, level + 1)
                }

                if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
                    node.choices.forEach((choice) => {
                        if (choice.next_node_id && nodeIdMap.has(choice.next_node_id)) {
                            traverseNode(choice.next_node_id, level + 1)
                        }
                    })
                }
            }
            return
        }
        traversedNodeIds.push(nodeId)

        const node = nodeIdMap.get(nodeId)
        if (node) {
            initialNodes.push({
                id: node.node_id,
                type: nodeNameToType[node.node_type],
                position: {
                    x: 0,
                    y: 0
                },
                data: {
                    preIds: prevMap.get(node.node_id) || [],
                    level: level,
                    label: node.node_type,
                    nodeType: node.node_type,
                    content: node.content,
                    prompt: node.prompt,
                    choices: node.choices,
                    nextNodeId: node.next_node_id,
                    createdType: 'import'
                },
            })
            if (node.next_node_id && nodeIdMap.has(node.next_node_id)) {
                // 添加从当前节点到下一个节点的连接
                initialEdges.push({
                    id: `${node.node_id}-${node.next_node_id}`,
                    source: node.node_id,
                    target: node.next_node_id,
                    style: { stroke: '#1890ff' }
                })

                traverseNode(node.next_node_id, level + 1)
            }

            if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
                node.choices.forEach((choice) => {
                    initialNodes.push({
                        id: choice.choice_id,
                        type: 'choiceNode',
                        parentId: node.node_id,
                        extent: 'parent',
                        draggable: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        data: {
                            level: level,
                            label: 'CHOICE',
                            nodeType: 'CHOICE',
                            text: choice.text,
                            effects: choice.effects,
                            choiceId: choice.choice_id,
                            nextNodeId: choice.next_node_id,
                            createdType: 'import'
                        },
                    })
                    if (choice.next_node_id && nodeIdMap.has(choice.next_node_id)) {
                        initialEdges.push({
                            id: `${choice.choice_id}-${choice.next_node_id}`,
                            source: choice.choice_id,
                            target: choice.next_node_id,
                            style: { stroke: '#faad14' }
                        })
                        traverseNode(choice.next_node_id, level + 1)
                    }
                })
            }
        }
    }

    traverseNode(scene.start_node_id, 0);


    // scene.nodes.forEach((node: INodeData) => {
    //     if (node.node_type === 'PLAYER_CHOICE' && node.choices && node.choices.length > 0) {
    //         // 创建一个PLAYER_CHOICE节点
    //         initialNodes.push({
    //             id: node.node_id,
    //             type: nodeNameToType[node.node_type],
    //             position: {
    //                 x: 0,
    //                 y: 0
    //             },
    //             data: {
    //                 preIds: prevMap.get(node.node_id) || [],
    //                 level: 0,
    //                 label: 'PLAYER_CHOICE',
    //                 nodeType: 'PLAYER_CHOICE',
    //                 content: node.content,
    //                 prompt: node.prompt,
    //                 choices: node.choices,
    //                 createdType: 'import'
    //             },
    //         })

    //         // 为每个choice创建一个独立的节点
    //         const choices = node.choices
    //         choices.forEach((choice) => {
    //             initialNodes.push({
    //                 id: choice.choice_id,
    //                 type: 'choiceNode',
    //                 parentId: node.node_id,
    //                 extent: 'parent',
    //                 draggable: false,
    //                 position: {
    //                     x: 0,
    //                     y: 0
    //                 },
    //                 data: {
    //                     level: 0,
    //                     label: 'CHOICE',
    //                     nodeType: 'CHOICE',
    //                     text: choice.text,
    //                     effects: choice.effects,
    //                     choice_id: choice.choice_id,
    //                     createdType: 'import'
    //                 },
    //             })

    //             // 如果choice有next_node_id，添加从CHOICE到next_node的连接
    //             if (choice.next_node_id) {
    //                 initialEdges.push({
    //                     id: `${choice.choice_id}-${choice.next_node_id}`,
    //                     source: choice.choice_id,
    //                     target: choice.next_node_id,
    //                     style: { stroke: '#faad14' }
    //                 })
    //             }
    //         })
    //     } else {
    //         initialNodes.push({
    //             id: node.node_id,
    //             type: nodeNameToType[node.node_type],
    //             position: {
    //                 x: 0,
    //                 y: 0
    //             },
    //             data: {
    //                 preIds: prevMap.get(node.node_id) || [],
    //                 level: 0,
    //                 label: node.node_type,
    //                 nodeType: node.node_type,
    //                 content: node.content,
    //                 choices: node.choices,
    //                 nextNodeId: node.next_node_id,
    //                 createdType: 'import'
    //             },
    //         })
    //         if (node.next_node_id) {
    //             initialEdges.push({
    //                 id: `${node.node_id}-${node.next_node_id}`,
    //                 source: node.node_id,
    //                 target: node.next_node_id,
    //                 style: { stroke: '#1890ff' }
    //             })
    //         }
    //     }
    // })

    // initialNodes[0].data.level = 0;

    // // 根据Edges计算每个节点的level
    // initialEdges.forEach((edge) => {
    //     const sourceNode = initialNodes.find((node) => node.id === edge.source)
    //     const targetNode = initialNodes.find((node) => node.id === edge.target)

    //     if (sourceNode?.type === 'choiceNode') {
    //         const parentNode = initialNodes.find((node) => node.id === sourceNode.parentId)
    //         if (parentNode) {
    //             sourceNode.data.level = parentNode.data.level;
    //         }
    //     }

    //     if (sourceNode && targetNode) {
    //         if (targetNode.type == "playerChoiceNode" && targetNode.data.level != 0) {
    //             // 不处理
    //         } else {
    //             targetNode.data.level = (Math.max(Number(targetNode.data.level || 0), Number(sourceNode.data.level || 0) + 1));
    //         }
    //     }
    // })

    // console.log(initialNodes)
    // console.log(initialEdges)

    return {
        initialNodes,
        initialEdges
    }
}