# TypeScript 全栈职业规划与学习路线（2026）

> 制定日期：2026-07-17  
> 修订日期：2026-07-17（就业门禁；6h 密集模式；**持续前端 + WebGL/Three.js 渐进主特色**；Go 可选辅修；双轨不互斥）  
> 近期目标：尽快获得 **前端 / 前端偏全栈** 岗位（约 10–14 周冲到 Gate B）；前端能力持续加深，不暂停  
> 中期目标：1–2 年内可独立交付中小型全栈应用，并具备可展示的 Web 3D / 可视化前端作品  
> 长期定位：以前端为锋刃（React/Next + WebGL/Three.js）、以 Node/PG 为底座的差异化全栈

---

## 1. 适合你的方向

你不需要因为想做全栈就强迫自己学习 Java。全栈是一组能力，而不是某一种语言：

- 能设计和实现前端界面。
- 能设计 API、认证和业务规则。
- 能建模数据库并保证数据一致性。
- 能测试、部署、监控和排查线上问题。
- 能理解安全、性能和系统边界。

结合你的现有经历，最合适的定位是：

> **以前端为锋刃、以 TypeScript 全栈为底座的工程师：React/Next.js 做产品体验与工程化前端，WebGL/Three.js 做差异化方向，Node.js + PostgreSQL 做可独立交付的服务端。**

**双轨原则（重要）：**

| 轨道 | 作用 | 是否可停 |
| --- | --- | --- |
| **轨道 F：前端持续加深** | 保持就业主优势；性能、工程、体验、可视化/3D | **不停** |
| **轨道 B：后端补齐** | 脱离 BaaS，Gate A/B 求职与全栈叙事 | 达 Gate B 后可降速，不追求一年纯后端 |

补后端 **不是** 用后端替换前端学习时间到只剩「维持面试题」，而是：用后端把交付边界拉长，同时前端继续往 **更难、更可展示、更有方向** 走（WebGL/Three.js）。

你已经具备 React、TypeScript、Next.js、Appwrite、Convex、Clerk、API Route 和基础数据库建模经验，因此不是从零学后端。后端要补的是：脱离 BaaS 后的数据库、API、认证、安全、测试与部署。前端要继续的是：工程深度 + **3D/可视化特色**。

### 1.1 现有作品集角色（禁止再开第四个同质 Todo）

| 项目 | 角色 | 用法 |
| --- | --- | --- |
| **TaskFlow 自建版** | 全栈主项目 | API / PG / 鉴权 / 测试 / 部署 |
| **RedditLike** | 前端深度 | 实时交互、复杂状态、TS、Convex/Clerk |
| **U-s-cinema** | 前端基本功 | 接口封装、JS→TS、Context、异常体验 |
| **竞赛闲置平台等** | 协作辅证 | Vue/Node/MySQL、团队与竞赛 |
| **Web 3D 渐进作品**（新建） | 前端特色 | Three.js/R3F 小场景 → 可交互产品页 → 全栈 3D 平台 |

原则：

- **一个全栈主项目纵向升级**（TaskFlow）证明后端边界。  
- **旧前端项目 + 持续 3D 作品** 证明前端没有停、且有方向。  
- 不要平行再开多个浅层 CRUD；3D 用 **同一条渐进线** 加深，而不是每周换 demo。

---

## 2. 推荐技术栈

### 主线技术栈

| 层次 | 推荐选择 | 原因 |
| --- | --- | --- |
| 前端核心 | React + Next.js + TypeScript | 就业主栈；SSR/BFF/全栈应用 |
| 前端工程 | Vite、ESLint、Vitest、Playwright、性能与 a11y | 持续加深，不因学后端停更 |
| UI | Tailwind CSS + shadcn/ui（试点，不全站重写） | 提高交付速度，保留组件源码控制权 |
| **前端特色** | **Three.js + React Three Fiber（R3F）+ Drei** | Web 3D 主方向；先场景后产品化 |
| 3D 资产 | glTF/GLB、压缩、贴图基础；Blender 够用即可 | 服务展示与加载性能，不做全职建模 |
| 服务端基础 | Node.js + TypeScript | 同一语言贯穿前后端，迁移成本最低 |
| 独立 API | Fastify（主选） | 性能好、插件与 Schema 思维清晰，比 NestJS 轻 |
| 赶投递旁路 | Next.js Route Handlers + 同仓 PostgreSQL | 已会 API Route，可先打通再抽独立服务 |
| 数据库 | PostgreSQL | SQL、事务、索引和关系建模可迁移 |
| 数据访问 | 先 SQL，后 **Prisma 优先**（或 Drizzle） | Prisma 招聘识别度更好；先懂 SQL 再上 ORM |
| 数据校验 | Zod（主） | 统一处理不可信输入；完整 OpenAPI 可后置 |
| 测试 | Vitest + Fastify `inject` + Playwright | 单元、集成、关键路径 E2E |
| 缓存/队列 | Redis + BullMQ | **Gate C 之后**再学，不阻塞求职 |
| 部署 | Docker + GitHub Actions + 云托管 | 建立提交到线上的链路 |
| 可观测性 | 结构化日志 + Sentry（OpenTelemetry 了解概念即可） | 先能定位错误，再谈完整 tracing |

### 框架选择建议

#### Fastify：当前主选

- 更容易看清 HTTP、路由、插件、Schema 和生命周期。
- TypeScript 支持良好，不要求大量装饰器和依赖注入。
- 适合从「会写 Next.js Route Handler」过渡到「会设计独立服务」。

#### 赶投递旁路（可选）

若进度紧张、需要尽快达到 Gate B：

