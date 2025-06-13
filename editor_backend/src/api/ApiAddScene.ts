import { ApiCall } from "tsrpc";
import { ReqAddScene, ResAddScene } from "../shared/protocols/PtlAddScene";
import { Scene } from "../models/Scene";
import { Story } from "../models/Story";
import { connectDB } from "../config/database";

export default async function (call: ApiCall<ReqAddScene, ResAddScene>) {
  await connectDB();
  const { story_id, scene_title } = call.req;

  // 查找该story下已有的scene数量，决定新index
  const story = await Story.findOne({ story_id });
  if (!story) {
    call.succ({ success: false, error: "未找到对应故事" });
    return;
  }
  const scenes = story.scenes || [];
  let maxIndex = 0;
  scenes.forEach(s => {
    const sid = s.scene_id || '';
    const match = sid.match(new RegExp(`^scene_${story_id}_(\\d+)$`));
    if (match) {
      const idx = parseInt(match[1]);
      if (idx > maxIndex) maxIndex = idx;
    }
  });
  const newIndex = maxIndex + 1;
  const scene_id = `scene_${story_id}_${newIndex}`;
  const start_node_id = "";

  // 新建Scene文档
  const newScene = new Scene({
    story_id,
    scene_id,
    scene_title,
    start_node_id,
    nodes: [],
    created_at: new Date(),
    updated_at: new Date()
  });
  await newScene.save();

  // 更新Story的scenes数组
  story.scenes.push({ scene_id, scene_title, start_node_id });
  // 如果start_scene_id为空，设置为当前scene_id
  if (!story.start_scene_id) {
    story.start_scene_id = scene_id;
  }
  await story.save();

  call.succ({
    success: true,
    scene: {
      scene_id,
      scene_title,
      start_node_id
    }
  });
}