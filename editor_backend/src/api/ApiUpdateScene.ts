import { ApiCall } from "tsrpc";
import { ReqUpdateScene, ResUpdateScene } from "../shared/protocols/PtlUpdateScene";
import { Scene } from "../models/Scene";
import { connectDB } from "../config/database";

export default async function (call: ApiCall<ReqUpdateScene, ResUpdateScene>) {
    await connectDB();
    const { story_id, scene_id, start_node_id, nodes } = call.req;

    // 先查找当前scene
    const scene = await Scene.findOne({ story_id, scene_id });
    if (!scene) {
        call.succ({ success: false, error: "未找到对应场景" });
        return;
    }

    // 如果start_node_id为空，则赋值
    let new_start_node_id = scene.start_node_id;
    if (!new_start_node_id) {
        new_start_node_id = start_node_id;
    }

    const result = await Scene.updateOne(
        { story_id, scene_id },
        {
            $set: {
                scene_title: scene.scene_title,
                start_node_id: new_start_node_id,
                nodes,
                updated_at: new Date()
            }
        }
    );
    if (result.matchedCount === 0) {
        call.succ({ success: false, error: "未找到对应场景" });
    } else {
        call.succ({ success: true });
    }
}