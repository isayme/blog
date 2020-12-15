---
title: 'Lerna 学习笔记'
date: 2020-10-15T11:37:21Z
tags: ["Node.js"]

---

# Lerna 是什么
> A tool for managing JavaScript projects with multiple packages.

[Lerna](https://lerna.js.org/) 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目。

# 解决什么问题
为了代码共享, 大型项目会将代码分成多个代码仓库为独立的包(package). 

如果某个包更改, 需要反向要求依赖该包的包升级依赖版本, 包少的时候还不是很成问题, 但当依赖链错综复杂时, 这个升级依赖的过程会极为痛苦.

为了解决这个问题, 如 Babel, React 等项目会将多个包放到一个代码仓库进行管理, 此种管理方式称为: Monorepo.
Lerna 是一个优化 Monorepo 工作流的工具.

# Lerna 工作模式
一个仓库下有多个包, 那么每个包的版本号如何管理?

Lerna 支持两种模式: **Fixed/Locked mode (default)** 和 Independent mode
前者是所有包使用同一个版本号, 后者是每个包独立版本号.

`lerna.json` 含有配置项 `"version": "independent"` 表示使用 Independent mode.
否则 `lerna.json` 中的 `version` 即为所有包的共用版本号.

`lerna init` 默认初始化为 Fixed/Locked mode, **推荐**使用.
独立版本号会导致版本依赖关系错综复杂, 长期维护会混乱.

# 如何使用
## 安装
```bash
npm install --global lerna
```

## 初始化项目
```bash
git init lerna-repo && cd lerna-repo
lerna init
```

得到的目录结构
```bash
lerna-repo/
  packages/
  package.json
  lerna.json
```

## 
## 常用命令
### lerna init
初始化 或 升级 当前仓库为 lerna 模式.

### lerna bootstrap
安装子包依赖. 相当于每个子包下执行 `npm i` .
根目录的依赖并不会安装.

### lerna create \<name\>
新增子包

### lerna add \<package\> [--dev] [--scope=module]
新增依赖, 默认会在每个包中添加对应依赖. 通过 `--scope` 参数指定仅特定包增加此依赖.

### lerna run [script]
每个子包中执行对应的script命令.

### lerna exec
每个子包中执行对应的命令. 例: `lerna exec -- ls` 
与 `lerna run` 的区别在于执行的命令是 shell 不是 package.json 中的 scripts.

### lerna version
创建新的版本.
会自动维护跟目录及子包package.json中的版本号, 子包直接的依赖版本号也会自动更新.

### lerna clean
删除所有子包中的 node_modules 目录.
根目录的 node_modules 不会删除.

# 更优体验 = Lerna + Yarn
## 配置 lerna 使用 yarn 管理依赖
在 `lerna.json` 中配置 `"npmClient": "yarn"` 即可.

## 配置 lerna 启用 yarn Workspaces
1. 配置`lerna.json/useWorkspaces = true` ;
1. 配置根目录 `package.json/workspaces = ["pacages/*"]` , 此时 lerna.json 中的 `packages` 配置项将不再使用;
1. 配置根目录 `package.json/private = true` ;

上面三个配置项需同时开启, 只开启一个 lerna 会报错.

此时执行 `lerna bootstrap` 等价于 `lerna bootstrap --npm-client yarn --use-workspaces` 等价于 `yarn install` 

由于 yarn 会自动 `hosit` 依赖包, 无需再 `lerna bootstrap` 时增加参数 `--hoist` (加了参数 lerna 也会报错)

## 依赖管理
安装在根目录: `yarn add -W xxx` 
安装包: `yarn workspace <module> add xxx` or `lerna add --scope=<module> xxx` 
为所有子包安装包 `lerna add xxx` or `lerna exec -- yarn add xxx` 

删除根目录包: `yarn remove -W xxx` 
删除包: `yarn workspace <module> remove xxx` or `lerna exec --scpope=<module> -- yarn remove xxx` 
为所有子包删除包 `lerna exec -- yarn remove xxx` 

## Lerna 与 Yarn 分工
包管理的能力交给Lerna, 如版本管理;
依赖管理的能力交给Yarn, 如依赖包的安装删除;
# 常见问题
## 如何使用 yarn
learn.json 中配置 "`npmClient": "yarn"` 

## 子包之间如何依赖
直接安装对应包即可.
> lerna add xxx [--scope=module]

## 子包共用dev包
比如 eslint/typescript/husky 等包没必要安装多份.
`npm i xxx --save-dev`
`yarn add xxx --dev -W`  注意 `-W` 参数.

## 如何删除依赖
`learn exec [--scope=module] -- npm uninstall xxx` 
`learn exec [--scope=module] -- yarn remove xxx`
`yarn workspace <module> remove xxx` 

## 避免共用依赖安装多份
> 建议使用 yarn 会有更好体验, 以下文字针对 npm 场景.

如所有子包都依赖 `lodash` , 每个子包的node_modules都会安装一份会浪费磁盘空间.
可以通过 `lerna bootstrap --hoist` 将共用的包安装到根目录的 `node_modules` 目录.
`--hosit` 参数不适用 yarn, 但其实 yarn 会自动优化避免包被安装多份.
可以配置 `lerna.json/command.bootsrap.hoist = true` 以省去每次都输入 `--hoist` 参数.

# 参考文档
官方文档: [https://lerna.js.org/](https://lerna.js.org/)
[基于lerna和yarn workspace的monorepo工作流](https://zhuanlan.zhihu.com/p/71385053)
[lerna+yarn workspace+monorepo项目的最佳实践](https://juejin.im/post/6844903918279852046)
