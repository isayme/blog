---
title: '编码风格: EditorConfig, Prettier, ESLint 作用'
date: 2020-09-21T03:17:40Z
tags: []

---

# 目标
跨平台, 支持多编辑器, 文件无关, 统一个人编码风格, 尽量避免定制化设定.

# 编码风格分类
## 代码风格问题(风格不符合一定规则)
[max-len](https://eslint.org/docs/rules/max-len)
[no-mixed-spaces-and-tabs](https://eslint.org/docs/rules/no-mixed-spaces-and-tabs)
[keyword-spacing](https://eslint.org/docs/rules/keyword-spacing)
[comma-style](https://eslint.org/docs/rules/comma-style)

## 代码质量问题(使用方式有可能有问题)
[no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)
[no-extra-bind](https://eslint.org/docs/rules/no-extra-bind)
[no-implicit-globals](https://eslint.org/docs/rules/no-implicit-globals)
[prefer-promise-reject-errors](https://eslint.org/docs/rules/prefer-promise-reject-errors)

# 工具
## editorconfig
`EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.`
适用 `代码风格问题`, 全平台支持, 语言无关.
支持大多数编辑器. 控制语法无关的风格, 详细可配列表见: https://editorconfig.org/#file-format-details

## Prettier
`An opinionated code formatter; Supports many languages; Integrates with most editors; Has few options`
适用 `代码风格问题`, 主要是 Javascript/Node.js/Typescript 生态.
使用 `prettier` 配置文件声明风格, 编辑器保存时自动格式化文件; 示例: https://github.com/isayme/prettier-config/blob/master/prettier.config.js

## ESLint
`ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.`
主要适用 `代码质量问题`, 也适用`代码风格问题`, 主要面向 Javascript/Node.js/Typescript 生态.

# 对比
## Prettier 与 editorconfig 功能有重叠, 两者差异是什么?
### 两者的适用范围有差异
editorconfig 适用任何文件, Prettier 主要适用 Javascript 生态;
比如 editorconfig 可以配置 Makefile 的缩进使用 TAB, 但 Prettier 不支持.
以这个角度看, 建议两者都使用, 可以将 Prettier 配置为 editorconfig 相同的风格;

### editorconfig 声明面向编辑器, Prettier 声明面向插件
比如 editorconfig 设置`indent_style = space` 和 `indent_size = 2`, 编辑器中输入`TAB`时, 会缩进 2 个空格.
但如果 Prettier 设置 `tabWidth = 4`, 在使用文件报错自动格式化时, 会重新将缩进改为 4 个空格.

### Prettier 在格式化时, 优先使用自身的配置, 降级使用 editorconfig 的配置

## ESLint 与 Prettier 功能有重叠, 两者差异是什么?
### 两者适用范围有差异
ESLint 更多解决的是`代码质量问题`; Prettier 更多解决的是`代码风格问题`.

### ESLint也可以格式化代码, 为什么还要用 prettier? 
[Prettier 官网对比: Prettier vs. Linters](https://prettier.io/docs/en/comparison.html)
[If eslint can auto fix/format code why to use Prettier?](https://github.com/prettier/prettier-eslint/issues/101)

# 官方网站
- [EditorConfig](https://editorconfig.org/#file-format-details)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

# 参考资料
[EditorConfig，Prettier and ESLint](https://github.com/xtyi/blog/issues/2)
[Prettier看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)
[Setting up ESLint and prettier with VS Code in 2019](https://pakatagoh.com/blog/setting-up-eslint-and-prettier-with-vs-code-in-2019)
[Using ESLint and Prettier in a TypeScript Project](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)
[搞懂 ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/80574300)
[深入理解 ESLint](https://zhuanlan.zhihu.com/p/75531199)
[vscode 中 prettier 和 ESLint 冲突的一点探讨](https://zhuanlan.zhihu.com/p/142105418)
[Comparison between tools that allow you to use ESLint and Prettier together](https://gist.github.com/yangshun/318102f525ec68033bf37ac4a010eb0c)