import React, { useRef } from 'react';
import styled from 'styled-components';
import { useStoryStore } from '../../store/storyStore';
import DialogueNode from './DialogueNode';
import { Story, NodeType } from '../../types/story';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
`;

const Button = styled.button`
  margin-bottom: 16px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const DialogueContainer: React.FC = () => {
  const { currentStory, nodeHistory, setCurrentStory, setNodeHistory, resetHistory } = useStoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // 类型转换：将node_type从string转为NodeType
        const story: Story = {
          ...data,
          scenes: data.scenes.map((scene: any) => ({
            ...scene,
            nodes: scene.nodes.map((node: any) => ({
              ...node,
              node_type: node.node_type as NodeType,
            }))
          }))
        };
        setCurrentStory(story);
        // 设置初始节点历史
        const startNode = story.scenes[0].nodes.find(
          node => node.node_id === story.start_node_id
        );
        if (startNode) {
          setNodeHistory([startNode]);
        } else {
          setNodeHistory([]);
        }
      } catch (err) {
        alert('文件格式错误或解析失败');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Container>
      <Button onClick={handleLoadClick}>加载故事</Button>
      <input
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {nodeHistory.map((node, idx) => (
        <DialogueNode key={idx + node.node_id} node={node} />
      ))}
    </Container>
  );
};

export default DialogueContainer; 