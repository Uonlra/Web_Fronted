# Interactive Portfolio 开发文档

## 1. 文档信息

- 项目名称：Interactive Portfolio（交互式个人作品集）
- 项目定位：面向招聘者浏览的个人作品集，同时提供一个本地管理端维护展示内容。
- 当前阶段：MVP，预计 3-4 周完成。
- 运行方式：本地运行，不接真实认证、远程数据库或生产级后台服务。
- 目标技术栈：TypeScript、React、Next.js App Router、shadcn/ui、Tailwind CSS。

## 2. 背景与目标

现有简历能够说明项目做过什么，但招聘者仍需要在多个仓库、部署地址和文字描述之间切换，难以快速理解项目背景、个人负责内容和技术决策。本项目把简历中的项目经验组织成一个可交互、可验证的作品集，重点展示完整产品闭环和工程实践。

### 2.1 项目目标

1. 让招聘者在 3 分钟内了解个人定位、代表项目和核心技术能力。
2. 通过项目详情页展示背景、职责、架构、难点、取舍、结果和相关链接。
3. 通过本地管理端编辑项目内容、调整展示顺序和控制公开展示状态。
4. 用真实的类型约束、表单校验、状态管理、测试和 CI 证明工程能力。
5. 保持公开展示数据和管理端数据联动，使项目具备可演示的产品闭环。

### 2.2 非目标（MVP 不做）

- 真实登录、注册、多用户和角色权限。
- 远程数据库、服务端文件上传和在线协同编辑。
- CMS、富文本编辑器、评论、点赞和访问者数据采集。
- 完整求职投递管理、面试问答库和技能成长记录。
- 为搜索引擎做复杂的内容运营后台。

这些能力作为后续路线，不应在 MVP 开发期间阻塞核心流程。

## 3. 用户与核心场景

### 3.1 招聘者

- 打开首页，快速确认候选人的定位、技术栈和代表项目。
- 通过项目卡片进入详情页，阅读项目成果、个人职责、技术难点和实现证据。
- 使用技术栈或项目类型筛选项目。
- 打开 GitHub、在线地址或项目文档链接。
- 通过页脚的“管理内容”入口进入本地管理端演示。

### 3.2 作者（本地管理者）

- 进入 `/manage` 查看当前公开内容和项目排序。
- 新增或编辑项目的结构化信息。
- 通过拖拽调整项目展示顺序。
- 切换项目的公开/隐藏状态。
- 刷新页面后保留本地修改，并可恢复为初始 fixture 数据。

## 4. MVP 功能范围

### 4.1 公开端

- 首页 `/`：个人定位、能力摘要、精选项目、技术栈、联系方式。
- 项目详情 `/projects/[slug]`：项目背景、成果、职责、技术栈、关键实现、工程质量、链接和项目复盘。
- 项目筛选：按技术栈和项目类型筛选，筛选结果通过 URL query 表达，可刷新和分享。
- 首页首屏只重点推荐 TaskFlow；RedditLike 和 U-s-cinema 在完整项目列表中展示。
- 状态处理：加载、空数据、项目不存在、图片/链接缺失和错误状态。
- 响应式布局：移动端以阅读为主，桌面端提供更高效的信息浏览和项目对比。

### 4.2 管理端

- `/manage`：项目列表、公开状态、排序和编辑入口。
- `/manage/projects/new`：新增项目。
- `/manage/projects/[id]/edit`：编辑项目。
- 结构化表单：标题、slug、摘要、类型、技术栈、职责、成果、难点、解决方案、链接和展示状态。
- React Hook Form + Zod 校验必填项、slug 格式、URL、数组项和字段长度。
- 拖拽排序：使用稳定的项目 id 更新 `order`，键盘操作和按钮操作作为可访问性兜底。
- 本地数据操作：保存、取消、删除确认、恢复初始数据和保存成功/失败反馈。
- 新建项目默认保存为草稿（`published: false`），只有显式发布后才进入公开项目列表。

## 5. 页面与路由设计

