import { _decorator, Component, log, Node } from 'cc';
import { Holder } from '../adapter';
const { ccclass, property } = _decorator;

@ccclass('UI_ChatItem')
export class UI_ChatItem extends Component {

    private _holder: Holder = null
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    show(holder: Holder) {
        log("show", holder)
        this._holder = holder;
    }

    hide() {
        log("hide", this._holder)
    }
}


