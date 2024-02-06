---
title: 'SSH 备忘'
date: 2024-02-06T01:41:22Z
tags: []

---

# 配置文件位置
客户端配置文件：`~/.ssh/config`, 更多信息可参考 [https://wangdoc.com/ssh/client](https://wangdoc.com/ssh/client)

服务端配置文件：`/etc/ssh/sshd_config`, 更多信息可参考 [https://wangdoc.com/ssh/server](https://wangdoc.com/ssh/server)

# 配置：是否允许密码登录
服务端配置，配置项 `PasswordAuthentication`，默认是 `yes`。
```
# 允许密码登录
PasswordAuthentication yes

# 禁止密码登录
PasswordAuthentication no
```
# 配置：是否允许 root 用户登录
服务端配置，配置项 `PermitRootLogin`，默认是 `yes`。
```
# 允许 root 登录
PermitRootLogin yes

# 不允许 root 登录
PermitRootLogin no

# 允许 root 使用密钥登录，但是不允许 root 使用密码登录
PermitRootLogin prohibit-password
```
# 配置：是否允许密钥登录
服务端配置，配置项`PubkeyAuthentication`，默认是 `yes`
```
# 允许密钥登录
PubkeyAuthentication yes

# 不允许密钥登录
PubkeyAuthentication no
```
# 配置：密钥登录
## 生成密钥
执行命令`ssh-keygen` , 默认使用`rsa` 算法，可通过 `-t` 参数指定其他算法, `-C` 参数增加注释信息。
```
# ssh-keygen
# ssh-keygen -t rsa
# ssh-keygen -t ed25519
```
过程中会询问私钥文件路径，同时公钥的文件路径在私钥的基础上增加`.pub` 后缀，例如私钥路径是`~/.ssh/id_rsa` 公钥路径是 `~/.ssh/id_rsa.pub`

新生成的私钥默认权限是 600, 公钥权限默认是 644, 建议都改成 600：
```
# chmod 600 ~/.ssh/id_rsa
# chmod 600 ~/.ssh/id_rsa.pub
```
## 将公钥上传到服务器
公钥内容需要保存在服务器的`~/.ssh/authorized_keys` 文件中，每个文件占用一行。

可以手动也可以使用命令辅助修改对应文件：
```
# cat ~/.ssh/id_rsa.pub | ssh user@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 或者使用 ssh 自带命令， key_file 无需带 `.pub` 后缀。
# ssh-copy-id 命令是添加公钥到 authorized_keys 文件尾，注意 authorized_keys 文件尾有换行。
# ssh-copy-id -i key_file user@host
```

注意，`authorized_keys` 文件权限要是 644，如果权限不对，ssh服务器可能拒绝读取该文件。
```
# chmod 644 ~/.ssh/authorized_keys
```

公钥上传到服务器后，下次登录就会自动采用密钥登录，无需输入密码。
## 密钥登录时手动指定私钥文件
ssh 登录服务器时默认查找使用的私钥是以下几个：

- ` ~/.ssh/id_dsa` 
- `~/.ssh/id_ecdsa` 
- `~/.ssh/id_ed25519` 
- `~/.ssh/id_rsa`


如果你的私钥文件不在以上之中，ssh 无法知道是哪一个，这时可以通过 -i 参数指定使用的私钥：
```
ssh -i ~/.ssh/id_rsa user@host
```

或者使用客户端配置 `~/.ssh/config` 文件
```
Host hostname
  IdentityFile ~/.ssh/mykey
  IdentitiesOnly yes # 如果有问题可以试试 https://unix.stackexchange.com/a/494485
```
# ssh-agent: 解决 ssh 私钥密码频繁输入问题
新建密钥时，为了更加安全，可以设置私钥密码，即使私钥丢失，没有私钥密码也无法使用。

但是安全带来的问题是每次使用私钥都需要输入私钥密码，很不方便。

ssh-agent 可以解决问题: 它让用户在整个 Bash 对话（session）之中，只在第一次使用 SSH 命令时输入密码，然后将私钥保存在内存中，后面都不需要再输入私钥的密码了。
> ssh-agent is a program to hold private keys used for public key authentication.  Through use of environment variables the agent can be located and automatically used for authentication when logging in to other machines using ssh.

```
# 1. 启动 ssh-agent, 在当前 shell 有效。
# ssh-agent bash 或 eval `ssh-agent`

# 2. 添加私钥，会提示输入私钥密码。完成后使用此私钥登录服务器就不再需要输入密码。
# ssh-add ~/.ssh/id_rsa

# 3. [可选] 退出 ssh-agent
# ssh-agent -k
```
# zsh：使用 ssh-agent 插件
即使有了 ssh-agent，每次使用也需要手动启动 ssh-agent ，还是不够方便。

为了避免手动维护 ssh-agent 状态，可以使用一些脚本，如果你在用 [oh my zsh](https://ohmyz.sh/), 还可以使用插件：
编辑 `~/.zshrc`, 添加 `ssh-agent`到插件列表：
```
plugins=(git ssh-agent)
```
执行`source ~/.zshrc`使改动生效。
客户端配置记得加上 `AddKeysToAgent`配置项，使用到此私钥时，输入密码后会自动添加到 ssh-agent。
```
Host *
  AddKeysToAgent yes
```
# 安全：为私钥新增或修改密码
已存在的私钥新增密码或修改密码：
```
# see https://stackoverflow.com/a/3818909
# ssh-keygen -p -f ~/.ssh/id_rsa
```
```
 -p      Requests changing the passphrase of a private key file instead of
         creating a new private key.  The program will prompt for the file
         containing the private key, for the old passphrase, and twice for
         the new passphrase.

 -f filename
         Specifies the filename of the key file.
```
# 参考资料
[阮一峰：SSH教程](https://wangdoc.com/ssh/)
