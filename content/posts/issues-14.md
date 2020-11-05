---
title: 'Golang 获取当前运行函数名'
date: 2018-06-22T12:57:42Z
tags: ["golang"]

---

## 代码
```
func getCurrentFuncName() string {
	pc := make([]uintptr, 1)
	runtime.Callers(2, pc)
	f := runtime.FuncForPC(pc[0])
	return f.Name()
}
```

## 还有另外一种写法, 但是效率低了很多
详细见: https://github.com/isayme/blog/blob/master/issues/14/
> 执行`make bench` 查看 benchmark 数据


## 参考资料
- [golang: get current scope of function name](https://stackoverflow.com/questions/25927660/golang-get-current-scope-of-function-name/25927915)
- [How to get the name of a function in Go?](https://stackoverflow.com/questions/7052693/how-to-get-the-name-of-a-function-in-go)