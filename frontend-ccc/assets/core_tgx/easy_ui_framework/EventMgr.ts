import { EventDispatcher } from "./EventDispatcher";

export class EventMgr {

    private static _inst: EventMgr;
    public static get inst(): EventMgr {
        if (this._inst == null) {
            this._inst = new EventMgr();
        }
        return this._inst;
    }

    private _eventDispatcher: EventDispatcher;

    constructor() {
        this._eventDispatcher = new EventDispatcher();
    }

    public on(event: string, cb: Function, thisArg?: any, args?: [], once?: boolean) {
        this._eventDispatcher.on(event, cb, thisArg, args, once);
    }

    public emit(event: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
        this._eventDispatcher.emit(event, arg0, arg1, arg2, arg3, arg4);
    }

    public off(event: string, cb: Function, thisArg?: any, once?: boolean) {
        this._eventDispatcher.off(event, cb, thisArg, once);
    }

    public once(event: string, cb: Function, thisArg?: any, args?: []) {
        this._eventDispatcher.once(event, cb, thisArg, args);
    }

    public clearAll(event?: string) {
        this._eventDispatcher.clearAll(event);
    }
}