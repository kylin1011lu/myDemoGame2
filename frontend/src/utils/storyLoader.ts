import { Story } from '../types/story';

export class StoryLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StoryLoadError';
  }
}

export const loadStory = async (storyId: string): Promise<Story> => {
  try {
    // 从本地文件加载故事数据
    const response = await fetch(`/data/${storyId}.json`);
    
    if (!response.ok) {
      throw new StoryLoadError(`Failed to load story: ${response.statusText}`);
    }

    const story = await response.json();
    
    // 验证故事数据结构
    if (!validateStory(story)) {
      throw new StoryLoadError('Invalid story data structure');
    }

    return story;
  } catch (error) {
    if (error instanceof StoryLoadError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new StoryLoadError(`Failed to load story: ${error.message}`);
    }
    throw new StoryLoadError('Failed to load story: Unknown error');
  }
};

const validateStory = (story: any): story is Story => {
  return (
    typeof story === 'object' &&
    typeof story.story_id === 'string' &&
    typeof story.story_title === 'string' &&
    typeof story.description === 'string' &&
    typeof story.start_node_id === 'string' &&
    Array.isArray(story.scenes) &&
    story.scenes.every(validateScene)
  );
};

const validateScene = (scene: any): boolean => {
  return (
    typeof scene === 'object' &&
    typeof scene.scene_id === 'string' &&
    typeof scene.scene_title === 'string' &&
    Array.isArray(scene.nodes) &&
    scene.nodes.every(validateNode)
  );
};

const validateNode = (node: any): boolean => {
  return (
    typeof node === 'object' &&
    typeof node.node_id === 'string' &&
    typeof node.node_type === 'string'
  );
}; 