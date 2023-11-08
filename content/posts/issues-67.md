---
title: 'NodeJS 模块系统备忘：CommonJS & ESM'
date: 2023-11-08T15:24:16Z
tags: []

---

> 本文记录了一些 `ESM 使用` 以及 `ESM 和 CommonJS 互相引用`的知识点，假定你对 CommonJS 和 ESM 有一定的了解。
> 你也可以参考 [ESM Module 的语法](https://es6.ruanyifeng.com/#docs/module) 和 [ESM Module 的加载实现](https://es6.ruanyifeng.com/#docs/module-loader) 获取更多信息。

首先，较新的 NodeJS 版本(>=16)可以加载 CommonJS 和 ESM，用户需指明具体某些文件是什么模块类型。可以简单参考如下：
![image](https://github.com/isayme/blog/assets/1747852/e416400e-f7bf-4c87-bf8d-324a0d36e0d6)

# ESM import 常用场景
一图胜千言
<img width="1175" alt="image" src="https://github.com/isayme/blog/assets/1747852/f686ae53-8116-47bf-be6f-812a1d7d3cb1">

## import { add } from 'moduleA'
此时 add 是 `moduleA` 导出的函数 `add`。
```
// moduleA.mjs
export function add(a, b) {
  return a + b
}
```

## import moduleA from 'moduleA'
此时 moduleA 是 `moduleA` 导出的 `default`, 等价于`import { default as moduleA } from 'moduleA'`
```
// moduleA.mjs
export default {
  add: function(a, b) {
    return a + b
  }
}
```

## import * as moduleA from 'moduleA'
此时 moduleA 对应模块 `moduleA` 中的所有导出的变量，包括`default`。
```
// moduleA.mjs
export function add(a, b) {
  return a + b
}
export default function add(a, b) {
  return a + b
}
```

# 模块类型混乱引发的异常
## 如果 package.json 中 type = commonjs，尝试运行 ESM 文件，会报错
<img width="1216" alt="image" src="https://github.com/isayme/blog/assets/1747852/e1dbad9f-0696-44af-bbf1-e6864a82ea98">

<img width="948" alt="image" src="https://github.com/isayme/blog/assets/1747852/ab61c3b6-a49e-4b5b-9277-8cf415912260">

## 如果 package.json 中 type = moudle，尝试运行 CommonJS 文件，会报错
<img width="1150" alt="image" src="https://github.com/isayme/blog/assets/1747852/37c6e33a-a57b-406c-91ef-ba8f798ac6ee">

<img width="1427" alt="image" src="https://github.com/isayme/blog/assets/1747852/92cddccc-369c-44a6-a8e3-21bed1bf6367">

# CommonJS 文件中引用 ESM 模块
使用场景较少，此处不谈论。

# ESM 文件中引用 CommonJS 模块
```
// tool.cjs
function add(a, b) {
  return a + b
}

exports.add = add
```
```
// test.mjs

// 三种方式都可以
import { add } from './tool.cjs'
import Tool1 from './tool.cjs'
import * as Tool2 from './tool.cjs'

console.log(add(1, 2))
console.log(Tool1.add(1, 2))
console.log(Tool2.add(1, 2))
```

ESM 引用 CommonJS 模块时，等价于 export CommonJS 中 exports，同时 export default CommonJS 中 exports。所以 `tool.cjs` 可以等价于 
```
// tool.mjs
function add(a, b) {
  return a + b
}

export { add }
export default { add }
```

# 一些模块已不再支持 CommonJS
如 [chalk](https://www.npmjs.com/package/chalk) 在 `5.x` 版本中完全使用 ESM 语法，不再支持 CommonJS。

<img width="745" alt="image" src="https://github.com/isayme/blog/assets/1747852/5dc70e2b-c30c-41e6-beb2-1324e236005f">
其中背景可参见[Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#pure-esm-package)。


如果你的代码还在使用 CommonJS，对于此类模块，只好使用旧版本。

# 做一个同时支持 CommonJS 和 ESM 的模块
技术上可以让一个模块同时兼容 CommonJS 和 ESM。官方参考文档：https://nodejs.org/api/packages.html#package-entry-points
方法是在模块中同时有 CommonJS 和 ESM 代码(加入分别在 cjs 和 mjs 子目录)，在 package.json 中指明两者的入口文件。
```
// package.json
{
  "main": "./cjs/index.js",
  "module": "./mjs/index.js",
  "exports": {
    "require": "./cjs/index.js",
    "import": "./mjs/index.js"
  }
}
```

其中的 "exports" 是简写，等价于
```
// package.json
{
  "exports": {
    ".": {
      "require": "./cjs/index.js",
      "import": "./mjs/index.js"
    }
  }
}
```