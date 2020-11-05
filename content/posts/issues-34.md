---
title: '权限系统及模型'
date: 2018-11-02T03:09:23Z
tags: []

---

主要介绍当前主流的权限系统及适用的场景. 理解错误的地方麻烦之处.

> 用户是抽象概念, 包含但不限定是 user(person).

## ACL
ACL 是 Access Control List 的缩写，称为访问控制列表.  定义了谁可以对某个数据进行何种操作.
关键数据模型有: 用户, 权限.

ACL规则简单, 也带来一些问题: 资源的权限需要在用户间切换的成本极大; 用户数或资源的数量增长, 都会加剧规则维护成本;

### 典型应用
#### 文件系统
文件系统的文件或文件夹定义某个账号(user)或某个群组(group)对文件(夹)的读(read)/写(write)/执行(execute)权限.

#### 网络访问
防火墙: 服务器限制不允许指定机器访问其指定端口, 或允许特定指定服务器访问其指定几个端口.

## RBAC
RBAC 是 Role-based access control 的缩写, 称为 基于角色的访问控制.
核心数据模型有: 用户, 角色, 权限.

用户具有角色, 而角色具有权限, 从而表达用户具有权限.

由于有角色作为中间纽带, 当新增用户时, 只需要为用户赋予角色, 用户即获得角色所包含的所有权限.

RBAC 存在多个扩展版本, 包含更为丰富的功能:
- RBAC1 的角色继承, 角色可以继承另一个角色的全部能力: 业务部门主管拥有专员的全部权限;
- RBAC2 的角色互斥, 比如: 财务会计 和 财务审计 两个角色, 又比如 球员 和 裁判 两个角色;
- RBAC2 的先决条件: 只有北京户口才可以参加北京高考;
- RBAC2 的基数约束, 角色只能赋予有限数量的用户: 公司只能有一个拥有者;

## ABAC
ABAC 是 Attribute-based access control 的缩写, 称为 基于属性的访问控制.

权限和资源当时的状态(属性)有关, 属性的值可以用于正向判断(符合某种条件则通过), 也可以用于反向判断(符合某种条件则拒绝):
- 论坛的评论权限, 当帖子是锁定状态时, 则不再允许继续评论;
- Github 私有仓库不允许其他人访问;
- 发帖者可以编辑/删除评论(如果是RBAC, 会为发帖者定义一个角色, 但是每个帖子都要新增一条用户/发帖角色的记录);
- 微信聊天消息超过2分钟则不再允许撤回;
- 12306 只有实名认证后的账号才能购票;
- 已过期的付费账号将不再允许使用付费功能;

## 参考资料
- [ACL 权限管理开发指南 - LeanCloud 文档](https://leancloud.cn/docs/acl-guide.html)
- [Access control list - Wikipedia](https://en.wikipedia.org/wiki/Access_control_list)
- [对云环境下访问控制系统的思考 - 知乎](https://zhuanlan.zhihu.com/p/28534558)
- [权限系统与RBAC模型概述 - LaplaceDemon - 博客园](http://www.cnblogs.com/shijiaqi1066/p/3793894.html)
- [RBAC权限管理 - 简书](https://www.jianshu.com/p/44bfd8d6184b)
- [企业管理系统前后端分离架构设计  系列一  权限模型篇 - 掘金](https://juejin.im/post/5b59c2956fb9a04faa79af6f)
- [RBAC模型：基于用户-角色-权限控制的一些思考 | 人人都是产品经理](http://www.woshipm.com/pd/1150093.html)
- [ABAC or RBAC | Object Partners](https://objectpartners.com/2017/06/16/abac-or-rbac/)
- [RBAC vs ABAC | iamfortress](https://iamfortress.net/2017/02/15/rbac-vs-abac/)
- [RBAC vs ABAC Access Control Models - IAM Explained](http://blog.identityautomation.com/rbac-vs-abac-access-control-models-iam-explained)
- [Implement Access Control in Node.js – Security and Node.js](https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d1)
