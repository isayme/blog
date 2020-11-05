---
title: ' Golang HTTP Hijacker'
date: 2020-10-21T12:28:10Z
tags: ["golang"]

---

# Hijack
Hijack 含义是 `劫持`, 在 Golang HTTP 语境, 是劫持 HTTP 连接.

Golang 中 `http.Hijacker` 是一个 interface, 默认 HTTP/1.x ResponseWriters 实现了该 interface, HTTP/2 则没有.
官方文档及示例见: [https://golang.org/pkg/net/http/#Hijacker](https://golang.org/pkg/net/http/#Hijacker)

**劫持结果**: HTTP Server 不再维护 HTTP连接对应的TCP socket Connection, 由调用者维护.

# 使用场景
HTTP连接建立后, 如果开发者希望接管对应的TCP连接, 则使用 Hijack 提供的能力. 典型的场景是 Websocket.

## Websocket
Websocket 连接建立是通过HTTP协议, 连接建立完成后升级为 Websocket 二进制协议.

## HTTP(S) Proxy
特别是HTTPS Proxy中, 客户端通过HTTP协议与Proxy建立连接, Proxy 连接服务后, 交换客户端与服务的二进制数据.

# 参考资料
[Go 中 Hijacker 的介绍和使用](https://liqiang.io/post/hijack-in-go)
