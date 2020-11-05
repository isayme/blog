---
title: '使用 monkey 替换 Golang 标准库方法'
date: 2018-08-02T08:44:03Z
tags: ["golang"]

---

Golang 标准库的`json.Marshal` & `json.Unmarshal` 方法性能并不高. 因而产生了第三方包解决此问题. 如: [ffjson](https://github.com/pquerna/ffjson), [json-iterator](https://github.com/json-iterator/go), [easyjson](https://github.com/mailru/easyjson). 

但开发者在又序列化需求时一般都会使用 `encoding/json` 的 `json.*` 系方法. 第三方包需要新增依赖, 在性能不是瓶颈时自然更倾向于使用官方原生包. 毕竟官方包也会持续对性能做改进.

但如果真有需要替换掉`json.Marshal` 时又如何做呢? 解决方法是 [Monkey patching in Go](https://github.com/bouk/monkey):
```
package main

import (
	"encoding/json"
	"fmt"

	"github.com/bouk/monkey"
	jjson "github.com/json-iterator/go"
)

type User struct {
	Name   string   `json:"name"`
	Emails []string `json:"emails"`
}

func main() {
	monkey.Patch(json.Marshal, func(v interface{}) ([]byte, error) {
		fmt.Println("use jsoniter")
		return jjson.Marshal(v)
	})

	u := User{}

	if b, err := json.Marshal(u); err != nil {
		fmt.Println("Marshal failed: ", err)
	} else {
		fmt.Println(err, string(b))
	}
}
```
虽然使用的还是 `json.Marshal`, 实际调用的已经是 Patch 后的方法. 此代码输出:
```
use jsoniter
<nil> {"name":"","emails":null}
```

## 参考资料
- [使用monkey补丁替换golang的标准库](http://xiaorui.cc/2018/04/02/%E4%BD%BF%E7%94%A8monkey%E8%A1%A5%E4%B8%81%E6%9B%BF%E6%8D%A2golang%E7%9A%84%E6%A0%87%E5%87%86%E5%BA%93/)