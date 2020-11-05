---
title: 'Dockerfile 最佳实践 - for Node.js'
date: 2017-11-29T15:39:27Z
tags: ["Dockerfile", "docker"]

---

## 使用 alpine 版本的基础镜像
```
# 明确指定版本号, 如: node:6.12.0-alpine
# 生产环境避免使用 latest 的 tag
FROM node:alpine
```
![image](https://user-images.githubusercontent.com/1747852/33382140-e018e684-d55a-11e7-8742-c225fa150548.png)

alpine 版本的镜像在磁盘占用上存在极大的优势.
BTW: node 的镜像已经包含了 [yarn](), 无需额外单独安装.

## 使用 [.dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file) 文件
通过此文件配置忽略无意义的文件, 在 build 镜像时减小 [context](https://docs.docker.com/engine/reference/commandline/build/#extended-description) 体积.
```
# 在镜像中安装, 而不是复制本地安装的版本, 避免兼容问题(有些依赖需要编译过程, 与平台有关)
node_modules
# git 版本产生的数据, 与服务本身无关
.git
# 测试代码, 生成镜像时可以忽略
test
```

## 注意顺序
```
# 先单独复制 package.json 并安装依赖, 然后再复制其他文件
COPY package.json /app
RUN ["npm", "install", "--production"]

COPY . /app
```
与
```
# 直接复制 app 文件, 随后安装依赖.
COPY . /app
RUN ["npm", "install", "--production"]
```
两种方式的结果是一样的.
但 docker 在产生镜像时会使用 [cache](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#build-cache) 特性. 如果频繁修改代码后 build 新的镜像, 则 `COPY . /app` 及之后的 Dockerfile 语句都需要重新执行, 此时前者的优势是: **无需重复耗时安装依赖**.

## 使用 PM2
PM2 官方指导: [Docker Integration](http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
官方提供了包含 PM2 的镜像: [keymetrics/pm2](https://hub.docker.com/r/keymetrics/pm2/)
个人不推荐使用官方版本, 当前官方的版本会将`/app`作为数据卷挂载到镜像:
https://github.com/keymetrics/docker-pm2/blob/e8ddd44691ba1259541c420421fbaa7a6e1f44ed/6/Dockerfile#L6

## 清理无意义的数据
**推荐使用 [multistage build](https://docs.docker.com/engine/userguide/eng-image/multistage-build/)**

通过`apt-get`/`yum`安装工具后立即清理产生的临时文件, 以降低该层占用的镜像大小, 如:
```
RUN apt-get install -y git && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN yum install git-core && yum clean all
```
如果使用 `npm` 管理依赖, 需要在安装后使用`npm cache clean`清理缓存以降低镜像大小. 示例:
```
COPY package*.json ./
RUN npm install --production && npm cache clean
```
如果使用 [yarn](https://yarnpkg.com/en/) 管理依赖, 需要在安装后使用`yarn cache clean`清理缓存以降低镜像大小. 示例:
```
COPY package*.json yarn.lock ./
RUN yarn install --production && yarn cache clean
```

## 使用 multi-stage 特性
使用 [multi-stage](https://docs.docker.com/engine/userguide/eng-image/multistage-build/) 特性, 利用中间层安装好依赖, 将结果复制到最终的镜像, 达到减小镜像的目的.

## 示例 Dockerfile
npm 版本: https://github.com/isayme/blog/blob/master/issues/1/Dockerfile-npm
yarn 版本: https://github.com/isayme/blog/blob/master/issues/1/Dockerfile-yarn
pm2 版本: https://github.com/isayme/blog/blob/master/issues/1/Dockerfile-pm2
multistage 版本: https://github.com/isayme/blog/blob/master/issues/1/Dockerfile-multistage
### 参考文献
- [Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
- [Dockerfile: 10 good practices](http://blog.container-labs.com/dockerfile-10-good-practices/)
- [Tips to Reduce Docker Image Sizes](https://hackernoon.com/tips-to-reduce-docker-image-sizes-876095da3b34)
- [Dockerfile linter](https://www.fromlatest.io/)
- [Use multi-stage builds](https://docs.docker.com/engine/userguide/eng-image/multistage-build/)