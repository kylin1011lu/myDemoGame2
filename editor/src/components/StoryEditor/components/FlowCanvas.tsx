import React from 'react';
import { ReactFlow, Background, Controls, Panel } from '@xyflow/react';
import { Button, Space, message } from 'antd';
import { nodeNameToType, nodeTypes } from '../../../types/define';
import { useStoryEditorContext } from '../context/StoryEditorContext';
import NodeTypeToolbar from './NodeTypeToolbar';

const FlowCanvas: React.FC = () => {
  const {
    nodes, setNodes,
    edges, setEdges,
    onNodesChange, onEdgesChange,
    onConnect, onNodeClick,
    isVisible,
    selectedNodeId, setSelectedNodeId, setSelectedNode,
    storyData, currentSceneIndex, getOrphanNodes,
    calculateLayout
  } = useStoryEditorContext();

  // 节点高亮处理
  const getNodeWithHighlight = (node: any) => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId
    }
  });

  // 画布空白点击
  const handlePaneClick = () => {
    setSelectedNode(null);
    setSelectedNodeId(null);
  };

  // 导出当前场景
  const exportCurrentScene = () => {
    if (!storyData) return;
    const scene = storyData.scenes[currentSceneIndex];
    const orphanNodes = getOrphanNodes(storyData.start_node_id);
    if (orphanNodes.length > 0) {
      message.error(`存在${orphanNodes.length}个孤立节点，无法导出！`);
      return;
    }

    // 移除null字段的辅助函数
    const removeNullFields = (obj: any) => {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    };

    // 组装nodes为json结构
    const exportNodes = nodes.filter(n => n.type !== 'choiceNode').map(n => {
      const d = n.data;
      let choices = undefined;
      if (d.nodeType === 'PLAYER_CHOICE' && Array.isArray(d.choices)) {
        choices = d.choices.map((c: any) => (removeNullFields({
          choice_id: c.choice_id,
          text: c.text,
          next_node_id: c.next_node_id,
          effects: c.effects
        })));
      }
      let node = removeNullFields({
        node_id: n.id,
        node_type: d.nodeType,
        content: d.content,
        character_id: d.characterId || d.character_id,
        prompt: d.prompt,
        choices,
        action_type: d.action_type,
        parameters: d.parameters,
        feedback_message_to_player: d.feedback_message_to_player,
        effects: d.effects,
        next_node_id: d.nextNodeId || d.next_node_id || null
      });
      return node;
    });
    const exportScene = {
      scene_id: scene.scene_id,
      scene_title: scene.scene_title,
      nodes: exportNodes
    };
    const exportStory = {
      ...storyData,
      scenes: storyData.scenes.map((s, idx) => idx === currentSceneIndex ? exportScene : s)
    };
    const blob = new Blob([JSON.stringify(exportStory, null, 2)], { type: 'application/json' });
    // @ts-ignore
    import('file-saver').then(({ saveAs }) => {
      saveAs(blob, `${storyData.story_title || 'story'}.json`);
      message.success('导出成功！');
    });
  };

  const refresh = () => {
    calculateLayout();
  };

  // 画布拖拽放置新节点
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/node-type');
    if (!type || !nodeNameToType[type]) return;
    // 画布坐标转换
    const reactFlowBounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - reactFlowBounds.left;
    const y = event.clientY - reactFlowBounds.top;
    const id = `${type}_${Date.now()}`;
    const defaultData: any = {
      nodeType: type,
      label: type,
      content: [],
      preIds: [],
      level: 0,
      createdType: 'create'
    };
    setNodes((nds: any[]) => [
      ...nds,
      {
        id,
        type: nodeNameToType[type],
        position: { x, y },
        data: defaultData
      }
    ]);
    setSelectedNodeId(id);
  };

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <div style={{ opacity: isVisible ? 1 : 0, width: '100%', height: '100vh', overflow: 'auto' }}>
        <ReactFlow
          nodes={nodes.map(getNodeWithHighlight)}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          style={{ width: '100%', height: '100vh' }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          onPaneClick={handlePaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <Controls position="bottom-right" />
          <Panel position="top-right">
            <Space>
              <Button onClick={refresh}>刷新</Button>
              <Button>保存</Button>
              <Button onClick={exportCurrentScene}>导出</Button>
            </Space>
          </Panel>
        </ReactFlow>
        <NodeTypeToolbar />
      </div>
    </div>
  );
};

export default FlowCanvas; 