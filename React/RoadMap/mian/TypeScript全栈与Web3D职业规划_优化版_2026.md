# TypeScript 全栈与 Web 3D 职业规划（优化版，2026）

> 制定日期：2026-07-17  
> 修订日期：2026-07-17（唯一执行版声明；每天 6h / 每周约 40h；Gate A min/full；落后熔断；Cinema 影廊开工门禁；Gate B 作品集聚合）  
> 近期目标：持续投递前端岗位，10–12 周形成前端偏全栈 + Web 3D 的新增证据  
> 中期目标：1–2 年内成为以前端体验为优势、能独立交付 Node/PostgreSQL 服务的全栈工程师  
> 长期特色：React/TypeScript 工程能力 + Three.js/WebGL + 数据可视化/UI 工程  
> **时间基线：每天约 6 小时有效学习，每周约 40 小时（含投递与复盘）**

### 文档地位（唯一执行版）

| 文档 | 用途 |
| --- | --- |
| **本文** `mian/TypeScript全栈与Web3D职业规划_优化版_2026.md` | **当前唯一执行主文档**：按周交付、WIP、门禁与验收以本文为准 |
| `TypeScript全栈职业规划与学习路线_2026.md` 等旧长文 | **概念/附录参考**（技术栈背景、面试清单）；与本文冲突时 **以本文为准**，避免双源执行 |

---

## 1. 核心结论

你的路线不应该是“暂停前端，集中转后端”，而应该是：

> **持续强化 React/TypeScript 前端，把 WebGL/Three.js 作为前端特色，同时用 Node.js/PostgreSQL 扩大交付边界。**

三个现有项目承担不同职责：

| 项目 | 唯一主职责 | 新技能落点 |
| --- | --- | --- |
| **TaskFlow** | 全栈主项目 | Fastify、PostgreSQL、Prisma、Session、测试、CI、部署 |
| **RedditLike** | 高级业务前端 | React 19、Tailwind 4、shadcn/ui 试点、实时交互体验、性能、a11y、组件测试 |
| **U-s-cinema** | Web 3D 代表作 | TypeScript strict、WebGL/Three.js、R3F/Drei、3D 海报影廊、性能降级、可访问替代视图 |

不再建立第四个同质业务项目，也不再建立与 cinema 脱节的长期 Three.js demo 仓库。学习阶段可以在 cinema 内设置 `/lab/three` 开发路由，但最终能力必须进入真实产品流程。

## 2. 当前仓库基线

根据 2026-07-17 的本地项目状态：

### RedditLike

- 当前分支：`SecBranch`。
- React 19 + TypeScript + Vite。
- 已安装 Tailwind CSS 4，并正在把设计 token 和组件样式迁移到 Tailwind。
- 使用 Convex、Clerk 和实时数据能力。
- 当前 `package.json` 没有测试脚本，也未看到 Testing Library/Playwright 配置。

因此 RedditLike 下一步不是重新搭 Tailwind，而是完成组件级迁移策略、交互可靠性、测试、可访问性和性能证据。

### U-s-cinema

- 当前分支：`SecBranch`。
- 当前检出的源码仍以 `.jsx/.js` 为主，`package.json` 未包含 TypeScript、测试或 Three.js 依赖。
- 这与简历中“已迁移 TypeScript strict”的描述不一致。

开始改造前必须先完成仓库核对：

1. 确认 TypeScript 版本是否存在于另一仓库、分支或尚未同步的本地目录。
2. 选择唯一主仓与主分支，将可部署版本合并为事实来源。
3. 如果确实没有 TypeScript 版本，再按本路线渐进迁移。
4. 在代码与构建证据一致前，不在简历中使用“已完成 strict 迁移”的表述。

## 3. 固定技术决策

减少反复选型，10–12 周内固定如下：

### 全栈主线

- 前端：React + Next.js + TypeScript。
- API：Fastify + TypeScript；Next.js Route Handler 只做 BFF、Webhook 或 Next 内部接口。
- 数据库：PostgreSQL。
- ORM：Prisma；先写和理解关键 SQL，再通过 Prisma 完成工程实现。
- 校验：Zod + Fastify 对应的 Type Provider，只维护一份核心输入 Schema。
- 认证：数据库 Session + `HttpOnly` Cookie + Argon2 密码哈希。
- 测试：Vitest、Fastify `inject`、真实 PostgreSQL 集成测试、Playwright 主流程。
- 部署：最小线上部署优先；Docker 深挖放在 Gate B 后。

