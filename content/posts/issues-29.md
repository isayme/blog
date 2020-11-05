---
title: '关于分页(pagination)'
date: 2018-10-29T03:05:05Z
tags: ["api"]

---

列表类的 API 通常需要进行分页处理. 

## 方案1: 基于 offset 的分页
思路是通过 offset 跳过一部分数据, 以获取部分数据. 实际实践中主要由两种风格:
1. docs[offset, offset + pageSize]
2. docs[(page - 1) * pageSize, page * pageSize]

其中 offset 也常被称为 skip; pageSize 也常被称为 count / page_count / per_page 等.

这个策略的优势是简单易懂. 通过参数就可以知道获取的是哪部分数据.

这个策略存在两大缺陷:
1. 如果 docs 数据在两次分页请求间发生了变化, 会导致获取到的数据存在重复或丢失情况;
2. 由于策略的本质是 skip 一部分数据, 当 skip 的值较大时, 存在理论上的性能问题.
> 具体数据重复/丢失图解: [APP后端分页设计 · ScienJus’s Blog](http://www.scienjus.com/app-server-paging/)

## 方案2: 基于时间线的分页
比如按照创建时间排序, 查找指定时间之前的数据: created_before=timestamp

这个策略的优势是可以利用 创建时间 字段的索引, 避免 skip 数据.

这个策略存在一大缺陷:
1. 不同数据的创建实际有可能相同. 这会导致获取到的数据存在丢失情况. 实际实践中会改用不会存在重复值且可以比较大小的字段(如 MongoDB 中的 ObjectId)

## 方案3: 基于 cursor 的分页
cursor 的本质还是 时间线分页 的思路.

典型的场景是按照创建时间分页, 由于 MongoDB 的 ObjectId 带有时间值, 且可以比较大小, 所以可以使用 id_before=5bd6d209f81581c9ff3ba00a 这样的方式进行分页.

如果希望使用 cursor 需要满足三个条件:
1. 唯一: 不唯一的话会导致查找出的数据有丢失;
2. 有序: 有序才可以进行比较;
3. 不可变: 一旦字段数据变化则会影响排序结果;

### 如果你在用 MongoDB
- [cursor.min()](https://docs.mongodb.com/manual/reference/method/cursor.min/) & [cursor.max()](https://docs.mongodb.com/manual/reference/method/cursor.max/) 会有所启发.
- [How to do pagination using range queries in MongoDB?](https://stackoverflow.com/questions/5525304/how-to-do-pagination-using-range-queries-in-mongodb/5526907#5526907)
- [Efficient paging in MongoDB using mgo](https://stackoverflow.com/questions/40634865/efficient-paging-in-mongodb-using-mgo) Golang

## 实践: pageToken
如果可以使用 cursor 分页, 当然最好了, 但往往很多分页只能使用 offset 分页, 甚至同一个接口的不同排序方式可以采用不同的分页策略, 最终导致 API 分页风格迥异, 对使用方不够友好(传参方式不同).

所以期望有个方案能够统一调用方分页传参方式, 最终分页策略由服务端决定.

这个方案就是 pageToken. 这个方案的思路是: 客户获取第一页数据后, 服务端返回一个 pageToken, 客户端使用这个 pageToken 获取第二页数据. 由于 pageToken 由服务端生成, 服务端可以自由利用 pageToken 记录任意信息, 可以依据不同的排序规则记录不同的信息, 最终可以在分页策略上采取最佳的方案.

然而 pageToken 方案也有一个缺点: 客户端必须一页页获取数据, 无法直接跳到第N页. 

配合 offset 可以解决上面的缺点.

## 参考资料
- [API Paging Built The Right Way](https://mixmax.com/blog/api-paging-built-the-right-way/)
- [List Pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination)
- [分页机制 - 程序印象](https://www.do1618.com/archives/1157/%E5%88%86%E9%A1%B5%E6%9C%BA%E5%88%B6/)
- [Paginating Real-Time Data with Cursor Based Pagination](https://www.sitepoint.com/paginating-real-time-data-cursor-based-pagination)
- [APP后端分页设计](http://www.scienjus.com/app-server-paging/)