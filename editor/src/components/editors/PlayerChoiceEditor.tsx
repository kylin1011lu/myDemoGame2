import React, { useEffect } from 'react';
import { Input, Form, Button, Space } from 'antd';
import { Node } from '@xyflow/react';

interface PlayerChoiceEditorProps {
  node: Node;
  onChange: (newNode: Node) => void;
}

const PlayerChoiceEditor: React.FC<PlayerChoiceEditorProps> = ({ node, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      node_id: node.id,
      node_type: node.data.nodeType,
      prompt: node.data.prompt || '',
      choices: node.data.choices ? (node.data.choices as any[]).map((c: any) => `${c.choice_id}|${c.text}|${c.next_node_id || ''}`).join('\n') : ''
    });
  }, [node, form]);

  const handleValuesChange = (changed: any, all: any) => {
    const choices = (all.choices || '').split('\n').filter(Boolean).map((line: string) => {
      const [choice_id, text, next_node_id] = line.split('|');
      return { choice_id, text, next_node_id };
    });
    const newNode = {
      ...node,
      id: all.node_id,
      data: {
        ...node.data,
        nodeType: all.node_type,
        prompt: all.prompt,
        choices
      }
    };
    onChange(newNode);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange} style={{ padding: 16 }}>
      <Form.Item label="节点ID" name="node_id"><Input disabled/></Form.Item>
      <Form.Item label="节点类型" name="node_type"><Input disabled /></Form.Item>
      <Form.Item label="提示语" name="prompt"><Input /></Form.Item>
      <Form.Item label="选项（每行：choice_id|文本|next_node_id）" name="choices"><Input.TextArea autoSize={{ minRows: 3 }} /></Form.Item>
    </Form>
  );
};

export default PlayerChoiceEditor;