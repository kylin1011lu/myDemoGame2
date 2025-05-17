import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, Tag } from 'antd'

interface PlayerChoiceNodeProps {
  data: {
    label: string
    nodeType: string
    content?: string[]
    choices?: { choice_id: string; text: string }[]
  }
}

const ChoiceNode: React.FC<PlayerChoiceNodeProps> = ({ data }) => {
  const { label, nodeType, content, choices } = data
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null)

  return (
    <div style={{ 
      position: 'relative', 
      minWidth: 280, 
      maxWidth: 800, 
      width: 'fit-content', 
      border: '2px solid #faad14', 
      borderRadius: 8, 
      background: '#fff', 
      boxShadow: '0 2px 8px #0001', 
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
        <div style={{ maxHeight: 200, overflow: 'auto', padding: 0 }}>
          {content && content.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {content.map((text, index) => (
                <p key={index} style={{ margin: '4px 0', fontSize: '12px', wordBreak: 'break-all' }}>
                  {text}
                </p>
              ))}
            </div>
          )}
          {choices && choices.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {choices.map((choice, index) => (
                <div 
                  key={choice.choice_id}
                  onMouseEnter={() => setHoveredChoice(choice.choice_id)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  style={{
                    position: 'relative',
                    padding: '8px 12px',
                    background: hoveredChoice === choice.choice_id ? '#fff1d6' : '#fff7e6',
                    border: '1px solid #ffd591',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    minWidth: 120,
                    maxWidth: 200,
                    flex: '1 1 auto'
                  }}
                >
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={`choice-${index}`}
                    style={{ 
                      background: '#faad14',
                      width: 8,
                      height: 8,
                      bottom: -4
                    }}
                  />
                  <p style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    color: '#d46b08',
                    textAlign: 'center',
                    wordBreak: 'break-word'
                  }}>
                    {choice.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ChoiceNode 