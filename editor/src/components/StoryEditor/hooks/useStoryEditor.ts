import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, Edge, addEdge, Connection, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, useNodesInitialized, useReactFlow } from '@xyflow/react';
import { IStoryData } from '../../../types/story';
import { parseScene } from '../../../types/parser';
import { caculateLevel, caculateNodePositions } from '../../../utils/layout';
import { checkOrphanNodes } from '../../../utils/storyExport';
import { MyNode } from '../../../types/define';
import { client  } from '../../../utils/network';
import { ReqGetSceneById, ResGetSceneById } from '../../../shared/protocols/story/PtlGetSceneById';

export function useStoryEditor(initialStoryData?: IStoryData) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [storyData, setStoryData] = useState<IStoryData | null>(initialStoryData || null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodesInitialized = useNodesInitialized();
  const { screenToFlowPosition, setViewport } = useReactFlow();

  // 初始化节点和边
  useEffect(() => {
    if (initialStoryData) {
      setStoryData(initialStoryData);
      setCurrentSceneIndex(0);
      setIsVisible(false);
    }
  }, [initialStoryData]);

  // 默认展示
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 计算节点布局
  const calculateLayout = useCallback(() => {
    if (nodes.length === 0) return;
    caculateLevel(storyData?.scenes[currentSceneIndex].start_node_id || '', nodes as MyNode[]);
    const nodePostions = caculateNodePositions(nodes);
    setNodes(nodes.map((node) => ({
      ...node,
      position: nodePostions[node.id] || node.position
    })));
  }, [nodes, storyData, currentSceneIndex]);

  useEffect(() => {
    if (nodesInitialized) {
      calculateLayout()
      setTimeout(() => {
        setIsVisible(true)
      }, 200)
    }
  }, [nodesInitialized])

  // 修改loadSceneById，支持传入index并只更新nodes/edges
  const loadSceneById = useCallback(async (storyId: number, sceneId: string, index?: number) => {
    const ret = await client.callApi('story/GetSceneById', { story_id: storyId, scene_id: sceneId });
    if (ret.isSucc && (ret.res as ResGetSceneById).scene) {
      const scene = (ret.res as ResGetSceneById).scene!;
      setStoryData(prev => {
        if (!prev) return null;
        // 保持scenes为全量，替换对应index的scene
        const newScenes = prev.scenes.map((s, i) => i === (index ?? 0) ? scene : s);
        return { ...prev, scenes: newScenes };
      });

      if (scene.nodes.length == 0) {
        return;
      }

      setIsVisible(false);
      const { initialNodes, initialEdges } = parseScene(scene);
      setNodes(initialNodes);
      setEdges(initialEdges);

    }
  }, []);

  // 初始化时自动加载start_scene_id场景，并设置currentSceneIndex
  useEffect(() => {
    if (initialStoryData && initialStoryData.story_id && initialStoryData.start_scene_id && initialStoryData.scenes) {
      const idx = initialStoryData.scenes.findIndex(s => s.scene_id === initialStoryData.start_scene_id);
      setCurrentSceneIndex(idx >= 0 ? idx : 0);
      loadSceneById(initialStoryData.story_id, initialStoryData.start_scene_id, idx >= 0 ? idx : 0);
    }
  }, [initialStoryData, loadSceneById]);

  // 切换场景时自动请求并渲染
  const handleSceneChange = useCallback((index: number) => {
    if (!storyData || !storyData.scenes[index]) return;
    setCurrentSceneIndex(index);
    if (!storyData.scenes[index].nodes || storyData.scenes[index].nodes.length == 0) {
      return;
    }
    setIsVisible(false);
    loadSceneById(storyData.story_id, storyData.scenes[index].scene_id, index);
  }, [storyData, loadSceneById]);

  // 文件选择并解析
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as IStoryData;
        if (!json.scenes || !json.scenes[0] || !json.scenes[0].nodes) return;
        setStoryData(json);
        setCurrentSceneIndex(0);
        setIsVisible(false);
        const { initialNodes, initialEdges } = parseScene(json.scenes[0]);
        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (error) { }
    };
    reader.readAsText(file);
  }, []);

  // 连接节点
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));

    let sourceNode = nodes.find(n => n.id === params.source);
    if (sourceNode) {
      // 如果是CHOICE节点，则更新其父节点的choices数据
      if (sourceNode.data.nodeType == 'CHOICE') {
        let parentNode = nodes.find(n => n.id === sourceNode.parentId);
        if (parentNode) {
          let choiceData = (parentNode as MyNode).data.choices.find(c => c.choice_id === sourceNode.id);
          if (choiceData) {
            choiceData.next_node_id = params.target;
          }
        }

        // target节点如果content为空，则自动赋值choiceData.content
        let targetNode = nodes.find(n => n.id === params.target);
        if (targetNode) {
          if (targetNode.data.nodeType == 'SYSTEM_PLAYER_DIALOGUE') {
            if (!targetNode.data.content || (targetNode.data.content as string[]).length == 0) {
              targetNode.data.content = [sourceNode.data.text || ''];
            }
          }
        }
      }
    }

    // 设置source节点的next_node_id
    setNodes((nds) => nds.map(n =>
      n.id === params.source ? {
        ...n,
        data: {
          ...n.data,
          nextNodeId: params.target
        }
      } : n
    ));
  }, [nodes]);

  // 节点/边变化
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      let newEdges = applyEdgeChanges(changes, eds);
      // 检查是否有边被删除
      const removed = changes.filter(c => c.type === 'remove');
      if (removed.length > 0) {
        setNodes((nds) => {
          let updated = [...nds];
          removed.forEach(rm => {
            if (rm.id) {
              // 找到被删除的边
              const oldEdge = eds.find(e => e.id === rm.id);
              if (oldEdge) {
                updated = updated.map(n =>
                  n.id === oldEdge.source ? {
                    ...n,
                    data: {
                      ...n.data,
                      nextNodeId: null
                    }
                  } : n
                );
              }
            }
          });
          return updated;
        });
      }
      return newEdges;
    });
  }, []);

  // 选中节点
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedNode(node);
  }, []);

  // 选择choiceNode
  const handleSelectChoiceNode = useCallback((choiceNodeId: string) => {
    setSelectedNodeId(choiceNodeId);
    const node = nodes.find(node => node.id === choiceNodeId);
    if (node) setSelectedNode(node);
  }, [nodes]);

  // 检查孤立节点
  const getOrphanNodes = useCallback((startNodeId: string) => {
    return checkOrphanNodes(nodes, edges, startNodeId);
  }, [nodes, edges]);

  const isValidConnection = (connection: Connection) => {

    let sourceNode = nodes.find(n => n.id === connection.source);
    if (sourceNode) {
      // 如果是CHOICE节点，则target必须是SystemPlayerDialogue节点
      if (sourceNode.data.nodeType == 'CHOICE') {
        let targetNode = nodes.find(n => n.id === connection.target);
        if (targetNode) {
          if (targetNode.data.nodeType == 'SYSTEM_PLAYER_DIALOGUE') {
            return true;
          }
        }
        return false;
      }
    }

    return true;
  };

  return {
    nodes, setNodes,
    edges, setEdges,
    storyData, setStoryData,
    currentSceneIndex, setCurrentSceneIndex,
    selectedNodeId, setSelectedNodeId,
    selectedNode, setSelectedNode,
    isVisible, setIsVisible,
    isValidConnection,
    fileInputRef,
    calculateLayout,
    handleSceneChange,
    handleFileChange,
    onConnect,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    handleSelectChoiceNode,
    getOrphanNodes,
    screenToFlowPosition
  };
} 