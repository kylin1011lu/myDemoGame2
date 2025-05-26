import React, { useEffect, useState } from 'react';
import { Input, Form, Button, List, Space } from 'antd';
import { Node } from '@xyflow/react';
import { IChoiceData } from '../../types/story';

interface PlayerChoiceEditorProps {
    node: Node;
    onChange: (newNode: Node, opInfo?: any) => void;
    onSelectChoiceNode?: (choiceNodeId: string) => void;
}


const PlayerChoiceEditor: React.FC<PlayerChoiceEditorProps> = ({ node, onChange, onSelectChoiceNode }) => {
    const [form] = Form.useForm();
    const [choices, setChoices] = useState<IChoiceData[]>([]);
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

    useEffect(() => {
        const rawChoices = Array.isArray(node.data.choices) ? node.data.choices : [];
        setChoices(rawChoices);
        form.setFieldsValue({
            node_id: node.id,
            node_type: node.data.nodeType,
            prompt: node.data.prompt || ''
        });
    }, [node, form]);

    const handleSelect = (choice: IChoiceData, idx: number) => {
        setSelectedChoiceId(choice.choice_id);
        if (onSelectChoiceNode) {
            onSelectChoiceNode(choice.choice_id);
        }
    };

    // 生成标准choice_id
    const generateChoiceId = (parentId: string, choices: IChoiceData[]) => {
        // 取名，并且跟现有的不重复
        let index = 0;
        let suffix = "";
        do {
            suffix = String.fromCharCode(65 + index); // A, B, C ...
            if (choices.find(c => c.choice_id.endsWith("_" + suffix))) {
                index++;
            }
        } while (choices.find(c => c.choice_id.endsWith("_" + suffix)));
        return `${parentId.replace('NODE_', 'CHOICE_')}_${suffix}`;
    };

    // 新增选项
    const handleAdd = () => {
        const parentId = node.id;
        const newChoice: IChoiceData = {
            choice_id: generateChoiceId(parentId, choices),
            text: '新选项',
            next_node_id: '',
        };
        const newChoices = [...choices, newChoice];
        setChoices(newChoices);
        setSelectedChoiceId(newChoice.choice_id);
        updateNodeData(form.getFieldsValue(), newChoices, { type: 'add', index: newChoices.length - 1, choice: newChoice });
        setTimeout(() => {
            if (onSelectChoiceNode) {
                onSelectChoiceNode(newChoice.choice_id);
            }
        }, 200);
    };

    const handleRemove = (idx: number) => {
        const choiceId = choices[idx].choice_id;
        const newChoices = choices.filter((_, i) => i !== idx);
        setChoices(newChoices);
        setSelectedChoiceId(null);
        updateNodeData(form.getFieldsValue(), newChoices, { type: 'remove', index: idx ,choiceId});
    };

    const handleFormValuesChange = (changed: any, all: any) => {
        updateNodeData(all, choices, { type: 'edit' });
    };

    const updateNodeData = (formValues: any, newChoices = choices, opInfo: any = {}) => {
        const newNode = {
            ...node,
            id: formValues.node_id,
            data: {
                ...node.data,
                nodeType: formValues.node_type,
                prompt: formValues.prompt,
                choices: newChoices
            }
        };
        onChange(newNode, opInfo);
    };

    return (
        <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange} style={{ padding: 16 }}>
            <Form.Item label="节点ID" name="node_id"><Input disabled /></Form.Item>
            <Form.Item label="节点类型" name="node_type"><Input disabled /></Form.Item>
            <Form.Item label="提示语" name="prompt"><Input /></Form.Item>
            <div style={{ fontWeight: 500, margin: '12px 0 4px 0' }}>选项列表</div>
            <List
                bordered
                dataSource={choices}
                renderItem={(choice, idx) => (
                    <List.Item
                        style={{
                            background: selectedChoiceId === choice.choice_id ? '#e6f7ff' : undefined,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px'
                        }}
                        onClick={() => handleSelect(choice, idx)}
                    >
                        <span style={{ flex: 1, fontWeight: 500 }}>{choice.text}</span>
                        <Button danger type="link" onClick={e => { e.stopPropagation(); handleRemove(idx); }} style={{ padding: 0, marginLeft: 8 }}>删除</Button>
                    </List.Item>
                )}
                locale={{ emptyText: '暂无选项' }}
            />
            <Button type="dashed" onClick={handleAdd} block style={{ marginTop: 8 }}>添加选项</Button>
        </Form>
    );
};

export default PlayerChoiceEditor;