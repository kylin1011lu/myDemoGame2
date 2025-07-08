import { ApiCall } from "tsrpc";
import { ReqGetSceneById, ResGetSceneById } from "../../shared/protocols/story/PtlGetSceneById";
import { Scene } from "../../models/Scene";

export default async function (call: ApiCall<ReqGetSceneById, ResGetSceneById>) {
    const scene = await Scene.findOne({
        story_id: call.req.story_id,
        scene_id: call.req.scene_id
    }, { _id: 0 }).lean();
    if (!scene) {
        call.succ({ error: '未找到对应场景' });
        return;
    }
    call.succ({
        scene: {
            story_id: scene.story_id,
            scene_id: scene.scene_id,
            scene_title: scene.scene_title,
            start_node_id: scene.start_node_id,
            nodes: scene.nodes,
            created_at: scene.created_at?.toISOString() ?? '',
            updated_at: scene.updated_at?.toISOString() ?? ''
        }
    });
} 