---
title: 'MongoDB 特性: Change Stream'
date: 2018-08-14T01:59:31Z
tags: ["mongodb"]

---

> 要求 MongoDB >= 3.6

官方文档: [Change Streams](https://docs.mongodb.com/manual/changeStreams/)

通过此特性可以做到对 [collection/database/deployment](https://docs.mongodb.com/manual/changeStreams/#watch-collection-database-deployment) 级别的数据变化的监听. 

### 应用场景
官方文档: [Use Cases](https://docs.mongodb.com/manual/changeStreams/#use-cases)
主要还是不太牵涉到业务的数据变更通知或同步类的场景.

### 支持的事件有
官方文档: [Change Events](https://docs.mongodb.com/manual/reference/change-events/#change-stream-output)
- insert
- delete
- replace
- update
- invalidate

### 拓展
- [Using MongoDB as a realtime database with change streams](https://hackernoon.com/using-mongodb-as-a-realtime-database-with-change-streams-213cba1dfc2a)
