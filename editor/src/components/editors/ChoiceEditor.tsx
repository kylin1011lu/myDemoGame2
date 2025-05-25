import React, { useEffect, useState, useCallback } from 'react';
import { Input, Form, Button, Select, InputNumber, Space, message } from 'antd';
import { Node } from '@xyflow/react';
import { StoryEffectTypeNames } from '../../types/story';
import { v4 as uuidv4 } from 'uuid';

interface ChoiceEditorProps {
    node: Node;
    onChange: (newNode: Node) => void;
}

interface Effect {
    type: string;
    value: number;
    id: string;
}

// 使用自己的效果列表组件，而不是依赖 Form.List
const EffectList: React.FC<{
    effects: Effect[];
    onChange: (effects: Effect[]) => void;
}> = ({ effects, onChange }) => {
    // 添加新效果
    const handleAddEffect = () => {
        const newEffect: Effect = {
            type: '',
            value: 0,
            id: `effect-${uuidv4()}`
        };
        onChange([...effects, newEffect]);
    };

    // 更新效果
    const handleUpdateEffect = (id: string, field: string, value: any) => {
        const updatedEffects = effects.map(effect =>
            effect.id === id ? { ...effect, [field]: value } : effect
        );
        onChange(updatedEffects);
    };

    // 删除效果
    const handleRemoveEffect = (id: string) => {
        const updatedEffects = effects.filter(effect => effect.id !== id);
        onChange(updatedEffects);
    };

    return (
        <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>效果列表</div>

            {effects.map((effect, index) => (
                <div
                    key={`effect-${effect.id}`}
                    style={{
                        display: 'flex',
                        marginBottom: 8,
                        alignItems: 'baseline'
                    }}
                >
                    <Select
                        style={{ width: 120, marginRight: 8 }}
                        placeholder="类型"
                        value={effect.type}
                        onChange={(value) => handleUpdateEffect(effect.id, 'type', value)}
                    >
                        {Object.entries(StoryEffectTypeNames).map(([type, label]) => (
                            <Select.Option key={type} value={type}>
                                {label}
                            </Select.Option>
                        ))}
                    </Select>

                    <InputNumber
                        placeholder="数值"
                        style={{ width: 80, marginRight: 8 }}
                        value={effect.value}
                        onChange={(value) => handleUpdateEffect(effect.id, 'value', value)}
                    />

                    <Button
                        danger
                        type="link"
                        onClick={() => handleRemoveEffect(effect.id)}
                        style={{ padding: 0 }}
                    >
                        删除
                    </Button>
                </div>
            ))}

            <Button
                type="dashed"
                onClick={handleAddEffect}
                block
            >
                添加效果
            </Button>
        </div>
    );
};

const ChoiceEditor: React.FC<ChoiceEditorProps> = ({ node, onChange }) => {
    const [form] = Form.useForm();
    const [effectsList, setEffectsList] = useState<Effect[]>([]);

    // 载入节点数据
    useEffect(() => {
        try {
            // 提取效果数据并确保每个效果都有唯一ID
            const rawEffects = Array.isArray(node.data.effects) ? node.data.effects : [];

            const effectsWithIds = rawEffects.map((effect: any) => ({
                ...effect,
                id: effect.id || `effect-${uuidv4()}`
            }));

            // 设置本地状态
            setEffectsList(effectsWithIds);

            // 设置其他表单值
            form.setFieldsValue({
                node_id: node.id,
                node_type: node.data.nodeType,
                text: node.data.text || '',
                choice_id: node.data.choice_id || ''
            });
        } catch (error) {
            console.error('处理节点数据时出错:', error);
        }
    }, [node, form]);

    // 处理表单值变化
    const handleFormValuesChange = (changed: any, all: any) => {
        updateNodeData(all);
    };

    // 处理效果列表变化
    const handleEffectsChange = (newEffects: Effect[]) => {
        setEffectsList(newEffects);
        updateNodeData(form.getFieldsValue(), newEffects);
    };

    // 更新节点数据
    const updateNodeData = (formValues: any, effects = effectsList) => {
        const newNode = {
            ...node,
            id: formValues.node_id,
            data: {
                ...node.data,
                nodeType: formValues.node_type,
                text: formValues.text,
                choice_id: formValues.choice_id,
                // 使用传入的效果列表，而不是依赖状态变量
                effects: effects
            }
        };
        onChange(newNode);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormValuesChange}
            style={{ padding: 16 }}
        >
            <Form.Item label="节点ID" name="node_id">
                <Input />
            </Form.Item>

            <Form.Item label="节点类型" name="node_type">
                <Input disabled />
            </Form.Item>

            <Form.Item label="选项内容" name="text">
                <Input />
            </Form.Item>

            <Form.Item label="选项ID" name="choice_id">
                <Input disabled />
            </Form.Item>

            {/* 使用自定义效果列表组件代替 Form.List */}
            <EffectList
                effects={effectsList}
                onChange={handleEffectsChange}
            />
        </Form>
    );
};

export default ChoiceEditor;