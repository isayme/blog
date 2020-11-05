---
title: '限流算法: 令牌桶(token bucket) vs 漏桶(leak bucket)'
date: 2018-09-06T10:26:05Z
tags: []

---

## 示意图
### 漏桶(leak bucket)
![image](https://user-images.githubusercontent.com/1747852/45152344-51b0fe00-b203-11e8-8c76-774037a085a6.png)

### 令牌桶(token bucket)
![image](https://user-images.githubusercontent.com/1747852/45152367-61c8dd80-b203-11e8-9ce4-0da597f4e530.png)

## 异同
- 都可用于限流;
- 漏桶限流的效果是服务处理器接收到的请求速度有上限. 典型应用是网络限速.
- 令牌桶限流的效果是服务器接收到的请求**允许短暂的突增**. 典型应用API请求限速.

## 参考资料
- [PPT: Token Bucket](https://www.eng.tau.ac.il/~shavitt/courses/PrinComNet/2012/TokenBucket.ppt)
- [高并发系统限流中的漏桶算法和令牌桶算法，通过流量整形和速率限制提升稳定性](https://blog.csdn.net/scorpio3k/article/details/53103239)
- [服务接口API限流 Rate Limit](https://www.cnblogs.com/exceptioneye/p/4783904.html)
- [Wiki: Token bucket](https://en.wikipedia.org/wiki/Token_bucket)
- [Wiki: Leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket)
