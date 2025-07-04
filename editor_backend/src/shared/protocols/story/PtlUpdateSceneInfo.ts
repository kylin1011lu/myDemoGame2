import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqUpdateSceneInfo extends BaseRequest {
  story_id: number;
  scene_id: string;
  new_scene_id: string;
  scene_title: string;
  start_node_id: string;
}

export interface ResUpdateSceneInfo extends BaseResponse {
  success: boolean;
  error?: string;
} 

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}