import React from 'react'
import { Layout } from 'antd'
import StoryEditor from './components/StoryEditor'

const { Header, Content } = Layout

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <h1>故事编辑器</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <StoryEditor />
      </Content>
    </Layout>
  )
}

export default App 