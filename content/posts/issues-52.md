---
title: 'xlan: Golang 实现一个内网穿透工具'
date: 2020-09-29T14:21:42Z
tags: ["golang"]

---

# 目标
通过因特网(Internet)访问局域网(LAN)中的服务.

# 限制条件
内网本身无因特网IP, 无法通过局域网路由器的端口转发功能转发请求.

# 解决方案
方案为`内网穿透`, 目前有开源产品 [frp](https://github.com/fatedier/frp).
本文实现的工具取名 [xlan](https://github.com/isayme/go-xlan), 服务端, 客户端分别称为 `xlans` 和 `xlanc`

# 设计
完整通信链路由 4 部分组成: 用户(user), 内网穿透服务端(xlans), 内网穿透客户端(xlanc), 最终服务(service), 其中 `xlans` 有公网 IP 地址.

`总体思路`: `user` 无法直接访问 `service`, 但是可以访问 `xlans`, `xlans` 将用户的请求转交给 `xlanc`, 由 `xlanc` 代为访问 `service`.

# 关键链路
![image](https://user-images.githubusercontent.com/1747852/94570219-33fad980-02a1-11eb-8ee0-a088caa27dc5.png)

第1步: xlanc 启动时与 xlans 建立`控制连接`, 注册 service 信息, 接收来自 xlans 的指令;
第2步: user 向 xlans 发起请求, 建立连接 A;
第3步: xlans 向 xlanc 发起指令, 告知有 user 请求 service;
第4步: xlanc 向 xlans 建立`数据连接` B;
第5步: xlanc 向 service 建立连接 C;
最后: xlans 将连接 A 和 B 的数据进行交换, xlanc 将连接 B 和 C 的数据进行交换, 达到 user 和 service 通信的目的.
