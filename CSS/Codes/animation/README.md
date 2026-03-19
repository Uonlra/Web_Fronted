# Sass 经典练习项目

## 什么是 Sass

Sass 是 CSS 的预处理器。
它让你在写样式时可以使用 CSS 本身没有的能力，比如：

- 变量：统一管理颜色、间距、字体
- 嵌套：让组件结构更清晰
- mixin：复用一段样式逻辑
- extend：复用已有规则
- 循环与条件：批量生成样式
- 模块拆分：把大样式文件拆成多个部分维护

浏览器不能直接识别 `.sass` / `.scss`，所以 Sass 最终需要被编译成普通的 `.css`。

## `.sass` 和 `.scss` 的区别

- `.sass`：使用缩进语法，不写大括号和分号
- `.scss`：语法更像普通 CSS，写法更接近你平时看到的样式文件

例如同样的内容：

```sass
.btn
  color: red
```

```scss
.btn {
  color: red;
}
```

如果你是刚开始学，`.scss` 通常更容易上手；如果你想练习 Sass 的原生缩进风格，可以继续用 `.sass`。

## 当前项目结构

```text
animation/
|- index.html
|- hello.sass        # Sass 缩进语法入口文件
|- hello.scss        # SCSS 语法入口文件
|- hello.css         # 编译后的 CSS
|- hello.css.map     # Source Map
|- README.md
|- sass/
|  |- _variables.sass
|  |- _mixins.sass
|  |- _base.sass
|  |- _components.sass
```

## 这个项目演示了什么

- `_variables.sass`：颜色、圆角、间距、字体等变量
- `_mixins.sass`：按钮和面板这两类可复用样式
- `_base.sass`：全局基础样式和布局
- `_components.sass`：Hero、卡片、按钮、响应式规则
- `hello.sass`：缩进语法入口
- `hello.scss`：更接近 CSS 的入口写法

## 如何编译

如果你使用 `.sass`：

```bash
sass hello.sass hello.css --watch
```

如果你使用 `.scss`：

```bash
sass hello.scss hello.css --watch
```

如果你想生成 source map：

```bash
sass hello.sass hello.css --watch --source-map
```

## 学习顺序建议

1. 先看 `hello.sass`，理解入口文件做什么。
2. 再看 `_variables.sass` 和 `_mixins.sass`。
3. 然后看 `_components.sass`，理解嵌套、循环和组件组织。
4. 最后对照 `hello.css`，观察 Sass 编译后变成了什么。
5. 再看 `hello.scss`，理解它和 `.sass` 的语法差异。
