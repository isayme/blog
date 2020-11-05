---
title: 'Dockerfile: CMD 与 ENTRYPOINT 关系'
date: 2019-10-12T09:52:14Z
tags: ["Dockerfile", "docker"]

---

> 一图胜千言

![image](https://user-images.githubusercontent.com/1747852/66699344-a5501e00-ed18-11e9-8d9e-ae324f6ff508.png)

# 使用推荐
优先使用 CMD exec form, 示例: `CMD ["node", "start"]`

## 参考资料
- [Dockerfile reference: Understand how CMD and ENTRYPOINT interact](https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact)
- [Dockerfile reference: CMD](https://docs.docker.com/engine/reference/builder/#cmd)
- [Dockerfile reference: ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint)