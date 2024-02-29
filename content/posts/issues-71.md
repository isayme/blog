---
title: '网站登录如何实现”记住我“功能'
date: 2024-02-29T12:21:14Z
tags: []

---

# 什么是”记住我“？
以前的网站登录，很多都有个”记住我“功能，这个功能名字并未统一，也有的网站叫“下次自动登录”，也有的叫“十天内免登录”，它们只是名字不同，本质相同。

这里举例微博和网易的登录框：
![image](https://github.com/isayme/blog/assets/1747852/0f70548c-aad4-4dbd-9110-fa378c6e5347)
![image](https://github.com/isayme/blog/assets/1747852/10c07a6e-e655-47d3-bbff-c1d17bd4a887)

用户勾选”记住我“后登录，在一段时间内再次访问网站无需重新输入账号密码做登录。

# 如何实现”记住我“
用户在输入账号密码点击登录后，服务器会通过响应Header `Set-Cookie` 返回登录凭证，根据是否选中”记住我“， 这个 `Set-Cookie` 有稍许不同：

## 选中”记住我“时
`Set-Cookie` 会通过 `Max-Age` 或 `Expires` 属性设置 Cookie 有效期。

比如网易的”十天内免登录“就是指 Cookie 有效期是十天。微博未明确说明 Cookie 有效期，一般用户也无需关注。

虽然此时登录凭证 Cookie 具有有效期，用户实际很少会在有效期后需要重新登陆。因为大部分网站都会在一定时机刷新 Cookie 有效期，比如虽然网易是“十天内免登”，但如果你每天都需要访问网易，网易可以每天都刷新一次 Cookie 有效期，降低重新登录的概率。只有在持续十天未再次访问网易时才需要重新登陆。

## 未选中”记住我“时
`Set-Cookie` 不会附带 `Max-Age` 或 `Expires` 属性设置，此时 Cookie 有效期通常就是直到`浏览器进程关闭`。MDN 上说明是 `If unspecified, the cookie becomes a session cookie. A session finishes when the client shuts down, after which the session cookie is removed.`。

如果你实际测试验证，很可能会发现即使未勾选”记住我“，登录后退出浏览器并重新打开时登录态还在，并没有如期需要重新登录。这是因为现在浏览器普遍支持`会话恢复`功能，开启时即使退出浏览器会话也不会清除，比如 Chrome 的设置：
![image](https://github.com/isayme/blog/assets/1747852/1599e3b8-24f9-4f3a-8ec0-8637e2ab6a73)

MDN 上对此也有特别说明：
> Many web browsers have a session restore feature that will save all tabs and restore them the next time the browser is used. Session cookies will also be restored, as if the browser was never closed.

注：实际测试时(2024-02-29)，微博每次登录后都会要求手机扫码或短信验证，这个过程丢失了”记住我“这个信息，等于这个选项无效。

# 样例代码实现
这里给出 Node 样例代码，去除了不相关信息，仅为”记住我“保留最基本的逻辑。
```
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// 配置session中间件
app.use(session({
  secret: 'your_secret_key', // 用于签名cookie
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 有效期7天
}));
// 配置cookie解析中间件
app.use(cookieParser());

// 登录接口
app.get('/login', (req, res) => {
  // 在这里，你应该检查用户名和密码是否正确
  // 假设用户名和密码都是正确的

  if (req.query.rememberMe) {
    // 指定7天有效期，单位秒
    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
  } else {
    // 不指定有效期
    req.session.cookie.expires = false;
  }

  res.send('登录成功');
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000/');
});
```

如果通过3000端口访问`/login`接口时，根据是否指定`rememberMe`参数分别会返回不同的 `Set-Cookie`：

### 未选中”记住我“
```
# curl -v http://127.0.0.1:3000/login

Set-Cookie: connect.sid=s%3A57MqvQ2gbkNU9LIoQS957bBhQTx9eqpF.3%2FTHHCNGzs4%2BpVbYTIkrPMX5Ayv9Pidw%2BVMHGuRYxY0; Path=/; HttpOnly
```

### 选中”记住我“
```
# curl -v http://127.0.0.1:3000/login\?rememberMe\=true
Set-Cookie: connect.sid=s%3AegFS3jS-CB0j6TbG1j5kfkhkf_2mg1vb.PiG2WHfDnvP%2BQzbyjD4R93niBFeNYn0hcTvJ8A%2BFxYw; Path=/; Expires=Thu, 07 Mar 2024 11:39:17 GMT; HttpOnly
```

两者的差异仅在是否有 `Expires` 属性信息。

# 是否还需要”记住我“功能？
早期“记住我”主要还是适用于网吧这类公共场景，为了用户账号安全，在公共场景登录账号建议不勾选“记住我”，重启浏览器登录态即清除。

近些年的网站基本都不再提供”记住我“功能，即使微博提供了“记住我”实际也有bug等同虚设。

现代浏览器基本都有“会话恢复”功能，随着个人电脑和手机普及度急速提升，用户也乐于在个人设备上开启“会话恢复”功能。

这个功能当前对大多数用户意义都不是很大，而且用户也未必能理解“记住我”的含义。

现代网站登录都有APP扫描或短信验证或两步验证等方式做二次验证，安全性已经足够。

综上，我个人认为，目前已不再需要“记住我”功能，需要它的时代已过去，其历史使命已完成。

# 关联信息
- [HTTP Cookie 常用属性解读](https://blog.isayme.org/posts/issues-70/) #70 