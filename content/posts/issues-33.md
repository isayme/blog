---
title: '数据库中树状数据模型存储'
date: 2018-10-31T16:34:43Z
tags: []

---

# 数据库中树状数据模型存储

# 背景
典型的树状结构的场景有: 
- 文件库;
- 企业部门组织(部门及子部门)

# 树状数据模型方案分析
![image](https://user-images.githubusercontent.com/1747852/47803540-b43efa00-dd6d-11e8-8407-9e3f24325bc9.png)

## 方案A: Model Tree Structures with Parent References
```
db.categories.insert( { _id: "MongoDB", parent: "Databases" } )
db.categories.insert( { _id: "dbm", parent: "Databases" } )
db.categories.insert( { _id: "Databases", parent: "Programming" } )
db.categories.insert( { _id: "Languages", parent: "Programming" } )
db.categories.insert( { _id: "Programming", parent: "Books" } )
db.categories.insert( { _id: "Books", parent: null } )
```

**优点**
1. 数据模型简洁, 含义清晰;
2. 改变所属父级时, 只需要修改一条数据的`parent`;

**缺点**
1. 通过父级节点查找`子孙`节点需要递归操作;
2. 通过`子孙`节点查找`祖先`节点需要递归操作;

## 方案B: Model Tree Structures with an Array of Ancestors
```
db.categories.insert( { _id: "MongoDB", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" } )
db.categories.insert( { _id: "dbm", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" } )
db.categories.insert( { _id: "Databases", ancestors: [ "Books", "Programming" ], parent: "Programming" } )
db.categories.insert( { _id: "Languages", ancestors: [ "Books", "Programming" ], parent: "Programming" } )
db.categories.insert( { _id: "Programming", ancestors: [ "Books" ], parent: "Books" } )
db.categories.insert( { _id: "Books", ancestors: [ ], parent: null } )
```

**优点**
1. 通过父级节点查找`子孙`节点只需一次请求;
2. 任一节点都直接保存了`祖先`节点的信息;

```
db.categories.find({ _id: { $in: doc.ancestors } }) // 找祖先
db.categories.find({ ancestors: 'Books' }) // 找子孙
db.categories.find({ 'ancestors.0': 'Books' }) // 找儿子
db.categories.find({ 'ancestors.1': 'Books' }) // 找孙子
```

**缺点**
1. 改变所属父级时, 除自身的`ancestors`需要更新外, 所有`子孙`节点的`ancestors`信息都需要更新;

# 总结
`方案A` 和 `方案B` 各有优劣, 需要依据实际场景判断方案选择:
**业务场景经常需要通过一个节点查找祖先或子孙, 则选择`方案B`, 否则选择`方案A`**

# 参考资料
- [Model Tree Structures with Parent References](https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-parent-references/)
- [Model Tree Structures with an Array of Ancestors](https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/)
