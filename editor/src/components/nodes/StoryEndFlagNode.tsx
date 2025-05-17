import React from 'react'
import { Handle, Position } from 'reactflow'
import { Card, Tag } from 'antd'

interface StoryEndFlagNodeProps {
  data: {
    label: string
    nodeType: string
    content?: string[]
    emotion?: string
    characterId?: string
    choices?: { choice_id: string; text: string }[]
  }
}

const nodeTypeColors: Record<string, string> = {
  SYSTEM_MESSAGE: 'blue',
  HOST_DIALOGUE: 'green',
  PLAYER_CHOICE: 'orange',
  SYSTEM_PLAYER_DIALOGUE: 'purple',
  STORY_END_FLAG: 'red'
}

const StoryEndFlagNode: React.FC<StoryEndFlagNodeProps> = ({ data }) => {
  const { label, nodeType, content, emotion, characterId } = data

  return (
    <div style={{ position: 'relative', minWidth: 220, maxWidth: 320, width: 'fit-content', border: `2px solid ${nodeTypeColors[nodeType] || '#d9d9d9'}`, borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px #0001', margin: '0 auto', boxSizing: 'border-box' }}>
      <Handle type="target" position={Position.Top} />
      <Card
        size="small"
        variant="borderless"
        style={{ boxShadow: 'none', background: 'transparent', minWidth: 200, maxWidth: 300, width: '100%', border: 'none', padding: 0 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Tag color={nodeTypeColors[nodeType] || 'default'}>
              {nodeType}
            </Tag>
            {characterId && <Tag color="cyan" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={characterId}>{characterId}</Tag>}
          </div>
        }
      >
        <div style={{ maxHeight: 200, overflow: 'auto', padding: 0 }}>
          {content && content.length > 0 ? (
            <div>
              {content.map((text, index) => (
                <p key={index} style={{ margin: '4px 0', fontSize: '12px', wordBreak: 'break-all' }}>
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px' }}>{label}</p>
          )}
          {emotion && (
            <Tag color="magenta" style={{ marginTop: 8 }}>
              {emotion}
            </Tag>
          )}
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default StoryEndFlagNode 