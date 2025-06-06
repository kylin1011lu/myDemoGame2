#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * 将完整的story.json文件分拆成分层结构
 * 目标结构：
 * /data/stories/STORY_0001/
 *   ├── meta.json         # 故事元数据
 *   ├── scenes/
 *       ├── SCENE_ACT1_CRISIS.json
 *       ├── SCENE_ACT2_AWAKENING.json
 *       └── ...
 */

async function splitStoryFile(inputFilePath, outputBaseDir) {
  try {
    console.log('🚀 开始分拆story.json文件...');
    console.log(`📂 读取文件: ${inputFilePath}`);
    
    // 读取原始story.json文件
    const storyContent = await fs.readFile(inputFilePath, 'utf-8');
    console.log(`📄 文件大小: ${storyContent.length} 字符`);
    
    // 移除注释并解析JSON（处理带注释的JSON）
    const cleanContent = storyContent.replace(/\/\/.*$/gm, '').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    console.log('📝 清理JSON注释完成');
    
    const storyData = JSON.parse(cleanContent);
    console.log(`📊 解析JSON完成，故事ID: ${storyData.story_id}`);
    
    const { story_id, scenes, ...metaData } = storyData;
    
    // 创建故事目录
    const storyDir = path.join(outputBaseDir, story_id);
    const scenesDir = path.join(storyDir, 'scenes');
    
    await fs.mkdir(storyDir, { recursive: true });
    await fs.mkdir(scenesDir, { recursive: true });
    
    // 创建meta.json文件（包含故事元数据和场景索引）
    const metaWithSceneIndex = {
      ...metaData,
      story_id,
      scenes: scenes.map(scene => ({
        scene_id: scene.scene_id,
        scene_title: scene.scene_title,
        start_node_id: scene.start_node_id,
        file_path: `scenes/${scene.scene_id}.json`
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: "1.0.0"
    };
    
    const metaPath = path.join(storyDir, 'meta.json');
    await fs.writeFile(metaPath, JSON.stringify(metaWithSceneIndex, null, 2), 'utf-8');
    console.log(`✅ 创建meta.json: ${metaPath}`);
    
    // 为每个场景创建单独的JSON文件
    for (const scene of scenes) {
      const sceneFileName = `${scene.scene_id}.json`;
      const sceneFilePath = path.join(scenesDir, sceneFileName);
      
      // 添加场景级别的元数据
      const sceneWithMeta = {
        ...scene,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        node_count: scene.nodes ? scene.nodes.length : 0
      };
      
      await fs.writeFile(sceneFilePath, JSON.stringify(sceneWithMeta, null, 2), 'utf-8');
      console.log(`✅ 创建场景文件: ${sceneFilePath}`);
    }
    
    console.log(`\n🎉 分拆完成！`);
    console.log(`📁 故事目录: ${storyDir}`);
    console.log(`📊 统计信息:`);
    console.log(`   - 故事ID: ${story_id}`);
    console.log(`   - 场景数量: ${scenes.length}`);
    console.log(`   - 总节点数量: ${scenes.reduce((total, scene) => total + (scene.nodes ? scene.nodes.length : 0), 0)}`);
    
  } catch (error) {
    console.error('❌ 分拆过程中发生错误:', error.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  // 默认路径
  const defaultInputPath = path.join(__dirname, '../data/story.json');
  const defaultOutputPath = path.join(__dirname, '../data/stories');
  
  const inputPath = args[0] || defaultInputPath;
  const outputPath = args[1] || defaultOutputPath;
  
  console.log(`📂 输入文件: ${inputPath}`);
  console.log(`📂 输出目录: ${outputPath}`);
  
  // 检查输入文件是否存在
  try {
    await fs.access(inputPath);
  } catch (error) {
    console.error(`❌ 输入文件不存在: ${inputPath}`);
    process.exit(1);
  }
  
  // 创建输出目录
  await fs.mkdir(outputPath, { recursive: true });
  
  // 执行分拆
  await splitStoryFile(inputPath, outputPath);
}

// 如果直接运行此脚本，则执行main函数
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = { splitStoryFile };
