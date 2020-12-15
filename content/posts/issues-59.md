---
title: '两步验证(2FA)备忘'
date: 2020-12-02T16:06:44Z
tags: []

---

# 两步验证
两步验证, 对应的英文是 Two-factor Authentication（2FA）. 

# 典型两步验证URI
> otpauth://totp/TEST:ququ@test.com?secret=IBED6ZJDF4UWST3YKM3DK2ZQHFUDQZZSIRFD6L2FMF3FEN2DINZQ&issuer=Google

其中:
`totp` 表示使用的算法是 TOTP (Time-based One-time Password), 它是基于时间的一次性密码生成算法.
`TEST:ququ@test.com` 是账户信息, 会显示在两步验证App上, 方便用户辨识是哪个账号.
`secret` 是密钥信息, base32 编码, 会在服务商服务端及两步验证App分别保存.
`issuer` 是服务商, 会显示在两步验证App上, 方便用户辨识对应编码来源服务商.

# 常见问题
## 验证码是否可以重复使用?
可以.

验证码每30秒刷新一次, 此验证码 30秒内都有效.

## 两步验证App(如Google Authenticator)验证码生成是否需要联网?
不需要. 

验证码计算是在本地根据密钥和时间生成, 无需与远端服务交互.

## 两步验证安全风险
服务端需要保存密钥, 服务端代码或数据库泄露, 密钥可能被他人拿到;
客户端需要保存密钥, 使用非正规客户端或越狱(ROOT)有可能被其他App获取到密钥;

## 云同步客户端会不会导致密钥泄露?
不会.

具体可以参见 Authy 的文档: [How Authy 2FA Backups Work](https://authy.com/blog/how-the-authy-two-factor-backups-work/).

## 备用验证码原理
为用户生成随机验证码, 当无法使用客户端生成验证码时(如手机丢失), 可以用备用验证码.

## 恢复码
当手机丢失时恢复码可以用来关闭账号的两步验证.

# 推荐的客户端App
不推荐 Google Authenticator, 因为其不支持云端同步.

- [LastPass Authenticator](https://lastpass.com/auth/)
- [Microsoft Authenticator](https://www.microsoft.com/zh-cn/account/authenticator)
- [Twillo Authy](https://authy.com/)

# 参考资料
- [使用两步验证提高账号安全性](https://imququ.com/post/about-two-factor-authentication.html)