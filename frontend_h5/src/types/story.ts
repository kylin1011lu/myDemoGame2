// 故事相关类型定义
export interface Story {
  story_id: string;
  story_title: string;
  description: string;
  start_node_id: string;
  scenes: Scene[];
}

export interface Scene {
  scene_id: string;
  scene_title: string;
  nodes: Node[];
}

export interface Node {
  node_id: string;
  node_type: NodeType;
  content: string[];
  next_node_id: string;
  choices?: Choice[];
  effects?: Effect[];
  character_id?: string;
  emotion?: string;
  prompt?: string;
}

export type NodeType = 
  | 'SYSTEM_MESSAGE'
  | 'HOST_DIALOGUE'
  | 'PLAYER_CHOICE'
  | 'SYSTEM_PLAYER_DIALOGUE'
  | 'SYSTEM_ACTION'
  | 'STORY_END_FLAG';

export interface Choice {
  choice_id: string;
  text: string;
  next_node_id: string;
  effects?: Effect[];
}

export interface Effect {
  type: string;
  variable_name?: string;
  value: any;
  target?: string;
} 