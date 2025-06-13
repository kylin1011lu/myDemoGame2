import { ApiCall } from "tsrpc";
import { ReqUpdateScene, ResUpdateScene } from "../shared/protocols/PtlUpdateScene";
import { Scene } from "../models/Scene";
import { connectDB } from "../config/database";

export default async function (call: ApiCall<ReqUpdateScene, ResUpdateScene>) {
    await connectDB();
    const { story_id, scene_id, scene_title, start_node_id, nodes } = call.req;
    const result = await Scene.updateOne(
        { story_id, scene_id },
        {
            $set: {
                scene_title,
                start_node_id,
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