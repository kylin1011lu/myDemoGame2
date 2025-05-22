import { StoryNode } from './story';

export interface BaseNode extends StoryNode {
  node_id: string;
  next_node_id?: string;
}

export interface SystemMessageNode extends BaseNode {
  node_type: 'SYSTEM_MESSAGE';
  content: string[];
}

export interface HostDialogueNode extends BaseNode {
  node_type: 'HOST_DIALOGUE';
  character_id: string;
  emotion: string;
  content: string[];
}

export interface PlayerChoiceNode extends BaseNode {
  node_type: 'PLAYER_CHOICE';
  prompt: string;
  choices: {
    choice_id: string;
    text: string;
    next_node_id: string;
    effects?: {
      type: string;
      value: any;
      target?: string;
    }[];
  }[];
}

export interface SystemPlayerDialogueNode extends BaseNode {
  node_type: 'SYSTEM_PLAYER_DIALOGUE';
  content: string[];
}

export interface SystemActionNode extends BaseNode {
  node_type: 'SYSTEM_ACTION';
  action_type: string;
  parameters: Record<string, any>;
  feedback_message_to_player: string;
}

export type GameNode = 
  | SystemMessageNode 
  | HostDialogueNode 
  | PlayerChoiceNode 
  | SystemPlayerDialogueNode 
  | SystemActionNode; 