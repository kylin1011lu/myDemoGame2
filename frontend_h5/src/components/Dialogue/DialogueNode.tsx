import React from 'react';
import styled from 'styled-components';
import { Node } from '../../types/story';
import SystemMessage from './SystemMessage';
import HostDialogue from './HostDialogue';
import PlayerChoice from './PlayerChoice';
import SystemPlayerDialogue from './SystemPlayerDialogue';
import SystemAction from './SystemAction';

const NodeContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface DialogueNodeProps {
  node: Node;
}

const DialogueNode: React.FC<DialogueNodeProps> = ({ node }) => {
  const renderNode = () => {
    switch (node.node_type) {
      case 'SYSTEM_MESSAGE':
        return <SystemMessage content={node.content} />;
      case 'HOST_DIALOGUE':
        return <HostDialogue 
          content={node.content} 
          characterId={node.character_id} 
          emotion={node.emotion} 
        />;
      case 'PLAYER_CHOICE':
        return <PlayerChoice 
          choices={node.choices || []} 
          prompt={node.prompt} 
        />;
      case 'SYSTEM_PLAYER_DIALOGUE':
        return <SystemPlayerDialogue content={node.content} />;
      case 'SYSTEM_ACTION':
        return <SystemAction 
          actionType={node.content[0]} 
          parameters={node.content[1]} 
        />;
      default:
        return null;
    }
  };

  return <NodeContainer>{renderNode()}</NodeContainer>;
};

export default DialogueNode; 