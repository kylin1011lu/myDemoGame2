export interface ReqAddScene {
  story_id: number;
  scene_title: string;
}

export interface ResAddScene {
  success: boolean;
  error?: string;
  scene?: {
    scene_id: string;
    scene_title: string;
    start_node_id: string;
  };
} 