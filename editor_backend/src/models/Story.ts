import mongoose from 'mongoose';

// 创建一个计数器集合用于生成自增ID
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const storySchema = new mongoose.Schema({
  story_id: { type: Number, required: true, unique: true },
  story_title: { type: String, required: true },
  description: { type: String, required: true },
  start_scene_id: { type: String, default: "" },
  story_type: { type: String, required: true },
  scenes: [
    {
      scene_id: String,
      scene_title: String,
      start_node_id: String
    }
  ],
  version: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// 添加获取下一个story_id的静态方法
storySchema.statics.getNextStoryId = async function () {
  const counter = await Counter.findByIdAndUpdate(
    'story_id',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// 新增：只获取当前story_id，不自增
storySchema.statics.peekNextStoryId = async function () {
  const counter = await Counter.findById('story_id');
  return counter ? counter.seq + 1 : 10000;
};

export const Story = mongoose.model('Story', storySchema); 