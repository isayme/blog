---
title: 'Golang 空结构体(empty struct)'
date: 2018-07-19T07:56:12Z
tags: ["golang"]

---

## 空结构体
指没有元素的结构体:
```
type s struct{}
```

## 特性
- 不占空间: sizeof(s{}) == 0
- 所有的实例的地址都相同: &s{} == &s{}

https://play.golang.org/p/Z-y-cGQgtkQ

## 参考资料
- [The empty struct](https://dave.cheney.net/2014/03/25/the-empty-struct)