### 前端主线

- RedditLike：保留 Convex/Clerk，不为“自建后端”重写已有实时能力。
- RedditLike：继续 Tailwind 4；shadcn/ui 只替换交互复杂且能受益的组件。
- Cinema：保留现有业务 UI 和 Context 边界，不做 Tailwind 全站重写。
- Cinema：Three.js 基础后使用 React Three Fiber + Drei 产品化。
- 3D 路由独立懒加载，DOM 页面始终保留，WebGL 不是核心功能的唯一入口。

### 明确后置

- Go、Python、Java 第二语言。
- Redis、BullMQ、Kafka、微服务、Kubernetes。
- 原生 WebGPU/WGSL。
- 完整 3D 编辑器、物理引擎和大型数字孪生。
- RedditLike 从 Convex 迁出、Cinema 全站 UI 重写。

## 4. 执行规则：前端不会被后端挤掉

### 4.1 每周工作在制品限制

每周最多有两个“功能型目标”：

1. TaskFlow 一个端到端纵向切片。
2. RedditLike **或** Cinema 的一个前端改进目标（二选一主改造）。

RedditLike 与 Cinema **按双周轮换**做主改造，避免三套项目每天切换。非主改造项目当周只允许：学习笔记、复盘、lint/build 修复或 ≤1 小时小 bugfix。

**即使每天 6h、每周约 40h，仍遵守 WIP=2 与双周轮换**——多余时间优先用于：闭合未完成切片、补测试/部署、投递与口述，**禁止**变成「三项目每天各做一点」。

### 4.2 时间基线：每天约 6h · 每周约 40h

| 内容 | 每周约 | 每天约（示意） | 说明 |
| --- | ---: | ---: | --- |
| 投递、沟通、面试复盘 | 7h | 1h（可集中 3–4 天各 1.5–2h） | 从第一周持续；面试周可临时加重 |
| TaskFlow 全栈纵向切片 | 14h | 2–2.5h | 后端与对应前端必须一起交付 |
| 轮值前端主改造（RedditLike **或** Cinema） | 8h | 1–1.5h | 双周只深做一个；另一项目不扩 scope |
| JS/TS/React/CSS/浏览器基础（F1） | 5h | 0.75–1h | 前端面试主场，不断档 |
| 算法与项目口述 | 4h | 0.5–0.75h | 常见中等以下；有笔试周可提到 6–7h/周（从轮值非 P0 借，不从 TaskFlow 未闭合切片借） |
| 缓冲、BASELINE 更新、周复盘 | 2h | — | 建议放周日半天 |
| **合计** | **约 40h** | **约 6h/天 × 6–7 天** | 含 1 个半天轻量日亦可 |

**每日 6h 推荐拆分（工作日）：**

| 块 | 时长 | 内容 |
| --- | ---: | --- |
| A | 2–2.5h | TaskFlow 纵向切片（API + 页面闭环优先） |
| B | 1–1.5h | 当周轮值：RedditLike **或** Cinema |
| C | 0.75–1h | F1 前端基础 / 面试题 |
| D | 0.5–0.75h | 算法 或 项目口述 |
| E | 0.5–1h | 投递 / 跟进 / 简历（可隔日加长） |
| 收尾 | 10–15min | 记录：今日切片进度 + 前端/3D 产出 |

**轻量日（每周建议 0.5–1 天）：** 投递 + 复盘 + 修 CI/文档，不新开功能。

**若某周实际只有约 20–25h：** 投递 4h、TaskFlow 10h、轮值前端 5h、F1 3h、算法 2h、复盘 1h；砍缓冲与「锦上添花」UI。

**若某周实际只有约 15h：** 投递 3h、TaskFlow 6h、轮值前端 4h、F1 1.5h、复盘 0.5h；算法可暂缓。

### 4.3 纵向切片原则

TaskFlow 不再连续 10 周只写后端，然后才接前端。每个切片必须尽量包含：

> 页面操作 → 请求校验 → API → PostgreSQL → 响应状态 → UI 反馈 → 至少一个测试

例如“创建任务”切片完成后，必须能够从浏览器实际创建、看到错误状态、刷新后仍存在，而不是只有 Postman 响应。

### 4.4 落后熔断（强制）

当进度落后时 **自动缩 scope**，而不是靠延长工时硬扛三线：

