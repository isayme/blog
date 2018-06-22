package main

import (
	"strings"
	"testing"
)

func TestGetCurrentFuncName1(t *testing.T) {
	name := getCurrentFuncName1()

	if !strings.HasSuffix(name, "TestGetCurrentFuncName1") {
		t.Errorf("name not valid: %s", name)
	}
}

func TestGetCurrentFuncName2(t *testing.T) {
	name := getCurrentFuncName2()

	if !strings.HasSuffix(name, "TestGetCurrentFuncName2") {
		t.Errorf("name not valid: %s", name)
	}
}

func BenchmarkGetCurrentFuncName1(b *testing.B) {
	for i := 0; i < b.N; i++ {
		getCurrentFuncName1()
	}
}

func BenchmarkGetCurrentFuncName2(b *testing.B) {
	for i := 0; i < b.N; i++ {
		getCurrentFuncName2()
	}
}
