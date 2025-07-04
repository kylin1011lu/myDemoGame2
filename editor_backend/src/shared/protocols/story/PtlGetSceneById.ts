import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqGetSceneById extends BaseRequest {
  story_id: number;
  scene_id: string;
}

export interface ResGetSceneById extends BaseResponse {
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

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}