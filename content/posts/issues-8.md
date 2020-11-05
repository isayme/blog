---
title: 'HTTP API 的数据校验'
date: 2017-12-07T02:46:11Z
tags: []

---

# HTTP API 的数据校验
当提供API服务时, 本着不信任调用方的输入(参数)原则, 通常都需要对输入进行校验.

## 对数据校验的期望
### 类型校验
基本需求. 要求是数字, 就不能提供一个字符串.

### 可选校验
有的参数是必须的, 有的参数是可选的.

### 多样能力
有些场景某个参数同时支持两个不同类型的取值. 如果任务截止时间可能是一个字符串日期, 也可能是空(null, 表达无截止时间).

### 格式校验
主要体现在提供多样的维度限制特定类型字段取值.

#### 字符串
- 区分 url / email / ip 等常见字符串字段的格式差异;
- 限制字符串长度范围;
- 限定字符串取值范围(enum);
- 通过正则表达式限制格式;

#### 数字
- 区分 整数/浮点数 的不同;
- 限制数字的取值范围: 最大/最小;
- 限定数字的取值范围(enum);

#### 数组
- 限制元素个数;
- 限制元素值唯一: 不可以有重复的值;
- 限制单个元素的类型;

#### 对象
- 限制对象属性个数范围;
- 指定必要的属性;

### 依赖校验
两个字段有依赖关系, 比如 字段A存在时, 字段B也必须存在.

### 默认值
如果某个字段未提供, 则赋予默认值. 特别是 bool 字段, 语言层面通常默认都是 false, 但API层有可能需要字段未提供时默认为 true.

### 类型(尝试)转换
HTTP API 可以通过 query/body 传参数, 其中 body 又有 form 和 json 两种. 

对于 query 和 form, 如果某个字段是 bool 类型, 当服务端收到数据时, 协议层面无法正常区分出客户端到底是想传入 bool 类型的 false/true 还是字符串类型的 false/true.

有些服务端期望支持客户端多样化的参数输入(参数可以通过query/form/json任意方式传入), 此时就需要类型转换能力.

### 订制能力
实际的业务场景对于参数的验证需求各种各样, 有一定的订制能力会解决一些非典型需求.

## JSON schema
> [JSON Schema](https://json-schema.org/) is a vocabulary that allows you to `annotate` and `validate` JSON documents.

为了解决参数校验的问题, JSON Schema 制定了一套标准, 目前最新版本是 草案7.

### 实现
官网列举了当前各种语言的实现: [Implementations | JSON Schema](https://json-schema.org/implementations.html)

## 如何使用
JSON Schema 官网的教程 [Learn | JSON Schema](https://json-schema.org/learn/).