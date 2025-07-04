import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useStoryEditorContext } from '../context/StoryEditorContext';
import { client } from '../../../utils/network';
import { ReqUpdateSceneInfo } from '../../../shared/protocols/story/PtlUpdateSceneInfo';
import { ReqAddScene } from '../../../shared/protocols/story/PtlAddScene';
import { ReqUpdateStory } from '../../../shared/protocols/story/PtlUpdateStory';

const { Text, Title } = Typography;

const LeftPanel: React.FC = () => {
  const {
    storyData,
    currentSceneIndex,
    handleSceneChange,
  } = useStoryEditorContext();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editScene, setEditScene] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm(); // 恢复原有form变量，专用于编辑弹窗
  const [addForm] = Form.useForm();
  const [hoverField, setHoverField] = useState<'title' | 'desc' | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'desc' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditClick = (scene: any) => {
    setEditScene(scene);
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    const values = await form.validateFields();
    if (!storyData || !editScene) return;
    const req: ReqUpdateSceneInfo = {
      story_id: storyData.story_id,
      scene_id: editScene.scene_id,
      new_scene_id: values.scene_id,
      scene_title: values.scene_title,
      start_node_id: values.start_node_id,
    };
    const ret = await client.callApi('story/UpdateSceneInfo', req);
    if (ret.isSucc && ret.res.success) {
      message.success('保存成功');
      setEditModalOpen(false);
      // 刷新UI（直接更新本地数据）
      if (storyData && storyData.scenes) {
        const idx = storyData.scenes.findIndex(s => s.scene_id === editScene.scene_id);
        if (idx >= 0) {
          storyData.scenes[idx] = {
            ...storyData.scenes[idx],
            scene_id: values.scene_id,
            scene_title: values.scene_title,
            start_node_id: values.start_node_id,
          };
        }
      }
    } else {
      message.error('保存失败: ' + (ret.res?.error || '未知错误'));
    }
  };

  // 新增场景保存
  const handleAddScene = async () => {
    const values = await addForm.validateFields();
    if (!storyData) return;
    const req: ReqAddScene = {
      story_id: storyData.story_id,
      scene_title: values.scene_title,
    };
    const ret = await client.callApi('story/AddScene', req);
    if (ret.isSucc && ret.res.success) {
      message.success('新增场景成功');
      setAddModalOpen(false);
      // 刷新场景列表（简单做法：push新场景到scenes）
      if (ret.res.scene) {
        storyData.scenes.push(ret.res.scene);
      }
    } else {
      message.error('新增失败: ' + (ret.res?.error || '未知错误'));
    }
  };

  // 保存故事信息修改
  const handleStoryEditSave = async () => {
    if (!storyData) return;
    // 新增：内容未变化则不提交
    if ((editingField === 'title' && editValue === storyData.story_title) ||
        (editingField === 'desc' && editValue === storyData.description)) {
      setEditingField(null);
      setHoverField(null);
      return;
    }
    const req: ReqUpdateStory = {
      story_id: storyData.story_id,
      ...(editingField === 'title' ? { story_title: editValue } : { description: editValue })
    };
    const ret = await client.callApi('story/UpdateStory', req);
    if (ret.isSucc && ret.res.success) {
      message.success('保存成功');
      if (editingField === 'title') storyData.story_title = editValue;
      if (editingField === 'desc') storyData.description = editValue;
      setEditingField(null);
      setHoverField(null);
    } else {
      message.error('保存失败: ' + (ret.res?.error || '未知错误'));
    }
  };

  useEffect(() => {
    if (editModalOpen && editScene) {
      // 添加适当延时确保 Modal 渲染完成
      setTimeout(() => {
        form.resetFields();
        form.setFieldsValue({
          scene_id: editScene.scene_id,
          scene_title: editScene.scene_title,
          start_node_id: editScene.start_node_id,
        });
      }, 100);
    }
  }, [editModalOpen, editScene, form]);

  return (
    <div style={{ flex: 'none' }}>
      <Card style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, width: 300 }}>
          {storyData && (
            <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={() => setHoverField('title')}
              onMouseLeave={() => setHoverField(null)}>
              {editingField === 'title' ? (
                <Input
                  size="small"
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={handleStoryEditSave}
                  onPressEnter={handleStoryEditSave}
                  style={{ width: 160 }}
                />
              ) : (
                <Title level={4} style={{ margin: 0, flex: 1, fontWeight: 500, fontSize: 18 }}>
                  {storyData.story_title}
                </Title>
              )}
              {(hoverField === 'title' && editingField !== 'title') && (
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  type="text"
                  style={{ color: '#888' }}
                  onClick={() => { setEditingField('title'); setEditValue(storyData.story_title); }}
                />
              )}
            </div>
            <div style={{ color: '#aaa', fontSize: 13, marginBottom: 4 }}>位面序号: {storyData.story_id}</div>
            <div style={{ position: 'relative', minHeight: 44, marginBottom: 8 }}
              onMouseEnter={() => setHoverField('desc')}
              onMouseLeave={() => setHoverField(null)}>
              {editingField === 'desc' ? (
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={handleStoryEditSave}
                  onPressEnter={handleStoryEditSave}
                  style={{ width: '100%', resize: 'none' }}
                  maxLength={100}
                />
              ) : (
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '44px',
                  lineHeight: '22px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  paddingRight: 0,
                  wordBreak: 'break-all',
                  fontSize: 14,
                  color: '#888'
                }}>
                  {storyData.description}
                </div>
              )}
              {(hoverField === 'desc' && editingField !== 'desc') && (
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  type="text"
                  style={{ color: '#888', position: 'absolute', right: -20, bottom: 0, background: 'transparent', boxShadow: 'none', zIndex: 2 }}
                  onClick={() => { setEditingField('desc'); setEditValue(storyData.description); }}
                />
              )}
            </div>
              <List
                size="small"
                bordered
                dataSource={storyData.scenes}
                renderItem={(scene, index) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                    background: currentSceneIndex === index ? '#e6f7ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    }}
                    onClick={() => handleSceneChange(index)}
                  >
                    <Text>{scene.scene_title}</Text>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={e => { e.stopPropagation(); handleEditClick(scene); }}
                  />
                  </List.Item>
                )}
              />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <div
                style={{
                  border: '1px dashed #bbb',
                  borderRadius: 4,
                  padding: '8px 0',
                  color: '#888',
                  fontSize: 18,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'border-color 0.2s',
                }}
                onClick={() => setAddModalOpen(true)}
                onMouseOver={e => (e.currentTarget.style.borderColor = '#1890ff')}
                onMouseOut={e => (e.currentTarget.style.borderColor = '#bbb')}
              >
                增加场景
              </div>
            </div>
            <Modal
              open={editModalOpen}
              title="编辑场景信息"
              onCancel={() => setEditModalOpen(false)}
              onOk={handleEditSave}
              okText="保存"
              cancelText="关闭"
              destroyOnHidden={true}
            >
              <Form form={form} layout="vertical" preserve={false}>
                <Form.Item label="场景ID" name="scene_id" rules={[{ message: '请输入场景ID' }]}>
                  <Input disabled />
                </Form.Item>
                <Form.Item label="场景标题" name="scene_title" rules={[{ required: true, message: '请输入场景标题' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="起始节点ID" name="start_node_id" rules={[{ message: '请输入起始节点ID' }]}>
                  <Input disabled />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              open={addModalOpen}
              title="新增场景"
              onCancel={() => setAddModalOpen(false)}
              onOk={handleAddScene}
              okText="保存"
              cancelText="关闭"
            >
              <Form form={addForm} layout="vertical">
                <Form.Item label="场景标题" name="scene_title" rules={[{ required: true, message: '请输入场景标题' }]}>
                  <Input placeholder="请输入场景标题" />
                </Form.Item>
              </Form>
            </Modal>
            </>
          )}
      </Card>
    </div>
  );
};

export default LeftPanel; 