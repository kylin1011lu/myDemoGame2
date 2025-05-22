import { useState, useEffect, useCallback } from 'react';

interface UseTypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const useTypingEffect = ({ text, speed = 50, onComplete }: UseTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const startTyping = useCallback(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isTyping, onComplete]);

  return {
    displayedText,
    isTyping,
    startTyping,
  };
}; 