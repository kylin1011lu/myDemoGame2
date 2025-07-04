import { BaseConf, BaseRequest, BaseResponse   } from "../base";

export interface ReqGetStoryList extends BaseRequest {
}

export interface ResGetStoryList extends BaseResponse {
  stories: Array<{
    story_id: number;
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

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}