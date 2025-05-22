import React from 'react';
import { Avatar, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const DialogueContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 12px 0;
`;

const AvatarContainer = styled.div`
  margin-right: 12px;
`;

const ContentContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 80%;
`;

const StyledText = styled(Text)`
  display: block;
  margin: 4px 0;
`;

interface HostDialogueProps {
  content: string[];
  characterId?: string;
  emotion?: string;
}

const HostDialogue: React.FC<HostDialogueProps> = ({ 
  content, 
  characterId = 'HOST_JINYANG',
  emotion 
}) => {
  // 这里可以根据 characterId 和 emotion 显示不同的头像
  const getAvatarSrc = () => {
    // 实际项目中需要根据角色ID和情绪返回对应的头像
    return '/assets/avatars/jinyang.png';
  };

  return (
    <DialogueContainer>
      <AvatarContainer>
        <Avatar size={40} src={getAvatarSrc()} />
      </AvatarContainer>
      <ContentContainer>
        {content.map((text, index) => (
          <StyledText key={index}>{text}</StyledText>
        ))}
      </ContentContainer>
    </DialogueContainer>
  );
};

export default HostDialogue; 