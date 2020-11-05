---
title: 'Node.js HTTP(s) 服务如何获取客户端IP'
date: 2018-03-23T06:08:49Z
tags: ["HTTP", "Node.js"]

---

# 获取 IP 的几种来源
## req.connection.remoteAddress

参考: https://nodejs.org/api/net.html#net_socket_remoteaddress

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521635043387_image.png)


指 socket 连接的源IP信息, 适用于客户端 **直连** 服务端的场景.


## X-Forwarded-For (RFC 7239)

通常 Server 端不会直接与 Client 端通信, 而是通过 Nginx 等代理接受客户端请求, 这时候 `remoteAddress` 是代理服务的地址, 无法描述客户端IP.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521638570931_image.png)


由此引入了HTTP 扩展协议头: `X-Forwarded-For` , 格式是:

> X-Forwarded-For: client, proxy1, proxy2

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521640336777_image.png)


获取的时候取 `X-Forwarded-For` 的第一个 IP 地址即可. 
但需要注意的是: `X-Forwarded-For` 可伪造! 

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521640927050_image.png)


通常 Nginx 作为 proxy 时的配置:

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
## X-Real-IP

代理程序设置请求源的 IP 信息, 目前并不是 RFC 标准.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521640589992_image.png)


`X-Real-IP` 不可伪造, 但仅能描述最近一个代理的真实IP, 如果有多级代理, 仍旧不可作为真实客户端的 IP.

通常 Nginx 作为 proxy 时的配置:

> proxy_set_header X-Real-IP $remote_addr;


# 对比
|       | req.connection.remoteAddress | X-Forwarded-For | X-Real-IP(前提是自有Nginx主动设置) |
| ----- | ---------------------------- | --------------- | ------------------------- |
| 是否可伪造 | 否                            | 是               | 否                         |
| 有效性   | 仅在客户端直连服务端时                  | 仅在未伪造时          | 仅在客户端未经过多级代理时             |

# Express 中获取 IP 方式及建议
## req.ip (readonly)

默认是返回的是 `req.connection.remoteAddress`;
当设置 `app.set('trust proxy', true)` 时, 返回的是 `X-Forwarded-For` 中的第一个 IP;

> 注: 如果 `X-Forwarded-For` 第一个被伪造且不是一个正常IP, `req.ip` 不会做任何处理.
## proxy-addr

`req.ip` 背后用的即是 `proxy-addr`, 不单独讨论.

## request-ip

综合了多种 Header 建立了 IP 获取的优先顺序, 同时如果有伪造的异常数据会进行过滤.

https://github.com/pbojinov/request-ip#how-it-works

![](https://d2mxuefqeaa7sj.cloudfront.net/s_BCB05ABD162D2484387AF70CA3C0C23647660D92DD34FC0EC56105D7732260FE_1521645376934_image.png)

## 推荐 Express 做法

使用 `request-ip` 库:
```
const express = require('express')
const requestIP = require('request-ip')
const app = express()
    
app.set('trust proxy', false) // default is false
app.use(requestIP.mw({ attributeName: 'clientIP' })
```

推荐 Nginx 配置:

```
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Real-IP $remote_addr;
```

# 引申阅读
## req 上的各种 remoteAddress 异同

https://stackoverflow.com/a/19524949/1918831


- `req.connection.remoteAddress`
- `req.socket.remoteAddress`
- `req.connection.socket.remoteAddress`
- `req.info.remoteAddress`


1. `req` 是 `http.IncomingMessage` 的实例
2. `req.connection` === `req.socket` : https://nodejs.org/api/http.html#http_request_socket (lib/_http_incoming.js)
3. `req.connection.socket` : https only & node <= 0.11.2 有效
4. `req.info` : for [hapi](https://hapijs.com/) 框架, https://hapijs.com/api#-requestinfo


# 参考资料

- [proxy-addr](https://github.com/jshttp/proxy-addr)
- [req.ip](http://expressjs.com/en/api.html#req.ip)
- [request-ip](https://github.com/pbojinov/request-ip)
- [socket.remoteAddress](https://nodejs.org/api/net.html#net_socket_remoteaddress)
- [RFC 7239: Forwarded HTTP Extension](https://tools.ietf.org/html/rfc7239)
- [HTTP 请求头中的 X-Forwarded-For](https://imququ.com/post/x-forwarded-for-header-in-http.html)