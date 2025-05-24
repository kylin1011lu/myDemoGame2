import { StoryEffectType } from "./StoryDef";
import { IChoiceData, IEffectData, INodeData, ISceneData, IStoryData, StoryNodeType } from "./StoryDef";

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
            case StoryEffectType.LINK_VALUE_CHANGE:
                this._excuteChnageLinkValue();
                break;
        }
    }

    private _excuteChnageLinkValue(): void {
        // 实现变量设置逻辑
    }
}