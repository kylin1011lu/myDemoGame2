export enum UIChatType {
    SYSTEM_MESSAGE = "SYSTEM_MESSAGE",
    HOST_DIALOGUE = "HOST_DIALOGUE",
    PLAYER_CHOICE = "PLAYER_CHOICE",
    SYSTEM_PLAYER_DIALOGUE = "SYSTEM_PLAYER_DIALOGUE",
    SYSTEM_ACTION = "SYSTEM_ACTION",
    STORY_END_FLAG = "STORY_END_FLAG"
}

export interface IUIChatBaseData {
    type: UIChatType;
    content: string;
}

export interface IUIChatChoiceData {
    type: UIChatType;
    prompt: string;
    choices: IUIChoiceData[];
}

export type IUIChatData = IUIChatBaseData | IUIChatChoiceData;

export interface IUIChoiceData {
    choiceId: string;
    choiceText: string;
}