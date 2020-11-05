---
title: '编码风格: ESLint 和 Prettier 如何在 VS Code 配合工作?'
date: 2020-09-24T10:22:58Z
tags: []

---

> 信息可能会有时效性, 当前相关工具版本信息: VS Code: 1.49.1, ESLint 插件: 2.1.8 , Prettier 插件: 5.7.1

# VS Code 提供的能力
## 1. 文件保存时执行特定动作(action)
1.23 版本加入的新特性 [Run Code Actions on save](https://code.visualstudio.com/updates/v1_23#_run-code-actions-on-save). 可以配置在文件保存时执行的动作.
```
"editor.codeActionsOnSave": {
     "source.organizeImports": true // 这里是需要执行的动作.
}
```
这个配置在 1.41 版本 [更新](https://code.visualstudio.com/updates/v1_41#_eslint), 加强 ESLint的`Auto Fix on Save`能力.
```
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
```

## 2. 文件保存时自动格式化文件(format)
VS Code 1.6 版本加入的特性: [Format On Save](https://code.visualstudio.com/updates/v1_6#_format-on-save). 可以在文件保存是格式化文件.
```
// 通过如下配置项开启.
"editor.formatOnSave": true
```

# Prettier 提供的能力
[Prettier](https://prettier.io/) 本身是一个格式化工具, 通过 [插件](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 集成到 VS Code.

Prettier 将自己注册为 VS Code 格式化(formatter) 工具, 在 VS Code `formatOnSave` 保存时格式化文件.

# ESLint 提供的能力
[ESLint](https://eslint.org/) 主要是编码质量的检测工具, 也可以有编码质量检测, 提供风格修正(fix)能力. 通过 [插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 集成到 VS Code.

ESLint 将注册 `codeActionsOnSave` 能力到 VS Code, 从而可以配置在 `codeActionsOnSave` 期间格式化代码.


# VS Code 中 ESLint 与 Prettier 插件并存
如果 VSCode 同时安装了 ESLint 和 Prettier 插件.

当 `formatOnSave` 和 `codeActionsOnSave` 都开启时, 保存文件会先后触发 ESLint 和 Prettier 格式化, 最终格式化会以 Prettier 风格为准.

如果自定义风格与 Prettier 冲突的风格, 将无法生效. 比如ESLint 配置项 `space-before-function-paren` 期望函数左括号前面空一格, 但 Prettier 期望不空格. 按照 ESLint  和 Prettier 的执行顺序, 最终会格式化为无空格.

## 忍痛禁用特定文件的 prettier 格式化
不愿意删除 Prettier 插件时, 如果 Prettier 的格式化风格不符合期望, 可以配置将其禁用, 增加 `.prettierignore` 文件指定需要忽略的文件.

## 在 `prettier` 之后执行 `eslint --fix` ?
直接禁用 Prettier 还是比较粗暴, 如果能实现 `prettier` 之后执行 `eslint --fix` 也是可以解决问题的.

VS Code 1.44 版本 [Explicit ordering for Code Actions on save](https://code.visualstudio.com/updates/v1_44#_explicit-ordering-for-code-actions-on-save) 支持将 `editor.codeActionsOnSave` 配置为数组, 按顺序执行其中的动作.

如果 Prettier 将自己注册为其中的动作, 则可以配置运行顺序. 目前已经有开发者向 Prettier 建议 [Add code action to format with prettier in codeActionsOnSave in VS Code](https://github.com/prettier/prettier-vscode/issues/1555).

在 Prettier 插件不改变的情况下, 还有一种[思路](https://github.com/prettier/prettier-vscode/issues/1277#issuecomment-621175180): 关闭`editor.formatOnSave`, 将其注册为`editor.codeActionsOnSav`动作, 可以达到同样的效果. 目前插件 [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action) 已经实现此功能.

`eslint-config-prettier` 会注册自己的规则到 ESLint, 会继续按照自己的风格提示错误信息, 与自定义的风格冲突, 可以不使用`eslint-plugin-prettier`, 只在 ESLint 中使用 `eslint-config-prettier`: 关闭 Prettier 相关规则, 不提示 Prettier 风格问题, 保存时由`Prettier`自动修复风格问题即可.

# 项目中 ESLint 与 Prettier 配置
由于 Prettier 的配置会与 ESLint 的冲突, 为了方便使用, Prettier 官方提供 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 将冲突的 ESLint 配置项(如`space-before-function-paren`)全部关闭.

由于冲突的配置项被关闭, 相关的编码风格将不在检测, 为了继续检测这些风格, Prettier 提供 ESLint 插件 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 注册规则(rule) `prettier/prettier` 到 ESLint, 开启这个规则后即可通过 ESLint 检测 Prettier 风格问题.

## 配置 Prettier 到 ESLint
安装依赖 `npm install --save-dev eslint-config-prettier eslint-plugin-prettier`
修改 ESLint 配置:
```
// .eslintrc
{
  "extends": ["plugin:prettier/recommended"]
}

// 上面的配置方式和下面这个写法效果等同: https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```