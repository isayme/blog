---
title: 'Go: HTTP API 部分(Partial)更新'
date: 2018-11-19T09:16:01Z
tags: ["HTTP", "api", "golang"]

---

## 背景
Golang HTTP 开发中, 解析客户端传入的数据可以使用 `json.Unmarshal` 方法.

假设有个 TODO 服务, 提供了任务更新能力.

## 同时更新标题及执行者
定义一个结构体, 用于解析输入的 json 参数, 从而获得客户端输入的参数.
```
type TaskUpdate struct {
    Title string `json:"title"`
    Executor string `json:"executor"`
}

u := TaskUpdate{}
json.Unmarshal([]byte(`{"title": "newTitle", "executor": "newExecutor"}`), &u)
fmt.Printf("%#v", u)
```

https://play.golang.org/p/toWu1ZBd5uj

## 只更新标题
HTTP 服务设计更新API时, 为了方便调用者, 会做成 PATCH 更新, 即仅更新客户端指定的字段.

假如客户端只需要更新标题, 未传 `executor` 字段. 由于Go语言的特性, `Executor` 在 Unmarshal 后拿到的值是空字符串, 导致更新后执行者信息被置空.

为了解决这个问题, 可以把字段定义成指针: **当客户端未传入`executor`时, Unmarshal 后 Excutor 值为 nil**.
```
type TaskUpdate struct {
	Title *string `json:"title"`
	Executor *string `json:"executor"`
}

u := TaskUpdate{}
json.Unmarshal([]byte(`{"title": "newTitle"}`), &u)
fmt.Printf("%#v", u)
```
https://play.golang.org/p/ZVuFEhWTCpc

## 清空执行者
如果客户端需要清空执行者信息. 在 json 的表述中, 需要客户端传入 `”executor”: null`.

但 Go 语言无法区分 json 中的 `null`, 即使客户端传入了 `”executor”: null`, Unmarshal 后 `Executor` 的值依然是 `nil`!

https://play.golang.org/p/vEcm-Z21yze

为了解决此问题, [How to determine if a JSON key has been set to null or not provided - Calhoun.io](https://www.calhoun.io/how-to-determine-if-a-json-key-has-been-set-to-null-or-not-provided/) 文章中提到了可行的解决办法: 定义结构体并自定义`UnmarshalJSON`方法, 解析后的结构体标记了客户端是否传入了`null`或合法的值.

![image](https://user-images.githubusercontent.com/1747852/48761747-5f473180-ece4-11e8-9654-5b2e7547bf69.png)

[GitHub - romanyx/nullable: Provide types that allows to determine if a JSON key has been set to null or not provided](https://github.com/romanyx/nullable) 依据此方法提供了更多类型的实现.

## 参考资料
- [How to determine if a JSON key has been set to null or not provided - Calhoun.io](https://www.calhoun.io/how-to-determine-if-a-json-key-has-been-set-to-null-or-not-provided/)
- [Go, REST APIs, and Pointers](https://willnorris.com/2014/05/go-rest-apis-and-pointers)
- [GitHub - romanyx/nullable: Provide types that allows to determine if a JSON key has been set to null or not provided](https://github.com/romanyx/nullable)