# MoviePage

MoviePage 是一个基于 React 和 Vite 构建的电影浏览项目，用来练习前端组件拆分、路由管理、接口请求、状态共享与本地数据持久化。项目以电影发现和收藏为核心场景，用户可以浏览热门电影、搜索电影，并把喜欢的电影加入收藏列表。

## 项目定位

这是一个个人前端练习项目，重点不在复杂业务，而在把一个完整的小型应用从页面结构、数据获取、交互状态到本地运行流程串起来。通过这个项目，我练习了 React 单页应用开发中的常见能力，包括组件化 UI、React Router 页面切换、Context 状态管理、API 数据接入和收藏数据的本地存储。

## 主要功能

- 浏览热门电影列表
- 根据关键词搜索电影
- 展示电影海报、标题和上映年份
- 添加或移除收藏电影
- 收藏列表通过 `localStorage` 保存在本地
- 首页和收藏页通过 React Router 切换
- 对加载中、错误和空结果状态进行基础展示

## 技术栈

- React
- Vite
- React Router
- JavaScript
- CSS
- TMDB API
- localStorage

## 项目结构

```text
17-MoviePage/
├── fronted/
│   ├── src/
│   │   ├── components/      # 通用组件
│   │   ├── Contexts/        # 收藏状态管理
│   │   ├── css/             # 页面与组件样式
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API 请求封装
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
├── package.json
└── README.md
```

## 本地运行

在项目根目录安装依赖后启动开发服务：

```bash
npm install
npm run dev
```

项目默认运行在：

```text
http://localhost:5174
```

也可以进入 `fronted` 目录后运行：

```bash
npm install
npm run dev
```

## 可用脚本

项目根目录提供了转发脚本，可以直接运行前端子项目命令：

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 实现说明

首页进入时会请求热门电影数据，并渲染电影卡片列表。搜索表单提交后，会根据输入关键词请求搜索结果；如果输入为空，则重新加载热门电影。电影卡片中的收藏按钮通过 Context 操作全局收藏状态，收藏数据会同步写入 `localStorage`，因此刷新页面后收藏列表仍然保留。

## 当前状态

项目已经实现基础的电影浏览、搜索和收藏功能，适合作为 React 入门阶段的个人作品展示。后续可以继续扩展电影详情页、评分筛选、分页加载、响应式优化和更完整的错误处理。
