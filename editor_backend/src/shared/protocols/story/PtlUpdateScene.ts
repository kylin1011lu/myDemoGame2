import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqUpdateScene extends BaseRequest {
  story_id: number;
  scene_id: string;
  start_node_id: string;
  nodes: any[];
}

export interface ResUpdateScene extends BaseResponse {
  success: boolean;
  error?: string;
}

export const conf: BaseConf = {
  needLogin: true,
  needRoles: ['admin']
}