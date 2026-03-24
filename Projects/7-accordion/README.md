# Accordion Component

一个现代化的手风琴（Accordion）组件，用于展示 FAQ 或分类内容。

## 功能特性

- ✨ 优雅的手风琴展开/收起动画
- 🎯 同时只能打开一个部分
- 📱 完全响应式设计
- ♿ 语义化 HTML 结构
- 🎨 现代化的视觉设计

## 文件结构

- `index.html` - 手风琴组件的 HTML 结构
- `style.css` - 样式和动画
- `script.js` - 交互逻辑

## 使用方法

1. 在浏览器中打开 `index.html` 文件
2. 点击任何问题标题来展开对应的答案
3. 点击已打开的标题可以关闭它
4. 同时只能打开一个问题的答案

## 组件结构

```html
<div class="accordion">
    <div class="accordion-item">
        <button class="accordion-header">
            <span>问题标题</span>
            <span class="icon">v</span>
        </button>
        <div class="accordion-content">
            <div class="accordion-body">
                答案内容
            </div>
        </div>
    </div>
</div>
```

## 样式自定义

可以通过修改 `style.css` 中的以下变量来自定义样式：

- 背景色和文本颜色
- 按钮高度和字体大小
- 动画速度（`transition: 0.3s`）
- 边框圆角大小

## 技术细节

- **HTML5** 语义标签
- **CSS3** Flexbox 布局和过渡动画
- **Vanilla JavaScript** 事件处理，无框架依赖
