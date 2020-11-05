---
title: 'Go: empty slice vs nil slice'
date: 2018-11-14T09:34:57Z
tags: ["golang"]

---

> Go Playgroud: https://play.golang.org/p/DNJ0Q9YrE14

> var nilSlice []int
> emptySlice := []int{}

## 相同点
### len(s)
len(nilSlice) == 0 // true
len(emptySlice) == 0 // true

### cap(s)
len(nilSlice) == 0 // true
len(emptySlice) == 0 // true

## 不同点
### s == nil ?
nilSlice == nil // true
emptySlice == nil // false

### json.Marshal
json.Marshal(nilSlice) // null
json.Marshal(emptySlice) // []

### json.Unmarshal
`{}` Unmarshal 后得到 nil slice;
`{"arr": null}` Unmarshal 后得到 nil slice; // 如果是HTTP API, 则服务端无法知道客户端是未传`arr`字段还是传了一个`null`;
`{"arr": []}` Unmarshal 后得到 empty slice;

## 如何检测是否是 nil slice
虽然 `nilSlice == nil`, 但换一种场景却无法判断:
```
var i interface{}
i = nilSlice

i == nil // false, 原因见: https://github.com/isayme/blog/issues/25
```

这里引入 [stretchr/testify:IsNil](https://github.com/stretchr/testify/blob/04af85275a5c7ac09d16bb3b9b2e751ed45154e5/assert/assertions.go#L418) 中的方法:
```
// IsNil 判定是否是 nil, 支持 pointer/channel/map/slice
func IsNil(v interface{}) bool {
	if v == nil {
		return true
	}

	value := reflect.ValueOf(v)
	kind := value.Kind()
	if kind >= reflect.Chan && kind <= reflect.Slice {
		return value.IsNil()
	}

	return false
}
```

## 参考资料
- [Empty slice vs nil slice in GoLang | Pixelstech.net](https://www.pixelstech.net/article/1539870875-Empty-slice-vs-nil-slice-in-GoLang)
- [nil slices vs non-nil slices vs empty slices in Go language - Stack Overflow](https://stackoverflow.com/questions/44305170/nil-slices-vs-non-nil-slices-vs-empty-slices-in-go-language)