| 触发条件 | 熔断动作 | 恢复条件 |
| --- | --- | --- |
| TaskFlow 纵向切片连续 **2 周** 未闭合（页面未真读写或无测试） | 暂停 RedditLike **功能型**改造；Cinema 仅保留 lab 最小增量或当周轮值也暂停 | 该切片从浏览器闭环 + 至少 1 个测试通过 |
| 已到 **第 9 周** 但 Cinema 影廊仍未上线可点开版本 | 砍视觉/资产美感；只保「选中 → 详情/收藏」+ 基础降级 + 懒加载 | 公网或稳定预览链接可演示 60s |
| 当周有 **正式面试 / 笔试** | TaskFlow 只修阻塞 bug 与演示；轮值前端以口述材料与小修复为主；不新开 shadcn/大场景 | 面试结束次周恢复 WIP=2 |
| Cinema **主仓/TS 事实未核对完成** | 禁止写简历「TS strict 已完成」；禁止开工影廊 v1（见 §5.1） | BASELINE 写明唯一主仓与可验证 build |
| Gate A-min 已达成但 **A-full（在线）** 卡住超过 **10 天** | 停止 RedditLike 新功能；本周 TaskFlow 只做托管/环境/演示账号 | 在线演示可访问或明确记录阻塞原因与绕过方案 |
| 连续 **3 天** 无任何前端 F1/轮值产出 | 次日块 A 减为 1.5h，强制 2h 前端（F1 或轮值） | 恢复每日前端记录 |

熔断期间仍保持：投递不中断；WIP 仍 ≤2。

## 5. 阶段零：2–3 天（必要时延长到 5 天），统一事实来源

### 目标

消除仓库、分支、简历和线上演示之间的不一致，建立后续改造基线。

### TaskFlow

- 确认当前可部署分支、Appwrite 模式和 Demo 模式。
- 列出需要迁移的功能，不在第一阶段追求一次替换全部 BaaS。
- 画出当前数据流和目标数据流。

### RedditLike

- 记录 Tailwind 已迁移组件和仍使用独立 CSS 的组件。
- 运行 build/lint，记录基线。
- 用 React DevTools Profiler 记录 Feed/PostCard 的一次基线交互。

### Cinema

- 查找 TypeScript 版本真实位置，确定唯一主仓。
- 记录 build/lint、主要页面和 Context 数据边界。
- 检查线上演示与当前源码是否一致。

### 小目标与验收

- 三个项目各有一页 `BASELINE.md` 或 Issue 清单。
- 简历中的技术与当前可验证代码一致。
- 每个项目只有一个接下来要做的 P0 目标。

### 5.1 Cinema 影廊开工门禁（必须全部满足）

在进入 **阶段四「3D 海报影廊 v1」**（约第 7–9 周）之前，下列条件必须满足；**任一不满足则禁止扩大 3D 产品路由 scope**（`/experience` 或 `/cinema-3d` 仅可在门禁通过后作为正式交付目标）：

| # | 门禁项 | 证据 |
| --- | --- | --- |
| 1 | 唯一主仓与主分支已写入 Cinema `BASELINE.md` | 路径、远程、分支名 |
| 2 | 可部署/可 build 的事实来源已确定 | `build`（及现有 lint）命令可复现 |
| 3 | TypeScript 状态已核对 | 已有 TS 主仓并合并 **或** 已启动 strict 渐进迁移且核心模型有计划 |
| 4 | 简历表述与代码一致 | 未完成 strict 前 **不写**「已完成 TypeScript strict 迁移」 |
| 5 | 业务 Context 边界已记录 | 收藏/想看/详情数据从何处来、3D 将如何复用而非复制 |
| 6 | lab 最小场景已跑通 | `/lab/three`（或等价）可运行、可 resize、可清理 |

**门禁通过前允许：** `/lab/three` 内 Three 基础、拾取、小型 glTF 实验。  
**门禁通过前禁止：** 正式影廊路由当作品集主承诺、批量贴图资产、为 3D 重写整站 UI。

阶段零若发现 TS 版本在其他分支/目录，优先合并为唯一事实来源，**宁可把阶段零延长到 5 天**，也不要在错误仓库上堆 Three。

## 6. 阶段一：第 1–2 周，前端质量基线 + 第一个全栈切片

### TaskFlow：任务读取与创建

