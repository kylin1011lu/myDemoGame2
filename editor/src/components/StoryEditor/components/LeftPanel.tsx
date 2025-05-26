import React from 'react';
import { Card, Button, Space, Typography, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useStoryEditorContext } from '../context/StoryEditorContext';

const { Text, Title } = Typography;

const LeftPanel: React.FC = () => {
  const {
    storyData,
    currentSceneIndex,
    handleSceneChange,
    fileInputRef,
    handleFileChange,
  } = useStoryEditorContext();

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ flex: 'none' }}>
      <input
        type="file"
        accept=".json,application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, width: 300 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" onClick={handleLoadClick} icon={<PlusOutlined />} block>加载故事数据</Button>
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
        </Space>
      </Card>
    </div>
  );
};

export default LeftPanel; 