---
title: '[2020-10] Mac 系统自助编译 Zeal'
date: 2020-10-22T00:57:25Z
tags: []

---

Dash 很好, 需要收费. Zeal 作为替代品并不提供 Mac 版本, 但可以自行编译.

> 以下内容可能存在时效性, 当前时间 2020-10-24.
> 内容源自官方文档实操: https://github.com/zealdocs/zeal/wiki/Build-Instructions-for-macOS

首先系统要安装好 Xcode 和 Homebrew.

要求 cmake 版本 >= 3.5.1, 可以通过 `brew install/upgrade cmake` 安装/升级版本.

安装依赖 qt 和 libarchive. 
```
brew install qt
brew install libarchive
export CMAKE_PREFIX_PATH=/usr/local/opt/qt5:/usr/local/opt/libarchive
```

下载最新zeal代码并编译
```
git clone https://github.com/zealdocs/zeal.git
cd zeal
mkdir build
cd build
cmake ..
make
```

编译完成即可将编译结果拷贝/移动到 Applications 目录:
`cp -Rp ./bin/Zeal.app ~/Applications/`

运行截图:
![image](https://user-images.githubusercontent.com/1747852/96805554-7a78c980-1444-11eb-86b8-1d52b24d4b20.png)

