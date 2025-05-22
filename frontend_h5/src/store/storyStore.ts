import { create } from 'zustand';
import { Node, Story } from '../types/story';

interface StoryState {
  currentStory: Story | null;
  nodeHistory: Node[];
  setCurrentStory: (story: Story) => void;
  setNodeHistory: (history: Node[]) => void;
  goToNextNode: (nodeId: string) => void;
  resetHistory: () => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  currentStory: null,
  nodeHistory: [],
  setCurrentStory: (story) => set({ currentStory: story }),
  setNodeHistory: (history) => set({ nodeHistory: history }),
  goToNextNode: (nodeId) => {
    const { currentStory, nodeHistory } = get();
    if (!currentStory) return;
    const nextNode = currentStory.scenes[0].nodes.find(
      node => node.node_id === nodeId
    );
    if (nextNode) {
      set({ nodeHistory: [...nodeHistory, nextNode] });
    }
  },
  resetHistory: () => set({ nodeHistory: [] }),
})); 