import React from 'react'
import { Layout, Dropdown, Avatar, message } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import StoryEditor from './components/StoryEditor/index'
import StoryHomePage from './components/StoryHomePage'
import LoginPage from './components/LoginPage'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { client } from './utils/network';

const { Header, Content } = Layout

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const [username] = React.useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.username || '用户';
    } catch {
      return '用户';
    }
  });

  const handleLogout = async () => {
    try {
      const ret = await client.callApi('user/Logout', {});
      if (!ret.isSucc) {
        message.error(ret.err.message);
        return;
      }
    } catch {
      message.error('退出登录失败');
    }
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
  return (
    <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['hover']}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
        <Avatar icon={<UserOutlined />} />
        <span style={{ color: '#333', fontWeight: 500 }}>{username}</span>
      </div>
    </Dropdown>
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('SSO_TOKEN');
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>编辑器</h1>
        {location.pathname !== '/login' && <UserMenu />}
      </Header>
      <Content style={{ padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><StoryHomePage /></RequireAuth>} />
          <Route path="/editor/:id" element={<RequireAuth><StoryEditor /></RequireAuth>} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App 