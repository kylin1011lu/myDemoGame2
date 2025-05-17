import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const SystemPlayerDialogueNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data} title="玩家对话" nodeColor="#e0f7fa">
      <div>
        {data.content && data.content.map((text, index) => (
          <div key={index} style={{ marginBottom: 5, fontStyle: 'italic', color: '#0277bd' }}>
            "{text}"
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

export default memo(SystemPlayerDialogueNode);
