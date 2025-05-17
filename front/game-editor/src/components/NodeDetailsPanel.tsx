import React, { useState, useEffect } from 'react';
import { Drawer, Tabs, Form, Input, Button, Space, List, Typography, Tag } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { GameNode, GameNodeData, Choice } from '../types';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;

interface NodeDetailsPanelProps {
  node: GameNode | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (node: GameNode) => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  open,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [nodeType, setNodeType] = useState<string>('');

  useEffect(() => {
    if (node) {
      form.setFieldsValue({
        node_id: node.data.node_id,
        node_type: node.data.node_type,
        character_id: node.data.character_id || '',
        emotion: node.data.emotion || '',
        content: node.data.content || [],
        content_template: node.data.content_template || '',
        next_node_id: node.data.next_node_id || '',
        prompt: node.data.prompt || '',
        choices: node.data.choices || [],
        action_type: node.data.action_type || '',
        feedback_message_to_player: node.data.feedback_message_to_player || '',
      });
      setNodeType(node.data.node_type);
    }
  }, [node, form]);

  const handleFinish = (values: any) => {
    if (!node) return;

    const updatedNode: GameNode = {
      ...node,
      data: {
        ...node.data,
        ...values,
      },
    };

    onUpdate(updatedNode);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 动态渲染基于节点类型的不同表单字段
  const renderNodeSpecificFields = () => {
    switch (nodeType) {
      case 'HOST_DIALOGUE':
        return (
          <>
            <Form.Item label="角色ID" name="character_id">
              <Input placeholder="角色ID" />
            </Form.Item>
            <Form.Item label="情绪" name="emotion">
              <Input placeholder="情绪状态" />
            </Form.Item>
          </>
        );
      case 'PLAYER_CHOICE':
        return (
          <>
            <Form.Item label="提示文本" name="prompt">
              <Input placeholder="选择提示" />
            </Form.Item>
            <Form.List name="choices">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'choice_id']}
                        rules={[{ required: true, message: '请输入选择ID' }]}
                      >
                        <Input placeholder="选择ID" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: '请输入选择文本' }]}
                      >
                        <Input placeholder="选择文本" style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'next_node_id']}
                        rules={[{ required: true, message: '请输入下一节点ID' }]}
                      >
                        <Input placeholder="下一节点ID" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加选项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        );
      case 'SYSTEM_ACTION':
        return (
          <>
            <Form.Item label="行为类型" name="action_type">
              <Input placeholder="系统行为类型" />
            </Form.Item>
            <Form.Item label="反馈消息" name="feedback_message_to_player">
              <Input placeholder="给玩家的反馈消息" />
            </Form.Item>
          </>
        );
      case 'STORY_END_FLAG':
        return (
          <>
            <Form.Item label="结果" name="outcome">
              <Input placeholder="故事结果" />
            </Form.Item>
            <Form.List name="unlocks">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: '请输入解锁项' }]}
                      >
                        <Input placeholder="解锁项" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加解锁项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        );
      default:
        return null;
    }
  };

  const renderContentEditor = () => {
    // 对于使用数组的content
    if (nodeType !== 'PLAYER_CHOICE' && nodeType !== 'STORY_END_FLAG') {
      return (
        <Form.List name="content">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: '请输入内容' }]}
                  >
                    <TextArea placeholder="对话/消息内容" rows={2} style={{ width: 350 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加内容行
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      );
    }
    return null;
  };

  // 如果没有选中节点，则返回空
  if (!node) {
    return null;
  }

  return (
    <Drawer
      title="节点详情"
      placement="right"
      width={550}
      onClose={handleCancel}
      open={open}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            保存
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        onFinish={handleFinish}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="basic">
            <Form.Item label="节点ID" name="node_id">
              <Input disabled />
            </Form.Item>
            <Form.Item label="节点类型" name="node_type">
              <Input disabled />
            </Form.Item>
            <Form.Item label="下一节点ID" name="next_node_id">
              <Input placeholder="下一节点ID" />
            </Form.Item>
            {renderNodeSpecificFields()}
          </TabPane>
          <TabPane tab="内容" key="content">
            {nodeType === 'HOST_DIALOGUE' && (
              <Form.Item label="内容模板" name="content_template">
                <TextArea rows={4} placeholder="内容模板 (如果使用)" />
              </Form.Item>
            )}
            {renderContentEditor()}
          </TabPane>
          <TabPane tab="效果" key="effects">
            <Text type="secondary">效果编辑功能将在后续版本中实现</Text>
            {node.data.effects && (
              <List
                size="small"
                bordered
                dataSource={node.data.effects}
                renderItem={item => (
                  <List.Item>
                    <Tag color="blue">{item.type}</Tag>
                    <Text ellipsis>{JSON.stringify(item)}</Text>
                  </List.Item>
                )}
              />
            )}
          </TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default NodeDetailsPanel;
