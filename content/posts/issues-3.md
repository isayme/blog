---
title: 'MinUnit -- 极简C单元测试框架'
date: 2017-11-30T14:50:22Z
tags: ["c", "test"]

---

## 简介
面向对象编程中单元测试及其流行. 诸如JUit(Java), SUnit(Smalltalk)以及CppUnit (C++)之类的框架都提供了功能丰富的接口函数. 然后对于那些要在条件受限环境(如嵌入式系统)做单元测试的开发者来说, 功能丰富意味着占用资源更多(译者注: 嵌入式环境内存及存储都受限). 好在单元测试的宗旨是测试而不是框架. MinUnit是一个C实现的极简单元测试框架. 它不做malloc之类的内存申请操作, 因此它理应能够胜任任何开发环境, 包括ROM级别的代码.

## 源码
```
/* file: minunit.h */
#define mu_assert(message, test) do { if (!(test)) return message; } while (0)
#define mu_run_test(test) do { char *message = test(); tests_run++; \
                                if (message) return message; } while (0)
extern int tests_run;  
```
你没看错, 整个源码就3行(为方便阅读, 其中一个宏被展开放在两行).

## 创建一个测试用例
MinUnit的测试用例就是一个函数. 如果测试通过, 函数返回0(NULL), 否则返回一个描述错误信息字符串. 
`mu_assert`是一个简单的宏, 如果传入的表达式`test`为false, 则返回对应的`message`描述信息. 宏`mu_run_test`执行一个测试用例, 如果用例fail, 立即返回. 恩, 就这样, 就这么简单.

## 例子
下面的例子执行两个测试用例, 一个通过, 另一个失败.
```
/* file minunit_example.c */
#include <stdio.h>
#include "minunit.h"

int tests_run = 0;

int foo = 7;  
int bar = 4;

static char * test_foo() {  
    mu_assert("error, foo != 7", foo == 7);
    return 0;
}

static char * test_bar() {  
    mu_assert("error, bar != 5", bar == 5);
    return 0;
}

static char * all_tests() {  
    mu_run_test(test_foo);
    mu_run_test(test_bar);
    return 0;
}

int main(int argc, char **argv) {  
    char *result = all_tests();
    if (result != 0) {
        printf("%s\n", result);
    }
    else {
        printf("ALL TESTS PASSED\n");
    }
    printf("Tests run: %d\n", tests_run);

    return result != 0;
}
```

## 结束语
有人以为实现一个单元测试框架很复杂. 其实你可以几行代码就实现一个, 就如本文中的MinUnit. 当然, 如果你熟悉类似JUnit这样功能齐全的测试框架, 最好用它们. 如果没有, 那你可以试试MinUnit, 或者花几个小时自己实现一个. 千万别不做单元测试.

## 许可协议
You may use the code in this tech note for any purpose, with the understanding that it comes with NO WARRANTY. 
(不负责翻译: 本文的源码尽管拿去用, 但出问题时本人不负责.)

## 附录: 为什么用 do {} while?
很多人问我为什么宏mu_run_test中用do {} while语句. 其实这是标准C的惯例. 更多信息参见: http://www.eskimo.com/~scs/C-faq/q10.4.html

> 原文: [MinUnit -- a minimal unit testing framework for C](http://www.jera.com/techinfo/jtns/jtn002.html)