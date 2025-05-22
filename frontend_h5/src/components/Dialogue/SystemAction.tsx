import React from 'react';
import { Typography, Spin } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const Container = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  border: 1px dashed #d9d9d9;
  animation: pulse 1s infinite;
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`;

interface SystemActionProps {
  actionType: string;
  parameters: any;
}

const SystemAction: React.FC<SystemActionProps> = ({ actionType, parameters }) => {
  return (
    <Container>
      <Spin />
      <Text>处理中...</Text>
    </Container>
  );
};

export default SystemAction; 