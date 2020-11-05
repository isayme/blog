---
title: 'Golang slice 扩容机制'
date: 2018-07-12T09:34:13Z
tags: ["golang"]

---

> 注: 结果可能与操作系统位数有关. 本人当前使用的操作系统 Mac Pro 64 位操作系统

搜索了相关的信息, 看到的别人总结的机制是这样的:
1. 当 cap(s) < 1024 时, 新的 size = cap(s) * 2
2. 当 cap(s) >= 1024 时, 新的 size = cap(s) * 1.25

先不说对不对, 至少这两条规则是没有覆盖到所有场景的, 如:
```
s := []int{1} //  cap(s) == 1
s = append(s, 2, 3, 4) // 满足 cap(s) < 1024, 如果是简单的 cap(s) * 2 = 2 都不足以容纳 `1, 2, 3, 4` 合计 4 个元素
```

## 机制
> 假设: var s []int
### 当 cap(s) < 1024 时, 新的 size = cap(s) * 2
但实际并不完全是这样: https://play.golang.org/p/Tj4SS-gwzIS
当 cap(s) == 17 时, 结果不是 `34` 而是 `36`.

对于 `[]byte`, 结果又是另一个样子: https://play.golang.org/p/4TYIMkEZmMn

## 参考资料
- [Go 源码: growslice](https://github.com/golang/go/blob/3df1f00bfc0739cf2b6cf046b920221bdfa748e3/src/runtime/slice.go#L116)
- [深入解析 Go 中 Slice 底层实现](https://halfrost.com/go_slice/)

