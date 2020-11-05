---
title: '编码风格: EditorConfig, Prettier, ESLint, VS Code 配置'
date: 2020-09-25T13:16:34Z
tags: []

---

# 目标风格
1. 文件使用 `utf-8` 编码;
2. 缩进优先使用2空格(space);
3. 使用 `lf` 作为换行符;
4. 行尾不留空格;
5. 文件尾空一行;
6. 保存文件时自动格式化(format);
7. 先使用 Prettier 格式化, 再使用 ESLint 格式化;
8. 支持在 Prettier 基础之上自定义 ESLint 与 Prettier 冲突的规则;

# EditorConfig 配置
> 相关目标: `1, 2, 3, 4, 5`

见 https://github.com/isayme/editorconfig/blob/master/.editorconfig


# Prettier 配置
> 相关目标: `2, 3, 4, 5`

见 http://github.com/isayme/prettier-config
使用方法: 在 Prettier 的配置文件中直接填"@isayme/prettier-config", 注意其中使用的是双引号.

# ESLint 配置
> 相关目标: `7, 8`

见: https://github.com/isayme/eslint-config
ESLint 配置需要根据实际场景, 基础配置是:
```
extends: ['prettier']
```

# VS Code 配置
> 相关目标: `6, 7, 8`

```
// setting.json 配置
"editor.formatOnSave": false,
"editor.codeActionsOnSave": [
    "source.fixAll.format",
    "source.fixAll.eslint"
  ]
```
如果发现没有自动格式化, 试试加上配置:
```
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
```

需要安装 VS Code 插件: [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action).
