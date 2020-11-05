---
title: 'mgo bson.ObjectId 序列化特性'
date: 2019-11-12T10:20:57Z
tags: ["golang", "mgo"]

---

> 变量说明:
> ValidObjectId: ValidObjectId.Valid() == true
> InvalidObjectId: InvalidObjectId.Valid() == false

| 场景 | json | bson |
|---|---|---|
| bson.ObjectId + ValidObjectId | 正常序列化 | 正常存储 |
| bson.ObjectId + InvalidObjectId | **序列化为空字符串** | **不允许存储** |
| bson.ObjectId + omitempty + ValidObjectId | 正常序列化 | 正常存储 |
| bson.ObjectId + omitempty + InvalidObjectId | **序列化后无此字段** | **不存储此字段** |
| *bson.ObjectId + ValidObjectId | 正常序列化 | 正常存储 |
| *bson.ObjectId + nil | 序列化为null | 存储为null |
| *bson.ObjectId + InvalidObjectId | **序列化为空字符串** | **不允许存储** |
| *bson.ObjectId + omitempty + ValidObjectId | 正常序列化 | 正常存储 |
| *bson.ObjectId + omitempty + nil | **序列化后无此字段** | **不存储此字段** |
| *bson.ObjectId + omitempty + InvalidObjectId | **序列化为空字符串** | **不允许存储** |

## 使用建议
bson.ObjectId + omitempty 兼容性最佳, 搭配 `id.Valid()` 方法检测有效性足以满足绝大多数场景;

如果需要 json&bson 序列化为 null, 则需要 *bson.ObjectId, 使用时需 `id != nil && id.Valid()` 进行检测有效性.
