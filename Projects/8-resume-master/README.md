# 在线简历项目

一个纯静态的在线简历模板，适合用来展示个人信息、技能栈、教育经历和项目经验。项目不依赖框架，直接修改 HTML、CSS 和少量 JavaScript 就能快速上线。

## 项目亮点

- 纯静态实现，部署简单，适合新人练手和个人展示
- 页面结构完整，包含头像、联系方式、技能、教育经历和工作经历
- 支持本地直接预览，也适合部署到 GitHub Pages、Netlify、Vercel
- 文件结构清晰，便于二次修改和扩展

## 适合谁使用

- 想做第一份在线简历的前端初学者
- 需要一个可直接替换内容的个人主页模板的人
- 想练习静态页面部署流程的人

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

## 快速开始

### 1. 修改简历内容

打开 [index.html](index.html)，重点替换下面这些信息：

- 姓名、职位、城市、联系方式
- 教育经历和工作经历
- 技能列表与技能熟练度
- GitHub、博客、社交主页等链接

如果需要替换图片资源，可以把文件放到 [assets/images](assets/images/) 中，再更新 HTML 路径。

### 2. 修改样式

常用样式文件：

- [assets/css/index.css](assets/css/index.css)
- [assets/css/typo.css](assets/css/typo.css)

如果你想统一颜色、间距或版式，优先从这两个文件开始。

### 3. 本地预览

最简单的方式是直接打开 [index.html](index.html)。

如果想用本地服务预览，进入项目目录后执行：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 部署方式

### 方案 A：GitHub Pages

适合想长期托管在 GitHub 上的人。

1. 把项目推送到 GitHub 仓库。
2. 进入仓库的 `Settings` -> `Pages`。
3. 选择 `Deploy from a branch`。
4. 分支选择 `main`，目录选择 `/ (root)`。
5. 保存后等待几分钟，即可获得公开访问链接。

后续更新流程：

```bash
git add .
git commit -m "update resume"
git push
```

### 方案 B：Netlify

适合想快速上线、少配置的人。

1. 登录 Netlify。
2. 选择 `Add new site` -> `Deploy manually`。
3. 直接拖拽整个项目文件夹上传。
4. 上传完成后会生成一个 `*.netlify.app` 地址。

### 方案 C：Vercel

适合已经把代码托管在 GitHub 上，并希望自动部署的人。

1. 登录 Vercel。
2. 选择 `Add New...` -> `Project`。
3. 导入 GitHub 仓库。
4. 保持默认配置并点击 `Deploy`。

## 常见问题

### 页面样式错乱

- 检查 `assets/...` 资源路径是否正确
- 确认部署平台发布的根目录就是项目根目录

### 修改后线上没有更新

- 先清理浏览器缓存再访问
- 确认代码已经推送到正确分支
- 检查部署平台的构建日志

## 许可证

项目采用 [MIT License](LICENSE)。
