---
title: 'Github Actions 自动构建 Docker 镜像'
date: 2020-10-21T12:52:42Z
tags: []

---

# 目标
每当有新的 git tag 推送到 GitHub 时执行对应工作流;
工作流中构建 Docker 镜像并推送到 Docker Hub;

# Github Actions 介绍
> Automate, customize, and execute your software development workflows right in your repository with GitHub Actions. You can discover, create, and share actions to perform any job you'd like, including CI/CD, and combine actions in a completely customized workflow.

通过 GitHub Actions 自动化执行自定义软件开发工作流.
可以在 Github Actions 市场 [发现](https://github.com/marketplace?type=actions), 创建及共享任何你喜欢的Job.


## 术语
GitHub Actions 有一些自己的术语:
workflow (工作流): 持续集成一次运行的过程, 就是一个 workflow.
job (任务): 一个 workflow 由一个或多个 jobs 构成, 含义是一次持续集成的运行, 可以完成多个任务.
step(步骤): 每个 job 由多个 step 构成, 一步步完成.
action (动作): 每个 step 可以依次执行一个或多个命令(action).


# 定义工作流

## Docker 相关 Action
[https://github.com/marketplace?type=actions&query=docker](https://github.com/marketplace?type=actions&query=docker)
![image](https://user-images.githubusercontent.com/1747852/96721626-f93b1b80-13de-11eb-810b-023781a4726b.png)


## 配置文件
`./.github/workflows/docker.yml` 
```bash
# 工作流名称
name: Build Docker Image

# push tag 时触发执行
on:
  push:
    tags:
      - v*

# 定义环境变量, 后面会使用
# 定义 APP_NAME 用于 docker build-args
# 定义 DOCKERHUB_REPO 标记 docker hub repo 名称
env:
  APP_NAME: httpproxy
  DOCKERHUB_REPO: isayme/httpproxy

jobs:
  main:
    # 在 Ubuntu 上运行
    runs-on: ubuntu-latest
    steps:
      # git checkout 代码
      - name: Checkout
        uses: actions/checkout@v2
      # 设置 QEMU, 后面 docker buildx 依赖此.
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1
      # 设置 Docker buildx, 方便构建 Multi platform 镜像
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      # 登录 docker hub
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          # GitHub Repo => Settings => Secrets 增加 docker hub 登录密钥信息
          # DOCKERHUB_USERNAME 是 docker hub 账号名.
          # DOCKERHUB_TOKEN: docker hub => Account Setting => Security 创建.
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      # 通过 git 命令获取当前 tag 信息, 存入环境变量 APP_VERSION
      - name: Generate App Version
        run: echo APP_VERSION=`git describe --tags --always` >> $GITHUB_ENV
      # 构建 Docker 并推送到 Docker hub
      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v2
        with:
          # 是否 docker push
          push: true
          # 生成多平台镜像, see https://github.com/docker-library/bashbrew/blob/v0.1.1/architecture/oci-platform.go
          platforms: |
            linux/386
            linux/amd64
            linux/arm/v6
            linux/arm/v7
            linux/arm64/v8
          # docker build arg, 注入 APP_NAME/APP_VERSION
          build-args: |
            APP_NAME=${{ env.APP_NAME }}
            APP_VERSION=${{ env.APP_VERSION }}
          # 生成两个 docker tag: ${APP_VERSION} 和 latest
          tags: |
            ${{ env.DOCKERHUB_REPO }}:latest
            ${{ env.DOCKERHUB_REPO }}:${{ env.APP_VERSION }}
```

# 参考资料
[GitHub Actions 入门教程 - 阮一峰](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)
