import { BaseConf, BaseRequest, BaseResponse } from "../base";

export interface ReqAddStory extends BaseRequest {
    story_title: string;
    description: string;    
    story_type: string;
}

export interface ResAddStory extends BaseResponse {
    success: boolean;
    error?: string;
    story?: {
        story_id: number;
        story_title: string;
        description: string;
        start_scene_id: string;
        story_type: string;
        scenes: {
            scene_id: string;
            scene_title: string;
            start_node_id: string;
        }[];
        version: string;
        created_at: string;
        updated_at: string;
    };
} 

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['admin']
}