import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqUpdateStory extends BaseRequest {
  story_id: number;
  story_title?: string;
  description?: string;
}

export interface ResUpdateStory extends BaseResponse  {
  success: boolean;
  error?: string;
} 

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}