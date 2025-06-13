export interface ReqUpdateSceneInfo {
  story_id: string;
  scene_id: string; // 原scene_id
  new_scene_id: string;
  scene_title: string;
  start_node_id: string;
}

export interface ResUpdateSceneInfo {
  success: boolean;
  error?: string;
} 