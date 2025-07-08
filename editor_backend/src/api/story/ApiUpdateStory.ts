import { ApiCall } from "tsrpc";
import { ReqUpdateStory, ResUpdateStory } from "../../shared/protocols/story/PtlUpdateStory";
import { Story } from "../../models/Story";

export default async function (call: ApiCall<ReqUpdateStory, ResUpdateStory>) {
  const { story_id, story_title, description } = call.req;
  const update: any = { updated_at: new Date() };
  if (story_title !== undefined) update.story_title = story_title;
  if (description !== undefined) update.description = description;
  const result = await Story.updateOne({ story_id }, { $set: update });
  if (result.matchedCount === 0) {
    call.succ({ success: false, error: "未找到对应故事" });
    return;
  }
  call.succ({ success: true });
}