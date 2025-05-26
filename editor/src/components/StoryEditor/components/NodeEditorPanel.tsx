import React from 'react';
import SystemMessageEditor from '../../editors/SystemMessageEditor';
import HostDialogueEditor from '../../editors/HostDialogueEditor';
import PlayerChoiceEditor from '../../editors/PlayerChoiceEditor';
import SystemActionEditor from '../../editors/SystemActionEditor';
import SystemPlayerDialogueEditor from '../../editors/SystemPlayerDialogueEditor';
import StoryEndFlagEditor from '../../editors/StoryEndFlagEditor';
import ChoiceEditor from '../../editors/ChoiceEditor';
import { useStoryEditorContext } from '../context/StoryEditorContext';

const NodeEditorPanel: React.FC = () => {
  const {
    selectedNode,
    setNodes,
    nodes,
    setEdges,
    setSelectedNode,
    setSelectedNodeId,
    handleSelectChoiceNode
  } = useStoryEditorContext();

  if (!selectedNode) return null;

  const handleNodeChange = (newNode: any, opInfo?: any) => {
    // 针对PLAYER_CHOICE节点，处理choiceNode的增删
    if (selectedNode?.data.nodeType === 'PLAYER_CHOICE' && opInfo) {
      setNodes((nds) => {
        let updatedNodes = nds.map((n) => (n.id === selectedNode.id ? { ...n, ...newNode } : n));
        if (opInfo.type === 'add') {
          // 新增ChoiceNode
          const choice = opInfo.choice;
          updatedNodes.push({
            id: choice.choice_id,
            type: 'choiceNode',
            parentId: selectedNode.id,
            extent: 'parent',
            draggable: false,
            position: { x: 0, y: 0 },
            data: {
              level: selectedNode.data.level,
              label: 'CHOICE',
              nodeType: 'CHOICE',
              text: choice.text,
              choice_id: choice.choice_id
            }
          });
        } else if (opInfo.type === 'remove') {
          // 删除ChoiceNode
          const choiceId = opInfo.choiceId;
          updatedNodes = updatedNodes.filter(n => n.id !== choiceId);
        }
        return updatedNodes;
      });
      setEdges((eds) => {
        if(opInfo.type === 'remove'){
          return eds.filter(e => e.source !== opInfo.choiceId);
        }
        return eds;
      });
      return;
    }
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, ...newNode } : n))
    );
  };

  let editor = null;
  switch (selectedNode.data.nodeType) {
    case 'SYSTEM_MESSAGE':
      editor = <SystemMessageEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    case 'HOST_DIALOGUE':
      editor = <HostDialogueEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    case 'PLAYER_CHOICE':
      editor = <PlayerChoiceEditor node={selectedNode} onChange={handleNodeChange} onSelectChoiceNode={handleSelectChoiceNode} />;
      break;
    case 'SYSTEM_ACTION':
      editor = <SystemActionEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    case 'SYSTEM_PLAYER_DIALOGUE':
      editor = <SystemPlayerDialogueEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    case 'STORY_END_FLAG':
      editor = <StoryEndFlagEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    case 'CHOICE':
      editor = <ChoiceEditor node={selectedNode} onChange={handleNodeChange} />;
      break;
    default:
      editor = (
        <div style={{ padding: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>节点ID：{selectedNode.id}</div>
          <div style={{ marginBottom: 8 }}>类型：{(selectedNode.data.nodeType as string).toUpperCase()}</div>
          <div style={{ color: '#aaa' }}>（该类型节点编辑UI开发中...）</div>
        </div>
      );
  }

  return (
    <div style={{ position: 'absolute', top: 60, right: 15, zIndex: 100, width: 340, background: '#fff', borderRadius: 10, border: '1px solid #eee', padding: 0, overflow: 'visible', minHeight: 60 }}>
      {editor}
    </div>
  );
};

export default NodeEditorPanel; 