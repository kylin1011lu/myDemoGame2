export interface ReqGetSceneById {
  story_id: number;
  scene_id: string;
}

export interface ResGetSceneById {
  scene?: {
    story_id: number;
    scene_id: string;
    scene_title: string;
    start_node_id: string;
    nodes: any[];
    created_at: string;
    updated_at: string;
  };
  error?: string;
} 