| 路由 | 渲染职责 | 主要内容 |
| --- | --- | --- |
| `/` | Server Component + Client islands | 个人信息、精选项目、技术栈、筛选 |
| `/projects/[slug]` | Server Component + Client islands | 项目详情、目录导航、外部链接；客户端恢复本地项目 |
| `/manage` | Client-heavy route | 项目管理列表、排序、状态和操作 |
| `/manage/projects/new` | Client Component | 新建项目表单 |
| `/manage/projects/[id]/edit` | Client Component | 编辑项目表单 |
| `not-found.tsx` | Server Component | 项目不存在 |
| `error.tsx` | Client Component | 页面级错误恢复 |

MVP 不实现真实 API Route。数据访问仍通过 repository 接口抽象，后续可以将实现替换为 Route Handler 或数据库，而不改变页面和表单契约。

由于管理端修改保存在浏览器 localStorage，公开页的服务端首屏只能使用 fixture。客户端挂载后读取本地数据并覆盖展示内容，期间显示稳定骨架屏；因此接受本地演示中的短暂恢复状态。新建项目的公开详情页同样在客户端按 slug 查找，找不到时进入项目未找到状态。

## 6. 技术架构

### 6.1 推荐依赖

- Next.js + React + TypeScript strict
- Tailwind CSS + shadcn/ui
- `react-hook-form` + `zod` + `@hookform/resolvers`
- `zustand`，用于编辑态和跨页面 UI 状态
- `@dnd-kit/core` + `@dnd-kit/sortable`，用于排序
- `lucide-react`，用于按钮和状态图标
- Vitest + Testing Library + jsdom
- Playwright
- ESLint + Prettier
- GitHub Actions

### 6.2 分层原则

```text
app/                 路由、页面和 Next.js 边界
components/          领域组件和可复用 UI 组件
features/projects/   项目列表、详情、表单、排序功能
lib/repository/      数据访问接口与 localStorage 实现
lib/validation/      Zod schema
stores/              Zustand store
types/               领域模型和 API 契约
data/                JSON fixtures
tests/               单元、组件和 E2E 测试
```

组件依赖 `features`，页面组合 `features`；数据访问、校验和领域类型不能散落在页面组件中。UI 组件只处理展示和交互，不直接读写 localStorage。

### 6.3 Server/Client 边界

- 页面默认使用 Server Component，负责读取 fixture、生成 metadata 和输出首屏内容。
- 需要浏览器 API、表单、拖拽、toast 或 Zustand 的部分使用 Client Component。
- `localStorage` 只能在客户端 repository 中访问，禁止在 Server Component 或模块初始化阶段直接读取。
- 为避免 hydration 不一致，客户端持久化状态需要在挂载后恢复；恢复前显示稳定的 loading/skeleton 状态。
- 初始数据和本地数据使用版本号管理，未来 schema 变化通过 migration 函数处理。

## 7. 数据模型

```ts
type PortfolioData = {
  version: 1;
  profile: Profile;
  projects: Project[];
  updatedAt: string;
};

type Profile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  skills: Skill[];
  links: ExternalLink[];
};

type Project = {
  id: string;
  slug: string;
  title: string;
  category: "workbench" | "community" | "media" | "other";
  summary: string;
  featured: boolean;
  published: boolean;
  order: number;
  timeRange: string;
  stack: string[];
  role: string[];
  outcomes: string[];
  challenges: Challenge[];
  quality: QualityEvidence;
  evidence: Evidence;
  links: ExternalLink[];
  updatedAt: string;
};
```

`Project` 以展示和叙事为中心，不在 MVP 中模拟任务、评论或复杂关系表。每个 fixture 至少包含 TaskFlow、RedditLike 和 U-s-cinema 三个项目，内容来自个人简历但需经过适合公开展示的精简和脱敏处理。

`Evidence` 至少包含以下内容：

- `heroImage`：项目精选主图。
- `gallery`：按功能分组的截图画廊。
- `architectureDiagram`：Mermaid 源文本及图示说明。
- `routeCount`：可核验的主要页面/路由数量。
- `moduleCount`：可核验的核心业务模块数量。
- `highlights`：每个项目 2-3 个关键难点，每项包含问题、决策、实现和结果。

