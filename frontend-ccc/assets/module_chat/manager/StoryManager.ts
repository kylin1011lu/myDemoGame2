
import { _decorator, Component, JsonAsset } from 'cc';
import { Story, StoryNode, StoryNodeType, IStoryData, StoryScene } from '../types/StoryDef';
import { EventDef } from '../types/EventDef';

const { ccclass, property } = _decorator;

@ccclass('StoryManager')
export class StoryManager extends Component {
    private static _instance: StoryManager = null;
    
    @property(JsonAsset)
    storyAsset: JsonAsset = null;

    private _currentStory: Story = null;
    private _currentScene: StoryScene = null;
    private _currentNode: StoryNode = null;

    public static get instance(): StoryManager {
        return StoryManager._instance;
    }

    protected onLoad(): void {
        if (StoryManager._instance === null) {
            StoryManager._instance = this;
        }
        this.loadStory();
    }

    private loadStory(): void {
        if (this.storyAsset) {
            this._currentStory = new Story(this.storyAsset.json as IStoryData);
            this.startStory();
        }
    }

    public startStory(): void {
        if (!this._currentStory) return;

        this._currentScene = this._currentStory.getStartScene();
        if (!this._currentScene) return;

        const startNode = this._currentScene.getStartNode();
        if (!startNode) return;

        this.processNode(startNode);
    }

    public processNode(node: StoryNode): void {
        this._currentNode = node;
        tgx.EventMgr.inst.emit(EventDef.NODE_PROCESS, node);
    }

    public processNextNode(): void {
        if (!this._currentNode) return;
        const nextNode = this._currentScene.getNextNode(this._currentNode.nodeId);
        if (nextNode) {
            this.processNode(nextNode);
        }
    }

    public makeChoice(choiceId: string): void {
        if (!this._currentNode || this._currentNode.nodeType !== StoryNodeType.PLAYER_CHOICE) return;

        const choice = this._currentNode.choices.find(c => c.choiceId === choiceId);
        if (choice) {
            // 执行选择效果
            choice.execute();
            
            // 移动到下一个节点
            const nextNode = this._currentScene.getNodeById(choice.nextNodeId);
            if (nextNode) {
                this.processNode(nextNode);
            }
        }
    }
}