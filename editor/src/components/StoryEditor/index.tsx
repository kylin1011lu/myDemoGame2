import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StoryEditorProvider } from './context/StoryEditorContext';
import LeftPanel from './components/LeftPanel';
import FlowCanvas from './components/FlowCanvas';
import NodeEditorPanel from './components/NodeEditorPanel';
import { useLocation } from 'react-router-dom';
import { IStoryData } from '../../types/story';

const StoryEditor: React.FC = () => {
  const location = useLocation();
  const story: IStoryData | undefined = location.state?.story;

  if (!story) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>未获取到故事数据</div>;
  }

  return (
    <ReactFlowProvider>
      <StoryEditorProvider initialStoryData={story}>
        <div className="story-editor" style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'row' }}>
          <LeftPanel />
          <FlowCanvas />
          <NodeEditorPanel />
        </div>
      </StoryEditorProvider>
    </ReactFlowProvider>
  );
};

export default StoryEditor; 