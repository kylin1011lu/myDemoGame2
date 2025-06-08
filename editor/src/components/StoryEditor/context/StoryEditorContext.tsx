import React, { createContext, useContext } from 'react';
import { useStoryEditor } from '../hooks/useStoryEditor';
import { IStoryData } from '../../../types/story';

const StoryEditorContext = createContext<ReturnType<typeof useStoryEditor> | null>(null);

export const StoryEditorProvider: React.FC<{ children: React.ReactNode, initialStoryData?: IStoryData }> = ({ children, initialStoryData }) => {
  const value = useStoryEditor(initialStoryData);
  return (
    <StoryEditorContext.Provider value={value}>
      {children}
    </StoryEditorContext.Provider>
  );
};

export function useStoryEditorContext() {
  const ctx = useContext(StoryEditorContext);
  if (!ctx) throw new Error('useStoryEditorContext必须在StoryEditorProvider中使用');
  return ctx;
} 