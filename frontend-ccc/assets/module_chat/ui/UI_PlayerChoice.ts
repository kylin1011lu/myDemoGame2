import { _decorator, Button, Component, Label, log, Node, UITransform } from 'cc';
import { IUIChatChoiceData } from '../types/UIDef';
import { EventDef } from '../types/EventDef';
const { ccclass, property } = _decorator;

@ccclass('UI_PlayerChoice')
export class UI_PlayerChoice extends Component {

    @property(Label)
    public prompt: Label = null;

    @property(Node)
    public choiceNodes: Node[] = [];

    public init(chatChoiceData: IUIChatChoiceData): number {
        this.prompt.string = chatChoiceData.prompt;

        for (let i = 0; i < this.choiceNodes.length; i++) {
            if (i < chatChoiceData.choices.length) {
                this.choiceNodes[i].active = true;
                this.choiceNodes[i].getComponentInChildren(Label).string = chatChoiceData.choices[i].choiceText;

                this.choiceNodes[i].getComponent(Button).clickEvents[0].customEventData = chatChoiceData.choices[i].choiceId;
            } else {
                this.choiceNodes[i].active = false;
            }
        }

        return this.node.getComponent(UITransform).height;
    }

    public onChoiceClick(event: Event, customEventData: string): void {
        log('onChoiceClick', customEventData);
        tgx.EventMgr.inst.emit(EventDef.CHOICE_PROCESS, customEventData);
        this.disableAllChoice();
    }

    private disableAllChoice(): void {
        for (let i = 0; i < this.choiceNodes.length; i++) {
            this.choiceNodes[i].getComponent(Button).interactable = false;
        }
    }
}

