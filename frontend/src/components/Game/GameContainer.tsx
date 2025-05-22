import React, { useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { SystemMessageNode } from './nodes/SystemMessageNode';
import { HostDialogueNode } from './nodes/HostDialogueNode';
import { PlayerChoiceNode } from './nodes/PlayerChoiceNode';
import { GameNode } from '../../types/nodes';
import { NODE_TYPES } from '../../constants/nodeTypes';

// 新增：系统玩家对话节点
const SystemPlayerDialogueNode: React.FC<{ node: any; onComplete: () => void }> = ({ node, onComplete }) => {
  const [done, setDone] = React.useState(false);
  console.log('SystemPlayerDialogueNode render:', { node, done });
  
  if (!done) {
    setTimeout(() => {
      console.log('SystemPlayerDialogueNode complete timeout triggered');
      setDone(true);
      onComplete();
    }, 800);
  }
  return (
    <div className="system-message">
      <span className="system-text">{node.content?.[0]}</span>
    </div>
  );
};

// 新增：系统动作节点
const SystemActionNode: React.FC<{ node: any; onComplete: () => void }> = ({ node, onComplete }) => {
  console.log('SystemActionNode render:', node);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log('SystemActionNode complete timeout triggered');
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="system-message">
      <span className="system-text">{node.feedback_message_to_player || '执行中...'}</span>
    </div>
  );
};

// 新增：结局节点
const StoryEndFlagNode: React.FC<{ node: any }> = ({ node }) => {
  console.log('StoryEndFlagNode render:', node);
  return (
    <div className="system-message">
      <span className="system-text">故事结束：{node.outcome || '未知结局'}</span>
    </div>
  );
};

interface GameContainerProps {
  story: any;
}

export const GameContainer: React.FC<GameContainerProps> = ({ story }) => {
  const { gameState, loadStory, applyEffects, moveToNextNode } = useGameState();

  useEffect(() => {
    console.log('Loading story:', story);
    loadStory(story);
  }, [story, loadStory]);

  useEffect(() => {
    console.log('Current game state:', gameState);
  }, [gameState]);

  const handleNodeComplete = (node: any) => {
    console.log('Node complete:', node);
    if (node.effects) {
      console.log('Applying effects:', node.effects);
      applyEffects(node.effects);
    }
    if (node.next_node_id) {
      console.log('Moving to next node:', node.next_node_id);
      moveToNextNode(node.next_node_id);
    }
  };

  const handleChoice = (choiceId: string, effects?: { type: string; value: any; target?: string }[]) => {
    console.log('Choice selected:', { choiceId, effects });
    if (effects) {
      applyEffects(effects);
    }
    const choice = gameState.currentNode?.choices?.find((c: any) => c.choice_id === choiceId);
    if (choice?.next_node_id) {
      console.log('Moving to choice node:', choice.next_node_id);
      moveToNextNode(choice.next_node_id);
    }
  };

  if (!gameState.currentNode) {
    console.log('No current node, showing loading...');
    return <div>Loading...</div>;
  }

  const renderNode = (node: any) => {
    console.log('Rendering node:', { type: node.node_type, id: node.node_id });
    
    switch (node.node_type) {
      case NODE_TYPES.SYSTEM_MESSAGE:
        return <SystemMessageNode node={node} onComplete={() => handleNodeComplete(node)} />;
      case NODE_TYPES.HOST_DIALOGUE:
        return <HostDialogueNode node={node} onComplete={() => handleNodeComplete(node)} />;
      case NODE_TYPES.PLAYER_CHOICE:
        return <PlayerChoiceNode node={node} onChoice={handleChoice} />;
      case NODE_TYPES.SYSTEM_PLAYER_DIALOGUE:
        return <SystemPlayerDialogueNode node={node} onComplete={() => handleNodeComplete(node)} />;
      case NODE_TYPES.SYSTEM_ACTION:
        return <SystemActionNode node={node} onComplete={() => handleNodeComplete(node)} />;
      case 'STORY_END_FLAG':
        return <StoryEndFlagNode node={node} />;
      default:
        console.warn('Unknown node type:', node.node_type);
        return <div>Unknown node type: {node.node_type}</div>;
    }
  };

  return (
    <div className="game-container">
      {renderNode(gameState.currentNode)}
    </div>
  );
}; 