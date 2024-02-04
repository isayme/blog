---
title: '教程: 使用GnuPG(PGP)对信息做加密或签名'
date: 2024-02-04T15:28:34Z
tags: []

---

> 注：以下内容在 Ubuntu 20.04 下验证，使用的 gpp 版本 2.2.19。

# 什么是 GnuPG(PGP)
PGP 全称 `Pretty Good Privacy`, 是由 Phil Zimmermann 于 1991 年开发的用于信息加密和数字签名的程序。
GnuPG 全称 GUN Privacy Guard, 是对 PGP 的开源实现。
# 加密和签名原理
技术层面的原理是非对称加密算法RSA，PGP 是建立在 RSA 基础之上，作为使用者，我们对RSA只需要有如下的了解：

1. RSA 算法的加解密使用一对密钥，称为私钥和公钥；
2. 私钥加密的数据，只有公钥能解密；
3. 公钥加密的数据，只有私钥能解密；
4. 公钥可对外公开可见（这样别人才能用你的公钥加密数据给你）
5. 私钥自己保存不给他人（有了私钥就能解密）
## 数据加密过程
假定A需要发送银行卡密码给B，B需要解密拿到银行卡密码明文，加密的过程：

1. A 通过安全的方式获取 B 的公钥；（具体什么方式不限，比如 B 可以将公钥放公网）
2. A 用 B 的公钥加密银行卡密码，将加密后的内容传给 B；
3. B 使用 B 的私钥解密收到的密文，得到银行卡密码明文；
<img width="530" alt="image" src="https://github.com/isayme/blog/assets/1747852/e8fe1af5-66da-4f87-bdf6-b475e03a6aa2">

## 数字签名过程
假定有份商业合同需要A签字，B需要验证A签名了且合同内容没有被人篡改，签名过程？

1. A 使用 A 的私钥对商业合同做签名；（两个作用：1. 证明是A签的；2. 防止别人看到的合同内容被篡改）
2. A 将合同和签名信息一起发送给 B；
3. B 通过安全的方式获取 A 的公钥；
5. B 使用 A 的公钥对收到的 签名做验证，验证通过后才认为合同内容可信；
<img width="471" alt="image" src="https://github.com/isayme/blog/assets/1747852/a5665ad4-4c2d-40e1-a94b-ba4f412d4e73">

