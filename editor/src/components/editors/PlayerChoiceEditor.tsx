import React, { useEffect, useState } from 'react';
import { Input, Form, Button, List, Space } from 'antd';
import { Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

interface PlayerChoiceEditorProps {
  node: Node;
  onChange: (newNode: Node) => void;
  onSelectChoiceNode?: (choiceNodeId: string) => void;
}

interface ChoiceItem {
  choice_id: string;
  text: string;
  next_node_id?: string;
}

const PlayerChoiceEditor: React.FC<PlayerChoiceEditorProps> = ({ node, onChange, onSelectChoiceNode }) => {
  const [form] = Form.useForm();
  const [choices, setChoices] = useState<ChoiceItem[]>([]);
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

  const handleSelect = (choice: ChoiceItem, idx: number) => {
    setSelectedChoiceId(choice.choice_id);
    if (onSelectChoiceNode) {
      onSelectChoiceNode(`${node.id}-choice-${idx}`);
    }
  };

  const handleAdd = () => {
    const newChoice: ChoiceItem = {
      choice_id: `choice_${uuidv4()}`,
      text: '新选项',
      next_node_id: ''
    };
    const newChoices = [...choices, newChoice];
    setChoices(newChoices);
    setSelectedChoiceId(newChoice.choice_id);
    if (onSelectChoiceNode) {
      onSelectChoiceNode(`${node.id}-choice-${newChoices.length - 1}`);
    }
    updateNodeData(form.getFieldsValue(), newChoices);
  };

  const handleRemove = (idx: number) => {
    const newChoices = choices.filter((_, i) => i !== idx);
    setChoices(newChoices);
    setSelectedChoiceId(null);
    updateNodeData(form.getFieldsValue(), newChoices);
  };

  const handleEdit = (idx: number, value: string) => {
    const newChoices = choices.map((c, i) => i === idx ? { ...c, text: value } : c);
    setChoices(newChoices);
    updateNodeData(form.getFieldsValue(), newChoices);
  };

  const handleFormValuesChange = (changed: any, all: any) => {
    updateNodeData(all, choices);
  };

  const updateNodeData = (formValues: any, newChoices = choices) => {
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
    onChange(newNode);
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