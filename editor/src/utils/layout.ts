import {
  Node,
} from '@xyflow/react'
import { MyNode } from '../types/define'

interface Position {
  x: number
  y: number
}

export const caculateNodePositions = (nodes: Node[]): Record<string, Position> => {
  const VERTICAL_SPACING = 50 // 恢复垂直间距
  let currentY = 0

  // 获取ReactFlow容器的尺寸
  const flowContainer = document.querySelector('.react-flow')
  if (!flowContainer) return {};
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

  let choicePostions: { [key: string]: { x: number, y: number } } = {};
  let parentWidths: { [key: string]: number } = {};

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

    let maxChildHeight = 0;

    childNodes.forEach((childNode) => {
      const childNodeElement = document.querySelector(`[data-id="${childNode.id}"]`)
      if (!childNodeElement) {
        return
      }
      const childNodeWidth = childNodeElement.getBoundingClientRect().width
      totoalWidth += childNodeWidth;

      childNode.position.x = childX;

      choicePostions[childNode.id] = {
        x: childX + childNodeWidth / 2,
        y: 50
      }

      childX += childNodeWidth + margin;
      childNode.position.y = 50;

      maxChildHeight = Math.max(maxChildHeight, childNodeElement.getBoundingClientRect().height);
    })

    totoalWidth += padding * 2;
    totoalWidth += margin * (childNodes.length - 1);

    // console.log("======", parentNode.id, 'totoalWidth', totoalWidth)

    const nodeElement = document.querySelector(`[data-id="${parentNode.id}"]`) as HTMLElement;
    if (nodeElement) {
      nodeElement.style.width = totoalWidth + 'px';
      nodeElement.style.height = 50 + maxChildHeight + 10 + 'px';
      parentWidths[parentNode.id] = totoalWidth;
    }
  })

  let levelNodes: { [key: number]: MyNode[] } = {};

  nodes.forEach((node) => {
    if (node.type === 'choiceNode') {
      return node;
    }

    if (!levelNodes[Number(node.data.level)]) {
      levelNodes[Number(node.data.level)] = [];
    }
    levelNodes[Number(node.data.level)].push(node as MyNode);
  })

  let nodePostions: { [key: string]: { x: number, y: number } } = {};

  const nodeMargin = 10;
  // 最大99层
  for (let i = 0; i < 99; i++) {
    if (!levelNodes[i]) {
      continue;
    }

    if (i == 0) {
      const nodeElement = document.querySelector(`[data-id="${levelNodes[0][0].id}"]`)
      if (nodeElement) {
        const nodeHeight = nodeElement.getBoundingClientRect().height
        const nodeWidth = nodeElement.getBoundingClientRect().width

        // 计算节点位置，使其中心点与容器中心对齐
        const newPosition = {
          x: containerCenterX - nodeWidth / 2,
          y: currentY
        }

        nodePostions[levelNodes[0][0].id] = newPosition;
        currentY += nodeHeight + VERTICAL_SPACING;
      }
    } else {

      if (levelNodes[i].length > 1) {

        let totalWidth = 0;
        let maxHeight = 0;

        levelNodes[i].forEach((node) => {
          const nodeElement = document.querySelector(`[data-id="${node.id}"]`)

          const nodeHeight = nodeElement!.getBoundingClientRect().height
          const nodeWidth = nodeElement!.getBoundingClientRect().width

          totalWidth += nodeWidth;
          maxHeight = Math.max(maxHeight, nodeHeight);
        })

        totalWidth += nodeMargin * (levelNodes[i].length - 1);

        let preNode = nodes.find((node) => node.id === levelNodes[i][0].data.preIds[0])
        if (preNode!.type == "choiceNode") {
          preNode = nodes.find((node) => node.id === preNode?.parentId)
        }

        const preNodeElement = document.querySelector(`[data-id="${preNode!.id}"]`)
        let startX = ((nodePostions[preNode!.id] && nodePostions[preNode!.id].x) + preNodeElement!.getBoundingClientRect().width / 2) - totalWidth / 2;

        levelNodes[i].forEach((node) => {
          const nodeElement = document.querySelector(`[data-id="${node.id}"]`)
          if (nodeElement) {
            nodePostions[node.id] = {
              x: startX,
              y: currentY
            }

            startX += nodeElement.getBoundingClientRect().width + nodeMargin;
          }
        })

        currentY += maxHeight + VERTICAL_SPACING;
      } else {

        let preNodeId = levelNodes[i][0].data.preIds[0]
        let preNode = nodes.find((node) => node.id === preNodeId)

        let centerX = 0;
        if (preNode!.type == "choiceNode") {
          centerX = choicePostions[preNode!.id].x - parentWidths[preNode!.parentId!] / 2;
          const preNodeElement = document.querySelector(`[data-id="${preNode!.parentId}"]`)
          centerX += ((nodePostions[preNode!.parentId!] && nodePostions[preNode!.parentId!].x)) + preNodeElement!.getBoundingClientRect().width / 2
        } else {
          const preNodeElement = document.querySelector(`[data-id="${preNode!.id}"]`)
          centerX = ((nodePostions[preNodeId] && nodePostions[preNodeId].x) || preNode!.position.x) + preNodeElement!.getBoundingClientRect().width / 2
        }

        const nodeElement = document.querySelector(`[data-id="${levelNodes[i][0].id}"]`)
        if (nodeElement) {
          nodePostions[levelNodes[i][0].id] = {
            x: centerX - nodeElement.getBoundingClientRect().width / 2,
            y: currentY
          }

          currentY += nodeElement.getBoundingClientRect().height + VERTICAL_SPACING;
        }

      }
    }
  }

  return nodePostions;
}