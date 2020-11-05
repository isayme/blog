---
title: '使用 Docker Compose 创建 MongoDB Replica Set (副本集)'
date: 2017-11-30T05:37:58Z
tags: ["docker", "mongodb", "replica"]

---

为了验证 MongoDB 主从模式时 mongoose 能够正常自动重连, 需要本地建立一个 MongoDB replica set.

### 概述
我们将创建 3 个 MongoDB 实例, 分别为: `rs0`, `rs1`, `rs2`. 通过 Docker Compose 将它们组建到一个网络.

## 创建步骤
### 1. 配置 docker-compose.yml 启动三个 MongoDB 实例.
https://github.com/isayme/mongo-replica-compose/blob/master/docker-compose.yml

通过 `docker-compose up -d` 启动. 

其中每个实例都对宿主机暴露了端口, 以方便宿主机访问并查看状态, 示例连接方式:
> mongo --port 37017

### 2. 尝试连接其中一个 MongoDB 实例
https://github.com/isayme/mongo-replica-compose/blob/master/initiate.sh

由于第1步是后台启动 MongoDB 实例, 执行 `initiate.sh` 时可能服务并没有完全启动完成, 所以会有重试机制.

### 3. 连接成功后, 尝试添加从节点, 从而设置为 Replica 模式
https://github.com/isayme/mongo-replica-compose/blob/master/setup.js

考虑到幂等性问题, `setup.js` 允许多次执行, 代码层会自动检测是否已经设置过.

## 如何连接 MongoDB Replica Set
docker-compose 启动的服务会有独立的网络, 可以通过启动日志看到:
![image](https://user-images.githubusercontent.com/1747852/33435187-79d834b6-d61c-11e7-9076-ce57e3c45e83.png)

连接此副本集, 需要通过 Docker 启动任一镜像, 并通过`--network`参数连接到同一网络, 如
> docker run --rm -it --network mongoreplicacompose_default alpine:latest
![image](https://user-images.githubusercontent.com/1747852/33435958-8d2dcd58-d61e-11e7-9ed7-a5a541012a03.png)

连接成功后即可通过 mongoose driver 连接此副本集, 地址是: `mongodb://rs0:27017,rs1:27018,rs2:27019/teambition?replicaSet=tiny`

## 快速启停 MongoDB Replica Set
虽然启动的步骤不多, 但对于频繁的调试场景还是需要一个快速的方式用于创建/关闭副本集.
[isayme/mongo-replica-compose](https://github.com/isayme/mongo-replica-compose) 将整个步骤封装成简单的 `make start` 和 `make stop` 命令, 可以快速的 `启动`/`关闭` 服务.

### 参考资料
- [Creating a MongoDB replica set using Docker](https://www.sohamkamani.com/blog/2016/06/30/docker-mongo-replica-set/)