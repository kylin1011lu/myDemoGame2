import React from 'react'
import { Layout } from 'antd'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StoryEditor from './components/StoryEditor/index'
import StoryHomePage from './components/StoryHomePage'

const { Header, Content } = Layout

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 20px' }}>
          <h1>故事编辑器</h1>
        </Header>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<StoryHomePage />} />
            <Route path="/editor/:id" element={<StoryEditor />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App 