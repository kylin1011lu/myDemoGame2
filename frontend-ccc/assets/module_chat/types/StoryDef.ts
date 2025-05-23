
// 基础枚举定义
export enum StoryNodeType {
    SYSTEM_MESSAGE = "SYSTEM_MESSAGE",
    HOST_DIALOGUE = "HOST_DIALOGUE",
    PLAYER_CHOICE = "PLAYER_CHOICE",
    SYSTEM_PLAYER_DIALOGUE = "SYSTEM_PLAYER_DIALOGUE",
    SYSTEM_ACTION = "SYSTEM_ACTION",
    STORY_END_FLAG = "STORY_END_FLAG"
}

export enum StoryEffectType {
    LINK_VALUE_CHANGE = "LINK_VALUE_CHANGE",
}

// 基础接口定义
export interface IStoryData {
    story_id: string;
    story_title: string;
    description: string;
    start_node_id: string;
    scenes: ISceneData[];
}

export interface ISceneData {
    scene_id: string;
    scene_title: string;
    nodes: INodeData[];
}

export interface INodeData {
    node_id: string;
    node_type: StoryNodeType;
    content?: string[];
    character_id?: string;
    prompt?: string;
    choices?: IChoiceData[];
    action_type?: string;
    parameters?: any;
    feedback_message_to_player?: string;
    next_node_id: string | null;
    effects?: IEffectData[];
}

export interface IChoiceData {
    choice_id: string;
    text: string;
    next_node_id: string;
    effects?: IEffectData[];
}

export interface IEffectData {
    type: StoryEffectType;
    variable_name?: string;
    value?: any;
    target?: string;
    condition?: string;
}
