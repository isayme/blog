---
title: '获取中国 IP 网段'
date: 2021-11-08T15:10:49Z
tags: []

---

# 获取 IP 网段
## 数据源1
```
wget -O- 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' | awk -F\| '/CN\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' > ./chnroute.txt
```

## 数据源2
```
wget -O- http://www.ipdeny.com/ipblocks/data/countries/cn.zone > ./chnroute.txt
```

# 创建并初始化 ipset
```
ipset -N chnroute hash:net
for i in $(cat ./chnroute.txt ); do ipset -A chnroute $i; done
```