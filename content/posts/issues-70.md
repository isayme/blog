---
title: 'HTTP Cookie 常用属性解读'
date: 2024-02-28T12:49:01Z
tags: []

---

# Cookie 的特征
## Cookie 的读写
Web应用场景，服务器和浏览器都可以设置 Cookie 信息：
- 浏览器通过 document.cookie 读写 Cookie；
- 服务器通过请求 Header [Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie) 读 Cookie；
- 服务器通过响应 Header [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) 写 Cookie；

本文是对服务器写Cookie `Set-Cookie` 时常用属性做解读。

## Cookie 的归属及访问携带
1. Cookie 归属于一个 Domain，需要注意的是 `example.com` 和 `www.example.com` 是不同的 Domain。
2. 浏览器在访问 URL 时会将 URL 对应 Domain 及祖先 Domain 的 cookie 都携带发送到 Web 服务器。

用一个表格说明：
| Cookie 归属  | 访问 example.com 时是否携带 | 访问 www.example.com 时是否携带 |
| ------------- | ------------- | ------------- |
| example.com  | 携带 | 携带 |
| www.example.com | 不携带  | 携带 |


# 服务器如何写 Cookie 
服务器可以在请求响应时通过 Header `Set-Cookie` 设置 Cookie 信息，基本语法是：

```
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
Set-Cookie: <cookie-name>=<cookie-value>; Partitioned
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

# Set-Cookie 属性解读
设置 Cookie 时，除了 cookie-name 和 -cookie-value, 还有诸如 Domain，Expires，HttpOnly 等属性信息，本文就其中常用属性做解读。

## Domain={domain-value}
指定cookie 归属的 Domain，默认是当前网址对应的 Domain。

使用场景：用户在二级域名 auth.example.com 登录，登录完成后会通过 `Set-Cookie`设置 cookie，如果不设置 Domain，cookie 默认归属到 auth.example.com，当用户访问 www.example.com 或 example.com 时都不会带对应的 cookie。为了解决此问题就需要在登录后返回的 cookie 配置 `Domain=example.com`。

## Expires={date} 与 Max-Age={number}
两个都是设置 cookie 的有效期，只是方式有差异：
- Expires 指定的是具体过期时间；
- Max-Age 指定的是 cookie 的有效时长（单位秒）；

如果相应时两个属性都配置，则优先用 `Max-Age`。
如果相应时两个属性都未配置，则 cookie 会在浏览器关闭后失效；

这里需要重点说明的是，如果两个属性都未配置，很多浏览器关闭并重新打开时 cookie 并未失效，这是因为这些浏览器支持会话恢复功能，即用户重新打开浏览器时 cookie 也会恢复。假如想关闭这个特性，以 Chrome 举例，可以在设置中配置 `启动时打开新标签页`。
![image](https://github.com/isayme/blog/assets/1747852/f0276d1b-ae47-40c3-b4d7-f08da61e588c)

## HttpOnly
限制禁止 javascript 访问对应 cookie。

通常情况下，前端开发者可以通过 document.cookie 读取 cookie 信息，但是设置了 HttpOnly 属性的 cookie 无法通过 document.cookie 读取。

使用场景：以登录为例，通常登录后服务器会返回一个 cookie 记录用户信息，前端页面通常不需要感知对应 cookie，此时服务器就可以对这个 cookie 配置 HttpOnly 属性，防止 javascript 读取到此 cookie。

## Secure
限制浏览器仅在使用 https 访问服务器是才携带对应 cookie。

现代的网站服务器基本都在使用 https 以保障数据安全。如果没有特别需要使用 http 的必要，建议 set-cookie 时都附加此配置。

## SameSite={samesite-value}
跨站安全配置。详见 [阮一峰: Cookie 的 SameSite 属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

## Path
限制 Cookie 的生效路径。

通常不需要使用，有需要可以查看文档 [Path={path-value}](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#pathpath-value)。

# 参考资料
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [Chrome doesn't delete session cookies](https://stackoverflow.com/a/10772420/1918831)
- [阮一峰: Cookie 的 SameSite 属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
