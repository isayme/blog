---
title: '一张图看懂 发布(Pub)/订阅模式(Sub) 与 观察者(Observer)模式'
date: 2018-08-17T03:05:57Z
tags: []

---

## 图解
![image](https://user-images.githubusercontent.com/1747852/44764223-444fa000-ab81-11e8-8866-bfa31bd7e880.png)
图片来源: [Observer vs Pub-Sub pattern][Observer vs Pub-Sub pattern]

## 两者的区别
两者的区别的根源都在于 发布/订阅 模式中的 `Event Channel`(更多的叫法是 `Broker` 或 `Event Bus`) 模块. 

- 发布者/订阅者 双方不知道对方的存在, 存在一个第三方维护订阅关系, 称为 `Broker` / `Event Bus`; 观察者模式中的 `Subject` 记录了所有订阅者的信息.
- 发布/订阅模式通常是异步的; 观察者模式通常是同步的.
- 发布/订阅模式适用于跨应用; 观察这模式通常是同一个应用.

## 参考资料
- [Observer vs Pub-Sub pattern][Observer vs Pub-Sub pattern]
- [Observer vs Pub-Sub](http://developers-club.com/posts/270339/)

[Observer vs Pub-Sub pattern]: https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c