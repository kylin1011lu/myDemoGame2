import React from 'react';
import { HostDialogueNode as HostDialogueNodeType } from '../../../types/nodes';
import { TypingText } from '../../UI/TypingText';

interface HostDialogueNodeProps {
  node: HostDialogueNodeType;
  onComplete: () => void;
}

export const HostDialogueNode: React.FC<HostDialogueNodeProps> = ({ node, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  const handleMessageComplete = () => {
    if (currentMessageIndex < node.content.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className={`host-dialogue ${node.emotion.toLowerCase()}`}>
      <div className="character-info">
        <span className="character-name">{node.character_id}</span>
        <span className="emotion">{node.emotion}</span>
      </div>
      <div className="dialogue-content">
        <TypingText
          text={node.content[currentMessageIndex]}
          onComplete={handleMessageComplete}
          className="dialogue-text"
        />
      </div>
    </div>
  );
}; 