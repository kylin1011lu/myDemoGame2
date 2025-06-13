import mongoose from 'mongoose';
import { Story } from '../models/Story';
import { Scene } from '../models/Scene';
import { connectDB } from '../config/database';

async function migrateStoryId() {
    try {
        await connectDB();
        
        // 确保数据库已连接
        if (!mongoose.connection.db) {
            throw new Error('数据库未连接');
        }
        
        // 1. 获取所有故事
        const stories = await Story.find({}).lean();
        console.log(`找到 ${stories.length} 个故事需要迁移`);

        // 2. 获取原生MongoDB集合，避免Mongoose的类型转换
        const db = mongoose.connection.db;
        const storyCollection = db.collection('stories');
        const sceneCollection = db.collection('scenes');

        // 3. 遍历每个故事，更新story_id
        for (let i = 0; i < stories.length; i++) {
            const story = stories[i];
            const oldStoryId = story.story_id;
            
            // 生成新的数字ID (从10000开始)
            const newStoryId = i + 10000;
            
            console.log(`正在迁移故事: ${oldStoryId} -> ${newStoryId}`);
            
            // 4. 使用原生MongoDB更新Story集合中的story_id
            await storyCollection.updateOne(
                { story_id: oldStoryId },
                { 
                    $set: { 
                        story_id: newStoryId,
                        updated_at: new Date()
                    }
                }
            );
            
            // 5. 使用原生MongoDB更新Scene集合中对应的story_id
            const updateResult = await sceneCollection.updateMany(
                { story_id: oldStoryId },
                { 
                    $set: { 
                        story_id: newStoryId,
                        updated_at: new Date()
                    }
                }
            );
            
            console.log(`更新了 ${updateResult.modifiedCount} 个相关场景`);
        }
        
        // 6. 初始化计数器
        const counterCollection = db.collection('counters');
        await counterCollection.updateOne(
            { _id: 'story_id' } as any,
            { $set: { seq: stories.length + 10000 - 1 } },
            { upsert: true }
        );
        
        console.log('迁移完成！');
        console.log(`计数器初始化为: ${stories.length + 10000 - 1}`);
        
        process.exit(0);
    } catch (error) {
        console.error('迁移失败:', error);
        process.exit(1);
    }
}

// 执行迁移
migrateStoryId(); 