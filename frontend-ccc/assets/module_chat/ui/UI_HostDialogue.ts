import { _decorator, Component, Label, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI_HostDialogue')
export class UI_HostDialogue extends Component {

    @property(Label)
    public text: Label = null;

    public init(content: string): number {
        this.text.string = content;
        this.text.updateRenderData();

        let textHeight = this.text.node.getComponent(UITransform).height;
        this.node.getComponent(UITransform).height = textHeight + 5;
        return textHeight + 5;
    }
}

