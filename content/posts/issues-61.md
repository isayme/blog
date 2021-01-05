---
title: 'Linux 账号密码加密方式 (Node.js 实现 sha-512 加密算法)'
date: 2021-01-05T15:07:37Z
tags: []

---

# 基础信息
linux 账号密码加密存储在文件`/etc/shadow`中;
`/etc/shadow` 文件每一行记录一个账号的相关信息, 其中用户密码采用加密(支持多种算法)方式存储;

# `/etc/shadow` 格式
```
# cat /etc/shadow
# root:$6$PCjFvrAA/NnyKdMp$7fs0mn0nUuQ0jjtKZVAyf8TCBIx5MUvwC2ftkRwh2q7PYSuKpnv4wVu63zX.oCJ/RG2v4gDbNMCDAV1dIjCuE.:18631:0:::::
```

https://linuxize.com/post/etc-shadow-file/

```
mark:$6$.n.:17736:0:99999:7:::
[--] [----] [---] - [---] ----
|      |      |   |   |   |||+-----------> 9. Unused
|      |      |   |   |   ||+------------> 8. Expiration date
|      |      |   |   |   |+-------------> 7. Inactivity period
|      |      |   |   |   +--------------> 6. Warning period
|      |      |   |   +------------------> 5. Maximum password age
|      |      |   +----------------------> 4. Minimum password age
|      |      +--------------------------> 3. Last password change
|      +---------------------------------> 2. Encrypted Password
+----------------------------------------> 1. Username

```

# `Encrypted Password`的格式
```
$id$salt$hashed
```

其中 id 表示加密策略, 可能值有:

https://www.cyberciti.biz/faq/understanding-etcshadow-file/

https://en.wikipedia.org/wiki/Crypt_(C)

```
1: MD5(Linux, BSD)
2a: Blowfish (OpenBSD)
md5: Sun MD5
5: sha-256
6: sha-512
```

# 一个示例

```
root:$6$PCjFvrAA/NnyKdMp$7fs0mn0nUuQ0jjtKZVAyf8TCBIx5MUvwC2ftkRwh2q7PYSuKpnv4wVu63zX.oCJ/RG2v4gDbNMCDAV1dIjCuE.:18631:0:::::

// 原始 password: 123456
// salt = 'PCjFvrAA/NnyKdMp', 最多16字节
// encrypt password = '7fs0mn0nUuQ0jjtKZVAyf8TCBIx5MUvwC2ftkRwh2q7PYSuKpnv4wVu63zX.oCJ/RG2v4gDbNMCDAV1dIjCuE.' 共86字节,
```

## openssl 加密命令
示例密码是`sha512`加密策略, 可以使用 openssl (Ubuntu 18.04 安装 openssl, 14.04 不支持 `-6` 参数) 加密验证结果是否一致:
```
openssl passwd -6 -salt PCjFvrAA/NnyKdMp 123456
$6$PCjFvrAA/NnyKdMp$7fs0mn0nUuQ0jjtKZVAyf8TCBIx5MUvwC2ftkRwh2q7PYSuKpnv4wVu63zX.oCJ/RG2v4gDbNMCDAV1dIjCuE.
```

# 加密算法 sha-512 Node.js 实现
加密算法说明: https://akkadia.org/drepper/SHA-crypt.txt
`encrypt password` 使用[类 base64 编码](https://en.wikipedia.org/wiki/Base64).

为了真实体验加密过程, 这里使用 nodejs 实现了一遍:
https://gist.github.com/isayme/44a82a15dc49c356743c95223cb7166a