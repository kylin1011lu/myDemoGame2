import React from 'react';
import { PlayerChoiceNode as PlayerChoiceNodeType } from '../../../types/nodes';

interface PlayerChoiceNodeProps {
  node: PlayerChoiceNodeType;
  onChoice: (choiceId: string, effects?: { type: string; value: any; target?: string }[]) => void;
}

export const PlayerChoiceNode: React.FC<PlayerChoiceNodeProps> = ({ node, onChoice }) => {
  return (
    <div className="player-choice">
      <div className="choice-prompt">
        <h3>{node.prompt}</h3>
      </div>
      <div className="choices">
        {node.choices.map(choice => (
          <button
            key={choice.choice_id}
            className="choice-button"
            onClick={() => onChoice(choice.choice_id, choice.effects)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}; 