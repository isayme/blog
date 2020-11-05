---
title: 'Golang defer 备忘'
date: 2019-02-26T10:02:42Z
tags: ["golang"]

---

## FILO
FIFO = 先进后出(First In Last Out)

https://play.golang.org/p/4lsVhQRd2gy

## panic 也不影响 defer 函数执行
https://play.golang.org/p/H8moFim3iXT

## defer 函数内修改变量”可能”影响 return 值
https://play.golang.org/p/xwIvBfWPbHh
https://play.golang.org/p/H7wrtp62xZt

## defer 函数参数注册值传递
defer 函数内获得的参数值不会参数变量值改变而改变(Golang 函数为值传递)

https://play.golang.org/p/67xVwZm5dTs

注意另一组常见的对比: https://play.golang.org/p/WlnsF60mWfa

进阶版本: https://play.golang.org/p/CpsrDGCkl9g

## 参考资料
- [Golang之轻松化解defer的温柔陷阱 - Go中国技术社区 - golang](https://gocn.vip/article/1588)
- [golang之defer简介 | 戒修-沉迷技术的小沙弥](https://leokongwq.github.io/2016/10/15/golang-defer.html)
- [5 Gotchas of Defer in Go (Golang) — Part I – Learn Go Programming](https://blog.learngoprogramming.com/gotchas-of-defer-in-go-1-8d070894cb01)