---
title: 'TCP "粘包" 备忘'
date: 2018-12-20T06:11:20Z
tags: ["TCP"]

---

TCP 属于流式(stream)连接, 协议中并没有`粘包`的定义.

基于 TCP 的应用发送端发送的数据通常有结构, 接收端需要从 TCP 数据 **流** 中`切分`出发送端不同次的数据以便解析数据.

`切分`需要解决的问题即是`粘包`. 

`粘包`与 TCP 无关, 是**应用层**对数据`切分`问题的形象定义.

`半包` 是 `粘包` 的其中一个场景.

## 参考资料
- [golang中tcp socket粘包问题和处理 - 快乐编程](http://www.01happy.com/golang-tcp-socket-adhere/)
- [idea’s blog -   炮打TCP – 关于一而再再而三的粘包拆包问题的大字报](http://www.ideawu.net/blog/archives/1027.html)
- [解Bug之路-TCP粘包Bug - WebFalse文档托管平台](https://www.webfalse.com/read/207386/11936739.html)
- [解决golang开发socket服务时粘包半包bug – 峰云就她了](http://xiaorui.cc/2016/03/08/%E8%A7%A3%E5%86%B3golang%E5%BC%80%E5%8F%91socket%E6%9C%8D%E5%8A%A1%E6%97%B6%E7%B2%98%E5%8C%85%E5%8D%8A%E5%8C%85bug/)
- [Netty精粹之TCP粘包拆包问题 - Float_Luuu的个人空间 - 开源中国](https://my.oschina.net/andylucc/blog/625315)
- [使用bufio处理TCP粘包问题 | 成长之路](https://feixiao.github.io/2016/05/08/bufio/)