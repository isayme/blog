---
title: 'Lastpass 数据安全机制'
date: 2021-01-06T14:57:24Z
tags: []

---

# 结论: 存储在 Lastpass 的数据是安全的

1. 用户持有登录密码, 此密码也是 Lastpass 数据加密 Master Password, 用于生成数据加密密钥;
2. Lastpass 不知用户的密码, 登录时密码加密(不可逆)提交;
3. 数据在客户端加密(可逆, aes-256算法)后提交到 Lastpass 存储;

只要用户的登录密码安全不被盗, 任何人(包括Lastpass)拿到 存储在 Lastpass 的用户数据都无法破解原始内容, 因为数据加密的key是在客户端依据登录密码生成, 没有登录密码就无法算出加密使用的key.

![image](https://user-images.githubusercontent.com/1747852/103782499-8272fd80-5072-11eb-8362-836a1c852bb4.png)


以下内容为 Lastpass 数据加密的方案.

# 获取 iterations

加密密钥生成需要使用得到的值, 默认是5000.

访问Lastpass接口即可, 此接口无鉴权.

> curl [https://lastpass.com/iterations.php](https://lastpass.com/iterations.php) --data-raw 'email=yourEmailAddress'

# 数据加密

在 Lastpass 存储的数据(各个站点的登录密码等)都在客户端本地加密后提交到Lastpass服务端.

加密使用 `aes-256-cbc`  算法, 加密用的 key 通过用户 Lastpass 账号及密码生成:

```jsx
key = crypto.pbkdf2Sync(password, email, iterations, 32, 'sha256')
```

# 登录 Lastpass

登录密码即为后面数据加密用的 Master Password.

登录密码客户端本地加密后提交, 即 Lastpass 无法知道原始密码.

```jsx
// hash 即为提交用的密码, hex 编码.
// 为了避免 Lastpass 拿到 key, 登录密码在 key 的基础上再次进行了一次 pbkdf2 运算.
hash = crypto.pbkdf2Sync(key, password, 1, 32, 'sha256').toString('hex')
```

# 获取加密数据

`POST https://lastpass.com/getaccts.php` 接口获取. 获取到的数据是 base64 编码结果.

# 解密加密数据

加解密采用 `aes-256` 算法, 解密用的key与加密使用相同的 key.

## 加密数据格式

每个站点的账号密码在Lastpass存为一个条目.

每个条目分别加密后组成整个加密数据.

每条条目数据的格式是: `id + size + payload`:

- id 是明文字符串格式, 标识此条目的类型, 共4字节;
- size 是 payload 的大小, 共4字节, 大端格式;
- payload 是本条目的具体内容, 不同的id类型的payload格式不同.

## ID = ACCT 对应的 payload 格式

```
payload = field1 + field2 + ... + fieldN
field{X} = size + content
size 共4字节, 大端格式, 等于 `content 长度 + 4`;
content 是具体 field 值(可能是加密后的值).
```

对于ACCT类型, 包含的field有:

- id
- name 需要 aes256解密
- group 需要 aes256解密
- url 需要 HEX解码
- notes 需要 aes256解密
- unknown 未知含义字段
- unknown 未知含义字段
- username 需要 aes256解密
- password 需要 aes256解密
- unknown 未知含义字段
- unknown 未知含义字段
- secureNote

其中 name 等字段主要使用 `aes-256-cbc` 加密, 密钥即为前文的 key.

# 参考资料

相关的算法方案主要参考的 Nodejs 包: https://www.npmjs.com/package/lastpass

Lastpass 官方: https://www.lastpass.com/enterprise/security