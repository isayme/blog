---
title: '浏览器指纹(fingerprint)'
date: 2018-10-29T03:05:55Z
tags: []

---

# Update
20201026: https://github.com/fingerprintjs/fingerprintjs

## 背景
如果每个浏览器都拥有一个唯一ID (即指纹), 那么利用这个ID进行用户行为记录/追踪.
当前 HTTP 协议本身并没有指纹的定义, 即便是有, 由于HTTP协议本身的无状态, 指纹信息也很容易被伪造.

## 生成指纹
在浏览器指纹不存在的前提下, 网站有需求去追踪用户信息(比如电商网站在用户未登录的情况下记录用户的浏览记录并进行信息推荐), 只能通过当前的访问者信息模拟生成一个指纹, 这个指纹要求尽量唯一, 但理论上无法保障唯一.

### 生成方式
为了尽量保障唯一, 生成指纹时会尽量获取访问者信息, 包括但不限于:
- User-Agent 信息;
- 屏幕 width/height;
- 屏幕 color depth;
- 浏览器语言;
- 时区信息;
- 浏览器的特性, 如 indexedDb/localStorage 等;
- 已安装的插件;

最终获取的信息通过哈希算出一个 ID.

### 参数的来源:
浏览器自身的信息, 比如 User-Agent / 语言 等. 同一地区用户安装的同一版本浏览器时这些信息基本相同.

用户电脑的信息, 比如 使用的屏幕信息 / 安装的插件信息 等. 这个会因人而异.

**任何个体用户存在差异的信息都可以作为生成的指纹参数之一.**

## 参考资料
- [Am I unique?](https://amiunique.org/)
- [fingerprintjs ](https://github.com/Valve/fingerprintjs) deprecated
- [fingerprintjs2](https://github.com/Valve/fingerprintjs2) // 2018-12-29: 网易邮箱在用 1.6.1 版本
- [browserprint.info](browserprint.info)