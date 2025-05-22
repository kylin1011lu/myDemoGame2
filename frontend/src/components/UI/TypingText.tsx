import React from 'react';
import { useTypingEffect } from '../../hooks/useTypingEffect';

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 50,
  onComplete,
  className,
}) => {
  const { displayedText, isTyping } = useTypingEffect({
    text,
    speed,
    onComplete,
  });

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="cursor">|</span>}
    </span>
  );
}; 