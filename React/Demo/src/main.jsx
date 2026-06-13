// main.jsx —— React 应用的入口文件
// 作用：把 App 组件挂载到 HTML 中的 #root 元素上

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// createRoot：React 18 的新 API，替代了旧的 ReactDOM.render
// document.getElementById('root')：找到 index.html 中的 <div id="root">
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
