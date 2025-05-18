import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Card, Tag } from 'antd'

interface PlayerChoiceNodeProps {
  data: {
    label: string
    nodeType: string
    content?: string[]
    choices?: { choice_id: string; text: string }[]
  }
}

const PlayerChoiceNode: React.FC<PlayerChoiceNodeProps> = ({ data }) => {
  // const { label, nodeType, content } = data

  return (
    <div style={{ 
      position: 'relative', 
      minWidth: 200, 
      maxWidth: 800, 
      height: 100,
      border: '2px solid #faad14', 
      borderRadius: 8, 
      background: '#fff', 
      boxShadow: '0 2px 8px #0001', 
      backgroundColor: 'rgba(255,255,255,0.4)',
      margin: '0 auto', 
      boxSizing: 'border-box',
      padding: '12px'
    }}>
      <Handle type="target" position={Position.Top} />
      <Card
        size="small"
        variant="borderless"
        style={{ boxShadow: 'none', background: 'transparent', minWidth: 260, maxWidth: 780, width: '100%', border: 'none', padding: 0 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Tag color="orange">PLAYER_CHOICE</Tag>
          </div>
        }
      >
      </Card>
    </div>
  )
}

export default PlayerChoiceNode 