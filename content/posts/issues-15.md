---
title: 'mgo 使用入门及进阶'
date: 2018-06-29T03:24:09Z
tags: ["golang", "mgo"]

---

## 基本结构定义
```
type User struct {
	ID   bson.ObjectId `bson:"_id"`   // 通过 bson tag 定义在数据库的字段名
	Name string        `bson:"name"` // 如果没有 bson tag, 则会使用字段名小写
}
```

## _id 自动生成
```
type User struct {
	ID   bson.ObjectId `bson:"_id,omitempty"`
}
```
如果 `ID` 字段的 `bson` 不设置` omitempty`, 则创建数据时需要主动赋值. 带上 `omitempty`, 则会由数据库自动生成一个值. 缺点是使用`Insert`创建完无法知道`ID`值.
> 注1: 仅针对 `_id` 字段会自动赋值.
> 注2: 如果`json`/`bson` tag 之间使用空格分隔, 不可用 Tab 分隔: [Cannot retrieve “_id” value using mgo with golang](https://stackoverflow.com/a/20739427/1918831)

## 数组
```
type User struct {
	ID     bson.ObjectId `bson:"_id"`
	Name   string        `json:"name"`
	Emails []string      `json:"emails"`
}
```
其中`Emails`是数组:
1. 当 `Emails == nil` 时, 写入数据库时会写入空数组`[]`;
2. 当数据库中 `emails == null` 时, 读出的 `Emails == nil`, json 序列化救过会是`"emails": null`;

TODO: 客户端调用API时会期望`emails`永远是个数组, 所以需要有个方法在反序列化时将 `Emails == nil` 的场景处理掉.

## 内嵌结构体
```
type Admin struct {
	User  `bson:",inline"`
}
```
如果不使用 `bson:",inline"`, 最终的数据库会是这样:
```
{
  // 其他字段忽略...
  "user": {
    "phone": "xxx"
  }
}
```
官方文档: [mgo/bson#Marshal](https://godoc.org/labix.org/v2/mgo/bson#Marshal)

## 指针 与 选填字段
```
type Task struct {
  ID         bson.ObjectId  `json:"_id" bson:"_id"`
  
  // 必填字段
  CreatorID  bson.ObjectId  `json:"_creatorId" bson:"_creatorId"`

  // 非必填, **为空时数据库存储为 null**
  ExecutorID *bson.ObjectId `json:"_executorId" bson:"_executorId"`

  // 非必填, **为空时数据库不存储此字段**
  AppID      bson.ObjectId  `json:"_appId,omitempty" bson:"_appId,omitempty"`
}
```


> var id1 = bson.NewObjectId()
> var id2 bson.ObjectId
> var id3 *bson.ObjectId = nil
> var id4 *bson.ObjectId = &id1
> var id5 *bson.ObjectId = &id2

| 字段定义 vs 写入行为 | bson.ObjectId | bson.ObjectId + omitempty | *bson.ObjectId | *bson.ObjectId + omitempty |
|---|---|---|---|---|
| id1 | √ | √ | - | - |
| id2 | × | √* | - | - |
| id3 | - | - | √ | √* |
| id4 | - | - | √ | √ |
| id5 | - | - | × | × |
> *: 表示写入后无此字段, 区别与写入后值为null

## 其他资料
- [Mgo 库的常见坑总结](https://www.4async.com/2016/01/something-about-mgo-driver/)
- [Golang Mgo笔记](https://www.do1618.com/archives/914/golang-mgo%E7%AC%94%E8%AE%B0/)
- [golang mgo的mongo连接池设置：必须手动加上maxPoolSize](https://www.cnblogs.com/shenguanpu/p/5318727.html)
- [mgo 的 session 与连接池](https://cardinfolink.github.io/2017/05/17/mgo-session/)