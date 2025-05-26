import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StoryEditorProvider } from './context/StoryEditorContext';
import LeftPanel from './components/LeftPanel';
import FlowCanvas from './components/FlowCanvas';
import NodeEditorPanel from './components/NodeEditorPanel';

const StoryEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <StoryEditorProvider>
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