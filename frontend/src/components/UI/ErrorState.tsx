import React from 'react';
import { StoryLoadError } from '../../utils/storyLoader';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="error-state">
      <h2 className="error-title">出错了</h2>
      <p className="error-message">{error.message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          重试
        </button>
      )}
    </div>
  );
}; 