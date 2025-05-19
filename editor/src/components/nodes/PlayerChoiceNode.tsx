import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Card, Tag } from 'antd'

interface PlayerChoiceNodeProps {
  data: {
    prompt: string
    label: string
    nodeType: string
    content?: string[]
    choices?: { choice_id: string; text: string }[]
  }
}

const PlayerChoiceNode: React.FC<PlayerChoiceNodeProps> = ({ data }) => {
  const { label, prompt } = data

  return (
    <div style={{
      position: 'relative',
      minWidth: 200,
      maxWidth: 800,
      border: '2px solid #faad14',
      borderRadius: 8,
      background: '#fff',
      boxShadow: '0 2px 8px #0001',
      backgroundColor: 'rgba(255,255,255,0.4)',
      margin: '0 auto',
      boxSizing: 'border-box',
      height: '100%',
    }}>
      <Handle type="target" position={Position.Top} />
      <Card
        size="small"
        variant="borderless"
        style={{ boxShadow: 'none', background: 'transparent', minWidth: 260, maxWidth: 780, width: '100%', border: 'none', padding: 0, height: '100%' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
            <Tag color="orange">{label}</Tag>
            {prompt && (
              <span style={{ color: '#faad14', fontWeight: 500, fontSize: 14, whiteSpace: 'pre-line', border: '1px solid #ffa940', borderRadius: 4, padding: '0 8px', background: '#fffbe6', minHeight: 22, display: 'inline-flex', alignItems: 'center' }}>{prompt}</span>
            )}
          </div>
        }
      >
      </Card>
    </div>
  )
}

export default PlayerChoiceNode 