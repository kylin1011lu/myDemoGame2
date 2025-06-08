import React, { useEffect, useState } from 'react';
import { Button, Tabs, Row, Col, Card, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ResGetStoryList } from '../shared/protocols/PtlGetStoryList';
import { getApiClient } from '../utils/network';

const storyTypes = [
  { key: 'all', label: '全部' },
  { key: 'history', label: '历史' },
  { key: 'fantasy', label: '玄幻' },
  { key: 'romance', label: '爱情' },
];

const client = getApiClient();

const StoryHomePage: React.FC = () => {
  const [stories, setStories] = useState<ResGetStoryList['stories']>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('all');
  const navigate = useNavigate();

  const fetchStories = async () => {
    setLoading(true);
    const ret = await client.callApi('GetStoryList', {});
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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', background: '#f5f5f5', minHeight: 600, padding: 24, borderRadius: 8 }}>
      {/* 按钮区 */}
      <div style={{ marginBottom: 32 }}>
        <Button type="primary" size="large">新建故事</Button>
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
    </div>
  );
};

export default StoryHomePage; 