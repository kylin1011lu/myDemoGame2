export interface ReqUpdateStory {
  story_id: number;
  story_title?: string;
  description?: string;
}

export interface ResUpdateStory {
  success: boolean;
  error?: string;
} 