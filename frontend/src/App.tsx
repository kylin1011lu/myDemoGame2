import React, { useState, useEffect } from 'react';
import { GameContainer } from './components/Game/GameContainer';
import { LoadingState } from './components/UI/LoadingState';
import { ErrorState } from './components/UI/ErrorState';
import { loadStory, StoryLoadError } from './utils/storyLoader';
import { Story } from './types/story';
import './styles/global.less';

const App: React.FC = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storyData = await loadStory('scene1');
      setStory(storyData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载故事数据失败'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoryData();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadStoryData} />;
  }

  if (!story) {
    return <ErrorState error={new Error('故事数据为空')} onRetry={loadStoryData} />;
  }

  return (
    <div className="app">
      <GameContainer story={story} />
    </div>
  );
};

export default App; 