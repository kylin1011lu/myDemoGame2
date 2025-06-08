import React from 'react';
import { Card, Typography, List } from 'antd';
import { useStoryEditorContext } from '../context/StoryEditorContext';

const { Text, Title } = Typography;

const LeftPanel: React.FC = () => {
  const {
    storyData,
    currentSceneIndex,
    handleSceneChange,
  } = useStoryEditorContext();

  return (
    <div style={{ flex: 'none' }}>
      <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, width: 300 }}>
        {storyData && (
          <>
            <Title level={4}>{storyData.story_title}</Title>
            <Text type="secondary">{storyData.description}</Text>
            <List
              size="small"
              bordered
              dataSource={storyData.scenes}
              renderItem={(scene, index) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: currentSceneIndex === index ? '#e6f7ff' : 'transparent'
                  }}
                  onClick={() => handleSceneChange(index)}
                >
                  <Text>{scene.scene_title}</Text>
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default LeftPanel; 