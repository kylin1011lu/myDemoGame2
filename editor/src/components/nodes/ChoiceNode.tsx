import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { StoryEffectType, StoryEffectTypeNames } from '../../types/story'

interface ChoiceNodeProps {
  data: {
    label: string
    nodeType: string
    text: string
    choice_id: string
    selected: boolean
    effects?: { type: string; value: any }[]
  }
}

const ChoiceNode: React.FC<ChoiceNodeProps> = ({ data }) => {
  const { text, effects } = data

  return (
    <div style={{
      position: 'relative',
      minWidth: 120,
      maxWidth: 320,
      width: 'fit-content',
      border: data.selected ? '3px solid #1890ff' : '2px solid #faad14',
      borderRadius: 8,
      background: '#fff',
      boxShadow: data.selected ? '0 0 0 3px #bae7ff' : '0 2px 8px #0001',
      margin: '0 auto',
      boxSizing: 'border-box',
      padding: 4,
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}>
      <Handle
        type="source"
        position={Position.Bottom}
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
        textAlign: 'left',
        wordBreak: 'break-word',
        fontWeight: 500
      }}>
        {text}
      </p>
      {effects && effects.length > 0 && (
        <>
          <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }} />
          <div style={{ marginTop: 0 }}>
            {effects.map((effect, idx) => (
              <div key={effect.type + '-' + idx} style={{ fontSize: '11px', color: '#8c8c8c', textAlign: 'left', wordBreak: 'break-all', lineHeight: 1.5 }}>
                {StoryEffectTypeNames[effect.type as StoryEffectType]}: {String(effect.value > 0 ? '+' + effect.value : effect.value)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ChoiceNode 