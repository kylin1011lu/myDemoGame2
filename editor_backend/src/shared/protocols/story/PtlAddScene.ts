import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqAddScene extends BaseRequest {
  story_id: number;
  scene_title: string;
}

export interface ResAddScene extends BaseResponse {
  success: boolean;
  error?: string;
  scene?: {
    scene_id: string;
    scene_title: string;
    start_node_id: string;
  };
} 

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}
