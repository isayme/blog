---
title: 'MongoDB oplog(operations log)'
date: 2019-01-11T04:32:50Z
tags: ["mongodb"]

---

MongoDB 开启复制集后会记录数据的写操作, 即为 oplog.

批量操作时被更新的文档写入时会有独立的记录.

oplog 记录格式参考: [MONGODB: UNDERSTANDING OPLOG](http://dbversity.com/mongodb-understanding-oplog/)

## 插入
`op` 是 `i`, `o` 为被插入数据信息.

```
// db.tasks.insert({ title: "1" })
{
	"ts" : Timestamp(1547176087, 1),
	"t" : NumberLong(1),
	"h" : NumberLong("-8215838784868636031"),
	"v" : 2,
	"op" : "i",
	"ns" : "test.tasks",
	"ui" : UUID("860c1ed6-2f14-442e-9721-c02411a36864"),
	"wall" : ISODate("2019-01-11T03:08:07.972Z"),
	"o" : {
		"_id" : ObjectId("5c380897180e87351017cf46"),
		"title" : "1"
	}
}
```

## 删除
`op` 是 `d`, `o` 为被删除数据`_id`信息.

```
// db.tasks.remove({ _id: ObjectId("5c380897180e87351017cf46") })
{
	"ts" : Timestamp(1547176327, 1),
	"t" : NumberLong(1),
	"h" : NumberLong("8005594350040157058"),
	"v" : 2,
	"op" : "d",
	"ns" : "test.tasks",
	"ui" : UUID("860c1ed6-2f14-442e-9721-c02411a36864"),
	"wall" : ISODate("2019-01-11T03:12:07.136Z"),
	"o" : {
		"_id" : ObjectId("5c380897180e87351017cf46")
	}
}
```

## 更新
### 不使用 `$set`
`o` 是 `u`, `o` 是更新后的完整数据.

```
// db.tasks.update({ _id: ObjectId("5c380897180e87351017cf46") }, { title: "2", note: "3"})
{
	"ts" : Timestamp(1547176647, 1),
	"t" : NumberLong(1),
	"h" : NumberLong("-1033519284697496909"),
	"v" : 2,
	"op" : "u",
	"ns" : "test.tasks",
	"ui" : UUID("860c1ed6-2f14-442e-9721-c02411a36864"),
	"o2" : {
		"_id" : ObjectId("5c380897180e87351017cf46")
	},
	"wall" : ISODate("2019-01-11T03:17:27Z"),
	"o" : {
		"_id" : ObjectId("5c380897180e87351017cf46"),
		"title" : "2",
		"note" : "3"
	}
}
```

### 使用 `$set`
`o` 是 `u`, `o` 是更新的部分.

```
// db.tasks.update({ _id: ObjectId("5c380897180e87351017cf46") }, { $set: { title: "4" } })
{
	"ts" : Timestamp(1547176767, 1),
	"t" : NumberLong(1),
	"h" : NumberLong("7121079342694515350"),
	"v" : 2,
	"op" : "u",
	"ns" : "test.tasks",
	"ui" : UUID("860c1ed6-2f14-442e-9721-c02411a36864"),
	"o2" : {
		"_id" : ObjectId("5c380897180e87351017cf46")
	},
	"wall" : ISODate("2019-01-11T03:19:27.454Z"),
	"o" : {
		"$v" : 1,
		"$set" : {
			"title" : "4"
		}
	}
}
```

### 其他更新操作
[Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)

`$setOnInsert` 记录为 `$set`
`$inc` 记录为 `$set`
`$currentDate` 记录为 `$set`
`$min/$max` 记录为 `$set`
`$mul` 记录为 `$set`
`$rename` 记录为 `$set` + `$unset`
`$unset` 记录为 `$unset`

`$` 记录为 `$set`
`$.[]` 记录为 `$set`
`$.[element]` 记录为 `$set`, 格式有两种:  `$set: { field: [v1, v2] }`  和 `$set: { 'field.x': v }`
`$addToSet`  记录为 `$set`
`$pop` 记录为 `$set`
`$pull` 记录为 `$set`
`$pullAll` 记录为 `$set`
`$push` 记录为 `$set`, `$set: { 'field.x': v }`

