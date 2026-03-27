# 在线简历项目说明

这是一个纯静态的个人在线简历模板，核心文件是 [index.html](index.html)，样式和脚本位于 [assets](assets/) 目录。

适用场景：

- 前端/程序员在线简历展示
- 个人主页（简历型）
- 面试投递时提供在线访问链接

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

## 1. 本地修改简历

1. 打开 [index.html](index.html)，替换以下内容：
- 个人信息（姓名、职位、联系方式）
- 教育经历、项目经历、技能描述
- 社交链接（GitHub、博客、掘金等）

2. 如需改样式，优先修改：
- [assets/css/index.css](assets/css/index.css)
- [assets/css/typo.css](assets/css/typo.css)

3. 如需替换头像或配图，把图片放到 [assets/images](assets/images/) 并更新 [index.html](index.html) 的路径。

## 2. 本地预览

直接双击 [index.html](index.html) 即可预览。

如果你希望用本地服务预览（推荐，避免路径缓存问题），在项目目录执行：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 3. 部署在线简历教程

下面给出 3 种常用部署方式，任选一种即可。

### 方案 A：GitHub Pages（免费，推荐）

适合：代码托管在 GitHub，希望长期稳定访问。

1. 将项目推送到 GitHub 仓库（例如仓库名为 `resume`）。
2. 进入仓库页面 -> `Settings` -> `Pages`。
3. 在 `Build and deployment` 中设置：
- `Source`: `Deploy from a branch`
- `Branch`: 选择 `main`（或你的发布分支）
- 文件夹选择 `/ (root)`
4. 点击 `Save`。
5. 等待 1-3 分钟，GitHub 会生成访问地址，例如：
- `https://你的用户名.github.io/resume/`

后续更新流程：

1. 本地修改 [index.html](index.html) 或样式文件。
2. `git add .`
3. `git commit -m "update resume"`
4. `git push`
5. Pages 自动重新部署。

### 方案 B：Netlify（拖拽即部署）

适合：不想配置太多，想快速上线。

1. 打开 Netlify 官网并登录。
2. 在后台选择 `Add new site` -> `Deploy manually`。
3. 将整个项目文件夹（包含 [index.html](index.html)）拖拽上传。
4. 上传完成后会得到一个 `*.netlify.app` 域名。
5. 可在站点设置中自定义二级域名。

后续更新：重新拖拽上传，或绑定 Git 仓库实现自动部署。

### 方案 C：Vercel（Git 自动部署）

适合：已有 GitHub 仓库，希望每次 push 自动发布。

1. 登录 Vercel。
2. `Add New...` -> `Project`，导入你的 GitHub 仓库。
3. 框架选择 `Other`（或保持自动识别）。
4. 保持默认构建设置（静态站点通常不需要额外命令）。
5. 点击 `Deploy`，完成后获得 `*.vercel.app` 访问地址。

后续每次推送到主分支都会自动重新部署。

## 4. 常见问题

### 页面样式错乱

- 检查资源路径是否正确（尤其是 `assets/...`）。
- 确认部署平台的发布根目录就是项目根目录（必须包含 [index.html](index.html)）。

### 修改后线上没更新

- 清理浏览器缓存后再访问。
- 确认已 push 到正确分支。
- 查看部署平台的构建日志是否报错。

## 5. 许可证

本项目采用 MIT License，详情见 [LICENSE](LICENSE)。