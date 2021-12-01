---
title: 'N1 通过 Docker 安装 Openwrt 为旁路由'
date: 2021-12-01T15:40:53Z
tags: []

---

# 说明
当前我的网络情况:
1. 主路由的子网网段是 `192.168.4.0/24`;
2. N1 路由器的 IP 是 `192.168.4.2`;

计划安装的 Openwrt 使用 IP `192.168.4.11`.

# Openwrt 安装及配置
## 1. 开启网卡混杂模式
```
## 启用
ip link set eth0 promisc on
```

## 2. docker 创建 macvlan 网络
```
docker network create -d macvlan --subnet=192.168.4.0/24 --gateway=192.168.4.1 -o parent=eth0 macnet
```

## 3. 启动 openwrt 镜像
```
# for N1
docker run \
  -d \
  --name=unifreq-openwrt-aarch64 \
  --restart=unless-stopped \
  --network=macnet \
  --privileged \
  --ip=192.168.4.11 \
  unifreq/openwrt-aarch64:r21.11.11
```

## 4. 修改容器 IP 信息并重启容器
```
# 见 Docker 镜像说明: https://hub.docker.com/r/unifreq/openwrt-aarch64
docker exec unifreq-openwrt-aarch64 sed -e "s/192.168.1.1/192.168.4.11/" -i /etc/config/network
docker restart unifreq-openwrt-aarch64
```

## 5. http://192.168.4.11 访问 openwrt
默认账号密码: `root/password`

## 6. 关闭 DHCP
路径: 网络 => 接口 => LAN => DHCP 服务器 => 基本设置
操作: 勾选忽略此接口
![image](https://user-images.githubusercontent.com/1747852/144264205-4ef70e4f-6856-444c-acb0-0ad4cb8fd43f.png)

## 7. 关闭 IPv6
路径: 网络 => 接口 => LAN => DHCP 服务器 => IPv6 设置
操作: 禁用 `路由通告服务`, `DHCPv6 服务`, `NDP 代理`
![image](https://user-images.githubusercontent.com/1747852/144264234-5393daf5-02b9-41d0-92b8-c8db06dcbde2.png)

## 8. 配置 网关 和 DNS
路径: 网络 => 接口 => LAN => 一般设置 => 基本设置
操作: 1. `IPv4 网关` 改为 `192.168.4.1`; 2. `IPv4 广播` 改为 `192.168.1.255`; 3. `使用自定义的 DNS 服务器` 改为 `114.114.114.114`
![image](https://user-images.githubusercontent.com/1747852/144266331-6ebd76d9-be64-485c-8f96-a42ce909319d.png)

## 9. 主路由是系统需要的配置
将 `IPv4 硬件加速` 改为 `Offload TCP/UDP for LAN`.
![image](https://user-images.githubusercontent.com/1747852/144273414-1e0557bb-7c0d-4022-bf5c-3b3e9eef3d3d.png)
 
## 10. 配置主路由
目前主路由下的设备可以在网络设置中将路由器的地址改为`192.168.4.11`即可实现通过旁路由上网.
为了避免各个设备分别配置, 达到全局使用旁路由的目的, 可以配置主路由: 将 DHCP 默认网关 和 DNS 都改为 `192.168.4.11`
![image](https://user-images.githubusercontent.com/1747852/144265148-ae38c859-3c2d-41f7-b53f-24949d54fe88.png)


# 资料
- 主要参考文章 [Docker下安装/升级Openwrt](https://touchren.pub/2020/11/16/openwrt-in-docker/)
- [N1 openwrt 镜像信息](https://www.right.com.cn/forum/thread-958173-1-1.html)