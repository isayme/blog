---
title: '为什么一些统计服务的上报地址都是 gif 后缀?'
date: 2018-09-04T07:00:47Z
tags: []

---

> 问题来源: [拼多多等 app，搜索请求地址是 t.gif，这个什么原理？](https://www.v2ex.com/t/485592)

关键字: `image beacon`, `pixel tracking`

之前也有注意到诸如 Google Analysis / 百度统计 的服务都会产生后缀是`gif`的请求, 但没有深究历史背景, 借此机会尝试去了解下.

## 常见统计服务商的收集API
### Google Analysis
通过访问 [Twitter](http://twitter.com/) 首页, 发现最新版的已经不是 gif, 但返回 gif 类型, 大小是 35 字节:
![image](https://user-images.githubusercontent.com/1747852/45024469-ac175680-b06b-11e8-9784-dd3661850473.png)

早期的 Google Analysis 也是 gif, 地址是 https://www.google-analytics.com/__utm.gif, 35 字节.

### customer.io
访问 [customer.io](https://customer.io) 首页, 地址带有 gif 后缀, 返回 gif 类型, 36 字节.
![image](https://user-images.githubusercontent.com/1747852/45025133-41ffb100-b06d-11e8-8ad7-9bb804e0fead.png)

### 友盟+
访问 [友盟](https://www.umeng.com/) 首页, 地址带有 gif 后缀, 返回 gif 类型, 43 字节.
![image](https://user-images.githubusercontent.com/1747852/45024814-6d35d080-b06c-11e8-97cf-bdcb26ae9930.png)

### 百度统计
访问 [Teambition](https://www.teambition.com) 首页, 使用了百度统计, 地址带有 gif 后缀, 返回 gif 类型, 43 字节.
![image](https://user-images.githubusercontent.com/1747852/45024989-d7e70c00-b06c-11e8-832e-5d13f5c8c95b.png)

## 微博
访问 [微博](https://weibo.com) 首页, 收集地址带有 gif 后缀, 返回 gif 类型, 35 字节
![image](https://user-images.githubusercontent.com/1747852/45025832-2dbcb380-b06f-11e8-92dd-570f352e997d.png)

### 简单总结
目前大多数统计的请求地址是带有`gif`后缀的, 接口返回一个 1x1 尺寸的 gif 图片,大小 35/36/43 字节.

## 问题及解释
### 使用 `gif` 后缀的传统是哪来的?
最早的猜测是 Google Analysis.

### 为什么是图片? 为什么是 `gif` 而不是其他格式?
图片的优势:
1. 不阻塞页面加载;
2. 自动触发;
3. 可以内嵌到邮件中(邮件不支持javascript; 邮件的阅读统计需求);
4. 没有跨域问题.

`gif` 的优势:
1. 1x1的尺寸够小(最小35字节);
2. 出生早([gif:1987/1989](https://en.wikipedia.org/wiki/GIF), [jpeg:1992](https://en.wikipedia.org/wiki/JPEG), [png: 1996](https://en.wikipedia.org/wiki/Portable_Network_Graphics));
3. 浏览器支持更广泛[Image format support](https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support)

### 同样是 `1x1` 的尺寸, 为什么大小不一样?
35/36字节的gif: 是1x1像素的白色图片;
43字节的gif: 是1x1像素的透明图片;

## 参考资料
- [网站统计中的数据收集原理及实现](http://blog.codinglabs.org/articles/how-web-analytics-data-collection-system-work.html)
- [CORS——跨域请求那些事儿](https://yq.aliyun.com/articles/69313)
- [Wiki: Web beacon](https://en.wikipedia.org/wiki/Web_beacon)
- [Why does Google Analytic request a GIF file?](https://stackoverflow.com/questions/2083043/why-does-google-analytic-request-a-gif-file)
- [Why does Google Analytics use __utm.gif?](https://stackoverflow.com/questions/4170190/why-does-google-analytics-use-utm-gif)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [Javascript Image Beacons For Tracking User Interactions](http://arlocarreon.com/blog/javascript/javascript-image-beacons-for-tracking-user-interactions/)
- [How to use Google Analytics with a beacon image](https://perso.crans.org/besson/beacon.en.html)
- [Using a Beacon Image for GitHub, Website and Email Analytics](https://www.sitepoint.com/using-beacon-image-github-website-email-analytics/)