import React, { useEffect, useState, useCallback } from 'react';
import { SystemMessageNode as SystemMessageNodeType } from '../../../types/nodes';
import { TypingText } from '../../UI/TypingText';

interface SystemMessageNodeProps {
  node: SystemMessageNodeType;
  onComplete: () => void;
}

export const SystemMessageNode: React.FC<SystemMessageNodeProps> = React.memo(({ node, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const content = node.content || [];

  const handleMessageComplete = useCallback(() => {
    if (currentMessageIndex < content.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      setTimeout(onComplete, 300);
    }
  }, [currentMessageIndex, content.length, onComplete]);

  useEffect(() => {
    if (content.length === 0) {
      onComplete();
    }
  }, [content.length, onComplete]);

  if (!content[currentMessageIndex]) {
    return null;
  }

  return (
    <div className="system-message">
      <TypingText
        text={content[currentMessageIndex]}
        onComplete={handleMessageComplete}
        className="system-text"
      />
    </div>
  );
}); 