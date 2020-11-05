---
title: '订制 Golang 的 func (t Time) MarshalJSON() ([]byte, error)'
date: 2018-08-02T09:35:33Z
tags: ["golang"]

---

在写 Golang 之前, 我是 Node.js 开发者. 在接触 Golang 之后迅速遇到了一个时间序列化的问题.

在 Javascript 中, 时间序列化是 [ISO8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) 格式: `YYYY-MM-DDTHH:mm:ss.sssZ`, 而Golang 使用的是 `RFC3339Nano`格式: `2006-01-02T15:04:05.999999999Z07:00`.

#### 具体表现: 
Javascript: https://jsfiddle.net/bgnuLjxs/1/

![image](https://user-images.githubusercontent.com/1747852/43574565-17f12ab6-9677-11e8-8fb6-39c7d0854f81.png)

Golang: https://play.golang.org/p/BG-GzlW5r2a

![image](https://user-images.githubusercontent.com/1747852/43574578-1ece1114-9677-11e8-82d4-8e208962a01d.png)

由于历史原因, 移动端未能完美兼容 Golang 输出的时间格式, 导致异常崩溃.

### 解决方案
#### 定义新类型
如果单纯的解决这个问题, 可以简单定义另一个类型, 并自定义该类型的 `MarshalJSON` 方法: https://github.com/isayme/go-iso8601

这个方法的问题是会丢失 time.Time 的很多实用方法(如 After / Format 等等), 并且还需要已经在用 `time.Time`的地方全部更换为新定义的类型, 对既有的代码破坏性很大.

#### 订制 time.go 包
由于目前 Golang 的服务都使用 Docker 发布, 我们可以把基础 Golang 镜像中的time.go中的`MarshalJSON`方法改写后再重新 install, Dockerfile 片段:
```
ADD time-1.10.1.go /usr/local/go/src/time/time.go
RUN go install -a time
```
此处的基础镜像是 Golang 1.10.1, 其中 `time-1.10.1.go` 是改过之后的文件, 其中改过之后的`MarshalJSON`是:

![image](https://user-images.githubusercontent.com/1747852/43575123-93fff4d8-9678-11e8-9cc5-b6cfadc45806.png)

此方法基本满足当前的场景, 存在的缺点是一旦想升级新的基础 Golang Docker 版本, 就需要重新订制`func (t Time) MarshalJSON() ([]byte, error)` 方法.

#### 使用 monkey 订制
[使用 monkey 替换 Golang 标准库方法](https://github.com/isayme/blog/issues/20) 中简单介绍了 mongkey 的使用, 其实它同样可以做到替换`实例方法`:
https://play.golang.org/p/UtF4uHDC9nK
```
	var t time.Time
	monkey.PatchInstanceMethod(reflect.TypeOf(t), "MarshalJSON", func(t time.Time) ([]byte, error) {
		t = t.UTC()

		s := t.Format("\"2006-01-02T15:04:05.000Z\"")
		return []byte(s), nil
	})
```

相比前两种方法, 此方法的优势还是比较明显的: 最小的改动达到期望的效果.