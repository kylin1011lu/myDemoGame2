import React from 'react';
import { Button, Typography } from 'antd';
import styled from 'styled-components';
import { Choice } from '../../types/story';
import { useStoryStore } from '../../store/storyStore';

const { Text } = Typography;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
`;

const ChoiceButton = styled(Button)`
  text-align: left;
  height: auto;
  padding: 12px 16px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateX(8px);
  }
`;

const PromptText = styled(Text)`
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
`;

interface PlayerChoiceProps {
  choices: Choice[];
  prompt: string;
}

const PlayerChoice: React.FC<PlayerChoiceProps> = ({ choices, prompt }) => {
  const { goToNextNode } = useStoryStore();

  const handleChoice = (choice: Choice) => {
    goToNextNode(choice.next_node_id);
  };

  return (
    <ChoiceContainer>
      <PromptText>{prompt}</PromptText>
      {choices.map((choice) => (
        <ChoiceButton 
          key={choice.choice_id}
          onClick={() => handleChoice(choice)}
        >
          {choice.text}
        </ChoiceButton>
      ))}
    </ChoiceContainer>
  );
};

export default PlayerChoice; 