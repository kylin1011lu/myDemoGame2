import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Tag } from 'antd';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const StoryEndNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode 
      data={data} 
      title="故事结束"
      nodeColor="#c8e6c9" 
      isSource={Boolean(data.next_node_id)}
    >
      <div>
        {data.outcome && (
          <div style={{ marginBottom: 8 }}>
            <strong>结果:</strong> {data.outcome}
          </div>
        )}
        {data.unlocks && data.unlocks.length > 0 && (
          <div>
            <strong>解锁:</strong>
            <div style={{ marginTop: 5 }}>
              {data.unlocks.map((item, index) => (
                <Tag key={index} color="green" style={{ marginBottom: 3 }}>
                  {item}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(StoryEndNode);
