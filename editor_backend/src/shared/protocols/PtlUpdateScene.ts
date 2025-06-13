export interface ReqUpdateScene {
    story_id: number;
    scene_id: string;
    start_node_id: string;
    nodes: any[];
  }
  
  export interface ResUpdateScene {
    success: boolean;
    error?: string;
  }