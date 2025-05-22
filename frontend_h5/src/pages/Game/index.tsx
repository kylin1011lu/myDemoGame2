import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import DialogueContainer from '../../components/Dialogue/DialogueContainer';

const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 120px);
  overflow-y: auto;
`;

const Game: React.FC = () => {
  return (
    <StyledCard>
      <DialogueContainer />
    </StyledCard>
  );
};

export default Game; 