import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Card, Tag } from 'antd'

interface SystemPlayerDialogueNodeProps {
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

const SystemPlayerDialogueNode: React.FC<SystemPlayerDialogueNodeProps> = ({ data }) => {
  const { label, nodeType, content, emotion, characterId } = data

  return (
    <div style={{ 
      position: 'relative', 
      width: 240,
      border: `2px solid ${nodeTypeColors[nodeType] || '#d9d9d9'}`, 
      borderRadius: 8, 
      background: '#fff', 
      boxShadow: '0 2px 8px #0001',
      boxSizing: 'border-box'
    }}>
      <Handle type="target" position={Position.Top} />
      <Card
        size="small"
        variant="borderless"
        style={{ 
          boxShadow: 'none', 
          background: 'transparent', 
          width: '100%', 
          border: 'none', 
          padding: '2px'
        }}
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            flexWrap: 'wrap',
            marginBottom: 8
          }}>
            <Tag color={nodeTypeColors[nodeType] || 'default'}>
              {nodeType}
            </Tag>
            {characterId && (
              <Tag 
                color="cyan" 
                style={{ 
                  maxWidth: 120, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }} 
                title={characterId}
              >
                {characterId}
              </Tag>
            )}
          </div>
        }
      >
        <div style={{ 
          maxHeight: 200, 
          overflow: 'auto',
          padding: '0 0px'
        }}>
          {content && content.length > 0 ? (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              {content.map((text, index) => (
                <p 
                  key={index} 
                  style={{ 
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ 
              margin: 0, 
              fontSize: '12px',
              lineHeight: '1.5',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              {label}
            </p>
          )}
          {emotion && (
            <Tag 
              color="magenta" 
              style={{ 
                marginTop: 8,
                display: 'block'
              }}
            >
              {emotion}
            </Tag>
          )}
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default SystemPlayerDialogueNode 