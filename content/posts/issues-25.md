---
title: 'Golang 中 error 空值(nil) 检测'
date: 2018-08-28T02:32:40Z
tags: ["golang"]

---

## 背景

Golang 中, 一般通过返回 error 判定函数异常. 常用的模式是:
```
if err != nil {
    panic(err) // 更多的是 return err
}
```
这样的代码片会遍布代码库时就会很烦, 所以有人就想少写两行:
```
checkErr(err)

func checkErr(err error) {
    if err != nil {
        panic(err)
    }
}
```
当然, 有人反对 checkErr 的写法: [Why You Should Not Use checkErr][Why You Should Not Use checkErr], 这里不讨论偏好, 关注的是: **这样写严谨吗?**

## 此 nil 非彼 nil
这里我们需要一个自定义的错误(实现了error interface):
```
type CustomError struct {}
func (err *CustomError) Error() string {
	return "CustomError"
}
```

### 场景1: 声明一个自定义错误指针变量, 然后与 nil 比较:
https://play.golang.org/p/lzG8UcRovrX
```
var err *CustomError
fmt.Println(err == nil) // return true
```
看起来很正常!

### 场景2: 声明一个函数, 返回 nil:
https://play.golang.org/p/Zf_r1CPAz2W
```
func test() error {
	return nil
}

fmt.Println(test() == nil) // return true
```
似乎也没问题!

### 场景2+: 声明一个函数, 返回自定义错误 nil 指针:
https://play.golang.org/p/hGhXxWSZ6wM
```
func test() error {
	var err *CustomError
	return err
}

fmt.Println(test() == nil) // return false
```
嗯? 返回不是 `true` ?

### 场景3: 声明函数, 返回自定义错误指针
https://play.golang.org/p/PEKq5eYOkVC
```
func test() *CustomError {
	return nil
}

fmt.Println(test() == nil) // return true
```
又返回 `true` 了?

### 场景3+: 声明函数, 返回自定义错误指针
https://play.golang.org/p/WOatukzyYgi
```
func test() *CustomError {
	var err *CustomError
	return err
}

fmt.Println(test() == nil)	// return true
```
也是 `true`.

## 背后的原因
官方文档对此做了说明: [Why is my nil error value not equal to nil?][Why is my nil error value not equal to nil?], 一句话解释是: error 是 interface, 比较时会同时比较 **`类型`** 及 `值`.

## 如何正确的判断 nil error ?
使用反射. 具体可以看 [stretchr/testify](https://github.com/stretchr/testify) 中的 [isNil 实现](https://github.com/stretchr/testify/blob/f35b8ab0b5a2cef36673838d662e249dd9c94686/assert/assertions.go#L419)

```
func isNil(object interface{}) bool {
	if object == nil {
		return true
	}

	value := reflect.ValueOf(object)
	kind := value.Kind()
	if kind >= reflect.Chan && kind <= reflect.Slice && value.IsNil() {
		return true
	}

	return false
}
```

## 回到 checkErr
这里给个不同方式的对比, 对照官方的解释理解下:
https://play.golang.org/p/_o5nfQYt3nl

| 场景    | err == nil | 普通版本 isNil | stretchr/testify 版本 isNil |
|-------|:----------:|:----------:|:-------------------------:|
| ![image](https://user-images.githubusercontent.com/1747852/44707603-86240c00-aad7-11e8-8ad4-d6878f4a2bbd.png) | true       | true       | true                      |
| ![image](https://user-images.githubusercontent.com/1747852/44707632-9fc55380-aad7-11e8-9acf-c948d6b6dd34.png) | true       | true       | true                      |
| ![image](https://user-images.githubusercontent.com/1747852/44707655-b53a7d80-aad7-11e8-932e-ed3b05a5edd6.png) | false      | false      | true                      |
| ![image](https://user-images.githubusercontent.com/1747852/44707668-bbc8f500-aad7-11e8-8476-93d3726681c9.png) | true       | false      | true                      |
| ![image](https://user-images.githubusercontent.com/1747852/44707677-c5eaf380-aad7-11e8-9da2-fe40e5170c2e.png) | true       | false      | true                      |


## 实践建议
### 函数定义时, 返回的错误永远是`error`类型
```
func a() *CustomError // bad
func b() error // good
```

### 如果返回的错误是自定义类型, 需要返回空时明确`return nil`
```
// bad
var err *CustomError
return err

// good
return nil
```

## 参考资料
- [Why is my nil error value not equal to nil?][Why is my nil error value not equal to nil?]

[Why is my nil error value not equal to nil?]: https://golang.org/doc/faq#nil_error
[Why You Should Not Use checkErr]: https://pocketgophers.com/checkErr/