---
title: 'dataloader 体验'
date: 2018-10-31T16:17:13Z
tags: ["Node.js"]

---

# 背景

系统有 `任务`, 每个任务有一个`执行者`. 服务端提供API用户获取任务数据.

```
// 用户
var UserSchema = new Schema({
  name: String
})
var User = mongoose.model('User', UserSchema)
// 任务
var TaskSchema = new Schema({
  name: String,
  _creatorId: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  _executorId: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
})
var Task = mongoose.model('Task', UserSchema)
```

# 需求1: 获取某个任务
```
const task = await Task.findById(_id).exec()
```

# 需求2: 获取某个任务及创建者

```
const task = await Task.findById(_id).exec()
const creator = await User.findById(task._creatorId).exec()
// 注: 由于 mongoose 内部实现, task.toJSON() 后是没有此 creator 字段, 此处仅示例用, 下同.
task.creator = creator
```

# 需求3: 获取一组任务
```
const tasks = await Task.find(conds).exec()
```

# 需求4: 获取一组任务及创建者
```
const tasks = await Task.find(conds).exec()
await Promise.all(tasks.map(async function (task) {
  const creator = await User.findById(task.creatorId).exec()
  task.creator = creator
}))
```

## 问题:
- 多个任务的创建者可能相同, 那么就会产生重复创建的查询, 浪费资源又影响响应时间;

## 改进思路:
- 将创建者ID去重后批量获取

```
const tasks = await Task.find(conds).exec()

// 也可以直接用 _.uniqBy
let creatorIds = tasks.map(task => `${task._creatorId}`)
creatorIds = _.uniq(creatorIds)

const creators = await User.find({
  _id: {
    $in: creatorIds
  }
}).exec()

const map = new Map()
creators.forEach(creator => {
  map.set(`${creator._id}`, creator)
})

tasks.forEach(task => {
  task.creator = map.get(`${task._creatorId}`)
})
```

## 问题:
- 过程复杂;
- 与获取单个任务及创建者流程不一致;
- 多次map消耗cpu资源;

## 改进思路:
- 使用 [dataloader](https://github.com/facebook/dataloader) 大法

```
const DataLoader = require('dataloader')

const tasks = await Task.find(conds).exec()

// 注: 每个 request 单独 new 一个 loader, 比如初始化后赋值为 req.dataloader.user
var userLoader = new DataLoader(ids => {
  // 示意用, 会存在问题, 详见 **特别须知** 中的实现
  return User.find({
    _id: {
      $in: ids
    }
  }).exec()
}, { cacheKeyFn: id => `${id}` })

await Promise.all(tasks.map(async function (task) {
  let creator = await userLoader.load(task._creatorId)
  task.creator = creator
}))
```

## 优势
1. 获取时是单个获取, 无需认为拼装成数组再批量请求;
2. 数据缓存(内存), 一次获取后, 之后的获取不再需要再次发送 mongodb 请求;

# Polyfill
```
class DataLoader {
  constructor (batchLoadFn, { cacheKeyFn }) {
    this._batchLoadFn = batchLoadFn
    this._cacheKeyFn = cacheKeyFn
    this._batchQuene = []
    this._cacheMap = new Map()
  }
  
  load (_id) {
    const cacheKey = this._cacheKeyFn(_id)
    if (this._cacheMap.has(cacheKey)) {
      return this._cacheMap.get(cacheKey)
    } else {
      const p = new Promise((resolve, reject) => {
        this._batchQuene.push({ _id, resolve, reject })
        if (this._batchQuene.length === 1) {
          process.nextTick(() => {
            const queue = this._batchQuene
            this._batchQuene = []
            this._batchLoadFn(queue.map(ele => ele._id))
              .then(docs => {
                queue.forEach((ele, idx) => ele.resolve(docs[idx]))
              })
              .catch(err => {
                queue.forEach(ele => ele.reject(err))
              })
          })
        }
      })
      this._cacheMap.set(cacheKey, p)
      return p
    }
  }
}
```

# 特别须知
## batchLoadFn 要求返回数据长度必须和 ids 一致;
## batchLoadFn 要求保障返回数据顺序和 ids 一致;
```
const batchLoadFn = (model, ids) => {
  return model
    .find({
      _id: {
        $in: ids
      }
    })
    .exec()
    .then(docs => {
      // 返回数据必须和 ids.length 一致, 且映射顺序也需要保持一致
      // refer: https://github.com/facebook/dataloader#batch-function
      const docMap = new Map()
      docs.forEach(doc => {
        docMap.set(`${doc._id}`, doc)
      })
      return ids.map(_id => {
        return docMap.get(`${_id}`) || null
      })
    })
}
```

# 参考资料
- [DataLoader](https://github.com/facebook/dataloader)
- [Order of responses to a MongoDB $in query](https://jira.mongodb.org/browse/SERVER-7528)
- [DataLoader/](https://github.com/facebook/dataloader#batch-function)[**Batch Function**](https://github.com/facebook/dataloader#batch-function)