量化信息只记录页面/路由数量和核心业务模块数量，不虚构性能、用户量、覆盖率或商业结果。项目外链优先使用真实 GitHub 仓库和仍可访问的在线演示；无法确认可用性的链接不展示。

### 7.1 本地持久化协议

- 初始数据：`data/portfolio.json`。
- 存储键：`portfolio-data:v1`。
- 读取顺序：localStorage 有有效数据时使用本地数据，否则使用 fixture。
- 写入策略：表单保存和排序完成后整体写入，并更新 `updatedAt`。
- 数据损坏：解析失败时回退 fixture，并显示可恢复提示。
- 恢复操作：删除本地数据并重新加载 fixture，必须有二次确认。
- 恢复范围：项目正文、项目顺序、公开状态、个人资料和其他作品集数据全部恢复为 fixture。

## 8. 状态管理

- 服务端数据：首屏展示使用 fixture/repository 读取。
- 作品集数据：使用 Zustand 管理客户端当前数据、初始化状态、保存状态和错误状态。
- URL 状态：筛选条件只放在 query string，使用 `searchParams` 读取并通过 `router.replace` 更新。
- 表单状态：由 React Hook Form 管理，不复制到全局 store；保存成功后再同步 store。
- 临时 UI 状态：抽屉、确认弹窗、toast 和当前拖拽项保持在局部组件状态。
- 首页主标题固定为“前端开发工程师”，副标题强调独立完成复杂产品的能力。
- 公开联系方式使用脱敏占位；MVP 不放真实电话、邮箱或联系表单。
- 公开项目详情提供桌面端目录锚点，章节至少包括概要、实现、质量和复盘；移动端保留可滚动锚点但不占据固定侧栏。

## 9. UI 与交互规范

视觉方向为“编辑部档案感”：白底或低饱和中性色为主，使用一处明确的强调色，突出项目证据和阅读层级，避免营销式大 Hero 和装饰性卡片堆叠。首页首屏由“前端开发工程师”定位、简短能力摘要和 TaskFlow 精选主图组成，必须在首屏传达独立完成复杂产品的信号。

- 使用 shadcn/ui 的 Button、Input、Textarea、Select、Dialog、Badge、Tabs、Toast、Skeleton 和 Alert。
- 项目卡片是重复内容的独立 card；页面区块使用完整宽度的 band 或无框布局，不嵌套 card。
- 图标按钮使用 Lucide，并为仅图标操作提供 tooltip 和 `aria-label`。
- 所有表单控件具备 label、错误提示、键盘访问和提交中禁用状态。
- 移动端管理列表改为单列；拖拽排序提供“上移/下移”按钮兜底。
- 外部链接明确标记新窗口打开，并使用 `rel="noreferrer"`。
- 图片使用 Next Image；无图片、加载失败和未知尺寸均有稳定占位。
- 项目详情采用“精选主图 + 图片画廊”结构；画廊优先展示 TaskFlow 工作台和 RedditLike 社区流，并可包含桌面端/移动端对比及异常状态截图。
- 架构图和数据流图使用 Mermaid 源文件保存并渲染，源文件纳入版本控制，不把不可编辑的图片作为唯一来源。

## 10. 测试策略

### 10.1 单元测试（Vitest）

- Zod schema：必填项、非法 slug、无效 URL、边界长度。
- repository：初始化、读写、损坏 JSON 回退、恢复 fixture、版本迁移。
- 纯函数：项目排序、筛选、slug 查找和公开项目选择。
- Zustand store：新增、编辑、删除、发布状态、排序和错误恢复。

### 10.2 组件测试（Testing Library）

- 项目筛选改变 URL 参数并正确更新列表。
- 项目详情展示缺失字段时仍保持结构完整。
- 主图、画廊、架构图和证据字段缺失时显示明确的空状态，不影响其他章节阅读。
- 表单错误正确关联字段，合法提交后保存并反馈成功。
- 删除确认、取消、保存中禁用和空列表状态。
- 排序操作更新列表顺序，并保留可访问的键盘操作。

### 10.3 E2E（Playwright）

至少覆盖两条主流程：