1. 先在 Next 同仓用 Route Handlers + Prisma + PostgreSQL 打通鉴权与任务 CRUD。  
2. 前端接上、演示可用、核心路径有测试。  
3. 再抽成 Fastify，或保持同仓并在简历中诚实说明边界。

旁路是加速器，不是长期逃避独立服务能力；面试仍要能讲清 HTTP、鉴权与数据归属。

#### Express：保持能读能改

Express 招聘覆盖面仍有价值，但不必做第二个完整项目。学中间件、路由、错误处理和生态差异即可；面试前扫一遍常见写法。

#### NestJS：按岗位需要补充

Nest 的模块、装饰器、DI 与 Java/Spring 风格接近。不喜欢则不必作为入门框架。若招聘大量要求 Nest，在掌握 Node/Fastify 后用 1–2 周做小型迁移练习。

#### Hono：作为后续扩展

适合轻量 API、边缘与 Serverless。现阶段岗位识别度通常不如 Express/Nest。先当多运行时扩展，不作为求职主线。

### 第二门后端语言

**默认：** 入职稳定或完成 TypeScript 全栈主项目（含认证、测试、部署）后，再系统学习第二语言。

- **Go**：首选第二语言。语法相对简洁，适合服务端、并发和云原生。  
- **Python**：更偏 AI、数据处理和自动化时选 FastAPI。  
- **Java**：仅目标公司明确要求时再学。

在未来 6–9 个月内不要同时系统学习 Go、Python、Java 和多个 Node 框架。

**可选轻辅修（见 §13）：** Gate A 之后且 F3 配额完成时，每天 ≤45 分钟 Go；**与 3D 冲突时 3D 优先**；不写进主定位。

---

## 3. 总体职业策略与就业门禁

### 3.1 求职定位：前端主投，全栈加分，3D 作差异化

目前简历最可信的优势仍然是 **前端**。推荐定位演进：

| 阶段 | 对外定位 | 说明 |
| --- | --- | --- |
| Gate B 前 | React / TypeScript 前端，具备 Next.js 与 Node/PG 全栈能力 | 主投前端 |
| Gate B 后 | 前端偏全栈；作品含自建 API + 可演示 3D/可视化 | 全栈比例上升 |
| 有 3D 作品后 | 可额外投可视化 / 数字孪生 / Web 3D / 创意前端 | **差异化通道，不是唯一通道** |

岗位投递建议（Gate B 前）：

- **55%**：React/TypeScript 前端、Next.js 前端（含中高级前端 JD 里「加分项 3D/可视化」）。  
- **25%**：前端偏全栈、Node 全栈、Web 全栈初级。  
- **10%**：接受应届/初级的实习或见习。  
- **10%**：数据可视化、数字孪生、Web 3D、Three.js 相关（有可点开的 demo 再加大比例）。

完成自建 Node/PostgreSQL 后，全栈投递可提到 35%–45%；**有 R3F 在线作品后**，3D/可视化通道可提到 15%–25%，但仍建议保留大量通用前端投递（岗位总量更大）。

### 3.2 就业门禁（硬标准，避免学满一年才投）

| 门禁 | 大约时间 | 能力标准 | 可投岗位 |
| --- | --- | --- | --- |
| **Gate A** | 约 6 周 | Fastify/同仓 API + PG CRUD、筛选分页、基础测试；能讲 Node/HTTP/SQL | 前端为主；简历可写自建 API/SQL |
| **Gate B（主目标）** | **约 10–14 周** | 认证+归属校验+安全测试；前端接自建 API；CI 与关键 E2E；可演示 | **前端偏全栈 / 初级全栈** |
| **Gate C** | 6 个月+ | 部署监控、迁移回滚、性能排查；Redis/队列按需 | 中小型独立交付、涨薪/跳槽素材 |

**重要：**

- 阶段 0–3（约 14 周）是 **求职主路径**。  
- 阶段 4–6（部署深挖、Redis、旗舰系统设计）标为 **入职后或已有稳定面试流再推进**，不阻塞 Gate B。  
- 不等待全栈路线全部完成才投递。  
- 第一份工作即使是纯前端，只要能接触接口、BFF、库表或服务端协作，也可作为全栈跳板。  
- 每一次后端学习尽量落到 **TaskFlow 同一主项目**。

### 3.3 与 Clerk / Appwrite 心智的迁移

阶段二的目标不是「再接一个登录 SDK」，而是把你在 Clerk/Appwrite 上建立的登录、Session、Webhook、归属校验经验，迁移为 **可解释的自建方案**（密码哈希、Cookie/Session、服务端鉴权、越权防护）。简历可对比说明：BaaS 原型 → 自建生产向边界。

### 3.4 前端不停学：三条并行线

后端冲刺期 **压缩的是「再堆一个业务 CRUD 前端」**，不是压缩前端本身。前端始终保持三条线：

| 线 | 内容 | 与后端关系 |
| --- | --- | --- |
| **F1 就业前端** | React/TS 面试、Next 边界、性能、状态、工程化 | 每天固定时间，服务拿 offer |
| **F2 产品前端** | TaskFlow 对接自建 API、体验、可访问性、组件质量 | 与轨道 B 同一项目 |
| **F3 特色前端** | WebGL 基础 → Three.js → R3F → 可交互 3D 作品 | **渐进加深，不后置到「有工作再说」** |

F3 在 Gate B 前是 **受保护的每日/每周配额**（见 §4、§9），不是可有可无的兴趣尾巴。

---

## 4. 前端持续加深 + WebGL / Three.js 渐进路线

> 本章与后端阶段 **并行**，不是附录。目标：前端能力曲线向上，同时用 3D 形成差异化。

### 4.1 通用前端（F1）——全程不断档

无论是否在冲 Gate A/B，每周都要有实质前端输入，建议轮换：

