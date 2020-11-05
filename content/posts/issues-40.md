---
title: 'Koa/Express 定义含有冒号(:)的路由'
date: 2019-01-17T14:37:13Z
tags: ["Node.js"]

---

在 Koa/Express 等 Node Web 框架中, 可以通过冒号(:)定义路由参数.

```
// GET /users/123/books/456

//Express
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params) // => { userId: '123', bookId: '456' }
})

// Koa
router.get('/users/:userId/books/:bookId', (ctx, next) => {
  console.log(ctx.params); // => { userId: '123', bookId: '456' }
})
```

Google 的 [Restful API 指导](https://cloud.google.com/apis/design/custom_methods) 中, 通过 `冒号+动词` 描述无法通过 HTTP method 表达的接口. 如: `POST /files/a/long/file/name:undelete`.

由此引出问题: Koa/Express 如何定义含有冒号(:)的路由 ?

Koa/Express 背后都是使用的 [Path-to-RegExp](https://github.com/pillarjs/path-to-regexp). `path-to-regexp>=0.2` 版本支持通过转义达到效果.

目前 Express 使用的是`0.1.7`版本, 暂不支持. 官方计划在 Express 5 版本升级 `path-to-regexp` 版本: [#3419](https://github.com/expressjs/express/issues/3419) [#3409](https://github.com/expressjs/express/pull/3409) [#3142](https://github.com/expressjs/express/issues/3142) [#2530](https://github.com/expressjs/express/pull/2530).

[Koa-Router](https://github.com/alexmingoia/koa-router) 使用的是`^1.1.1` 版本, 可以正常支持. 示例代码:
```
router.post('/tasks/:_id\\:undelete', (ctx, next) => {
	console.log(ctx.params)
}
```

## 参考资料
- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Koa-Router URL parameters](https://github.com/alexmingoia/koa-router#url-parameters)
- [Custom Methods  | Cloud APIs](https://cloud.google.com/apis/design/custom_methods)