- PostgreSQL 建立 `users`、`tasks`、`tags` 及必要约束。
- Fastify 完成任务列表与创建接口。
- Zod 校验标题、日期、优先级和标签输入。
- 前端实际读取列表和创建任务。
- 覆盖成功、非法输入、数据库约束失败三类测试。

### RedditLike：测试与 UI 迁移规则

- 配置 Vitest、Testing Library、`user-event` 和 `jsdom`。
- 先测试 `SearchBar`、`PostCard` 或 `CreateCommunityModal` 中两个最关键交互。
- 建立 Tailwind 迁移规则：设计 token 统一，组件逐个迁移，不混合重复的颜色/间距来源。
- shadcn/ui 只做评估，暂不批量安装组件。

### Cinema：WebGL 基础进入项目

- 完成仓库/TypeScript 状态确认。
- 在不影响正式路由的 `/lab/three` 中加入最小场景：Scene、Camera、Renderer、Mesh、Material、Light。
- 处理窗口 resize、动画循环停止和资源清理。
- 为不支持 WebGL 的环境显示 DOM 提示。

### 前端学习内容

- React 渲染触发、状态快照、Effect 边界、受控组件。
- TypeScript 判别联合、类型收窄、泛型和 `unknown`。
- CSS 层叠、Flex/Grid、响应式、焦点状态。
- 浏览器渲染流水线、`requestAnimationFrame` 和长任务。

### 阶段验收

- TaskFlow 可以从页面读取和创建 PostgreSQL 中的真实任务。
- RedditLike 至少有 4–6 个稳定组件测试。
- Cinema 最小 Three.js 场景可运行并正确清理。
- 继续投递前端岗位，没有等待 Gate B。

### 资源

