import React, { useEffect } from 'react';
import { Input, Form } from 'antd';
import { Node } from '@xyflow/react';

interface StoryEndFlagEditorProps {
  node: Node;
  onChange: (newNode: Node) => void;
}

const StoryEndFlagEditor: React.FC<StoryEndFlagEditorProps> = ({ node, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      node_id: node.id,
      node_type: node.data.nodeType,
    });
  }, [node, form]);

  const handleValuesChange = (changed: any, all: any) => {
    const newNode = {
      ...node,
      id: all.node_id,
      data: {
        ...node.data,
        nodeType: all.node_type,
      }
    };
    onChange(newNode);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange} style={{ padding: 16 }} className="my-editor-form">
      <Form.Item label="节点ID" name="node_id"><Input /></Form.Item>
      <Form.Item label="节点类型" name="node_type"><Input disabled /></Form.Item>
    </Form>
  );
};

export default StoryEndFlagEditor;