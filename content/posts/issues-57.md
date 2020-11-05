---
title: 'TIP: Docker node-alpine 安装编译 npm 包: pinyin/nodejieba '
date: 2020-11-02T14:22:39Z
tags: ["Dockerfile", "Node.js", "docker"]

---

pinyin 依赖 nodejieba, 这里的其实要解决的是安装 nodejieba 的问题.

默认 docker node alpine 因缺失编译工具无法编译 nodejieba, 所以通过 multi stage 在 builder stage 编译后拷贝至最终镜像使用.

```
FROM node:12.9.0-alpine as builder
WORKDIR /app

# 安装编译工具链
RUN apk add alpine-sdk python
# 如果不是 alpine 而是 debian 需要使用 apt-get 安装
# RUN apt-get update && apt-get install -y build-essential python

# install & build
RUN npm i pinyin

FROM node:12.9.0-alpine

WORKDIR /app

# copy build result so files
COPY --from=builder /app/ /app/
```