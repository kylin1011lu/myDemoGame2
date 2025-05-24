
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
    SET_VARIABLE = "SET_VARIABLE",
    CHANGE_TRUST = "CHANGE_TRUST",
    CHANGE_ENERGY = "CHANGE_ENERGY",
    CHANGE_HOST_STATUS = "CHANGE_HOST_STATUS"
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
    emotion?: string;
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

// 模型类实现
export class Story {
    private _data: IStoryData;
    private _scenes: Map<string, StoryScene> = new Map();
    private _currentScene: StoryScene = null;

    constructor(data: IStoryData) {
        this._data = data;
        this._initScenes();
    }

    private _initScenes(): void {
        this._data.scenes.forEach(sceneData => {
            const scene = new StoryScene(sceneData);
            this._scenes.set(sceneData.scene_id, scene);
        });
    }

    public get storyId(): string {
        return this._data.story_id;
    }

    public get storyTitle(): string {
        return this._data.story_title;
    }

    public get description(): string {
        return this._data.description;
    }

    public getStartScene(): StoryScene {
        return this._scenes.values().next().value;
    }

    // public getStartNode(): Node {
    //     const startScene = this._scenes.values().next().value;
    //     return startScene.getNodeById(this._data.start_node_id);
    // }

    public getSceneById(sceneId: string): StoryScene {
        return this._scenes.get(sceneId);
    }

    public setCurrentScene(sceneId: string): void {
        this._currentScene = this._scenes.get(sceneId);
    }
}

export class StoryScene {
    private _data: ISceneData;
    private _nodes: Map<string, StoryNode> = new Map();

    constructor(data: ISceneData) {
        this._data = data;
        this._initNodes();
    }

    private _initNodes(): void {
        this._data.nodes.forEach(nodeData => {
            const node = new StoryNode(nodeData);
            this._nodes.set(nodeData.node_id, node);
        });
    }

    public get sceneId(): string {
        return this._data.scene_id;
    }

    public get sceneTitle(): string {
        return this._data.scene_title;
    }

    public getStartNode(): StoryNode {
        return this._nodes.values().next().value;
    }

    public getNodeById(nodeId: string): StoryNode {
        return this._nodes.get(nodeId);
    }

    public getNextNode(currentNodeId: string): StoryNode {
        const currentNode = this._nodes.get(currentNodeId);
        return currentNode ? this._nodes.get(currentNode.nextNodeId) : null;
    }
}

export class StoryNode {
    private _data: INodeData;
    private _effects: StoryEffect[] = [];

    constructor(data: INodeData) {
        this._data = data;
        this._initEffects();
    }

    private _initEffects(): void {
        if (this._data.effects) {
            this._effects = this._data.effects.map(effectData => new StoryEffect(effectData));
        }
    }

    public get nodeId(): string {
        return this._data.node_id;
    }

    public get nodeType(): StoryNodeType {
        return this._data.node_type;
    }

    public get content(): string[] {
        return this._data.content || [];
    }

    public get characterId(): string {
        return this._data.character_id;
    }

    public get emotion(): string {
        return this._data.emotion;
    }

    public get prompt(): string {
        return this._data.prompt;
    }

    public get feedbackMessageToPlayer(): string {
        return this._data.feedback_message_to_player;
    }

    public get choices(): StoryChoice[] {
        return this._data.choices?.map(choiceData => new StoryChoice(choiceData)) || [];
    }

    public get nextNodeId(): string {
        return this._data.next_node_id;
    }

    public get effects(): StoryEffect[] {
        return this._effects;
    }

    public processEffects(): void {
        this._effects.forEach(effect => effect.execute());
    }
}

export class StoryChoice {
    private _data: IChoiceData;
    private _effects: StoryEffect[] = [];

    constructor(data: IChoiceData) {
        this._data = data;
        this._initEffects();
    }

    private _initEffects(): void {
        if (this._data.effects) {
            this._effects = this._data.effects.map(effectData => new StoryEffect(effectData));
        }
    }

    public get choiceId(): string {
        return this._data.choice_id;
    }

    public get text(): string {
        return this._data.text;
    }

    public get nextNodeId(): string {
        return this._data.next_node_id;
    }

    public get effects(): StoryEffect[] {
        return this._effects;
    }

    public execute(): void {
        this._effects.forEach(effect => effect.execute());
    }
}

export class StoryEffect {
    private _data: IEffectData;

    constructor(data: IEffectData) {
        this._data = data;
    }

    public get type(): StoryEffectType {
        return this._data.type;
    }

    public get value(): any {
        return this._data.value;
    }

    public get target(): string {
        return this._data.target;
    }

    public execute(): void {
        // 根据不同类型执行不同的效果
        switch (this._data.type) {
            case StoryEffectType.SET_VARIABLE:
                this._executeSetVariable();
                break;
            case StoryEffectType.CHANGE_TRUST:
                this._executeChangeTrust();
                break;
            case StoryEffectType.CHANGE_ENERGY:
                this._executeChangeEnergy();
                break;
            case StoryEffectType.CHANGE_HOST_STATUS:
                this._executeChangeHostStatus();
                break;
        }
    }

    private _executeSetVariable(): void {
        // 实现变量设置逻辑
    }

    private _executeChangeTrust(): void {
        // 实现信任度改变逻辑
    }

    private _executeChangeEnergy(): void {
        // 实现能量改变逻辑
    }

    private _executeChangeHostStatus(): void {
        // 实现宿主状态改变逻辑
    }
}