package main

import (
	"fmt"
	"runtime"
)

func main() {
	testA()
}

func testA() {
	test1()
	test2()
}

func test1() {
	name := getCurrentFuncName1()

	fmt.Printf("in test1(), get: %s\n", name)
}

func test2() {
	name := getCurrentFuncName2()

	fmt.Printf("in test2(), get: %s\n", name)
}

func getCurrentFuncName1() string {
	pc := make([]uintptr, 1) // at least 1 entry needed
	runtime.Callers(2, pc)
	f := runtime.FuncForPC(pc[0])
	return f.Name()
}

func getCurrentFuncName2() string {
	pc, _, _, ok := runtime.Caller(1)
	if !ok {
		return "???"
	}

	f := runtime.FuncForPC(pc)

	return f.Name()
}