- [React Learn](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Testing Library](https://testing-library.com/docs/)
- [Vitest](https://vitest.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Node.js Learn](https://nodejs.org/en/learn)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Fastify Getting Started](https://fastify.dev/docs/latest/Guides/Getting-Started/)
- [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals)
- [MDN WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

## 7. 阶段二：第 3–4 周，认证切片 + Cinema 类型与 Three 基础

### TaskFlow：固定认证方案

- Argon2 哈希密码。
- PostgreSQL 保存 Session。
- `HttpOnly`、`Secure`、`SameSite` Cookie。
- 注册、登录、退出、当前用户接口。
- 前端登录状态、错误提示和受保护页面。
- 用户只能读取自己的任务。

JWT 只学习对比，不在 TaskFlow 再实现第二套认证。

### Cinema：先建立可维护基线

本阶段 **优先满足 §5.1 门禁中的主仓与 TypeScript 事实**；Three 只在 lab 做可控增量。

如果唯一主仓仍是 JavaScript：

- 添加 TypeScript strict 配置。
- 优先迁移 `movieFormatters`、常量、API 响应、Movie 类型和 Context 核心。
- 页面允许渐进迁移，不要求一次把所有 `.jsx` 改完。
- 为 API 转换、localStorage 兼容和观看状态补测试。
- **不要**在本阶段同时做 Tailwind 全站迁移或正式影廊路由。

Three.js 学习继续落在 `/lab/three`（门禁通过前不上正式影廊）：

- 坐标系、PerspectiveCamera、Group/Object3D。
- Texture、颜色空间、光照和阴影边界。
- Raycaster 点击拾取。
- 加载一个小型 glTF/GLB，并显示加载/错误状态。

### RedditLike：保持维护，不扩大范围

- 修复阶段一测试暴露的问题。
- 完成一个复杂交互组件的 Tailwind 迁移。
- 不在本阶段同时引入 shadcn、Storybook 和 E2E。

### 阶段验收

- TaskFlow 能阻止未登录和跨用户访问。
- Cinema 核心数据模型进入 TypeScript strict，或已确认现成 TS 主仓并完成合并。
- Cinema 能加载 glTF，点击对象能更新 React/DOM 信息区。
- 能口述 Session、Cookie、CSRF、XSS 和资源归属校验。

### 资源

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Zod](https://zod.dev/)
- [Three.js Scene Graph](https://threejs.org/manual/#en/scenegraph)
- [Three.js Load glTF](https://threejs.org/manual/#en/load-gltf)
- [Three.js Picking](https://threejs.org/manual/#en/picking)
- [Khronos glTF](https://www.khronos.org/gltf/)

## 8. 阶段三：第 5–6 周，Gate A + RedditLike 高级前端

### TaskFlow：可展示 Gate A（分 min / full）

- 补全编辑、删除、筛选和 Offset 分页。
- 前端接通这些能力，完成 loading/error/empty 和表单错误。
- 数据迁移、Seed、README、ER 图和请求链路图。
- API 核心路径 8–12 个测试。
- **在线演示按 Gate A-full 要求，允许比 A-min 晚 1–2 周**（见下表），避免第 6 周被托管卡住而停掉 RedditLike/Cinema。

### RedditLike：Tailwind/shadcn、实时 UX、a11y

根据当前结构，优先处理：

- `CreateCommunityModal`：可使用 shadcn `Dialog`，验证焦点圈定、Esc、标题语义和关闭后焦点恢复。
- `CreateDropdown`：可使用 `DropdownMenu`，完善键盘操作。
- mutation 反馈：使用现有方案或 `Sonner`，统一成功/失败/处理中状态。
- `Feed/PostCard`：处理 skeleton、空状态、图片懒加载、重复提交和投票 pending 状态。
- Convex 实时更新到达时，避免覆盖用户正在进行的本地交互。

shadcn/ui 的目的不是增加关键词，而是减少复杂交互错误。普通布局和业务卡片继续使用 Tailwind 与自有组件。

### RedditLike 测试目标

- PostCard 投票切换与禁用状态。
- SearchBar 输入、提交和无结果反馈。
- Modal 键盘与焦点行为。
- Comments loading/empty/error。
- 至少一个 Convex Hook 边界测试或替身策略。

### 阶段验收：Gate A-min 与 Gate A-full

| 级别 | 最晚目标时间 | TaskFlow 标准 | 用途 |
| --- | --- | --- | --- |
| **Gate A-min** | **第 6 周末** | 本地一键启动（或文档清晰的启动步骤）+ 迁移/Seed + **浏览器真读写** CRUD/筛选 + 核心 8–12 测试 + README/ER/链路图 | 可对外说「全栈切片已通」；简历可写自建 API/PG（诚实描述部署状态） |
| **Gate A-full** | **最晚第 7–8 周末** | 在 A-min 之上增加：**公网或稳定预览可访问** + 演示数据/账号说明 | 作品集链接级；投递全栈向时优先展示 |

**共同仍要求（第 6 周）：**

- RedditLike 至少一个 shadcn 复杂组件真正替换成功，而非全站套模板。
- RedditLike 具备约 10 个有价值的组件/交互测试。
- 能用 3 分钟分别讲 TaskFlow 全栈切片和 RedditLike 实时 UX 改进。
- Cinema：主仓/TS 状态明确；lab 或 glTF 实验可用（影廊 v1 仍在阶段四，且须过 §5.1 门禁）。

**说明：** 第 6 周未完成 A-full **不算路线失败**；触发 §4.4 中「A-full 卡住」熔断，优先补在线而非开新功能。

### 资源

- [shadcn/ui Vite](https://ui.shadcn.com/docs/installation/vite)
- [WAI-ARIA APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Convex Optimistic Updates](https://docs.convex.dev/client/react/optimistic-updates)
- [Convex Pagination](https://docs.convex.dev/database/pagination)
- [web.dev Accessibility](https://web.dev/learn/accessibility/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Fastify Testing](https://fastify.dev/docs/latest/Guides/Testing/)

## 9. 阶段四：第 7–9 周，安全闭环 + Cinema 3D 影廊 v1

### TaskFlow：Gate B 核心

- 完成所有任务接口的用户归属校验。
- 登录限流、统一认证错误、敏感日志检查。
- PostgreSQL 集成测试覆盖唯一约束、外键和事务回滚。
- Playwright 覆盖登录 → 创建 → 筛选 → 删除主流程。
- CI 运行 lint、typecheck、unit/integration、E2E 和 build。

### Cinema：从实验路由进入真实产品

**开工前再次确认 §5.1 影廊开工门禁全部勾选。** 未通过则本阶段 Cinema 只做 lab 巩固与 TS 核心迁移，不承诺影廊上线。

新增懒加载的 `/experience` 或 `/cinema-3d` 路由，完成 **3D 海报影廊 v1**：

- 使用 R3F `Canvas` 管理 Three.js 场景。
- 展示 8–12 张电影海报平面或少量可复用展板（资产不足可先用占位平面 + 海报图）。
- 点击/键盘选择海报后，将 `movieId` 同步给现有电影详情或信息面板。
- 可直接加入收藏、想看或更新观看状态，复用现有 Context，而不是复制状态系统。
- 使用 Suspense/进度反馈处理资源加载。
- 3D 路由单独代码分割，不增加普通首页首屏负担。

### Cinema 必须提供的降级

- 无 WebGL：显示普通电影网格。
- 移动端/低性能设备：减少对象、限制 DPR、关闭重阴影或动画。
- `prefers-reduced-motion`：停止自动运动，保留显式控制。
- 屏幕阅读器：提供与 3D 内容等价的 DOM 电影列表和当前选择说明。
- 加载失败：保留普通详情和收藏功能。

### 阶段验收

- TaskFlow 主流程 CI 通过，越权测试有效。
- Cinema 3D 影廊在线可访问，选择能进入现有业务流程。
- 3D 功能关闭或失败时，浏览/详情/收藏仍可使用。
- 能解释 Three.js Scene/Camera/Renderer 与 R3F/React 状态之间的边界。

### 资源

- [React Three Fiber Introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Drei](https://drei.docs.pmnd.rs/)
- [R3F Loading Models](https://r3f.docs.pmnd.rs/tutorials/loading-models)
- [React lazy](https://react.dev/reference/react/lazy)
- [Three.js Responsive Design](https://threejs.org/manual/#en/responsive)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Playwright](https://playwright.dev/docs/intro)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 10. 阶段五：第 10–12 周，Gate B + 三项目作品集闭环

### TaskFlow：全栈案例

- 线上演示、演示账号或安全 Demo 模式。
- 本地一键启动说明、数据库迁移和 Seed。
- README 包含问题、架构、数据模型、安全、测试、部署和取舍。
- 准备 5 分钟完整请求链路和 10 分钟项目深挖。

### RedditLike：性能与工程证据

- 使用 React Profiler 对 Feed/PostCard 做真实测量。
- 检查无效渲染、图片加载、列表分页和路由包体积。
- 只有测量证明需要时才引入虚拟列表或复杂 memo。
- 路由级懒加载，完善错误边界与移动端状态。
- 增加 CI，至少执行 lint、typecheck、test、build。
- 记录一次性能或交互可靠性改进前后对比。

### Cinema：3D 性能与产品化

- `Canvas` 设置合理 DPR 上限，按需使用 `frameloop="demand"`。
- 限制同时展示的高清纹理数量；列表使用合适尺寸海报。
- 路由退出后释放 geometry、material、texture 和监听器。
- 为 3D chunk、纹理、模型大小建立预算并记录构建结果。
- 对场景选择 → 详情 → 收藏流程增加一个 Playwright 测试；无法稳定驱动 Canvas 时，对 DOM 状态桥接进行测试。
- README 说明 3D 设计目的、降级策略和性能取舍。

### Gate B 验收

#### TaskFlow

- 在线演示：必须。
- 一键本地启动：必须。
- Session、资源归属、集成测试和 E2E：必须。

#### RedditLike

- Tailwind 迁移边界清晰，没有 Tailwind/CSS token 双重冲突。
- 复杂交互满足键盘和焦点要求。
- 测试、CI 和至少一项有测量的性能改进可展示。

#### Cinema

- TypeScript 状态与简历一致。
- 3D 影廊在线可用，不影响普通电影页面。
- 有加载、错误、低性能和无 WebGL 降级。
- 能用 60–90 秒完成稳定演示。

#### 作品集聚合（Gate B 必须，个人站）

在个人站（如 `www.uon1ra.top`）或等价单页汇总，**三个项目各一条可点击链路**，避免面试官只拿到散落的 GitHub：

| 区块 | 必须包含 |
| --- | --- |
| **TaskFlow** | 在线演示 URL、仓库、演示账号/Demo 模式说明、一句话全栈证据 |
| **RedditLike** | 在线演示（若有）或清晰本地启动 + 仓库、一句话实时/交互证据 |
| **Cinema 3D** | 影廊路由直达链接、仓库、降级说明一句话 |
| **60 秒演示脚本** | 每项目各一份（见下），可放在个人站或各 README 顶部 |

**60 秒演示脚本（建议原文写进 README）：**

1. **TaskFlow（约 60s）：** 登录 → 创建任务 → 筛选/刷新仍在 → 指出「PG + Session + 自建 API」边界（可打开 Network 一眼）。  
2. **RedditLike（约 60s）：** 打开 Feed → 投票或发帖看实时/状态反馈 → 打开一处 Modal 演示键盘/焦点或测试/CI 证据。  
3. **Cinema 3D（约 60–90s）：** 进入影廊路由 → 选择一张海报 → 详情/收藏闭环 → 快速说明无 WebGL 或低性能时的降级路径。

Gate B 检查清单勾选：**个人站三链齐全 + 三份脚本可照着念**，才视为作品集闭环完成。

### 资源

- [React Profiler](https://react.dev/reference/react/Profiler)
- [web.dev Performance](https://web.dev/learn/performance/)
- [R3F Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [R3F Performance Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- [Three.js Cleanup](https://threejs.org/manual/#en/cleanup)
- [MDN WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [GitHub Actions](https://docs.github.com/en/actions)

## 11. Gate B 后：第 4–6 个月

获得 Offer 或稳定面试流后，再进入深挖。

### TaskFlow

- Docker Compose、健康检查、结构化日志、请求 ID。
- Sentry 错误追踪。
- `EXPLAIN ANALYZE`、索引和慢查询优化。
- 迁移回滚、备份与恢复演练。

### RedditLike

- 基于真实数据量优化分页、Feed 与评论树。
- 为关键 UI 建立组件文档；Storybook 只有在组件复用确实增加时再引入。
- 对 Convex 实时模型形成一篇架构复盘：响应式查询、索引、乐观更新、并发计数及边界。
- 不为“证明后端”迁出 Convex。

### Cinema

- 使用 Blender 制作一个低多边形影院/展台资产。
- 建立 Blender → glTF/GLB → 压缩 → 加载 → 性能验证的资产管线。
- 学习 Instancing、LOD、贴图压缩与按需渲染。
- 3D 场景增加热点、主题切换或时间轴，但仍与电影浏览功能相关。

### 资源

- [Docker Get Started](https://docs.docker.com/get-started/)
- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [Sentry Node.js](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Blender glTF Export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [glTF Transform](https://gltf-transform.dev/)
- [Three.js Optimize Lots of Objects](https://threejs.org/manual/#en/optimize-lots-of-objects)

## 12. 第 7–12 个月：根据工作选择一条主深化方向

### 方向 A：全栈 Web 3D

适合你仍然强烈喜欢 Three.js/Blender 时：

- Cinema 增加服务端用户影廊配置、场景主题和资产元数据。
- 对象存储 + CDN 管理模型和纹理。
- Worker 生成缩略图、检查资产或导出分享图。
- 形成全栈 3D 展陈/运营作品，而不是纯视觉 demo。

### 方向 B：高级业务前端 + 可视化

适合实际工作更偏数据产品时：

- RedditLike 或 TaskFlow 增加有真实指标口径的分析页面。
- ECharts 负责标准业务图表，D3 负责一项定制交互。
- 深入设计系统、复杂表单、性能与可访问性。

### 方向 C：Node.js 服务端深化

适合工作中已经频繁承担后端职责时：

- Redis、BullMQ、SSE/WebSocket 按真实需求引入。
- 学习事务隔离、并发更新、幂等、限流和可观测性。
- Go 只在目标岗位或工作需要明确时开始。

一次只选择一个主深化方向，另外两个保持维护。

## 13. 两个前端项目的明确完成定义

### RedditLike 完成定义

- Tailwind 4 token 和组件迁移规则清晰。
- shadcn/ui 只用于 Dialog/Dropdown/Toast 等复杂交互。
- loading、empty、error、pending 和实时更新冲突均有处理。
- Modal、搜索、Feed、投票和评论至少覆盖关键测试。
- 具备键盘操作、焦点管理和合理语义。
- 有 CI 和一项基于测量的性能改进。
- README 能说明 Convex/Clerk 的架构取舍，而不是只罗列功能。

### Cinema 完成定义

- 唯一主仓、TypeScript 状态和简历一致。
- 原有浏览、详情、收藏、想看功能保持稳定。
- `/cinema-3d` 独立懒加载并与现有电影状态连接。
- 有 WebGL、移动端、低性能、reduced motion 和加载失败降级。
- 资源释放、DPR、纹理数量和场景帧循环有明确策略。
- 有在线演示、README、性能记录和至少一个关键流程测试。

## 14. 面试叙事

### 30 秒定位

> 我以前端工程能力为主，熟悉 React、TypeScript 和 Next.js。TaskFlow 证明我能从 PostgreSQL、认证、API 到前端完成全栈交付；RedditLike 证明我能处理实时数据和复杂业务交互；U-s-cinema 则用于深入 Three.js/R3F、3D 性能与降级体验。

### 三个项目分别回答什么

| 面试问题 | 使用项目 |
| --- | --- |
| 你会不会独立完成后端和数据库？ | TaskFlow |
| 你如何处理复杂状态、实时交互和组件质量？ | RedditLike |
| 你的前端差异化能力是什么？ | Cinema 3D |
| 你如何做测试、性能和可访问性？ | 三个项目各举一个证据 |

避免把所有技术都写进一个项目。清晰的职责分工比“技术栈很长”更可信。

## 15. 每周复盘模板

每周只回答以下问题：

1. 本周上线了哪个端到端切片？
2. RedditLike 或 Cinema 哪个用户问题得到改善？
3. 有什么测试、性能数据或可访问性证据？
4. 本周投递多少、约面多少、卡在哪一环？
5. 下周唯一的 TaskFlow P0 和前端 P0 是什么？
6. 哪项学习没有进入项目，应当停止还是安排落地？

## 16. 应暂缓的内容

- RedditLike 迁出 Convex/Clerk。
- Cinema 同时迁 TypeScript、Tailwind、Next.js 和 Three.js。
- 为 Three.js 另开长期 demo 仓库而不进入 Cinema。
- Gate B 前学习 Go、Redis、队列、微服务或 WebGPU。
- 没有测量就添加虚拟列表、复杂 memo 或大量实例化优化。
- 为写进简历安装 shadcn/ui，却不处理键盘和焦点行为。
- 3D 只追求视觉，不提供 DOM 替代、错误处理和移动端降级。
- 暂停投递等待三项目全部完成。

## 17. 最终里程碑

### 第 0 周（2–5 天）· 阶段零

- 三项目 `BASELINE.md` 完成；Cinema 主仓/TS 事实核对完成或明确迁移计划。
- 简历表述与可验证代码一致。

### 第 2 周

- TaskFlow 第一个 PostgreSQL 纵向切片可用（页面真读写）。
- RedditLike 测试环境建立。
- Cinema 最小 Three.js 场景进入 lab。

### 第 6 周 · Gate A-min

- TaskFlow：本地闭环 CRUD/筛选 + 迁移/Seed + 核心测试 + README（**在线可为 A-full 延后**）。
- RedditLike 完成复杂交互质量升级与约 10 个有价值测试。
- Cinema：glTF/拾取实验可用，TypeScript 状态明确；§5.1 门禁尽量勾满。

### 第 7–8 周 · Gate A-full（最晚）

- TaskFlow 公网或稳定预览可访问 + 演示说明。
- 若仍卡住：触发 §4.4 熔断，优先部署而非新功能。

### 第 9 周

- TaskFlow 完成认证、归属和关键安全测试（可与 A-full 交错，但越权测试不可缺）。
- Cinema 3D 影廊 v1 在线，并与详情/收藏连接（须已过 §5.1）。

### 第 12 周 · Gate B

- TaskFlow：在线演示、CI、集成测试、E2E。
- RedditLike：测试、a11y、性能与 UI 工程证据。
- Cinema：可降级、可解释、可测试的 R3F 代表功能。
- **个人站三链 + 三份 60 秒演示脚本**齐全。
- 简历定位仍以 React/TypeScript 前端为主，全栈和 Web 3D 为明确加分项。

## 18. 最终建议

时间与执行默认按：

> **每天约 6 小时，每周约 40 小时；WIP ≤ 2；RedditLike/Cinema 双周轮换；落后熔断优先于加功能。**

未来 10–12 周的优先级是：

> **持续投递 > 前端基本功与面试 > TaskFlow 全栈纵向切片 > Cinema Web 3D 代表功能 > RedditLike 工程质量 > 其他新技术。**

这里的 TaskFlow、Cinema 和 RedditLike 不是三个同时扩张的大项目，而是三个职责清晰的证据：

- TaskFlow 证明你能把数据安全地交付到界面。
- RedditLike 证明你仍在深入现代 React 业务前端。
- Cinema 证明你在 WebGL/Three.js 方向形成了真正可展示的差异化。

你的竞争力不来自“会最多的框架”，而来自能同时讲清产品体验、前端工程、数据边界、性能与取舍，并且每一项都能在现有项目中被验证。

**执行时只认本文；旧版长文仅作概念参考。**
