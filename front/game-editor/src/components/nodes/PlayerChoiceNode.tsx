import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Badge } from 'antd';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const PlayerChoiceNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data} title="玩家选择" nodeColor="#ffe0e0">
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          {data.prompt}
        </div>
        {data.choices && data.choices.map((choice, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
            <span style={{ marginLeft: 8 }}>{choice.text}</span>
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

export default memo(PlayerChoiceNode);
