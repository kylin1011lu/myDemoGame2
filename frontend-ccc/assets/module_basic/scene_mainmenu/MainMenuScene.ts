import { _decorator, Component, EventTouch, Node } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { SceneUtil } from '../../scripts/SceneDef';
import { client } from '../../core_tgx/easy_http/client';
// import { UI_DemoList } from '../ui_demo_list/UI_DemoList';
const { ccclass, property } = _decorator;

const GameList = [
    { bundle: ModuleDef.GAME_MINE_SWEEPER, entryScene: 'mine_sweeper' },
    { bundle: ModuleDef.DEMO_TANK, entryScene: 'tank_game' },
    { bundle: ModuleDef.DEMO_ROOSTER, entryScene: 'rooster_jump' },
];


@ccclass('MainMenuScene')
export class MainMenuScene extends Component {

    start() {
        // tgx.UIMgr.inst.showUI(UI_DemoList);
    }

    update(deltaTime: number) {

    }

    async onGameClick(evt: EventTouch, customEventData) {
        let info = GameList[parseInt(customEventData)];
        if (!info) {
            return;
        }

        tgx.UIWaiting.show();
        SceneUtil.loadScene({ name: info.entryScene, bundle: info.bundle });

        const res = await client.callApi('AddData', {
            content: 'test',
        });

        console.log(res.res.time);
    }

}

