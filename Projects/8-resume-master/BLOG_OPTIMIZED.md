# 在线简历项目实战：从本地修改到上线部署

如果你想做一个可以直接发送给面试官的在线简历页面，这个项目可以作为一个很合适的起点。它基于原生 HTML、CSS 和 JavaScript 实现，不依赖前端框架，结构清晰，部署成本也很低。

这篇文章会带你快速了解项目结构、可修改的内容，以及如何把它发布到线上，最终得到一个可以公开访问的在线简历链接。

## 项目地址

- GitHub 仓库：<https://github.com/Uonlra/Web_Fronted/tree/main/Projects/8-resume-master>

## 项目适合什么场景

- 作为个人在线简历使用
- 作为简洁的个人主页使用
- 作为静态页面练习项目使用
- 作为部署 GitHub Pages / Netlify / Vercel 的入门项目使用

## 这个项目有什么特点

- 纯静态实现，不需要额外框架和构建工具
- 页面信息完整，包含头像、联系方式、技能、教育经历和工作经历
- 文件结构直观，适合初学者快速上手
- 修改后即可部署，适合用来练习“开发 + 发布”的完整流程

## 目录结构

```text
8-resume-master/
├─ index.html
├─ assets/
│  ├─ css/
│  ├─ images/
│  ├─ js/
│  └─ sass/
└─ README.md
```

## 如何修改成你自己的简历

核心文件是 `index.html`。你可以优先替换下面几部分内容：

1. 个人信息：姓名、职位、城市、年龄、邮箱、手机号
2. 联系方式：GitHub、博客、社交主页等外链
3. 技能信息：HTML、CSS、JavaScript、React、Node.js 等技能项
4. 教育经历：学校、专业、时间、奖项或成果
5. 项目经历或工作经历：项目背景、职责、技术栈、产出结果

如果你还想调整页面风格，建议优先查看下面两个样式文件：

- `assets/css/index.css`
- `assets/css/typo.css`

如果需要更换头像或其他配图，可以把图片放到 `assets/images` 中，再更新 HTML 引用路径。

## 如何本地预览

你可以直接双击 `index.html` 打开页面。

如果你想更稳定地预览，建议在项目目录启动本地服务：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 如何部署到线上

### GitHub Pages

这是最推荐的方式，适合长期维护。

1. 把项目推送到 GitHub 仓库
2. 打开仓库 `Settings` -> `Pages`
3. 选择 `Deploy from a branch`
4. 分支选择 `main`，目录选择 `/ (root)`
5. 保存后等待几分钟，即可生成公开链接

后续更新只需要：

```bash
git add .
git commit -m "update resume"
git push
```

### Netlify

如果你希望尽快上线，可以直接拖拽部署。

1. 登录 Netlify
2. 选择 `Add new site` -> `Deploy manually`
3. 把整个项目文件夹拖进去
4. 上传完成后会得到一个 `*.netlify.app` 地址

### Vercel

如果你更习惯使用 Git 自动部署，Vercel 也很适合这个项目。

1. 登录 Vercel
2. 创建新项目并导入 GitHub 仓库
3. 保持默认构建配置
4. 点击 `Deploy`

## 常见问题

### 1. 页面样式丢失

通常是资源路径配置不正确。请重点检查 `assets/...` 路径是否完整，并确认部署根目录包含 `index.html`。

### 2. 修改后线上没更新

先清理浏览器缓存，再确认代码是否已经推送到正确分支。如果仍然没有更新，可以去部署平台查看构建日志。

## 项目总结

这个在线简历项目最大的优点是简单直接。它不追求复杂技术栈，而是把重点放在“快速修改、快速展示、快速上线”上。对于前端初学者来说，这类项目非常适合拿来练习页面结构、样式组织和静态部署流程。

如果你正在准备简历、整理作品集，或者想做一个能公开访问的个人介绍页，这个项目会是一个不错的开始。

## 参考项目

- Gitee：<https://gitee.com/itsay/resume>
