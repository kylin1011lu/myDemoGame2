import fs from 'fs/promises';
import path from 'path';
import { Story } from '../models/Story';
import { Scene } from '../models/Scene';
import { connectDB } from '../config/database';

async function migrateStories() {
  try {
    await connectDB();
    const storiesDir = path.join(process.cwd(), 'data', 'stories');
    const storyDirs = await fs.readdir(storiesDir);
    for (const storyDir of storyDirs) {
      const storyPath = path.join(storiesDir, storyDir);
      const metaPath = path.join(storyPath, 'meta.json');
      const scenesPath = path.join(storyPath, 'scenes');
      // 读取故事元数据
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      const meta = JSON.parse(metaContent);
      // 故事文档
      const story = new Story({
        story_id: meta.story_id,
        title: meta.story_title,
        scenes: (meta.scenes as Array<{scene_id: string, scene_title: string, start_node_id: string}>).map((s) => ({
          scene_id: s.scene_id,
          scene_title: s.scene_title,
          start_node_id: s.start_node_id
        })),
        version: meta.version || '1.0.0',
        created_at: meta.created_at ? new Date(meta.created_at) : new Date(),
        updated_at: meta.updated_at ? new Date(meta.updated_at) : new Date()
      });
      await Story.deleteOne({ story_id: meta.story_id });
      await story.save();
      // 迁移场景
      const sceneFiles = await fs.readdir(scenesPath);
      for (const sceneFile of sceneFiles) {
        const sceneContent = await fs.readFile(path.join(scenesPath, sceneFile), 'utf-8');
        const sceneData = JSON.parse(sceneContent);
        const scene = new Scene({
          story_id: meta.story_id,
          scene_id: sceneData.scene_id,
          scene_title: sceneData.scene_title,
          start_node_id: sceneData.start_node_id,
          nodes: sceneData.nodes,
          created_at: meta.created_at ? new Date(meta.created_at) : new Date(),
          updated_at: meta.updated_at ? new Date(meta.updated_at) : new Date()
        });
        await Scene.deleteOne({ story_id: meta.story_id, scene_id: sceneData.scene_id });
        await scene.save();
      }
    }
    console.log('数据迁移完成');
    process.exit(0);
  } catch (error) {
    console.error('数据迁移失败:', error);
    process.exit(1);
  }
}

migrateStories(); 