export interface ReqGetStoryList {}

export interface ResGetStoryList {
  stories: Array<{
    story_id: string;
    story_title: string;
    description: string;
    start_scene_id: string;
    story_type: string;
    scenes: Array<{
      scene_id: string;
      scene_title: string;
      start_node_id: string;
    }>;
    version: string;
    created_at: string;
    updated_at: string;
  }>;
} 