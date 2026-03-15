# Basic HTML Website

一个基于纯 HTML 多页面结构练习的前端入门项目，目标是先完成语义化结构，再逐步添加样式与交互。

## 项目目标

- 学习多页面网站的组织方式
- 使用语义化 HTML 标签搭建页面结构
- 保持结构清晰，便于后续扩展 CSS 和 JavaScript
- 添加基础 SEO 元信息

## 页面说明

- Home: 个人简介、项目概览、工作经历、教育背景、教师评价
- Projects: 项目列表与简要说明
- Articles: 文章列表与简介
- Contact: 联系方式与表单输入

## 技术栈

- HTML5
- CSS3
- Google Fonts (Gloria Hallelujah)

## 目录结构

```text
2-BasicHTMLWebsite/
├─ index.html
├─ projects.html
├─ articles.html
├─ contact.html
├─ style.css
├─ logo.png
└─ README.md
```

## 如何运行

1. 直接在浏览器打开 index.html
2. 通过导航栏访问 Projects / Articles / Contact 页面

如果你使用 VS Code，也可以安装 Live Server 后右键 index.html 选择 Open with Live Server。

## 已实现内容

- 统一导航栏与页面跳转
- 主页结构化区块布局
- Projects 与 Articles 页的卡片化排版
- Contact 页表单字段增强
  - Name / Email / Phone / Subject / Message
  - 占位符、长度限制、基础校验、自动填充
- 边框与分割线风格统一
- 标题与局部元素使用艺术字风格

## SEO 元信息

各页面均包含以下基础 SEO 设置：

- description
- keywords
- author
- viewport

## 后续可优化方向

- 增加暗色模式与主题切换
- 为表单添加前端交互校验提示
- 补充文章详情页（article1.html 等）
- 增加项目筛选与标签分类
- 接入真实后端提交联系表单

## 作者

Uonlra
