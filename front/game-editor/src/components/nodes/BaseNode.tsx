import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Tooltip } from 'antd';
import { GameNodeData } from '../../types';

interface BaseNodeProps {
  data: GameNodeData;
  title?: string;
  isSource?: boolean;
  isTarget?: boolean;
  nodeColor?: string;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  title,
  isSource = true,
  isTarget = true,
  nodeColor = '#f0f0f0',
  children
}) => {
  const displayTitle = title || data.node_type;
  
  return (
    <div
      style={{
        background: nodeColor,
        border: '1px solid #ddd',
        padding: 10,
        borderRadius: 5,
        minWidth: 150,
        maxWidth: 300,
      }}
    >
      {isTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#555' }}
        />
      )}
      
      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', marginBottom: 8, padding: 5 }}>
        <Tooltip title={data.node_id}>
          {displayTitle}
        </Tooltip>
      </div>
      
      <div style={{ fontSize: '0.9em' }}>
        {children}
      </div>
      
      {isSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
        />
      )}
    </div>
  );
};

export default memo(BaseNode);
