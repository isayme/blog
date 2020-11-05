---
title: 'N1 刷入 Armbian 5.77(Debian) 系统'
date: 2020-03-25T14:37:52Z
tags: []

---

# 关于 斐讯 N1
知道的自然会知道~~

# 参考资料
[斐讯N1探索手记#1 – 降级并刷入armbian系统](https://luotianyi.vc/1306.html)

# 步骤
机器是在2020年01月01日拼爹爹下单购买, 价格 115. 

买的机器已经刷了 W大系统, 无需再降级.

Mac 电脑通过 adb 远程操作, 无需 双公USB 线.

使用 8G 金士顿 优盘. (**在此处吃了大亏, 之前一直使用的 tf 卡加转接口, `adb shell reboot update` 一直无法进入优盘启动**

dtb 文件: meson-gxl-s905d-phicomm-n1-xiangsm.dtb(md5 9ae7488bf6ddf63d20aa5bd6db82a5d7)

## 核心步骤
1. 下载 Armbian 5.77 镜像(md5 1973fa9c2de53eb1f5bd9d530ffd0eff)并解压;
2. sudo dd if=/path/to/Armbian_5.77_Aml-s905_Debian_stretch_default_5.0.2_20190401.img of=/dev/{your udisk} bs=1m
3. cp /path/to/meson-gxl-s905d-phicomm-n1-xiangsm.dtb /Volumes/{your udisk}/dtb/
4. 编辑 /Volumes/{your udisk}/uEnv.ini, 替换 dtb 信息.
5. adb connect {ip of your n1}
6. adb shell reboot update
7. 进入U盘启动系统后按提示重置账号密码;
8. `nand-sata-install` 完成安装, halt 关机;
9. 拔掉U盘, 重新上电即可进入 Armbian 系统;

# 旁路由
- [关于 N1 旁路由的设置
](https://instar.me/archives/e806f8ac.html)

# 其他资料
> 为了刷这个系统, 找了不少资料, 仅记录在此
- [斐讯N1折腾记 - Armbian 5.77 刷入与优化](https://www.dragoncave.me/2019/07/armbian-on-n1.html)
- [斐讯N1折腾记：运行 Linux 及优化](https://www.mivm.cn/phicomm-n1-linux/)
- [N1盒子Armbian折腾记](https://segmentfault.com/a/1190000021386143)
- [N1 备份 + 刷机 + 安装 Armbian](https://leeyr.com/323.html)
- [Mac下给斐讯N1盒子刷机Linux系统Armbian](https://blog.newnius.com/burn-linux-os-armbian-to-phicomm-n1-under-mac.html)
- [斐讯 N1 安装 Armbian 教程](https://github.com/HouCoder/blog/blob/master/hacking/install-armbian-on-phicomm-n1/README.md)
- [斐讯N1安装Armbian](https://dotbbq.com/post/phicomm-n1-install-armbian/)
- https://github.com/jxjhheric/n1-setup/blob/master/README.md