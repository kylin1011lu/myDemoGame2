import { ApiCall } from "tsrpc";
import { ReqGetStoryList, ResGetStoryList } from "../../shared/protocols/story/PtlGetStoryList";
import { Story } from "../../models/Story";

export default async function (call: ApiCall<ReqGetStoryList, ResGetStoryList>) {
    const stories = await Story.find({}, { _id: 0 }).lean();
    call.succ({
        stories: stories.map(s => ({
            story_id: s.story_id,
            story_title: s.story_title,
            description: s.description,
            start_scene_id: s.start_scene_id,
            story_type: s.story_type,
            scenes: s.scenes?.map((scene: any) => ({
                scene_id: scene.scene_id,
                scene_title: scene.scene_title,
                start_node_id: scene.start_node_id
            })) ?? [],
            version: s.version,
            created_at: s.created_at?.toISOString() ?? '',
            updated_at: s.updated_at?.toISOString() ?? ''
        }))
    });
} 