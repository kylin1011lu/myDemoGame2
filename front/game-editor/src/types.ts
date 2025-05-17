// 游戏数据类型定义
export interface Effect {
  type: string;
  [key: string]: any;
}

export interface Choice {
  choice_id: string;
  text: string;
  next_node_id: string;
  effects?: Effect[];
}

export interface GameNodeData {
  node_id: string;
  node_type: string;
  character_id?: string;
  emotion?: string;
  content?: string[];
  content_template?: string;
  next_node_id?: string;
  prompt?: string;
  choices?: Choice[];
  action_type?: string;
  parameters?: Record<string, any>;
  effects?: Effect[];
  feedback_message_to_player?: string;
  outcome?: string;
  unlocks?: string[];
  [key: string]: any;
}

export interface SceneData {
  scene_id: string;
  scene_title: string;
  nodes: GameNodeData[];
}

export interface GameData {
  story_id: string;
  story_title: string;
  description: string;
  start_node_id: string;
  scenes: SceneData[];
}

// ReactFlow 节点类型扩展
import { Node, Edge } from 'reactflow';

export interface GameNodeProps {
  id: string;
  type: string;
  data: GameNodeData;
  [key: string]: any;
}

export type GameNode = Node<GameNodeData>;
export type GameEdge = Edge;
