import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useStoryEditorContext } from '../context/StoryEditorContext';
import { getApiClient } from '../../../utils/network';
import { ReqUpdateSceneInfo } from '../../../shared/protocols/PtlUpdateSceneInfo';

const { Text, Title } = Typography;

const LeftPanel: React.FC = () => {
  const {
    storyData,
    currentSceneIndex,
    handleSceneChange,
  } = useStoryEditorContext();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editScene, setEditScene] = useState<any>(null);
  const [form] = Form.useForm();
  const client = getApiClient();

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
    const ret = await client.callApi('UpdateSceneInfo', req);
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
      message.error('保存失败: ' + (ret.res.error || '未知错误'));
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
            <Title level={4}>{storyData.story_title}</Title>
            <Text type="secondary">{storyData.description}</Text>
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
                <Form.Item label="场景ID" name="scene_id" rules={[{ required: true, message: '请输入场景ID' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="场景标题" name="scene_title" rules={[{ required: true, message: '请输入场景标题' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="起始节点ID" name="start_node_id" rules={[{ required: true, message: '请输入起始节点ID' }]}>
                  <Input />
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