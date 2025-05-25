import React from 'react'
import { Handle, Position } from '@xyflow/react'

interface ChoiceNodeProps {
  data: {
    label: string
    nodeType: string
    text: string
    choice_id: string
    selected: boolean
  }
}

const ChoiceNode: React.FC<ChoiceNodeProps> = ({ data }) => {
  const { text } = data

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
        textAlign: 'center',
        wordBreak: 'break-word'
      }}>
        {text}
      </p>
    </div>
  )
}

export default ChoiceNode 