import React from 'react'
import { Handle, Position } from '@xyflow/react'

interface ChoiceNodeProps {
  data: {
    label: string
    nodeType: string
    text: string
    choice_id: string
  }
}

const ChoiceNode: React.FC<ChoiceNodeProps> = ({ data }) => {
  const { text } = data

  return (
    <div style={{ 
      position: 'relative', 
      minWidth: 120, 
      maxWidth: 200, 
      width: 'fit-content', 
      border: '1px solid #ffd591', 
      borderRadius: 4, 
      background: '#fff7e6', 
      boxShadow: '0 2px 8px #0001', 
      margin: '0 auto', 
      boxSizing: 'border-box',
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: '#faad14',
          width: 8,
          height: 8,
          top: -4
        }}
      />
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