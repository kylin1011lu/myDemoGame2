import { _decorator, Component, log, Node, Prefab } from 'cc';
import { Holder, ScrollAdapter, View } from '../adapter';
import { UI_ChatItem } from './UI_ChatItem';
const { ccclass, property } = _decorator;

export interface IChatModel {
    type: number
    name: string
    message: string
}

@ccclass('UI_ChatList')
export class UI_ChatList extends ScrollAdapter<IChatModel> {

    @property(Node) myPrefab: Node = null

    public getPrefab(data: IChatModel): Node | Prefab {
        return this.myPrefab
    }

    // public getHolder(node: Node, code: string): Holder<IChatModel, ScrollAdapter<IChatModel>> {
    //     log("getHolder", node, code)
    //     return new ChatListHolder(node, code, this)
    // }

    start() {
        this.modelManager.insert({ type: 0, name: "我", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
        this.modelManager.insert({ type: 1, name: "你", message: "你好" })
    }

    update(deltaTime: number) {
        
    }
}

// class myView extends View<IChatModel, UI_ChatList> {

//     protected onVisible(): void {
//     }
//     protected onDisable(): void {
//     }
// }

class ChatListHolder extends Holder<IChatModel, UI_ChatList>{
    private _chatItem: UI_ChatItem = null
    protected onCreated(): void {
        this._chatItem = this.node.getComponent(UI_ChatItem)
    }
    protected onVisible(): void {
        this._chatItem.show(this)
    }
    protected onDisable(): void {
        this._chatItem.hide()
    }

}



