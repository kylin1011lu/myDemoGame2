// assets/module_chat/ui/UI_Game.ts

import { _decorator, Component, log, Node, UITransform } from 'cc';
import { StoryNode, StoryNodeType } from './types/StoryDef';
import List from '../list/List';
import { EventDef } from './types/EventDef';
import { UI_ChatItem } from './UI_ChatItem';
import { IUIChatChoiceData, IUIChatData, UIChatType } from './types/UIDef';
import { StoryManager } from './manager/StoryManager';

const { ccclass, property } = _decorator;

// 每句对话处理时间间隔
const TIME_STEP = 1;

@ccclass('UI_Game')
export class UI_Game extends Component {
    @property(List)
    private list: List = null;

    private _chatList: (IUIChatData | IUIChatChoiceData)[] = [];

    protected onLoad(): void {
        tgx.EventMgr.inst.on(EventDef.NODE_PROCESS, this.onNodeProcess, this);
        tgx.EventMgr.inst.on(EventDef.EFFECT_PROCESS, this.onEffectProcess, this);
        tgx.EventMgr.inst.on(EventDef.CHOICE_PROCESS, this.onChoiceProcess, this);
    }

    protected onDestroy(): void {
        tgx.EventMgr.inst.off(EventDef.NODE_PROCESS, this.onNodeProcess, this);
        tgx.EventMgr.inst.off(EventDef.EFFECT_PROCESS, this.onEffectProcess, this);
        tgx.EventMgr.inst.off(EventDef.CHOICE_PROCESS, this.onChoiceProcess, this);
    }

    private onNodeProcess(node: StoryNode): void {
        switch (node.nodeType) {
            case StoryNodeType.SYSTEM_MESSAGE:
                this.processSystemMessage(node);
                break;
            case StoryNodeType.HOST_DIALOGUE:
                this.processHostDialogue(node);
                break;
            case StoryNodeType.SYSTEM_PLAYER_DIALOGUE:
                this.processSystemPlayerDialogue(node);
                break;
            case StoryNodeType.PLAYER_CHOICE:
                this.processPlayerChoice(node);
                break;
            case StoryNodeType.SYSTEM_ACTION:
                this.processSystemAction(node);
                break;
            case StoryNodeType.STORY_END_FLAG:
                this.processStoryEndFlag(node);
                break;
        }
    }

    private processSystemMessage(node: StoryNode): void {
        // 处理系统消息
        if (node.content.length > 0) {
            let index = 0;
            this.addChatItem({
                type: UIChatType.SYSTEM_MESSAGE,
                content: node.content[index]
            });

            this.schedule(() => {
                log('processSystemMessage', index);
                index++;
                if (index == node.content.length) {
                    StoryManager.instance.processNextNode();
                    return;
                }
                this.addChatItem({
                    type: UIChatType.SYSTEM_MESSAGE,
                    content: node.content[index]
                });
            }, TIME_STEP, node.content.length - 1);
        } else {
            StoryManager.instance.processNextNode();
        }
    }

    private processHostDialogue(node: StoryNode): void {
        // 处理系统消息
        if (node.content.length > 0) {
            let index = 0;
            this.addChatItem({
                type: UIChatType.HOST_DIALOGUE,
                content: node.content[index]
            });

            this.schedule(() => {
                index++;
                if (index == node.content.length) {
                    StoryManager.instance.processNextNode();
                    return;
                }
                this.addChatItem({
                    type: UIChatType.HOST_DIALOGUE,
                    content: node.content[index]
                });
            }, TIME_STEP, node.content.length - 1);
        } else {
            StoryManager.instance.processNextNode();
        }
    }

    private processPlayerChoice(node: StoryNode): void {
        this.addChatItem({
            type: UIChatType.PLAYER_CHOICE,
            prompt: node.prompt,
            choices: node.choices.map(choice => ({
                choiceId: choice.choiceId,
                choiceText: choice.text
            }))
        });
    }

    private processSystemPlayerDialogue(node: StoryNode): void {
        this.addChatItem({
            type: UIChatType.SYSTEM_PLAYER_DIALOGUE,
            content: node.content[0]
        });
        this.scheduleOnce(() => {
            StoryManager.instance.processNextNode();
        }, TIME_STEP);
    }

    private processSystemAction(node: StoryNode): void {
        this.addChatItem({
            type: UIChatType.SYSTEM_ACTION,
            content: node.feedbackMessageToPlayer || "..."
        });
        this.scheduleOnce(() => {
            StoryManager.instance.processNextNode();
        }, TIME_STEP);
    }

    private processStoryEndFlag(node: StoryNode): void {
        this.addChatItem({
            type: UIChatType.STORY_END_FLAG,
            content: node.content[0]
        });
    }
    
    private addChatItem(chat: IUIChatData): void {
        this._chatList.push(chat);
        this.list.numItems = this._chatList.length;


        this.list.scrollTo(this._chatList.length - 1);

        log('addChatItem', this._chatList.length);
    }

    private onEffectProcess(effect: any): void {
        // 处理效果
    }

    private onChoiceProcess(choiceId: string): void {
        log('onChoiceProcess', choiceId);
        StoryManager.instance.makeChoice(choiceId);
    }

    onListRender(item: Node, idx: number): void {
        item.active = true;
        item.getComponent(UI_ChatItem).init(this._chatList[idx]);
    }
}