---
title: '腾讯面试题: 1-1000 之间有多少个 7 ?'
date: 2020-11-21T02:34:35Z
tags: []

---

# 说明

1. 不要理解为多少个数包含7;

# 思路

1. 以题目理解为 [0, 999] 有多少个7, 因为0和1000都不含有7;
2. [1, 999] 或 [1, 9999] 的思路是一样的;

假如 n 是数字的位数, 则有 `f(n) = f(n-1) * 9 + 10^(n-1)`:
`f(n-1)*9`: 因为高位有[1, 9]共计9种数字搭配地位;
`10^(n-1)`: 高位的7搭配地位的所有可能数字可能;

```
f(n) = f(n-1) * 9 + 10^(n-1) 且 f(0) = 0
f(1) = f(0)*9 + 10^(1-1) = 0*9 + 10^0 = 1
f(2) = f(1)*9 + 10^(2-1) = 1*9 + 10^1 = 19
f(3) = f(2)*9 + 10^(3-1) =  19*9 + 10^2 = 271
f(4) = f(3)*9 + 10^(4-1) =  271*9 + 10^3 = 3439
```

# 如果 7 和 07 算作两个有效数字

同样会有公式

```
f(n) = f(n-1) * 10  + 10^(n-1) 且 f(0) = 0
f(1) = f(0)*10 + 10^(1-1) = 0*10 + 10^0 = 1
f(2) = f(1)*10 + 10^(2-1) = 1*10 + 10^1 = 20
f(3) = f(2)*10 + 10^(3-1) = 20*10 + 10^2 = 300
f(4) = f(4)*10 + 10^(4-1) = 300*10 + 10^3 = 4000
```

这种场景的结果有很明显的规律: `f(n) = n  * 10^(n-1)`, 可以参加思路 https://www.jianshu.com/p/8e1844d80143