1. 招聘者从首页筛选项目，进入 TaskFlow 详情并打开 GitHub/在线地址。
2. 作者进入管理端，编辑项目摘要，拖拽调整顺序，刷新后确认公开首页显示更新结果。

测试使用独立 browser context 和清理后的 localStorage，避免测试之间共享数据。

## 11. 代码质量与 CI

本地提交前至少执行：

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:run
pnpm test:e2e
pnpm build
```

GitHub Actions 在 push 和 Pull Request 执行同一组质量门禁。CI 失败时禁止合并。推荐提交格式为 `feat`、`fix`、`test`、`docs`、`refactor`，每次提交保持单一意图。

## 12. 开发计划

### 第 1 周：骨架与公开端

- 初始化 Next.js、TypeScript strict、Tailwind、shadcn/ui、ESLint、Prettier。
- 建立目录边界、类型、fixture 和基础 layout。
- 完成首页、项目卡片、详情页、not-found、error 和响应式基础布局。

### 第 2 周：数据层与管理端

- 实现 repository、localStorage 版本协议和 Zustand store。
- 完成管理列表、新建/编辑表单、Zod 校验和保存反馈。
- 完成公开/隐藏状态和本地数据恢复。

### 第 3 周：复杂交互与测试

- 接入拖拽排序和移动端上移/下移兜底。
- 完成 query 筛选、加载/空/错误状态和可访问性检查。
- 编写单元、组件和两条 Playwright 主流程测试。

### 第 4 周：工程收尾与展示

- 配置 GitHub Actions、生产构建和测试报告。
- 优化移动端、键盘操作、metadata、链接和视觉细节。
- 编写 README、架构说明、技术决策记录和项目复盘。

## 13. 验收标准

- `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test:run`、`pnpm test:e2e` 和 `pnpm build` 全部通过。
- 招聘者不进入管理端即可完成首页到项目详情的浏览闭环。
- 管理者可以新增、编辑、删除、发布/隐藏和排序项目。
- TaskFlow 是首页唯一首推项目；其他已发布项目可在完整列表中访问。
- 编辑或排序后刷新页面，数据仍然存在；恢复操作可以回到 fixture 初始状态。
- 新建项目保存后默认为草稿，不会出现在公开页，显式发布后才可访问。
- 不存在的项目显示友好的 not-found 页面，数据损坏不会导致应用白屏。
- 公开联系方式为脱敏占位，真实联系方式不进入 fixture 和提交历史。
- 桌面端和移动端无横向溢出，主要流程可使用键盘完成。
- README 能说明本地启动、架构边界、测试命令、已知限制和后续计划。

## 14. 风险与后续路线

### 风险

- localStorage 只适合演示，不提供跨设备同步、并发控制或真实权限。
- 公开页与管理页共享本地数据，换浏览器或清理站点数据会丢失修改。
- 拖拽库会增加交互复杂度，需要保证键盘替代操作和测试稳定性。
- 作品集内容质量直接影响展示效果，应在开发时同步完善项目叙事，而不是最后再填数据。

### 后续路线

1. 将 repository 替换为 Next.js Route Handler + Supabase，并加入 Auth 与 RLS。
2. 增加 Markdown 项目复盘、草稿/发布和版本历史。
3. 增加简历版本管理、面试问答和求职跟踪模块。
4. 增加访问统计、SEO、Open Graph 预览和部署到 Vercel。
5. 增加项目指标、测试覆盖率和性能数据的自动采集或手动录入。

## 15. 面试表达重点

项目完成后应能围绕以下问题准备简短说明：

- 为什么公开页使用 Server Component，而管理表单使用 Client Component？
- 为什么筛选状态放在 URL，编辑状态不放在 URL？
- 如何处理 localStorage 与服务端首屏之间的 hydration 不一致？
- 如何保证拖拽排序、删除和编辑不会产生丢失更新？
- 为什么先用 repository + fixture，而不是直接把 localStorage 写进组件？
- 测试如何覆盖真实用户流程，哪些逻辑不值得通过 E2E 测试？
- 如果接入真实后端，哪些接口、数据模型和权限边界需要改变？
