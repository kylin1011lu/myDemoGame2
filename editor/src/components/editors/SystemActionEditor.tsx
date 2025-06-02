import React, { useEffect } from 'react';
import { Input, Form } from 'antd';
import { Node } from '@xyflow/react';

interface SystemActionEditorProps {
  node: Node;
  onChange: (newNode: Node) => void;
}

const SystemActionEditor: React.FC<SystemActionEditorProps> = ({ node, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      node_id: node.id,
      node_type: node.data.nodeType,
      content: (node.data.content as string[] || []).join('\n'),
      next_node_id: node.data.nextNodeId || ''
    });
  }, [node, form]);

  const handleValuesChange = (changed: any, all: any) => {
    const newNode = {
      ...node,
      id: all.node_id,
      data: {
        ...node.data,
        nodeType: all.node_type,
        content: all.content.split('\n'),
        nextNodeId: all.next_node_id
      }
    };
    onChange(newNode);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange} style={{ padding: 16 }}>
      <Form.Item label="节点ID" name="node_id"><Input /></Form.Item>
      <Form.Item label="节点类型" name="node_type"><Input disabled /></Form.Item>
      <Form.Item label="内容（多行）" name="content"><Input.TextArea autoSize={{ minRows: 3 }} /></Form.Item>
      <Form.Item label="下一个节点ID" name="next_node_id"><Input disabled/></Form.Item>
    </Form>
  );
};

export default SystemActionEditor;