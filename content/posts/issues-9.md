---
title: 'MongoDB Schema Validation'
date: 2017-12-17T13:56:21Z
tags: ["JSON", "mongodb", "schema", "validation"]

---

## 前言
MongoDB 作为文档型数据库, 对于数据表文档的格式并不做特别的限制, 理论上一个文档的某个字段可能会是任何类型.
但作为一个产品长期使用的数据库, 自然不希望数据库字段类型出现不确定性, 这就要求开发在写入数据的时候要一直关注是否有手误的可能.
为了解决这个问题, MongoDB 在 3.2 版本中引入 [Document Validation](https://docs.mongodb.com/v3.2/core/document-validation/), 之后又在 3.6 版本引入改进版的 [Schema Validation](https://docs.mongodb.com/v3.6/core/document-validation/)

## Document Validation
> 不推荐使用

简单来讲, MongoDB 支持通过 [查询操作符](https://docs.mongodb.com/v3.2/reference/operator/query/#query-selectors) 定义数据表字段的规则,
 当插入/更新文档时, 执行验证是否符合规则, 不符的默认拒绝写入/更新.
默认行为是可以通过参数调整, 详情查看 [官方文档](https://docs.mongodb.com/v3.2/core/document-validation/).

## Schema Validation
MongoDB 3.6 版本中引入的改进版数据验证方法: [JSON Schema validation](https://docs.mongodb.com/v3.6/reference/operator/query/jsonSchema/#op._S_jsonSchema).
Schema Validation 详细使用方式请查看 [官方文档](https://docs.mongodb.com/v3.6/core/schema-validation/).
MongoDB 支持的是 [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04), 可以到 [官方网站](http://json-schema.org/) 了解更多 JSON Schema 规范及定义.

## 是否影响性能
既然加入了校验逻辑, 自然需要关注是否影响写入性能. 官方博客的说法是: `忽略不计的损耗(negligible overhead)` [link](https://www.mongodb.com/blog/post/document-validation-part-1-adding-just-the-right-amount-of-control-over-your-documents).
MongoDB 中文社区也有[文章](http://mongoing.com/archives/4561)压测证实了上述说法.

## 参考资料
- [MongoDB(3.2) Document Validation](https://docs.mongodb.com/v3.2/core/document-validation/)
- [MongoDB(3.6) Schema Validation](https://docs.mongodb.com/v3.6/core/document-validation/)
- [JSON Schema](http://json-schema.org/)
- [MongoDB Validator 是否会因性能影响而成为摆设?](http://www.mongoing.com/archives/4561)