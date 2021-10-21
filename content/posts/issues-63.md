---
title: 'Redis 持久化 AOF 未过期字段恢复时过期时间重置问题'
date: 2021-10-21T12:26:59Z
tags: []

---

Redis AOF 核心原理已协议文本方式记录数据库写入命令。

假如以下场景：
1. 设置 key `A` 过期时间为 30秒；
2. 在第 15 秒 redis 服务异常关闭，此时 key `A` 还有 15 秒过期；
3. 在 5 分钟后 redis 服务重新启动并从 aof 文件恢复数据；

由于 AOF 恢复的机制是回放命令，导致恢复后的 key `A` 的过期时间重置为`相对当前时间`之后的 30 秒。
如果 redis 服务并没有异常关闭，key `A` 理应早已过期。

另，RDB 恢复不会有如上类似的问题。

- [AOF - Redis 设计与实现](https://redisbook.readthedocs.io/en/latest/internal/aof.html)