import { useState, useCallback, useRef } from 'react';
import { Story, StoryNode } from '../types/story';
import { GameNode } from '../types/nodes';
import { EFFECT_TYPES } from '../constants/nodeTypes';

interface GameState {
  currentStory: Story | null;
  currentNode: GameNode | null;
  variables: Record<string, any>;
  trust: Record<string, number>;
  hostStatus: Record<string, string>;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentStory: null,
    currentNode: null,
    variables: {},
    trust: {},
    hostStatus: {},
  });

  // 使用 ref 来追踪是否已经加载过故事
  const isStoryLoaded = useRef(false);

  const loadStory = useCallback((story: Story) => {
    // 如果已经加载过相同的故事，则不重复加载
    if (isStoryLoaded.current && gameState.currentStory?.story_id === story.story_id) {
      return;
    }

    console.log('Loading story:', { storyId: story.story_id, startNodeId: story.start_node_id });
    const startNode = story.scenes[0].nodes.find(node => node.node_id === story.start_node_id);
    
    if (!startNode) {
      console.error('Start node not found:', story.start_node_id);
      return;
    }

    setGameState(prev => {
      const newState = {
        ...prev,
        currentStory: story,
        currentNode: startNode as GameNode,
      };
      return newState;
    });

    isStoryLoaded.current = true;
  }, [gameState.currentStory?.story_id]);

  const applyEffects = useCallback((effects: { type: string; value: any; target?: string }[]) => {
    if (!effects || effects.length === 0) return;
    
    console.log('Applying effects:', effects);
    setGameState(prev => {
      const newState = { ...prev };
      
      effects.forEach(effect => {
        switch (effect.type) {
          case EFFECT_TYPES.SET_VARIABLE:
            newState.variables = {
              ...newState.variables,
              [effect.target as string]: effect.value,
            };
            break;
          case EFFECT_TYPES.CHANGE_TRUST:
            newState.trust = {
              ...newState.trust,
              [effect.target as string]: (newState.trust[effect.target as string] || 0) + effect.value,
            };
            break;
          case EFFECT_TYPES.CHANGE_HOST_STATUS:
            newState.hostStatus = {
              ...newState.hostStatus,
              [effect.target as string]: effect.value,
            };
            break;
        }
      });

      return newState;
    });
  }, []);

  const moveToNextNode = useCallback((nextNodeId: string) => {
    if (!nextNodeId) return;
    
    console.log('Moving to next node:', nextNodeId);
    setGameState(prev => {
      if (!prev.currentStory) {
        console.warn('No current story available');
        return prev;
      }

      const nextNode = prev.currentStory.scenes
        .flatMap(scene => scene.nodes)
        .find(node => node.node_id === nextNodeId);

      if (!nextNode) {
        console.warn('Next node not found:', nextNodeId);
        return prev;
      }

      return {
        ...prev,
        currentNode: nextNode as GameNode,
      };
    });
  }, []);

  return {
    gameState,
    loadStory,
    applyEffects,
    moveToNextNode,
  };
}; 