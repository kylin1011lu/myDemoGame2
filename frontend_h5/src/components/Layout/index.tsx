import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  z-index: 1;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  margin-top: 64px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
`;

const Layout: React.FC = () => {
  return (
    <StyledLayout>
      <StyledHeader>
        <h1>文字冒险游戏</h1>
      </StyledHeader>
      <StyledContent>
        <Outlet />
      </StyledContent>
    </StyledLayout>
  );
};

export default Layout; 