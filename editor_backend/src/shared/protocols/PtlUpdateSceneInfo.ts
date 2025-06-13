export interface ReqUpdateSceneInfo {
  story_id: number;
  scene_id: string;
  new_scene_id: string;
  scene_title: string;
  start_node_id: string;
}

export interface ResUpdateSceneInfo {
  success: boolean;
  error?: string;
} 