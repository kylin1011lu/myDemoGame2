import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  story_id: { type: String, required: true, unique: true },
  story_title: { type: String, required: true },
  description: { type: String, required: true },
  start_scene_id: { type: String, required: true },
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

export const Story = mongoose.model('Story', storySchema); 