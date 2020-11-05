---
title: '互斥锁(Mutex) 与 读写锁(RWMutex)'
date: 2018-09-17T10:19:39Z
tags: ["golang"]

---

并发场景中, 互斥锁 与 读写锁 是常用解决访问冲突的两种锁:
### 互斥锁(Mutex)
- 同时只能有一个线程能够获得锁(Lock);

### 读写锁(RWMutex)
- 同时只能有一个线程能够获得写锁定(Lock);
- 同时能有多个线程获得读锁定(RLock);
- 写锁定(Lock) 与 读锁定(RLock) 互斥;

从两种锁的特性看, 读写锁能够完全替代互斥锁. 但通常提到读写锁时都会说: 读写锁用于 **读多写少** 的场景.

我们从 benchmark 结果看原因:
> 注: 不同系统/硬件结果可能不同
```
goos: darwin
goarch: amd64
pkg: demo
// 互斥锁 加锁
BenchmarkMutexLock-4             	300000000	        23.3 ns/op
// 读写锁 加写锁
BenchmarkRWMutexLock-4           	200000000	        38.3 ns/op
// 读写锁 加读锁
BenchmarkRWMutexRLock-4          	200000000	        31.7 ns/op
// 互斥锁 加锁+解锁
BenchmarkMutexLockUnLock-4       	200000000	        30.3 ns/op
// 读写锁 加写锁+解锁
BenchmarkRWMutexLockUnLock-4     	100000000	        54.1 ns/op
// 读写锁 加读锁+解锁
BenchmarkRWMutexRLockRUnLock-4   	200000000	        38.4 ns/op
PASS
ok  	demo	56.978s
```

### 从结果上看, 读写锁的效率会低于互斥锁! 虽然理论上读写锁可以替代互斥锁, 但不推荐!

赋上 benchmark 代码
```
func BenchmarkMutexLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.Mutex
		lock.Lock()
	}
}

func BenchmarkRWMutexLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.RWMutex
		lock.Lock()
	}
}

func BenchmarkRWMutexRLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.RWMutex
		lock.RLock()
	}
}

func BenchmarkMutexLockUnLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.Mutex
		lock.Lock()
		lock.Unlock()
	}
}

func BenchmarkRWMutexLockUnLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.RWMutex
		lock.Lock()
		lock.Unlock()
	}
}

func BenchmarkRWMutexRLockRUnLock(b *testing.B) {
	for i := 0; i < b.N; i++ {
		var lock sync.RWMutex
		lock.RLock()
		lock.RUnlock()
	}
}
```