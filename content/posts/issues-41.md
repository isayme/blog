---
title: 'Dockerfile CMD: exec form vs shell form'
date: 2019-01-18T05:33:18Z
tags: ["Dockerfile", "docker", "kubernetes"]

---

## Dockerfile CMD 的两种格式
```
CMD ["executable","param1","param2"] (exec form, this is the preferred form)
CMD command param1 param2 (shell form)
```

官方推荐 `exec form`.

## 原因
`shell form` 时程序是通过 shell 执行, 导致程序运行时 pid 不是 `1` ! 

kubernetes 在删除 pod 时会先发送信号 `TERM` 给 pod 的主进程(main process), 进程可以在收到信号后平滑(graceful)退出, 超时(30s)仍未退出的 pod 会被强制删除.

那么谁是 主进程(main process) ? 就是 pid 为 `1` 的进程!

也就是说如果 CMD 启动的进程 pid 不是 `1` 就无法正常收到 `TERM` 信号并退出, 最后会导致 pod 因超时被 k8s 强制删除.

所以, 赶紧改用 `exec form` !

## 参考资料
- [Dockerfile reference: CMD](https://docs.docker.com/engine/reference/builder/#cmd)
- [Dockerfile reference: RUN](https://docs.docker.com/engine/reference/builder/#run)
- [docker - Dockerfile CMD shell versus exec form - Stack Overflow](https://stackoverflow.com/questions/42805750/dockerfile-cmd-shell-versus-exec-form)
- [Termination of Pods - Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods)
- [Graceful shutdown of pods with Kubernetes](https://pracucci.com/graceful-shutdown-of-kubernetes-pods.html)