| 主题 | 学什么 | 证据 |
| --- | --- | --- |
| React 深度 | 并发特性边界、memo/稳定引用、错误边界、可组合组件 | 能讲清一次列表卡顿的排查 |
| TypeScript | 工具类型、判别联合、收窄、与 Zod 共用类型 | 减少 `any`，严格模式通过 |
| Next.js | RSC/客户端边界、缓存与重新验证、流式与加载态 | TaskFlow 或个人站实践 |
| 浏览器与性能 | 渲染路径、长任务、LCP/INP、包体积、图片与字体 | Lighthouse 或 Web Vitals 前后对比 |
| CSS/UI 工程 | 布局体系、设计 token、暗色、响应式、动效克制 | 一个业务区组件库化 |
| 工程与质量 | 测试策略、a11y 基础、Story/文档化（可选） | 关键组件有测或检查清单 |

**资源（F1）：**

- [React Docs](https://react.dev/)  
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)  
- [Next.js Docs](https://nextjs.org/docs)  
- [web.dev](https://web.dev/) Performance / INP  
- [MDN](https://developer.mozilla.org/) 按需查 CSS/Web API  

### 4.2 Web 3D 渐进（F3）——四阶，不一步做旗舰

| 阶 | 大约时间 | 目标 | 产出（必须可访问） | 每日/周配额建议 |
| --- | --- | --- | --- | --- |
| **3D-0 图形基础** | W1–4 | 坐标系、相机、网格、材质、光照、渲染循环直觉 | 笔记 + 1 个原生 canvas/WebGL 或 Three 最小场景 | 密集：45–60min/天 |
| **3D-1 Three 基础** | W5–10 | 场景图、Loader、glTF、阴影、基础交互（射线拾取） | 个人站挂 1 个 glTF 展示页（旋转/缩放/加载态） | 密集：45–60min/天 |
| **3D-2 R3F 产品化** | W11–16 | R3F + Drei、与 React 状态结合、Suspense/加载、移动端降级 | **可交互小作品**（产品展示 / 简易场景编辑 / 数据点热点） | Gate B 冲刺周可降至 30min，不中断 |
| **3D-3 工程与全栈** | Gate B 后 | 性能（draw call、实例化、LOD）、资源管线、权限与资产 API | 3D 作品接简易后端（资产元数据/权限）或并入旗舰 | 入职后 3–5h/周或继续全日配额 |

**Gate B 前禁止：**

- 一上来做「数字孪生大盘 / 完整编辑器 / 物理引擎大作」。  
- 用 3D 替代 TaskFlow 全栈主项目时间导致后端 Gate 失败。  
- 只存本地不部署——3D 作品 **必须有链接** 才能写进简历。

**Gate B 前允许且鼓励：**

- 个人站一个 3D 入口。  
- 与 U-s-cinema 或作品集结合的「3D 封面/展厅」级体验。  
- 面试可演示的 60 秒操作路径。

### 4.3 推荐学习顺序与资源（F3）

1. **Three.js 官方手册**（优先于东拼西凑教程）：[Three.js Manual](https://threejs.org/manual/#en/fundamentals)  
2. **glTF 工作流**：导出、压缩（如 gltf-transform 概念）、贴图尺寸  
3. **R3F**：[React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) + [Drei](https://github.com/pmndrs/drei)  
4. **可选进阶**：[three.js journey](https://threejs-journey.com/)（付费体系课，有预算再上）  
5. **性能与发布**：`requestAnimationFrame`、像素比限制、移动端降级、静态托管  

数学：向量/矩阵/四元数 **用到再补**，不要先开线性代数长线课。

### 4.4 前端作品集叙事（简历怎么写）

避免「学了后端所以前端空窗」：

- 项目区：**TaskFlow（全栈）** + **RedditLike（复杂前端）** + **3D 作品名（Three/R3F）**  
- 技能区：React/TS/Next **写在前面**；Three.js/R3F 单列「可视化 / Web 3D」  
- 一句话差异化：  

> 前端工程扎实，能独立交付 Node/PG 全栈链路，并具备 Web 3D（Three.js/R3F）可演示作品。

### 4.5 与后端时间的冲突规则

| 情况 | 规则 |
| --- | --- |
| 正常密集日 | 后端/全栈主项目为主，**固定保留 F1+F3 合计约 1.5–2h** |
| Gate B 最后 7 天 | F3 可减到 20–30min 保手感，**F1 面试前端不减** |
| 主项目阻塞 | 优先修 TaskFlow；3D 只做已规划小步，不新开范围 |
| 连续 3 天零前端 | 违规——次日必须补 F1 或 F3 任一实质产出 |

---

## 5. 阶段零：第 0–2 周，建立服务端认知（并行 F1 + 3D-0）

### 阶段目标

理解一次请求从浏览器进入 Node.js、访问数据库、再返回响应的完整链路。  
**并行：** F1 每天保留前端输入；3D-0 建立场景/相机/网格直觉（见 §4.2）。

### 学习内容

#### Node.js 基础

- Node.js 运行时与浏览器运行时的区别。  
- ESM、CommonJS、`package.json`、环境变量和进程。  
- 异步 I/O、事件循环、Promise、错误传播。  
- Buffer、Stream、文件系统和基础网络模块（够用即可，勿深挖源码）。  
- npm/pnpm、依赖类型、版本与脚本。

#### HTTP 和 API 基础

- 请求方法、状态码、Header、Cookie、缓存和内容协商。  
- REST 资源设计、分页、排序、筛选和统一错误格式。  
- 幂等性、超时、重试和请求 ID 的基本概念。  
- JSON 的边界以及所有外部输入都不可信的原则。

#### SQL 入门

- PostgreSQL 的表、行、列、约束和关系。  
- `SELECT`、`INSERT`、`UPDATE`、`DELETE`。  
- `JOIN`、聚合、子查询和分页。  
- 主键、外键、唯一约束、`NULL` 和数据类型。

### 小目标

- 使用 Node.js 原生 `http` 模块写一个最小 API（不使用框架）。  
- 使用 PostgreSQL 建立 `users`、`tasks`、`tags` 三张表。  
- 独立写出任务列表筛选、标签聚合和用户任务统计 SQL。  
- 画出「浏览器 → API → 数据库 → API → 浏览器」链路。  
- **3D-0：** 完成 Three 手册 fundamentals 相关章节 + 本地最小旋转立方体/基础场景。

### 验收标准

- 能解释为什么 Node.js 适合 I/O 密集型服务。  
- 能区分进程、线程、事件循环和异步 I/O。  
- 能解释 `INNER JOIN` 与 `LEFT JOIN`，主键与唯一约束。  
- 能为常见成功和失败场景选择合理 HTTP 状态码。  
- 能用自己的话解释场景、网格、材质、相机与渲染循环。

### 学习资源

- [Node.js Learn](https://nodejs.org/en/learn)  
- [Node.js API Docs](https://nodejs.org/api/)  
- [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)  
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)  
- [SQLBolt](https://sqlbolt.com/)  
- [JavaScript.info Event Loop](https://javascript.info/event-loop)  
- [Three.js Manual – Fundamentals](https://threejs.org/manual/#en/fundamentals)  

优先官方文档；中文课只作索引，不替代动手。

---

## 6. 阶段一：第 3–6 周，独立构建类型安全 API → Gate A（并行 F1 + 3D-1）

### 阶段目标

不用 Appwrite/Convex，独立完成一个 **可演示、可测试** 的 Node.js API（先可用，再完美）。  
**并行：** 开始 3D-1（Loader/glTF）；F1 保持 React/TS 面试手感。

### 学习内容

#### Fastify（或赶投递旁路：Next Route Handlers）

- 路由、插件、Hook、生命周期。  
- Zod 输入校验（主）；TypeBox/JSON Schema 可选。  
- 统一错误处理、日志和请求上下文。  
- 配置管理与开发/测试/生产环境分离。

#### 数据访问

- 参数化 SQL，防止 SQL 注入。  
- 连接池、迁移、Seed、事务基础。  
- 理解 SQL 后选 **Prisma（优先）** 或 Drizzle；同一项目只用一个 ORM。

#### API 设计

- 资源命名与清晰错误体。  
- Offset 分页先落地；Cursor 分页理解差异即可。  
- 搜索、排序、筛选参数。  
- 业务错误与系统错误分离。  
- **完整 OpenAPI 后置到阶段三**；本阶段用 Zod + 路由表/简短 API 说明即可。

### 项目：TaskFlow API v1

将 TaskFlow 任务核心能力逐步从 BaaS 抽离：

- 用户、任务、标签与状态的数据模型。  
- 任务 CRUD、筛选、分页、排序、基础统计。  
- 统一响应与错误格式。  
- 数据库迁移与开发 Seed。  
- **核心路径 8–12 个** API 测试场景（不必强求 20+）。  
- 简短 API 说明（Markdown 即可）。

不要立即移除现有 Appwrite 版本。先让新 API 独立可运行并通过测试，再切换前端。

### 小目标

- 每个写接口输入都有 Schema 校验。  
- 查询全部参数化或走 ORM。  
- 核心路径测试通过；README 可让他人按步骤启动。  
- **第 6 周末更新简历 bullet + 个人站进度。**  
- **3D-1 启动：** 能加载一个 glTF 并控制旋转/缩放（可仍在本地）。

### 验收标准（Gate A）

- 能解释 Fastify 插件封装和生命周期（或 Route Handler 边界）。  
- 能说明连接池、迁移和事务的必要性。  
- 能解释为何选 Prisma 或 Drizzle。  
- 能设计分页、筛选、排序和错误响应。  
- 前端 F1 未出现连续多日空窗（自检 §4.5）。

### 学习资源

- [Fastify Getting Started](https://fastify.dev/docs/latest/Guides/Getting-Started/)  
- [Fastify Reference](https://fastify.dev/docs/latest/Reference/)  
- [Prisma Docs](https://www.prisma.io/docs/) 或 [Drizzle Docs](https://orm.drizzle.team/docs/overview)  
- [Zod Docs](https://zod.dev/)  
- [REST API Design Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)  
- OpenAPI 全文规范：阶段三再精读  

---

## 7. 阶段二：第 7–10 周，认证、安全与权限（并行 F1 + 3D-1 收尾）

### 阶段目标

实现一套能解释安全边界的认证与授权，而不只是「接入登录 SDK」。把 Clerk/Appwrite 的经验迁到自建方案。  
**前端并行：** 完成个人站 glTF 展示页（3D-1 验收）；F1 每周至少 1 个前端面试主题复盘。

### 学习内容

#### 认证（分优先级）

**P0（必须）：**

- 注册、登录、退出。  
- 密码哈希与 Salt（Argon2 或 bcrypt）。  
- Session Cookie（推荐）或受控 JWT；能比较两者。  
- Cookie：`HttpOnly`、`Secure`、`SameSite`。

**P2（Gate B 后可选）：**

- 邮箱验证、重置密码。  
- OAuth 2.0 / OIDC 与第三方登录（可参考 Auth.js，非主路径）。

#### Web 安全

- XSS、CSRF、SQL 注入、CORS、点击劫持。  
- 登录限流、暴力破解防护；注意账号枚举。  
- 密钥与环境变量管理。  
- 权限校验必须在服务端。  
- 日志不得记录密码、Token 和敏感信息。

#### 授权

- 资源所有权校验（只能改自己的任务）。  
- 普通用户 + 管理员两个角色即可（轻量 RBAC）。  
- 明确何时不需要复杂权限系统。

### 项目升级：TaskFlow Auth v2

- 数据库 Session 或受控 JWT 完成认证。  
- 全任务操作做用户归属校验。  
- 登录限流、密码规则、统一认证错误。  
- 编写越权、无效 Cookie、过期 Session 等测试（约 8–10 个安全/权限用例即可）。  
- README 写安全假设与威胁清单（简短）。

### 小目标

- 独立画出登录、Session 校验、退出和权限判断流程。  
- 能解释「前端隐藏按钮 ≠ 权限控制」。  
- **第 10 周末更新简历；可提高全栈向投递比例。**

### 验收标准

- 能比较 Session Cookie 与 JWT。  
- 能说明 XSS、CSRF、CORS 区别。  
- 能解释密码应哈希而非可逆加密。  
- 能阻止用户读取或修改他人任务。

### 学习资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)  
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)  
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)  
- [OAuth 2.0 Simplified](https://www.oauth.com/)（P2）  
- [Auth.js Docs](https://authjs.dev/)（仅第三方登录需要时）  

---

## 8. 阶段三：第 11–14 周，前后端整合与质量体系 → Gate B（并行 F1 + 3D-2 启动）

### 阶段目标

把 React/Next.js 前端接到自建服务，形成 **可演示的最小质量闭环**——这本身就是高强度 **产品前端（F2）** 训练。默认 **保留现有 Zustand + URL 状态**，禁止整站状态/UI 重写。  
**3D：** 启动 R3F 小作品骨架（可与个人站同仓），Gate B 最后一周允许只维护不扩 scope。

### 学习内容

#### 前后端边界

- Server Component、Route Handler、Server Action 与独立 API 的职责。  
- BFF 与独立后端的适用场景。  
- 服务端状态、客户端 UI 状态、URL 状态的边界。  
- 共享 Zod 类型或简单契约，避免前后端复制两份模型。

#### 数据获取（克制引入）

- **P0：** 前端稳定调用自建 API；loading/error/empty 完整。  
- **P1：** TanStack Query **仅管理服务端缓存**（列表/详情），与 Zustand 分工：Query = 服务端数据，Zustand = 真正的客户端/跨页 UI 状态。  
- 请求取消、竞态、错误恢复：按需补，不一次上齐。

#### UI 与产品前端（F2，本阶段重点）

- Tailwind + shadcn：**只改造一个完整业务区域**（例如任务表单或筛选条）。  
- **禁止** 全站 UI 重构抢 Gate B 时间。  
- 强化：空态/错态/加载态、键盘可达、移动端关键路径、请求竞态下的界面一致性。  
- 这是「前端没有停」的主证据之一：对接真实 API 的体验工程，而不是只写静态页。

#### 测试金字塔（务实版）

- 纯函数单元测试（已有日期工具可延续）。  
- API + PostgreSQL 集成测试（核心路径）。  
- Playwright：**至少 1 条** 主路径 E2E（登录 → 创建 → 筛选 → 删除）。  
- CI：lint、typecheck、unit/integration、E2E（可分 job）、build。

### 项目升级：TaskFlow Full Stack v3

- 前端切换到自建 API（或同仓 Handler）。  
- 保留 Zustand；按需引入 TanStack Query。  
- 覆盖登录、创建、编辑、筛选、跨视图跳转和删除。  
- README：架构图、数据模型、测试策略、技术取舍（含为何离开 BaaS）。

### 小目标

- 至少一条前端操作能对应到 API 日志与数据库变更。  
- 乐观更新非必须；有则失败要回滚提示。  
- **第 14 周末：Gate B 检查清单全部勾选；个人站案例页上线。**

### 验收标准（Gate B）

- 能说明状态分别属于 Query Cache、Zustand、URL 或组件本地。  
- 能解释何时用 Next Route Handler、何时拆独立 Fastify。  
- 能在测试中验证真实库表约束，而不只 Mock。  
- 能用 5 分钟讲清一次完整请求链路。  
- 演示账号 + 线上或可一键启动的环境可用。

### 学习资源

- [Next.js Docs](https://nextjs.org/docs)  
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)  
- [Testing Library Docs](https://testing-library.com/docs/)  
- [Vitest Guide](https://vitest.dev/guide/)  
- [Playwright Docs](https://playwright.dev/docs/intro)  
- [Tailwind CSS Docs](https://tailwindcss.com/docs)  
- [shadcn/ui Docs](https://ui.shadcn.com/docs)  

---

## 9. 时间分配：两套模式（前端有固定配额）

### 9.1 模式 A：边投边学（每周约 30 小时）

适合实习/兼职/不能全天学习时：

| 内容 | 时间 | 轨道 |
| --- | ---: | --- |
| 投递、沟通与面试复盘 | 6h | — |
| **前端面试 + 工程复习（F1）** | **5h** | F |
| **WebGL/Three/R3F（F3）** | **3h** | F |
| 算法 | 2h | — |
| Node/SQL/后端学习 | 6h | B |
| 全栈主项目（含对接前端 F2） | 8h | B+F |

前端合计约 **8h/周**，后端+全栈项目约 **14h/周**，避免「只补后端」。

### 9.2 模式 B：密集备战（每天约 6 小时）→ 约 3.5–4 个月到 Gate B

适合全职备战。原则：**后端拿 Gate，前端不断档，3D 渐进有产出。**

| 时段用途 | 时长/天 | 轨道 | 说明 |
| --- | ---: | --- | --- |
| 全栈主项目 / API / 鉴权 / 对接 | 3.0–3.5h | B + F2 | 仍是最大块，但不是唯一块 |
| **前端加深 F1**（面试/性能/Next/工程） | **0.75–1h** | F1 | 可与算法日交替加强 |
| **Three.js / R3F（F3）** | **0.75–1h** | F3 | 受保护配额；见 §4.5 冲突规则 |
| 算法 + 项目口述 | 0.5–0.75h | — | 算法约 30–40min |
| Go 轻辅修 | 0–0.5h | — | **仅 Gate A 后且 F3 不挤占时**；与 3D 冲突时 **3D 优先于 Go** |
| 日记与明日三条任务 | 15min | — | 防失控 |

**工作日模板示例（推荐）：**

1. 块 A 2.5–3h：TaskFlow / API / 鉴权 / 库表  
2. 块 B 1h：前端对接或 F1（Next/性能/组件）  
3. 块 C 45–60min：**Three.js / R3F 固定练习**  
4. 块 D 40–50min：算法 + 口述  
5. 收尾 15min：记录（含「今日前端产出 / 3D 产出」两栏）

**约 14 周双轨节奏：**

| 周次 | 后端/全栈焦点 | 前端 / 3D 焦点 | 里程碑 |
| --- | --- | --- | --- |
| W1–2 | 阶段零：http + SQL | F1 巩固；**3D-0** | 三表 SQL + 最小 3D 场景笔记 |
| W3–6 | 阶段一：API v1 | F1；**3D-1** 开始 | **Gate A**；简历更新 |
| W7–10 | 阶段二：Auth | F1；**3D-1** glTF 页上线 | 鉴权完成；个人站 3D 展示页 |
| W11–14 | 阶段三：对接 + CI | F2 主战场；**3D-2** 骨架 | **Gate B**；R3F 作品可点开（可简） |
| W15+ | 部署/监控或入职 | **3D-2 打磨** → 3D-3 | 提高全栈与 3D 向投递 |

每周至少保留半天不学习。持续推进比连续熬夜两周更重要。

### 9.3 入职后（每周 10–14 小时）

| 内容 | 时间 | 说明 |
| --- | ---: | --- |
| 工作问题复盘 | 2–3h | 含前端业务 |
| 全栈加深（阶段四–五） | 2–3h | 部署/Redis 等按需 |
| **Web 3D / 可视化主特色** | **4–5h** | 主差异化时间放到这里 |
| 前端工程/性能专题 | 1–2h | F1 不停 |

入职后时间结构 **反转**：工作已提供业务前端与部分后端，业余时间 **3D 配额应高于再学一门后端语言**。

---

## 10. 阶段四：第 15 周–第 6 个月，部署、性能与可观测性 + 3D-2 打磨

> **定位：Gate B 之后或入职后推进。** 未达 Gate B 时，最多做「能上线 + 健康检查」，不在此阶段沉迷优化。  
> **前端：** 将 3D-2 从「能点开」打磨到「面试可演示」；F1 转向性能与复杂组件专题。

### 阶段目标

让全栈项目不只「本机可跑」，而是能部署、升级和排查问题；同时让 3D 作品达到稳定演示质量。

### 学习内容

#### Linux 与部署

- 文件、权限、进程、端口、日志、环境变量。  
- Dockerfile、镜像层、容器网络、Volume、健康检查。  
- Docker Compose 管理 API、PostgreSQL（Redis 可并列出现但非必须）。  
- CI/CD、迁移、回滚和零停机概念。

#### 性能

- 事件循环阻塞与内存问题信号。  
- 索引、`EXPLAIN ANALYZE`、N+1、慢查询。  
- 压缩、分页、连接池；有证据再优化。

#### 可观测性

- 结构化日志、级别、请求 ID、错误上下文。  
- Metrics / Logs / Traces 概念区分。  
- **Sentry 错误追踪（P0）。**  
- OpenTelemetry：**了解概念即可**，完整接入非 Gate C 前必须。

### 项目升级：Production v4

- Compose 一键启动本地环境。  
- GitHub Actions 构建、测试、部署。  
- 健康检查、结构化日志、请求 ID。  
- 对 2–3 个核心查询做 `EXPLAIN ANALYZE` 并记录优化前后。  
- 错误监控、备份说明、简短故障恢复手册。

### 小目标与验收

- 新机器 15 分钟内按 README 启动。  
- 能制造并定位慢查询与一次「线上」错误。  
- 完成一次迁移与安全回滚演练。  
- 能解释容器与虚拟机、索引读写代价、日志/指标/追踪分工。

### 学习资源

- [Docker Get Started](https://docs.docker.com/get-started/)  
- [GitHub Actions Docs](https://docs.github.com/en/actions)  
- [PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)  
- [Node.js Diagnostics](https://nodejs.org/en/learn/diagnostics)  
- [Sentry for Node.js](https://docs.sentry.io/platforms/javascript/guides/node/)  
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)（概念）  
- [The Linux Command Line](https://linuxcommand.org/tlcl.php)  

---

## 11. 阶段五：约第 7–9 个月，缓存、队列与实时能力

> **定位：Gate C 向。** 避免为了「高并发」过度设计；没有真实痛点可不做。  
> **前端并行：** 3D-2 收尾为「可面试演示」级；开始 3D-3 的资源与性能课题（实例化、LOD、移动端降级）。

### 学习内容

#### Redis

- 数据结构、TTL、键设计、失效策略。  
- Cache Aside。  
- 穿透、击穿、雪崩的基本应对。  
- 分布式锁有风险，不神化。

#### 队列与后台任务

- 邮件、报表、导出、图片处理适合异步。  
- BullMQ：Job、Worker、重试、退避、失败处理。  
- 幂等、至少一次投递、重复消费。

#### 实时通信

- SSE、WebSocket、轮询的区别。  
- 重试、心跳、顺序、断线恢复。  
- 权限与多实例广播的基本问题。  
- 可对照 RedditLike / Convex 经验讲「BaaS 实时 vs 自建」。

### 项目升级：Async & Realtime v5

- BullMQ 异步生成周报或导出。  
- Redis 缓存只读统计，并记录命中/延迟变化。  
- 优先 SSE 推送进度；确需双向再用 WebSocket。  
- 对重复任务、失败重试、缓存失效写测试。

### 验收要点

- 缓存有明确 TTL 与失效条件。  
- 队列消费者可安全处理重复消息。  
- 能说明何时不需要缓存或实时。  
- 能解释缓存一致性不能只靠「加 Redis」。

### 学习资源

- [Redis Docs](https://redis.io/docs/latest/)  
- [BullMQ Guide](https://docs.bullmq.io/)  
- [MDN Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)  
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)  
- [Microsoft Cache-Aside Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)  

---

## 12. 阶段六：约第 10–12 个月，系统设计与方向融合

> **定位：有 offer 后或 Gate C 已具备时。**  
> **注意：** 旗舰可以大，但 **Gate B 前的 3D-0～3D-2 不是旗舰、不可取消**（见 §4）。旗舰 = 在已有 3D 作品上的产品化与全栈化。

### 学习内容

- 模块化单体、BFF、微服务、Serverless 边界。  
- 一致性、隔离级别、并发更新、乐观锁。  
- 限流、超时、重试、降级。  
- 文件上传、对象存储、CDN、签名 URL（**3D 资产分发强相关**）。  
- API 版本、兼容、Feature Flag 概念。  
- 基础容量与性能目标；3D 场景的性能预算。

### 特色旗舰项目（优先 B；A 为备选）

#### 方向 B（推荐主特色）：全栈 Web 3D 运营 / 展陈平台

- 在 3D-2 作品上升级：多模型、热点、状态面板、移动端降级。  
- Three.js/R3F 场景 + React 业务 UI（不是纯 demo 页）。  
- Node/PG：模型元数据、权限、版本；对象存储 + CDN。  
- Worker：缩略图、格式检查或导出任务（阶段五能力可选接入）。

#### 方向 A（备选）：全栈数据可视化平台

- PG 指标口径 + Worker 聚合 + ECharts/D3。  
- 若更爱「图表/分析」而非空间交互，选 A；可与 3D 热点图结合做杂交。

**Gate B 前：** 只做 §4 的 3D-0～3D-2，不做本章旗舰范围。  
**Gate B 后 / 入职后：** 用 §9.3 的 4–5h/周主攻旗舰。

### 小目标与验收

- 需求文档、数据模型、API 契约、架构决策记录。  
- 明确性能/安全/可用性指标；一次负载或故障演练。  
- 10 分钟讲清边界、瓶颈与演进。  
- 能解释为何现阶段用模块化单体而非微服务。

### 学习资源

- [System Design Primer](https://github.com/donnemartin/system-design-primer)  
- [Microsoft Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)  
- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)  
- [AWS Architecture Center](https://aws.amazon.com/architecture/)  
- [Three.js Manual](https://threejs.org/manual/#en/fundamentals) / [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)  
- [D3 Getting Started](https://d3js.org/getting-started) / [Apache ECharts Handbook](https://echarts.apache.org/handbook/en/get-started/)  

---

## 13. Go：默认后置 + 可选轻辅修（优先级低于前端 3D）

### 13.1 优先级声明

在时间冲突时：

> **F1 就业前端 > F3 Web 3D 渐进 > 轨道 B 当日 P0 > Go 轻辅修**

Go 是后端第二语言期权；**Three.js 是你选择的前端差异化方向**。不要用 Go 挤掉每日 3D 配额。

### 13.2 默认（系统学习，4–6 周）

满足以下条件后再系统学 Go：

- 已能独立设计 Node.js API 与 PostgreSQL 模型。  
- 主项目具备认证、测试、部署（至少 Gate B）。  
- **3D-1 或 3D-2 已有可访问作品**（避免第二语言与特色前端双线都半成品）。  
- 已找到工作，**或** 目标岗位明确要求 Go。

系统路线：

1. 语法、包、结构体、接口、错误处理。  
2. Goroutine、Channel、Context 与取消。  
3. `net/http`、JSON、中间件、PostgreSQL 驱动。  
4. 将 TaskFlow **一个只读统计服务** 用 Go 重写并做简单对比。

不要为「微服务」强行拆 Node + Go。

### 13.3 可选轻辅修（每天 ≤45 分钟）

**开始时机：** Gate A 之后，且当日 F3 配额已完成。  
**停止条件：** 主项目延期、冲刺 Gate B、或 3D 作品未上线时，Go 归零。

| 阶段 | 内容 | 产出 |
| --- | --- | --- |
| 2 周 | [A Tour of Go](https://go.dev/tour/) | 语法过关 |
| 2 周 | `net/http` JSON API | `/health` + 内存 CRUD |
| 2 周 | 接 PostgreSQL 只读查询 | 只读统计小服务 |
| 收尾 | README：与 Node 对比 | 简历「了解 Go」一行即可 |

**不做：** K8s、复杂 gRPC、微服务拆分、与主项目强行混部。

### 资源

- [A Tour of Go](https://go.dev/tour/)  
- [Go by Example](https://gobyexample.com/)  
- [Effective Go](https://go.dev/doc/effective_go)  
- [Go Web Examples](https://gowebexamples.com/)  

---

## 14. 每个阶段统一学习方法

1. **读官方入门**：建立正确概念，不追求一次记住全部 API。  
2. **写最小实验**：隔离验证事务、Cookie、缓存等单一能力。  
3. **加入主项目**：只在能解决真实问题时集成。  
4. **添加测试**：用失败用例证明理解边界。  
5. **写决策记录**：问题、选择、替代方案、代价。  
6. **口述复盘**：不看代码能讲清链路。

学习成果用证据衡量，而不是视频时长：

- 可运行代码  
- 迁移与 API 说明  
- 自动化测试与 CI  
- 监控或性能记录（阶段四后）  
- 架构图与技术取舍  
- 在线演示与可复现 README  

### 固定检查点

| 节点 | 动作 |
| --- | --- |
| 第 6 周（Gate A） | 简历 bullet；个人站进度；**3D-0/1 进度可见** |
| 第 10 周 | 鉴权叙事；**glTF 展示页链接**；提高全栈投递 |
| 第 14 周（Gate B） | TaskFlow 全栈案例；**R3F 作品可点开**；投递比例调整 |
| 每月 | 至少 1 次口述：全栈链路 **或** 3D 作品 60 秒演示 |

### 算法节奏

- 密集模式：每天约 30–40 分钟。  
- 目标：热题约 80 道（中等及以下为主）。  
- 同步巩固：数组、哈希、栈队列、树基础、复杂度。

---

## 15. 面试知识清单

### 前端（主场，必须持续强）

- JavaScript、TypeScript、React、CSS、浏览器渲染与性能。  
- Next.js 服务端/客户端边界、缓存与渲染策略。  
- 可访问性、测试、错误与边界状态。  
- 项目深挖：TaskFlow URL 协议、Zustand、筛选；RedditLike 实时与组件拆分。  
- **Web 3D：** 场景图、相机/光照、glTF 加载、R3F 与 React 状态结合、基础性能（像素比、draw call 直觉）。

### 后端（加分与全栈岗）

- Node 事件循环、异步 I/O、错误处理。  
- HTTP、REST、Cookie、Session、JWT、CORS、CSRF。  
- PostgreSQL 建模、索引、事务、隔离级别、执行计划基础。  
- API 校验、权限、日志、测试、部署。  
- Redis/队列/实时：适用边界即可（Gate C 前不要求深）。

### 算法与计算机基础

- 常见结构与中等以下题目。  
- 进程、线程、内存、网络、数据库基础概念。  
- 3D 相关：向量点积/叉积、变换矩阵 **用到再补**。

---

## 16. 应暂缓的内容

- 同时深入 NestJS、Fastify、Express、Hono。  
- 不理解 SQL 只会 ORM CRUD。  
- 过早微服务、Kubernetes、Kafka、复杂分布式事务。  
- 同时系统学习 Go、Python、Java。  
- 为了「全栈」减少投递，等一年再找工作。  
- 只会调 BaaS，却讲不清数据库、认证与权限边界。  
- **为冲后端而连续多日零前端学习。**  
- **Gate B 前做数字孪生大盘 / 完整 3D 编辑器旗舰。**  
- 用 Go 轻辅修挤掉每日 Three.js 配额。  
- Tailwind/shadcn **全站**重写抢主项目时间。  
- 再开第四个同质 Todo/CRUD 仓库。  
- 阶段一追求 20+ 测试与完整 OpenAPI 而拖死 Gate A。  
- 只做 3D demo、从不部署、无法给面试官链接。

---

## 17. 里程碑（与门禁 + 3D 阶对齐）

### 6 周 · Gate A + 3D-0/1 启动

- API + PostgreSQL CRUD、筛选、分页与核心测试。  
- 能解释 Node、HTTP、SQL、连接池与事务基础。  
- 前端 F1 未断档；3D 最小场景或手册练习可展示。  
- 更新简历与作品集进度。

### 10 周 · 鉴权 + 3D-1 展示页

- 完成认证、归属校验与安全测试。  
- **个人站 glTF/Three 展示页上线。**  
- 可认真投递前端偏全栈与初级 Node 全栈。

### 14 周 · Gate B + 3D-2 可点开

- TaskFlow 前端已接自建 API；CI 与至少 1 条 E2E。  
- 演示可用；全栈链路口述 5 分钟。  
- **R3F（或 Three）交互作品有链接**（允许简版）。  
- 投递：通用前端为主，全栈与 3D 向为辅。

### 6 个月 · Gate C 向 + 3D-2 打磨

- 可部署、可监控、可迁移（深度按是否在职调整）。  
- 3D 作品达到「面试 60 秒流畅演示 + 性能基本可接受」。  
- 能排查基础 Node、数据库与线上错误。

### 9 个月

- Redis/队列/实时按需。  
- 独立交付中小型全栈功能。  
- 3D-3：资产管线或简易权限/元数据后端。

### 12 个月

- 旗舰：全栈 Web 3D 展陈/运营 **或** 可视化平台 + 真实工作项目。  
- 能从需求、数据、API、UI/3D、测试到部署完整讲解。  
- 再决定是否系统学 Go，或加深渲染/可视化专业方向。

---

## 18. 最终建议

你的发展不应是「放弃前端去当后端初学者」，而应是：

> **前端持续加深（含 WebGL/Three.js 特色）+ 责任边界向 API/数据/部署扩展。**

能力顺序可以记成：

> React/TS 产品前端 → Next 与工程化 → **Three/R3F 渐进作品** → Node API → PostgreSQL → 认证安全 → 测试 CI →（就业）→ 部署监控 → 3D 全栈旗舰。

**执行优先级一句话：**

> **14 周：TaskFlow 冲 Gate B 拿全栈证据；每天固定前端 F1 + Three 渐进 F3，禁止前端空窗；旗舰 3D 与系统 Go 后置，但 3D 小作品必须提前上线可点开。**

近期主投前端岗位；用自建 API 打开全栈通道；用 **可持续的 Web 3D 作品** 与「只会 CRUD 的全栈」拉开差距。
