import { _decorator, log, Node, UITransform } from 'cc';
import ListItem from '../list/ListItem';
import { IUIChatBaseData, IUIChatChoiceData, IUIChatData, UIChatType } from './types/UIDef';
import { UI_SystemMesage } from './ui/UI_SystemMesage';
import { UI_HostDialogue } from './ui/UI_HostDialogue';
import { UI_PlayerChoice } from './ui/UI_PlayerChoice';
import { UI_PlayerDialogue } from './ui/UI_PlayerDialogue';
import { UI_SystemAction } from './ui/UI_SystemAcrion';
const { ccclass, property } = _decorator;

@ccclass('UI_ChatItem')
export class UI_ChatItem extends ListItem {

    @property([Node])
    public typeNodes: Node[] = [];

    public init(chat: IUIChatData): void {

        for (let i = 0; i < this.typeNodes.length; i++) {
            this.typeNodes[i].active = false;
        }

        if (chat.type == UIChatType.SYSTEM_MESSAGE) {
            this.typeNodes[0].active = true;
            let nodeHeight = this.typeNodes[0].getComponent(UI_SystemMesage).init((chat as IUIChatBaseData).content);
            this.node.getComponent(UITransform).height = nodeHeight;
        } else if (chat.type == UIChatType.HOST_DIALOGUE) {
            this.typeNodes[1].active = true;
            let nodeHeight = this.typeNodes[1].getComponent(UI_HostDialogue).init((chat as IUIChatBaseData).content);
            this.node.getComponent(UITransform).height = nodeHeight;
        } else if (chat.type == UIChatType.PLAYER_CHOICE) {
            if ((chat as IUIChatChoiceData).choices.length == 2) {
                this.typeNodes[2].active = true;
                let nodeHeight = this.typeNodes[2].getComponent(UI_PlayerChoice).init((chat as IUIChatChoiceData));
                this.node.getComponent(UITransform).height = nodeHeight;
            } else {
                this.typeNodes[3].active = true;
                let nodeHeight = this.typeNodes[3].getComponent(UI_PlayerChoice).init((chat as IUIChatChoiceData));
                this.node.getComponent(UITransform).height = nodeHeight;
            }
        } else if (chat.type == UIChatType.SYSTEM_PLAYER_DIALOGUE) {
            this.typeNodes[4].active = true;
            let nodeHeight = this.typeNodes[4].getComponent(UI_PlayerDialogue).init((chat as IUIChatBaseData).content);
            this.node.getComponent(UITransform).height = nodeHeight;
        } else if (chat.type == UIChatType.SYSTEM_ACTION) {
            this.typeNodes[5].active = true;
            let nodeHeight = this.typeNodes[5].getComponent(UI_SystemAction).init((chat as IUIChatBaseData).content);
            this.node.getComponent(UITransform).height = nodeHeight;
        } else if (chat.type == UIChatType.STORY_END_FLAG) {
            this.typeNodes[6].active = true;
            this.node.getComponent(UITransform).height = this.typeNodes[6].getComponent(UITransform).height;
        }   
    }

}


