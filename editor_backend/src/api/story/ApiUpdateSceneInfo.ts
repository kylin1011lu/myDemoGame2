import { ApiCall } from "tsrpc";
import { ReqUpdateSceneInfo, ResUpdateSceneInfo } from "../../shared/protocols/story/PtlUpdateSceneInfo";
import { Scene } from "../../models/Scene";
import { Story } from "../../models/Story";

export default async function (call: ApiCall<ReqUpdateSceneInfo, ResUpdateSceneInfo>) {
    const { story_id, scene_id, new_scene_id, scene_title, start_node_id } = call.req;
    // 如果scene_id和new_scene_id不同，校验新scene_id是否已存在
    if (scene_id !== new_scene_id) {
        const exists = await Scene.findOne({ story_id, scene_id: new_scene_id });
        if (exists) {
            call.succ({ success: false, error: '新的scene_id已存在，不能重复' });
            return;
        }
    }
    // 执行Scene更新
    const result = await Scene.updateOne(
        { story_id, scene_id },
        {
            $set: {
                scene_id: new_scene_id,
                scene_title,
                start_node_id,
                updated_at: new Date()
            }
        }
    );
    if (result.matchedCount === 0) {
        call.succ({ success: false, error: '未找到对应场景' });
        return;
    }
    // 同步更新Story中的scenes数组
    const storyUpdateResult = await Story.updateOne(
        { story_id, "scenes.scene_id": scene_id },
        {
            $set: {
                "scenes.$.scene_id": new_scene_id,
                "scenes.$.scene_title": scene_title,
                "scenes.$.start_node_id": start_node_id,
                updated_at: new Date()
            }
        }
    );
    if (storyUpdateResult.matchedCount === 0) {
        call.succ({ success: false, error: 'Story中未找到对应场景引用' });
        return;
    }
    call.succ({ success: true });
}