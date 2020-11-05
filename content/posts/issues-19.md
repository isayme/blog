---
title: 'navigator.sendBeacon'
date: 2018-08-02T08:16:56Z
tags: ["web"]

---

## 简介
方法的作用是对某个url发送`POST`请求, `不阻塞`业务代码, 请求会加入到浏览器队列, 由浏览器自主调度进行发送.

主要适用于调用方`不关心接口返回值`的场景, 比如 Google Analysis 统计类的请求 或是 用户行为日志记录类.

由于请求会加入到浏览器队列, **页面关闭 或 跳转 都不会导致请求丢失**.

## 浏览器支持(caniuse)
[点击查看](https://caniuse.com/#feat=beacon)

## 参考资料
- [Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [Logging Activity With The Web Beacon API](https://www.smashingmagazine.com/2018/07/logging-activity-web-beacon-api/#getting-started)
- [navigator.sendBeacon polyfill](https://github.com/miguelmota/Navigator.sendBeacon)
- [利用 sendBeacon 发送统计信息](https://csbun.github.io/blog/2014/12/send-beacon/)