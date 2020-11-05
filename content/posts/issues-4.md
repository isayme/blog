---
title: 'HTTP Keep-Alive'
date: 2017-12-01T08:05:25Z
tags: ["HTTP", "Keep-Alive"]

---

HTTP持久连接(HTTP persistent connection, 也称作 HTTP Keep-Alive)是使用同一个 TCP 连接来发送/接受多个 HTTP 请求/应对的方法.

### 优势
区别与每个请求都打开独立的 TCP 连接, 持久连接的优势有: 
1. 减少新建 TCP 带来三次握手时间(如下图); 
2. 减少连接数(系统同时打开的连接数有限);

![900px-http_persistent_connection](https://user-images.githubusercontent.com/1747852/33525043-28b23530-d862-11e7-827a-c3aaeccafd53.png)

### 如何启用 HTTP Keep-Alive
在发起请求时携带 header: `Connection: Keep-Alive`.

如果服务端支持持久连接, 则会在响应头中附带 header: `Connection: Keep-Alive`.
如果服务端不支持持久连接, 则会在响应头中附带 header: `Connection: close`.

### Wireshark 抓包
#### 未使用 `Connection: Keep-Alive` 时
其中 `51`-`62`条报文为第一次请求, `67`-`78`条报文为第二次请求. 
两次请求都有独立的三次握手及四次挥手报文. 并分别使用了`50103`及`50104`端口.
![image](https://user-images.githubusercontent.com/1747852/33525149-bf6137ae-d864-11e7-9ac9-32c3aa5b115e.png)

#### 使用 `Connection: Keep-Alive` 时
其中 `27`-`34`条报文为第一次请求, `41`-`44`条报文为第二次请求.
第一次请求有三次握手报文但没有挥手报文, 第二次请求由于复用第一次的 TCP 连接, 所以无需握手报文, 也是因为复用连接, 两次请求用的是相同的端口(`50654`).
![image](https://user-images.githubusercontent.com/1747852/33525232-82450236-d866-11e7-9e9d-bec0cc260b05.png)

**特别需要说明的是**: `39`/`40`是`Keep Alive`检测报文, 用于确认 TCP 连接状态是否正常.

### 参考资料
- [HTTP persistent connection](https://en.wikipedia.org/wiki/HTTP_persistent_connection#Advantages)
- [理解HTTP之keep-alive](http://www.firefoxbug.com/index.php/archives/2806/)