---
title: 'TCP 半连接队列和全连接队列'
date: 2019-12-03T16:05:08Z
tags: []

---

## 半连接队列
TCP 建立连接需要三次握手. 当服务端收到客户端第一个SYN包时, 此连接在服务端状态是 SYN_RCVD,  服务端为此类状态的连接维护一个 **半连接队列(syns queue)**.
![image](https://user-images.githubusercontent.com/1747852/70062414-f0075b80-1620-11ea-8f42-47292f867b59.png)

## 全连接队列
当完成三次握手后, 连接在服务状态后(状态 ESTABLISHED), 在服务端 accept 之前, 连接会放到 **全连接队列(accept queue)**.

当队列满后, 新的客户端无法连接成功, 服务端会发送 RST 包拒绝连接, 反应到程序会报`connection reset by peer` 错误.

![image](https://user-images.githubusercontent.com/1747852/70061686-aec27c00-161f-11ea-857b-c3a3ac86a491.png)

除了 `connection reset by peer` 错误以外, 有可能还会遇到 `pipe broken` 错误. 

(未确认)场景是 connect 成功返回之后立即 write. 由于客户端 connect 是在收到服务端 syn+ack 包后. 此时连接并没有完全建立, 但客户端认为已经连接完成, 随后发起 write 写数据, 被判定为写已关闭(CLOSED)的连接, 所以会报 `pipe broken` 错误.

## 半/全连接队列长度
半连接队列长度由`/proc/sys/net/ipv4/tcp_max_syn_backlog`指定, 默认是2048.


全连接队列长度由`/proc/sys/net/core/somaxconn`和listen的参数backlog共同决定, 二者取最小值. 默认为128. Linux内核2.4.25之前, 是写死在代码常量 SOMAXCONN , Linux内核2.4.25之后, 在配置文件 `/proc/sys/net/core/somaxconn` 中直接修改, 或者在 `/etc/sysctl.conf` 中配置 `net.core.somaxconn = 128`.

## 关于 backlog
listen 方法有个参数 backlog, 定义连接队列长度. 

Linux 内核 2.2 之前, backlog = 半连接队列长度 + 全连接队列长度.
Linux 内核 2.2 之后, backlog = 全连接队列长度


## 全连接队列满后行为
通过 `/proc/sys/net/ipv4/tcp_abort_on_overflow` 指示行为.

如果值为`0`, 服务端丢掉握手第三个ack包, 等同于认为客户端并没有回复 ack, 服务端重传 syn+ack 包.
如果值为`1`, 服务端直接回复 rst 包, 关闭连接.
> syn+ack 重传次数通过 `net.ipv4.tcp_synack_retries` 控制.

## 参考资料
[关于TCP 半连接队列和全连接队列](http://jm.taobao.org/2017/05/25/525-1/)
[从一次 Connection Reset 说起，TCP 半连接队列与全连接队列](https://cjting.me/2019/08/28/tcp-queue/)
[译文: 深入理解Linux TCP backlog](https://www.jianshu.com/p/7fde92785056)
[How TCP backlog works in Linux](http://veithen.io/2014/01/01/how-tcp-backlog-works-in-linux.html)
[TCP SOCKET中backlog参数的用途是什么](https://www.cnxct.com/something-about-phpfpm-s-backlog/)
[TCP/IP协议中backlog参数](https://www.cnblogs.com/Orgliny/p/5780796.html)
[Linux TCP Backlog机制分析](https://codefine.site/2918.html)
[/proc/sys/net目录](https://blog.p2hp.com/archives/4378)
[TCP协议笔记](https://www.codedump.info/post/20190227-tcp/) 推荐