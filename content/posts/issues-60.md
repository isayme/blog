---
title: 'Github Pages + Github Issues + Github Actions 自动发布静态博客'
date: 2020-12-16T15:00:22Z
tags: []

---

# 背景
1. 使用 Github Isssue 记录文章;
2. 使用 Github Pages 发布静态站点;

# 目标
当 Github Isssue 新建或更新后, 自动将 Isssue 发布到 Github Pages.

# 方案
1. Github Issue 新建/更新后, 触发 Github Actions, 将 Issue 内容在 master 分支 更新到 `content/posts/` 目录, 并 git push 到远端.
2. master 分支的提交再次触发 Github Actions, 执行静态博客构建命令, 并 git push 到 `gh-pages` 分支.

两步分别对应Github Workflow: https://github.com/isayme/blog/blob/master/.github/workflows/issue-event.yml 和 https://github.com/isayme/blog/blob/master/.github/workflows/gh-pages.yml

# 问题及解决
## 使用 GITHUB_TOKEN 时无法 trigger 新的 workflow
官方说明见: https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows
```
Note: You cannot trigger new workflow runs using the GITHUB_TOKEN. For more information, see "[Triggering new workflows using a personal access token](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#triggering-new-workflows-using-a-personal-access-token)."
```

解决办法: 创建一个 Personal Token, 提交 Issue 信息到 master 分支时使用此 token.