import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const MessageContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  border-left: 3px solid #1890ff;
`;

const StyledText = styled(Text)`
  color: #666;
  font-size: 14px;
  display: block;
  margin: 4px 0;
`;

interface SystemMessageProps {
  content: string[];
}

const SystemMessage: React.FC<SystemMessageProps> = ({ content }) => {
  return (
    <MessageContainer>
      {content.map((text, index) => (
        <StyledText key={index}>{text}</StyledText>
      ))}
    </MessageContainer>
  );
};

export default SystemMessage; 