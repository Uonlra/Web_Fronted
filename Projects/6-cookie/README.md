# Cookie Consent Center

## 1. 项目目标

本项目用于练习 JavaScript 的 DOM 操作、事件处理和浏览器存储能力，模拟真实网站中的 Cookie 同意中心。

用户访问页面后，会看到右下角的 Cookie 弹窗。用户可以接受或拒绝非必要 Cookie；选择会被持久化，后续访问不再重复提示。

## 2. 当前功能

- 首次访问显示 Cookie 弹窗
- 提供 Accept all 和 Reject non-essential 两种选择
- 点击右上角关闭按钮或遮罩层时仅关闭弹窗，不写入同意结果
- 使用 cookie 保存用户选择，并设置过期时间
- 在后续访问中自动读取已保存的选择并跳过弹窗
- 支持 Escape 键关闭弹窗
- 使用遮罩层和对话框语义增强可访问性
- 在移动端保持良好的可读性和点击区域

## 3. 文件结构

- index.html：页面结构、弹窗结构、遮罩层、按钮与语义标记
- style.css：页面背景、弹窗样式、按钮样式、动画与响应式适配
- script.js：显示逻辑、事件绑定、cookie 读写与键盘交互
- README.md：简要说明
- PROJECT_DESCRIPTION.md：完整项目说明

## 4. 运行方式

1. 打开项目目录下的 index.html。
2. 首次进入页面时会自动弹出 Cookie 同意中心。
3. 选择接受或拒绝后刷新页面，弹窗不会再次出现。

## 5. 核心实现

### 5.1 DOM 选择

脚本通过 getElementById 选择以下节点：

- cookiePopup：弹窗容器
- cookieBackdrop：遮罩层
- acceptCookieBtn：接受按钮
- rejectCookieBtn：拒绝按钮
- closePopupBtn：关闭按钮
- pageContent：主内容区域

### 5.2 状态管理

用户选择通过 cookie 持久化保存：

- cookie 名称：cookieConsentStatus
- accepted：接受非必要 Cookie
- rejected：拒绝非必要 Cookie
- 保存周期：180 天

### 5.3 交互逻辑

- 页面加载后，如果未找到已保存选择，则延迟显示弹窗
- 点击 Accept all 会保存 accepted 并关闭弹窗
- 点击 Reject non-essential 会保存 rejected 并关闭弹窗
- 点击关闭按钮、遮罩层或按 Escape 键只会关闭弹窗

## 6. 设计说明

- 使用深色弹窗搭配浅色背景内容，形成清晰视觉层级
- 遮罩层让弹窗更接近真实站点的隐私确认体验
- 使用 show 类控制显示状态，并结合 hidden 属性减少初始闪烁
- 提供两个明确操作按钮，符合常见隐私弹窗交互习惯

## 7. 与题目要求的对应关系

题目要求：创建一个 Cookie 同意弹窗，包含消息和同意按钮，点击后消失；如果能保存用户同意信息则加分。

本项目完成情况：

- 已实现 Cookie 弹窗显示与关闭
- 已实现接受按钮和拒绝按钮
- 已通过 cookie 保存用户选择，实现后续访问不再出现弹窗

## 8. 可继续扩展的方向

- 增加隐私政策链接和 Cookie 分类说明
- 将选择同步到后端接口
- 增加“仅接受必要 Cookie”的更细粒度配置面板
- 提供可清除已保存偏好的设置入口

## 9.相关参考

https://roadmap.sh/projects/cookie-consent
