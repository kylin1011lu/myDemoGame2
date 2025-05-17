export interface StoryNode {
  node_id: string
  node_type: string
  content?: string[]
  next_node_id?: string
  character_id?: string
  emotion?: string
  prompt?: string
  choices?: {
    choice_id: string
    text: string
    next_node_id: string
    effects?: {
      type: string
      value: any
      target?: string
    }[]
  }[]
  action_type?: string
  parameters?: Record<string, any>
  feedback_message_to_player?: string
  outcome?: string
  unlocks?: string[]
}

export interface Scene {
  scene_id: string
  scene_title: string
  nodes: StoryNode[]
}

export interface Story {
  story_id: string
  story_title: string
  description: string
  start_node_id: string
  scenes: Scene[]
} 