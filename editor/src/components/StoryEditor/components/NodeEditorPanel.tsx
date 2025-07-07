import React from 'react';
import SystemMessageEditor from '../../editors/SystemMessageEditor';
import HostDialogueEditor from '../../editors/HostDialogueEditor';
import PlayerChoiceEditor from '../../editors/PlayerChoiceEditor';
import SystemActionEditor from '../../editors/SystemActionEditor';
import SystemPlayerDialogueEditor from '../../editors/SystemPlayerDialogueEditor';
import StoryEndFlagEditor from '../../editors/StoryEndFlagEditor';
import ChoiceEditor from '../../editors/ChoiceEditor';
import { useStoryEditorContext } from '../context/StoryEditorContext';
import { MyNode } from '../../../types/define';

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
    // 如果是CHOICE节点，则更新其父节点的choices数据
    if (selectedNode?.data.nodeType === 'CHOICE') {
      let parentNode = nodes.find(n => n.id === selectedNode.parentId);
      if (parentNode) {
        let choiceData = (parentNode as MyNode).data.choices.find(c => c.choice_id === selectedNode.id);
        if (choiceData) {
          choiceData.text = newNode.data.text;
        }
      }
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingBottom: 16, paddingRight: 16 }}>
        <button
          style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, padding: '4px 16px', cursor: 'pointer' }}
          onClick={() => {
            // 删除节点
            setNodes((nds) => nds.filter(n => n.id !== selectedNode.id));
            setEdges((eds) => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNode(null);
            setSelectedNodeId(null);
          }}
        >删除</button>
        <button
          style={{ background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 4, padding: '4px 16px', cursor: 'pointer' }}
          onClick={() => {
            // 复制节点
            const type = selectedNode.data.nodeType;
            const offset = 80;
            const newId = `${type}_${Date.now()}`;
            const newNode = {
              ...selectedNode,
              id: newId,
              position: {
                x: (selectedNode.position?.x || 0) + offset,
                y: (selectedNode.position?.y || 0) + offset
              },
              data: {
                ...selectedNode.data,
                label: selectedNode.data.label + '_复制',
                choice_id: selectedNode.data.choice_id ? `${selectedNode.data.choice_id}_copy` : undefined,
                createdType: 'create',
              }
            };
            setNodes((nds) => [...nds, newNode]);
            setSelectedNode(newNode);
            setSelectedNodeId(newId);
          }}
        >复制</button>
      </div>
    </div>
  );
};

export default NodeEditorPanel; 