# 安装 GnuPG
GnuPG 官网：[https://www.gnupg.org](https://www.gnupg.org/)

## 安装命令行工具
### Mac
 > brew install gnupg

### Debian/Ubuntu
> apt install gnupg

### CentOS
> yum install gnupg

## 安装图形界面
### Mac
[GPG Suite](https://gpgtools.org/)

### Windows
[GPG4Win](http://www.gpg4win.org/)

## 确认完成安装
```
# gpg --version
gpg (GnuPG) 2.2.19
```
# 常用操作
## 列出已有的密钥
### 列出已有的公钥
```
# gpg --list-keys
------------------------
# pub 表示这是公钥，如果是私钥，这里会是 sec
# rsa3072, 表示这是 rsa 算法，密钥长度 3072 位
# 2024-02-04 是公钥创建时间
# expires 后面是公钥过期时间
pub   rsa3072 2024-02-04 [SC][expires: 2024-11-30]
# 这是公钥指纹，如果这个公钥来自他人，可用于和对方确认指纹，确保公钥是对方的。
      C2763C98BB7CF126E63FD0FDF4EC5AF0F688DC85
# 公钥uid信息
# ultimate 表示这是个被标记可信的公钥，默认从别处导入的公钥是不可信的。
uid           [ultimate] demo2 (demo2 comment) <demo2@t.cn>
sub   rsa3072 2024-02-04 [E]
```
后续会大量使用 uid，uid 可以是 name，可以是邮箱，可以是指纹，只要不重复就可以用。
### 列出已有的私钥
> gpg --list-secret-keys

输出信息和公钥差不多。
## 新建密钥对
> gpg --full-generate-key

命令执行会提示几个问题, 这里提供建议答案：

1. key 类型选择 `RSA and RSA`(即默认值）；
2. key 长度选择 4096；
3. key 有限期选择永久；(根据你的需要选择

生成过程中会提示为私钥设置密码，如果密钥不需要可以直接Ok跳过(会提示两次)。
## 创建撤销公钥证书
一旦私钥泄露，需要及时标记公钥作废。
[https://superuser.com/questions/1526283/how-to-revoke-a-gpg-key-and-upload-in-gpg-server](https://superuser.com/questions/1526283/how-to-revoke-a-gpg-key-and-upload-in-gpg-server)
```
# 创建一个撤销证书
gpg --output revoke.asc --revoke-key [uid]

# 标记本地公钥为撤销
gpg --import revoke.asc

# 标记密钥服务器上的公钥为撤销（再上传一次公钥）
gpg --send-keys [uid]
```
## 导出公钥或私钥
将你的公钥导出给他人使用。
```
# --armor 表示到处公钥为 ascii 格式
# --output 指定导出文件路径
gpg --armor --output ./public-key.txt --export [uid]

# 导出私钥
gpg --armor --output private-key.txt --export-secret-keys [uid]
```
## 导入公钥并标记可信
```
# --import 指定导入公钥所在文件
gpg --import ./public-key.txt
```
导入的公钥默认是不受信的，后续使用此公钥时软件会提醒，
```
# [uid] 导入公钥的 uid
gpg --sign-key [uid]
```

## 删除公钥或私钥

```
# 删除公钥
gpg --delete-keys [uid]

# 删除私钥
gpg --delete-secret-keys [uid]
```

## 将公钥托管在密钥服务器
公钥除了通过文本或文件传输，还可以将其上传到密钥服务器，这样其他人可以在密钥服务器上直接下载你的公钥。

```
# 上传公钥
gpg --send-keys [uid]

# 搜索公钥
gpg --search-keys [uid]

# 下载公钥
gpg --receive-keys [uid]
```

默认的密钥服务是 `keys.gnupg.net`, 可通过参数`--keyserver [key server url]`指定密钥服务器。
常见的密钥服务器有（[维基](http://en.wikipedia.org/wiki/Key_server_(cryptographic))）：
https://keyserver.ubuntu.com
https://pgp.mit.edu
https://keyring.debian.org

# 使用gpg实现数据加密

```
# 加密文件, --recipient 指定使用uid的公钥
gpg --output demo.enc.txt --recipient [uid] --encrypy demo.txt

# 解密文件, 无需指定密钥，密文里含有此密文使用的公钥信息。
gpg --output demo.de.txt --decrypt demo.enc.txt
```

# 使用gpg实现数字签名

```
# 可通过 --output 参数指定输出前面文件位置

# 签名，会在当前目录生成 demo.txt.gpg 文件，文件是二进制，含有原始文件内容和签名信息
gpg --sign demo.txt
# 签名，会在当前目录生成 demo.txt.asc 文件，文件是文本，含有原始文件内容和签名信息
gpg --clearsign demo.txt
# 签名，会在当前目录生成 demo.txt.sig 文件，文件是二进制，仅含有签名信息
gpg --detach-sign demo.txt
# 签名，会在当前目录生成 demo.txt.sig 文件，文件是文本，仅含有签名信息
gpg --armor --detach-sign demo.txt
```

```
# 验证通过软件会给出提示
gpg --verify demo.txt.gpg
gpg --verify demo.txt.asc
gpg --verify demo.txt.sig
```

# 参考信息

- [阮一峰: GPG入门教程](https://www.ruanyifeng.com/blog/2013/07/gpg.html)
- [使用GnuPG(PGP)加密信息及数字签名教程](https://www.williamlong.info/archives/3439.html)
