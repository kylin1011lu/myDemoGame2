import React from 'react';
import { Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  margin-top: 100px;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <Title level={2}>欢迎来到文字冒险游戏</Title>
      <Paragraph>
        这是一个充满未知和惊喜的冒险世界。准备好开始你的旅程了吗？
      </Paragraph>
      <Button type="primary" size="large" onClick={() => navigate('/game')}>
        开始游戏
      </Button>
    </StyledCard>
  );
};

export default Home; 