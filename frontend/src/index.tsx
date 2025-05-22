import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.less';

// 创建根元素
const root = ReactDOM.createRoot(
  document.getElementById('app') as HTMLElement
);

// 渲染应用，移除 StrictMode
root.render(<App />); 