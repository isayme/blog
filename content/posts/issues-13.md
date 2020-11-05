---
title: '分析: npm 恶意包 getcookies 后门机制'
date: 2018-05-06T13:54:01Z
tags: ["Node.js"]

---

## 背景
`getcookies`包存在后门代码, 目前已经被发现并从 npmjs.org 中删除.

## 相关报道
- Hacker News: [Backdoor injected to NPM express-cookies package](https://news.ycombinator.com/item?id=16975025)  `2018-05-02T08:26:01.000Z`
- npmjs [Reported malicious module: getcookies](https://blog.npmjs.org/post/173526807575/reported-malicious-module-getcookies) `May 2, 2018 (3:47 pm)`
- solidot [有人尝试在流行的 JavaScript 包中植入后门](https://www.solidot.org/story?sid=56384) `2018年05月04日 15时50分`

## 基本信息
恶意包包括: `getcookies`, `express-cookies`, `http-fetch-cookies`, 其中后门代码在`getcookies`中.

> 由于 npm 已经删除了上述恶意包, 无法正常获取信息. 但是作为镜像的 `npm.taobao.org` 当前仍旧可以获取信息. 此后的信息都是从 `npm.taobao.org` 获取. 同时为了避免失效, 获取到的信息都有留存.

发布人的信息: `dustin87 <dustin.heidenreich@hotmail.com> https://npm.taobao.org/~dustin87`

![image](https://user-images.githubusercontent.com/1747852/39673796-785dc0ae-5175-11e8-8440-6fbdb42a077d.png)

## 留存
> 三个包的留存
### getcookies
包信息: https://registry.npm.taobao.org/getcookies [备份](https://github.com/isayme/blog/blob/master/issues/13/getcookies/getcookies.json)
版本备份: https://github.com/isayme/blog/blob/master/issues/13/getcookies/

### express-cookies
包信息: https://registry.npm.taobao.org/express-cookies [备份](https://github.com/isayme/blog/blob/master/issues/13/express-cookies/express-cookies.json)
版本备份: https://github.com/isayme/blog/blob/master/issues/13/express-cookies/

### http-fetch-cookies
包信息: https://registry.npm.taobao.org/http-fetch-cookies [备份](https://github.com/isayme/blog/blob/master/issues/13/express-cookies/http-fetch-cookies.json)
版本备份: https://github.com/isayme/blog/blob/master/issues/13/http-fetch-cookies/

## 三个包的基本信息
### getcookies
首次上传时间: `2018-03-22T07:45:55.796Z`, 上传人邮箱: `dustin.heidenreich@hotmail.com`
![image](https://user-images.githubusercontent.com/1747852/39673977-bdc5accc-5177-11e8-9309-7cd38fa19373.png)

包内的 History.md 文件描述此包创建于`2012-05-28`. 其实这个包是从 [cookie](https://www.npmjs.com/package/cookie)@0.3.1 修改而来, `History.md` 的信息都是`cookie`的记录, 存在误导.

### express-cookies
首次上传时间: `2018-03-22T07:46:26.847Z`, 上传人: `dustin.heidenreich@hotmail.com`
![image](https://user-images.githubusercontent.com/1747852/39674107-a2a0cd08-5179-11e8-908e-80d6272bdb5a.png)

包内的 History.md 文件描述此包创建于`2014-02-15`. 其实这个包是从 [cookie-parser](https://www.npmjs.com/package/cookie-parser)@1.4.3 修改而来, `History.md` 的信息都是`cookie-parser`的记录, 存在误导.

### http-fetch-cookies
首次上传时间: `2018-04-12T12:44:43.189Z`, 上传人: `dustin.heidenreich@hotmail.com`
![image](https://user-images.githubusercontent.com/1747852/39674077-4e92f330-5179-11e8-9b93-188872e7ba04.png)
此包为空包, 暂无更多信息.

## 谁在用这些包?
expess-cookies 依赖 getcookies;
http-fetch-cookies 依赖 expess-cookies;
mailparser 依赖 http-fetch-cookies;
```
mailparser
└── http-fetch-cookies
     └── express-cookies
          └──getcookies
```
其中 `mailparser` 存在一定的文档下载量:
![image](https://user-images.githubusercontent.com/1747852/39674679-0179041e-5182-11e8-9df1-a4dbaf44775a.png)

仅 `mailparser` `2.2.1` `2.2.2` `2.2.3` 三个版本分别依赖了 `http-fetch-cookies` 的 `1.0.0` `1.0.0` `1.0.1` 版本, 目前 `mailparser` 的这三个版本已经删除, 备份: https://github.com/isayme/blog/blob/master/issues/13/mailparser/
其中 `mailparser@2.2.1` 发布于 `2018-04-12T12:45:09.611Z`, `mailparser@2.2.2` 发布于 `2018-04-12T12:46:40.121Z`, `mailparser@2.2.3` 发布于 `2018-04-12T12:52:13.451Z`. 有趣的是: `mailparser` 在 `2018年3月11日 GMT+8 下午6:18` 就已经[标记](https://github.com/nodemailer/mailparser/commit/6a1f205a598877269cf1f23a5643e5f75ebf864d)为 `deprecated`.

## 后门机制
![image](https://user-images.githubusercontent.com/1747852/40057311-8535f55a-5880-11e8-982e-30523bf51593.png)


攻击者通过`headers`构建上传恶意代码并执行:

1. 匹配 `req.headers` 中 g`COMMAND`h`CODE`;
2. 当 `COMMAND` 是 `0xfffe` 时重置 code buffer;
3. 当 `COMMAND` 是 `0xfffe`/`0xfffa` 以外的值时加载`CODE` 至 code buffer;
4. 当 `COMMAND` 是 `0xfffa` 时执行 code buffer 的代码, 其中 code buffer 返回一个函数.
 
示例 code buffer:
```
var codebuffer = `(function() {
        return function (...args) {
            console.log(args)
        }
    })()`

require('vm')['runInThisContext'](codebuffer)('we', 'can', 'do', 'anything', 'here')
require('vm')['runInThisContext'](codebuffer)(module.exports, require, req, res, next)
```