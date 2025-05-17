import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const SystemMessageNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data} title="系统消息" nodeColor="#e3f2fd">
      <div>
        {data.content && data.content.map((text, index) => (
          <div key={index} style={{ marginBottom: 5 }}>
            {text}
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

export default memo(SystemMessageNode);
