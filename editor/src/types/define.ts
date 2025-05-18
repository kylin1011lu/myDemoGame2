import SystemMessageNode from "../components/nodes/SystemMessageNode";
import SystemActionNode from "../components/nodes/SystemActionNode";
import { Node, NodeTypes } from "@xyflow/react";
import PlayerChoiceNode from "../components/nodes/PlayerChoiceNode";
import SystemPlayerDialogueNode from "../components/nodes/SystemPlayerDialogueNode";
import StoryEndFlagNode from "../components/nodes/StoryEndFlagNode";
import HostDialogueNode from "../components/nodes/HostDialogueNode";
import ChoiceNode from "../components/nodes/ChoiceNode";

export const nodeTypes: NodeTypes = {
    playerChoiceNode: PlayerChoiceNode,
    systemActionNode: SystemActionNode,
    systemMessageNode: SystemMessageNode,
    systemPlayerDialogueNode: SystemPlayerDialogueNode,
    storyEndFlagNode: StoryEndFlagNode,
    hostDialogueNode: HostDialogueNode,
    choiceNode: ChoiceNode
}

export const nodeNameToType: Record<string, string> = {
    SYSTEM_MESSAGE: 'systemMessageNode',
    HOST_DIALOGUE: 'hostDialogueNode',
    PLAYER_CHOICE: 'playerChoiceNode',
    SYSTEM_PLAYER_DIALOGUE: 'systemPlayerDialogueNode',
    STORY_END_FLAG: 'storyEndFlagNode',
    CHOICE: 'choiceNode',
    SYSTEM_ACTION: 'systemActionNode'
}

export interface MyNodeData {
    [key: string]: string | string[] | null;
    label: string;
    nodeType: string;
    content: string[];
    emotion: string;
    characterId: string;
    choices: string[];
}

export type MyNode = Node<MyNodeData, 'data'>;