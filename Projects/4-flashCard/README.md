# 4-flashCard - Accessible Form UI (HTML + CSS)

这是一个仅使用 **HTML** 与 **CSS** 构建的静态表单 UI 练习项目。  
项目重点是：在还没有 JavaScript 交互逻辑的阶段，先把表单结构、视觉层次和可访问性（Accessibility）基础打牢。

## 项目目标

- 练习语义化 HTML 表单结构
- 练习 CSS 布局与响应式设计
- 通过真实 UI 场景落实无障碍最佳实践
- 为后续 JavaScript 增强（校验、进度联动、显示/隐藏密码）做好结构准备

## 页面内容

当前页面包含以下静态 UI 组件：

- Full Name 输入框
- Email 输入框（包含错误状态样式与错误提示）
- Enter Password 输入框（含“显示/隐藏密码”按钮占位）
- Confirm Password 输入框（含“显示/隐藏密码”按钮占位）
- Profile Completeness 圆形进度展示（示例为 65%）
- 任务清单（已完成项与未完成项）
- Update Profile 提交按钮（静态，无实际提交逻辑）

## 无障碍实现要点

本项目已在结构和样式层实现以下无障碍基础：

- 每个输入字段均使用 `label` + `for` 与控件明确绑定
- 必填字段添加 `required` 与 `aria-required`
- 错误输入示例使用 `aria-invalid="true"`
- 错误提示通过 `aria-describedby` 与对应输入字段关联
- 错误信息区域使用 `role="alert"`
- 进度区使用 `role="progressbar"` 与 `aria-valuenow/min/max`
- 输入框与按钮具备清晰的 `:focus-visible` 焦点样式，支持键盘用户
- 配色保持可读性与足够对比度（接近 WCAG 对比要求）

## 技术栈

- HTML5
- CSS3（自定义属性、Grid、响应式媒体查询）

## 项目结构

```text
4-flashCard/
├─ index.html
├─ style.css
└─ README.md
```

## 如何运行

1. 进入项目目录：`Projects/4-flashCard`
2. 使用浏览器直接打开 `index.html`

无需安装依赖，无构建步骤。

## 后续可扩展方向

可以在保留当前结构的基础上引入 JavaScript：

- 实现密码显示/隐藏（同步更新 `aria-pressed` 与可读反馈）
- 实现实时表单校验（邮箱格式、密码强度、确认密码一致性）
- 根据完成项动态更新进度（65% -> 100%）
- 在错误状态下自动聚焦首个无效字段，提升可用性

## 相关说明
此版本是静态 UI 组件，旨在先完成结构与可访问性基线。  
后续即使增加交互逻辑，也建议继续保持语义化结构与 ARIA 语义一致。

- 作者 <b> -- Uonlra
- 项目参考：https://roadmap.sh/projects/accessible-form-ui



