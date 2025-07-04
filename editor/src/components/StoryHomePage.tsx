import React, { useEffect, useState } from 'react';
import { Button, Tabs, Row, Col, Card, Spin, message, Modal, Form, Input, Select, Dropdown, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ResGetStoryList } from '../shared/protocols/story/PtlGetStoryList';
import { client } from '../utils/network';
import { storyTypes } from '../types/story';
import { ReqAddStory } from '../shared/protocols/story/PtlAddStory';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const StoryHomePage: React.FC = () => {
  const [stories, setStories] = useState<ResGetStoryList['stories']>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 用户信息（简单从localStorage获取）
  const [username] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.username || '用户';
    } catch {
      return '用户';
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'logout',
      label: (
        <span onClick={handleLogout}><LogoutOutlined /> 退出登录</span>
      )
    }
  ];

  const fetchStories = async () => {
    setLoading(true);
    const ret = await client.callApi('story/GetStoryList', {});
    setLoading(false);
    if (ret.isSucc) {
      setStories(ret.res.stories);
    } else {
      message.error('获取故事列表失败');
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const filteredStories = activeType === 'all'
    ? stories
    : stories.filter(story => story.story_type === activeType);

  const handleCardClick = (story: ResGetStoryList['stories'][0]) => {
    navigate(`/editor/${story.story_id}`, { state: { story } });
  };

  const handleCreateStory = () => {
    setModalOpen(true);
    form.resetFields();
  };

  const handleSaveStory = async () => {
    const values = await form.validateFields();
    const req: ReqAddStory = {
      story_title: values.story_title,
      description: values.description,
      story_type: values.story_type,
    };
    const ret = await client.callApi('story/AddStory', req);
    if (ret.isSucc && ret.res.success) {
      message.success('新建故事成功');
      setModalOpen(false);
      fetchStories();
    } else {
      message.error('新建失败: ' + (ret.res?.error || '未知错误'));
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', background: '#f5f5f5', minHeight: 600, padding: 24, borderRadius: 8, position: 'relative' }}>
      {/* 按钮区 */}
      <div style={{ marginBottom: 32 }}>
        <Button type="primary" size="large" onClick={handleCreateStory}>新建故事</Button>
      </div>
      {/* 类型标签区 */}
      <Tabs
        activeKey={activeType}
        onChange={setActiveType}
        items={storyTypes.map(type => ({ key: type.key, label: type.label }))}
        style={{ marginBottom: 24 }}
      />
      {/* 故事列表区 */}
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {filteredStories.map(story => (
            <Col key={story.story_id} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable style={{ minHeight: 120 }} onClick={() => handleCardClick(story)}>
                <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{story.story_title}</div>
                <div style={{ color: '#888', fontSize: 14 }}>{story.description}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
      <Modal
        open={modalOpen}
        title="新建故事"
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveStory}
        okText="保存"
        cancelText="关闭"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="故事标题" name="story_title" rules={[{ required: true, message: '请输入故事标题' }]}>
             <Input /> 
          </Form.Item>
          <Form.Item label="故事描述" name="description" rules={[{ required: true, message: '请输入故事描述' }]}> 
            <Input.TextArea rows={3} /> 
          </Form.Item>
          <Form.Item label="故事类型" name="story_type" rules={[{ required: true, message: '请选择故事类型' }]}> 
            <Select options={storyTypes.filter(t => t.key !== 'all').map(t => ({ value: t.key, label: t.label }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoryHomePage; 