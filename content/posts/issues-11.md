---
title: 'Open Graph protocol (开放内容协议)'
date: 2017-12-17T14:27:59Z
tags: []

---

> 2018/09/06: [Noembed](https://noembed.com/)
> 2018/08/21: 当前同类协议有 [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards). 另外, [embed.ly](https://embed.ly/)(meduim在用), [iframely](https://iframely.com/) 提供服务以支持多种协议.


当在 twitter / slack 等应用上分享一个链接(如 https://slack.com) 时, 会展示成这样:

![image](https://user-images.githubusercontent.com/1747852/34080552-dc870d74-e37a-11e7-982d-ffbf117c5d64.png)
![image](https://user-images.githubusercontent.com/1747852/34080535-8dea0d74-e37a-11e7-9c47-b22bb58547c0.png)

是否有想过:
- 图片总的`标题`是如何拿到的? 抓取网页后解析`title`标签吗?
- 图片中的`简介`是如何拿到的? 解析`<meta name="description"`吗?
- 图片中的`图片`地址是如何拿到的? 

**想要了解背后的原理, 可以直接查看: [The Open Graph protocol](http://ogp.me/).**

本质上 `标题`/`简介`/`图片` 等信息都是从 `<meta property="og:XXX"` 标签中解析获取. 常用的有:
`og:site_name`: 网站名
`og:description`: 网站简介
`og:image`: 网站的logo或其他任意图片.

比如示例中的 slack 的首页:
![image](https://user-images.githubusercontent.com/1747852/34080667-c6c7c4a4-e37c-11e7-98db-fa77bb2966f8.png)

Open Graph protocol 还定义了诸如 音频/视频 等信息的定义, 具体规范参见 [官方网站](http://ogp.me/).