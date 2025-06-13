import mongoose from 'mongoose';

const sceneSchema = new mongoose.Schema({
  story_id: { type: Number, required: true, index: true },
  scene_id: { type: String, required: true },
  scene_title: { type: String, required: true },
  start_node_id: { type: String, default: "" },
  nodes: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

sceneSchema.index({ story_id: 1, scene_id: 1 }, { unique: true });

export const Scene = mongoose.model('Scene', sceneSchema); 