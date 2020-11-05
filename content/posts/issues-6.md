---
title: '利用 autogen.sh 生成 configure 文件'
date: 2017-12-06T05:27:30Z
tags: ["autogen.sh", "make"]

---

### 背景
Linux 系统上的软件安装通常是这样的三部曲:
```
./configure
make
make install
```
当自己想通过`configure`文件查看原理时, 发现基本看不懂 ...
即使通过 Google 了解到这些文件是通过 [autoconf][autoconf] / [automake][automake] 生成, 也会发现这两个工具(还有其他周边工具)的使用门槛有点高: [autoconf flow](https://user-images.githubusercontent.com/1747852/33802720-124b042e-ddb8-11e7-9238-4e7c95babf94.gif)

[autogen.sh][autogen.sh] 的诞生即是为了解决门槛及繁琐生成的过程.

### 如何使用
开发提供 `configure.ac` 及 `Makefile.am` 文件, 剩下的一切都交由 `autogen.sh` 处理.

### 示例
提供一个生成静态库的示例 [autogen.sh-example](https://github.com/shiffthq/autogen.sh-example).

### 参考资料
- [autogen.sh][autogen.sh]
- [The magic behind configure, make, make install](https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install)

[autogen.sh]: https://sourceforge.net/projects/buildconf
[autoconf]: https://www.gnu.org/software/autoconf/manual/autoconf.html
[automake]: https://www.gnu.org/software/autoconf/manual/automake.html