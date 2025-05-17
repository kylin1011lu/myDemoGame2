import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Tag, Descriptions } from 'antd';
import BaseNode from './BaseNode';
import { GameNodeData } from '../../types';

const SystemActionNode: React.FC<NodeProps<GameNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data} title="系统行为" nodeColor="#ede7f6">
      <div>
        <div style={{ marginBottom: 8 }}>
          <Tag color="green">{data.action_type}</Tag>
        </div>
        {data.parameters && (
          <div style={{ fontSize: '0.85em', marginBottom: 8 }}>
            <Descriptions
              size="small"
              column={1}
              bordered
              style={{ maxWidth: 220 }}
            >
              {Object.entries(data.parameters).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {String(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}
        {data.feedback_message_to_player && (
          <div style={{ marginTop: 8, color: '#666' }}>
            反馈: {data.feedback_message_to_player}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default memo(SystemActionNode);
