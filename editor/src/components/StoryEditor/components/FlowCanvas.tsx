import React, { useState } from 'react';
import { ReactFlow, Background, Controls, Panel, Connection } from '@xyflow/react';
import { Button, Space, message } from 'antd';
import { nodeNameToType, nodeTypes } from '../../../types/define';
import { useStoryEditorContext } from '../context/StoryEditorContext';
import NodeTypeToolbar from './NodeTypeToolbar';
import { client } from '../../../utils/network';
import { ReqUpdateScene, ResUpdateScene } from '../../../shared/protocols/story/PtlUpdateScene';
import { EyeOutlined } from '@ant-design/icons';
import PreviewSimulator from './PreviewSimulator';

const FlowCanvas: React.FC = () => {
  const {
    nodes, setNodes,
    edges,
    onNodesChange, onEdgesChange,
    onConnect,
    isValidConnection,
    isVisible,
    selectedNodeId, setSelectedNodeId, setSelectedNode,
    storyData, currentSceneIndex, getOrphanNodes,
    calculateLayout,
    screenToFlowPosition
  } = useStoryEditorContext();
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 节点高亮处理
  const getNodeWithHighlight = (node: any) => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId
    }
  });

  // 边高亮处理
  const getEdgeWithHighlight = (edge: any) => ({
    ...edge,
    style: {
      ...(edge.style || {}),
      stroke: edge.id === selectedEdgeId ? '#faad14' : (edge.style?.stroke || '#b1b1b7'),
      strokeWidth: edge.id === selectedEdgeId ? 3 : (edge.style?.strokeWidth || 2),
    },
    animated: edge.id === selectedEdgeId
  });

  // 画布空白点击
  const handlePaneClick = () => {
    setSelectedNode(null);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  // 边点击
  const handleEdgeClick = (_: any, edge: any) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setSelectedNode(null);
  };

  // 节点点击
  const handleNodeClick = (event: any, node: any) => {
    setSelectedNodeId(node.id);
    setSelectedNode(node);
    setSelectedEdgeId(null);
  };

  // 导出当前场景
  const exportCurrentScene = () => {
    if (!storyData) return;
    const scene = storyData.scenes[currentSceneIndex];
    const orphanNodes = getOrphanNodes(scene.start_node_id);
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
        feedback_message_to_player: d.feedback_message_to_player,
        effects: d.effects,
        next_node_id: d.nextNodeId || null
      });
      return node;
    });
    const exportScene = {
      scene_id: scene.scene_id,
      scene_title: scene.scene_title,
      start_node_id: scene.start_node_id,
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

  // 保存当前场景
  const saveCurrentScene = async () => {
    if (!storyData) return;
    const scene = storyData.scenes[currentSceneIndex];
    // 组装nodes为json结构
    const removeNullFields = (obj: any) => {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    };
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
        feedback_message_to_player: d.feedback_message_to_player,
        effects: d.effects,
        next_node_id: d.nextNodeId || null
      });
      return node;
    });
    const req: ReqUpdateScene = {
      story_id: storyData.story_id,
      scene_id: scene.scene_id,
      start_node_id: exportNodes[0].node_id,
      nodes: exportNodes
    };
    const ret = await client.callApi('story/UpdateScene', req);
    if (ret.isSucc && ret.res.success) {
      message.success('保存成功');
    } else {
      message.error('保存失败: ' + (ret.res?.error || '未知错误'));
    }
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
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    }); 
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
        position,
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
          edges={edges.map(getEdgeWithHighlight)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          isValidConnection={isValidConnection as any}
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
              <Button onClick={saveCurrentScene}>保存</Button>
              <Button onClick={exportCurrentScene}>导出</Button>
              <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)} type="primary">预览</Button>
            </Space>
          </Panel>
        </ReactFlow>
        <NodeTypeToolbar />
        <PreviewSimulator open={previewOpen} onClose={() => setPreviewOpen(false)} />
      </div>
    </div>
  );
};

export default FlowCanvas; 