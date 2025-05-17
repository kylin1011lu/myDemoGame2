import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Tag } from 'antd';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const HostDialogueNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data} title="角色对话" nodeColor="#fff3e0">
      <div>
        {data.character_id && (
          <div style={{ marginBottom: 8 }}>
            <Tag color="blue">{data.character_id}</Tag>
            {data.emotion && (
              <Tag color="purple">{data.emotion}</Tag>
            )}
          </div>
        )}
        {data.content && data.content.map((text, index) => (
          <div key={index} style={{ marginBottom: 5, fontStyle: 'italic' }}>
            "{text}"
          </div>
        ))}
        {data.content_template && (
          <div style={{ marginBottom: 5, fontStyle: 'italic' }}>
            "{data.content_template}"
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(HostDialogueNode);
