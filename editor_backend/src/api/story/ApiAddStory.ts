import { ApiCall } from "tsrpc";
import { ReqAddStory, ResAddStory } from "../../shared/protocols/story/PtlAddStory";
import { Story } from "../../models/Story";
import { connectDB } from "../../config/database";

export default async function (call: ApiCall<ReqAddStory, ResAddStory>) {
    try { 
        await connectDB();

        const { story_title, description, story_type } = call.req;

        // 只获取下一个自增ID，不自增
        const story_id = await (Story as any).peekNextStoryId();

        // 创建新故事
        const story = new Story({
            story_id,
            story_title,
            description,
            start_scene_id: "", // 初始为空，后续可通过其他接口设置
            story_type, // 可以根据需要设置默认类型
            scenes: [], // 初始没有场景
            version: "1.0.0" // 初始版本
        });

        // 保存故事
        await story.save();

        // 保存成功后才自增Counter
        await (Story as any).getNextStoryId();

        // 返回创建的故事信息
        call.succ({
            success: true,
            story: {
                story_id: story.story_id,
                story_title: story.story_title,
                description: story.description,
                start_scene_id: story.start_scene_id,
                story_type: story.story_type,
                scenes: story.scenes.map(s => ({
                    scene_id: s.scene_id || '',
                    scene_title: s.scene_title || '',
                    start_node_id: s.start_node_id || ''
                })),
                version: story.version,
                created_at: story.created_at.toISOString(),
                updated_at: story.updated_at.toISOString()
            }
        });
    } catch (error) {
        console.error('创建故事失败:', error);
        call.succ({
            success: false,
            error: '创建故事失败: ' + (error instanceof Error ? error.message : String(error))
        });
    }
}