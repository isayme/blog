---
title: 'Golang: mgo SetBSON/GetBSON 自定义数据库存储'
date: 2018-12-04T10:13:43Z
tags: ["golang", "mgo"]

---

Go 语言本身是强类型, 这不利于处理联合体(union).

在使用 mgo 的过程中, 经常会遇到类似的场景: `某个字段的值可能是类型A, 也可能是类型B.` 

为了达到上述的目的, 需要自定义 `bson.Marshal` & `bson.Unmarsahl` 方法: 实现 `bson.Getter` & `bson.Setter` interface

完整的示例的代码: https://play.golang.org/p/ESDlrW353is

## 自定义 bson.Marshal & bson.Unmarshal
```
// 示例结构体
type T struct {
	ID   string
	Elem Elem
}
```
需求: 存储 T 类型字段到 mongo 时, 如果 `ID` 字段有值, 则存入 `ID`, 否则存入 `Elem` 字段. 

### bson.Marshal: GetBSON
实现 `bson.Getter` interface, 自定义字段序列化.

```
// GetBSON bson marshal
func (t T) GetBSON() (interface{}, error) {
	if t.ID != "" {
		return t.ID, nil
	} else {
		return t.Elem, nil
	}
}
```

### bson.Unmarshal: SetBSON
实现 `bson.Setter` interface, 自定义字段反序列化.

```
// SetBSON bson unmarshal
func (t *T) SetBSON(raw bson.Raw) error {
	if err := raw.Unmarshal(&t.Elem); err == nil {
		return nil
	}

	return raw.Unmarshal(&t.ID)
}
```

## 自定义 json.Marshal & json.Unmarshal
结构体 json 序列化后等价于序列化其中一种有效字段.

### json.Marshal: MarshalJSON

```
// MarshalJSON custom json.Unmarshal
func (t T) MarshalJSON() ([]byte, error) {
	if t.ID != "" {
		return json.Marshal(t.ID)
	} else {
		return json.Marshal(t.Elem)
	}
}
```

### json.Unmarshal: UnmarshalJSON

```
// UnmarshalJSON custom json.Marshal
func (t *T) UnmarshalJSON(data []byte) error {
	if data[0] == '"' {
		return json.Unmarshal(data, &t.ID)
	} else {
		return json.Unmarshal(data, &t.Elem)
	}
}
```

## 参考资料
- https://godoc.org/gopkg.in/mgo.v2/bson#Setter
- https://godoc.org/gopkg.in/mgo.v2/bson#Getter