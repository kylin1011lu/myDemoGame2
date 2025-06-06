import * as fs from 'fs/promises';
import * as path from 'path';
import { Story, Scene, Node } from '../shared/protocols/models';

export class StoryFileManager {
    private basePath: string;

    constructor(basePath: string = path.join(__dirname, '../../data/stories')) {
        this.basePath = basePath;
    }

    /**
     * 获取故事目录路径
     */
    getStoryPath(storyId: string): string {
        return path.join(this.basePath, storyId);
    }

    /**
     * 获取故事元数据文件路径
     */
    getStoryMetaPath(storyId: string): string {
        return path.join(this.getStoryPath(storyId), 'meta.json');
    }

    /**
     * 获取场景目录路径
     */
    getScenesPath(storyId: string): string {
        return path.join(this.getStoryPath(storyId), 'scenes');
    }

    /**
     * 获取场景文件路径
     */
    getScenePath(storyId: string, sceneId: string): string {
        return path.join(this.getScenesPath(storyId), `${sceneId}.json`);
    }

    /**
     * 检查故事是否存在
     */
    async storyExists(storyId: string): Promise<boolean> {
        try {
            await fs.access(this.getStoryMetaPath(storyId));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 检查场景是否存在
     */
    async sceneExists(storyId: string, sceneId: string): Promise<boolean> {
        try {
            await fs.access(this.getScenePath(storyId, sceneId));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 读取故事元数据
     */
    async readStoryMeta(storyId: string): Promise<Story> {
        const filePath = this.getStoryMetaPath(storyId);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    }

    /**
     * 保存故事元数据
     */
    async saveStoryMeta(storyId: string, meta: Story): Promise<void> {
        const filePath = this.getStoryMetaPath(storyId);
        meta.updated_at = new Date().toISOString();
        await fs.writeFile(filePath, JSON.stringify(meta, null, 2), 'utf-8');
    }

    /**
     * 读取场景数据
     */
    async readScene(storyId: string, sceneId: string): Promise<Scene> {
        const filePath = this.getScenePath(storyId, sceneId);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    }

    /**
     * 保存场景数据
     */
    async saveScene(storyId: string, sceneId: string, scene: Scene): Promise<void> {
        const filePath = this.getScenePath(storyId, sceneId);
        scene.updated_at = new Date().toISOString();
        scene.node_count = scene.nodes ? scene.nodes.length : 0;
        
        // 确保目录存在
        await fs.mkdir(this.getScenesPath(storyId), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(scene, null, 2), 'utf-8');
    }

    /**
     * 删除场景文件
     */
    async deleteScene(storyId: string, sceneId: string): Promise<void> {
        const filePath = this.getScenePath(storyId, sceneId);
        await fs.unlink(filePath);
    }

    /**
     * 创建故事目录结构
     */
    async createStoryStructure(storyId: string): Promise<void> {
        const storyPath = this.getStoryPath(storyId);
        const scenesPath = this.getScenesPath(storyId);
        
        await fs.mkdir(storyPath, { recursive: true });
        await fs.mkdir(scenesPath, { recursive: true });
    }

    /**
     * 删除整个故事目录
     */
    async deleteStory(storyId: string): Promise<void> {
        const storyPath = this.getStoryPath(storyId);
        await fs.rmdir(storyPath, { recursive: true });
    }

    /**
     * 获取所有故事ID列表
     */
    async getStoryIds(): Promise<string[]> {
        try {
            const dirs = await fs.readdir(this.basePath, { withFileTypes: true });
            return dirs
                .filter(dir => dir.isDirectory())
                .map(dir => dir.name)
                .filter(name => name.startsWith('STORY_'));
        } catch {
            return [];
        }
    }

    /**
     * 生成新的ID
     */
    generateStoryId(): string {
        return `STORY_${Date.now()}`;
    }

    generateSceneId(storyId: string, index?: number): string {
        const suffix = index ? `_${index.toString().padStart(3, '0')}` : `_${Date.now()}`;
        return `SCENE_${storyId}${suffix}`;
    }

    generateNodeId(storyId: string, sceneId: string, index?: number): string {
        const suffix = index ? `_${index.toString().padStart(3, '0')}` : `_${Date.now()}`;
        return `NODE_${sceneId}${suffix}`;
    }

    /**
     * 备份故事文件
     */
    async backupStory(storyId: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.basePath, '..', 'backups', `${storyId}_${timestamp}`);
        
        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        
        // 复制整个故事目录
        const sourcePath = this.getStoryPath(storyId);
        await this.copyDirectory(sourcePath, backupPath);
        
        return backupPath;
    }

    /**
     * 递归复制目录
     */
    private async copyDirectory(source: string, destination: string): Promise<void> {
        await fs.mkdir(destination, { recursive: true });
        
        const entries = await fs.readdir(source, { withFileTypes: true });
        
        for (const entry of entries) {
            const sourcePath = path.join(source, entry.name);
            const destPath = path.join(destination, entry.name);
            
            if (entry.isDirectory()) {
                await this.copyDirectory(sourcePath, destPath);
            } else {
                await fs.copyFile(sourcePath, destPath);
            }
        }
    }
}
