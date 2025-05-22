import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 12px 0;
`;

const ContentContainer = styled.div`
  background-color: #1890ff;
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  max-width: 80%;
`;

const StyledText = styled(Text)`
  color: #fff;
  display: block;
  margin: 4px 0;
`;

interface SystemPlayerDialogueProps {
  content: string[];
}

const SystemPlayerDialogue: React.FC<SystemPlayerDialogueProps> = ({ content }) => {
  return (
    <Container>
      <ContentContainer>
        {content.map((text, index) => (
          <StyledText key={index}>{text}</StyledText>
        ))}
      </ContentContainer>
    </Container>
  );
};

export default SystemPlayerDialogue; 