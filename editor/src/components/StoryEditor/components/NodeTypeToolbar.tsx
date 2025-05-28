import React from 'react';

// 7种类型及其SVG图标
const nodeTypeList = [
  {
    type: 'SYSTEM_MESSAGE',
    label: '系统提示',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="#fff" stroke="#333" strokeWidth="2"/><rect x="7" y="9" width="10" height="2" rx="1" fill="#333"/><rect x="7" y="13" width="6" height="2" rx="1" fill="#bbb"/></svg>
    )
  },
  {
    type: 'HOST_DIALOGUE',
    label: '宿主',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="9" r="4" fill="#fff" stroke="#333" strokeWidth="2"/><rect x="6" y="15" width="12" height="5" rx="2" fill="#fff" stroke="#333" strokeWidth="2"/></svg>
    )
  },
  {
    type: 'PLAYER_CHOICE',
    label: '玩家选项',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" stroke="#333" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#333" strokeWidth="2"/></svg>
    )
  },
  {
    type: 'SYSTEM_ACTION',
    label: '系统操作',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" stroke="#333" strokeWidth="2"/><path d="M8 12h8" stroke="#f90" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="#f90"/></svg>
    )
  },
  {
    type: 'SYSTEM_PLAYER_DIALOGUE',
    label: '玩家选择',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" fill="#fff" stroke="#333" strokeWidth="2"/><rect x="7" y="14" width="10" height="4" rx="2" fill="#fff" stroke="#333" strokeWidth="2"/></svg>
    )
  },
  {
    type: 'STORY_END_FLAG',
    label: '结束标记',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" stroke="#333" strokeWidth="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="#e33" strokeWidth="2"/></svg>
    )
  }
];

interface Props {
}

const NodeTypeToolbar: React.FC<Props> = ({ }) => {
  return (
    <div style={{
      position: 'absolute',
      left: 22,
      bottom: 60,
      zIndex: 100,
      width: 56,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px #0001',
      padding: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
      {nodeTypeList.map(item => (
        <button
          key={item.type}
          title={item.label}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'grab',
            outline: 'none',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            transition: 'background 0.2s',
          }}
          draggable
          onDragStart={e => {
            e.dataTransfer.setData('application/node-type', item.type);
            e.dataTransfer.effectAllowed = 'move';
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default NodeTypeToolbar; 