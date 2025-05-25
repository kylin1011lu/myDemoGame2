import React, { useEffect } from 'react';
import { Input, Form } from 'antd';
import { Node } from '@xyflow/react';

interface ChoiceEditorProps {
  node: Node;
  onChange: (newNode: Node) => void;
}

const ChoiceEditor: React.FC<ChoiceEditorProps> = ({ node, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      node_id: node.id,
      node_type: node.data.nodeType,
      text: node.data.text || '',
      choice_id: node.data.choice_id || ''
    });
  }, [node, form]);

  const handleValuesChange = (changed: any, all: any) => {
    const newNode = {
      ...node,
      id: all.node_id,
      data: {
        ...node.data,
        nodeType: all.node_type,
        text: all.text,
        choice_id: all.choice_id
      }
    };
    onChange(newNode);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange} style={{ padding: 16 }}>
      <Form.Item label="节点ID" name="node_id"><Input /></Form.Item>
      <Form.Item label="节点类型" name="node_type"><Input disabled /></Form.Item>
      <Form.Item label="选项内容" name="text"><Input /></Form.Item>
      <Form.Item label="选项ID" name="choice_id"><Input disabled /></Form.Item>
    </Form>
  );
};

export default ChoiceEditor;