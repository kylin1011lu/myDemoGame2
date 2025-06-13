export interface ReqUpdateScene {
    story_id: string;
    scene_id: string;
    scene_title: string;
    start_node_id: string;
    nodes: any[];
  }
  
  export interface ResUpdateScene {
    success: boolean;
    error?: string;
  }