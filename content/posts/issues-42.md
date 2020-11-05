---
title: '数据库Schema设计: Attribute Pattern'
date: 2019-01-30T05:39:59Z
tags: ["mongodb"]

---

## 需要解决的问题
场景一: Trello 官方支持多个插件, 插件的名称描述信息都是英文, 为了降低母语非英语的用户入门难度, 当此类用户访问插件信息的时候最好展示其母语版本的标题描述.
问题一: 同一个字段需要存在多个不同语言的版本

场景二: 电影会有个上映时间信息, 不通国家地区的上映时间不同, 需要单独记录.
问题二: 同一个字段需要存在多个不同地区的版本

总结: 数据库如何设计以应对统一字段不同场景下的不同版本?

## 解决方式
> 以 `场景一` 为例, 如何解决同一个字段需要存在多个不同语言的版本.

### 方式一: 不同场景下分别增加一个字段
```
{
  title_en: "",
  title_fr: "",
  title_de: ""
}
```

#### 优点
- 实现/使用简单;
- 查询指定语言版本的标题也方便;

#### 缺点
- 扩展性差: 新增一个语言时多个表都要新增多个字段;
- 由于字段多,  无法方便对字段加索引或查询;

### 方式二: 使用独立的表记录多语言信息
```
{
  title: "",
  title_translate_id: ""
}

// translation
{
  _id: "",
  text_en: "",
  text_fr: "",
  text_de: ""
}
```

#### 优点
- 新增表可以更好兼容既有的数据(尽量少的变动既有表结构);
- 新增语言只需要改 translations 一张表;
- tranlastions 的单条数据可以被多个字段共用;

#### 缺点
- 需要在原表上新增 `xxx_translate_id` 字段;
- translations 表字段可能会存在大量空值: 因为并不是所有的字段都需要全部语言的翻译版本;
- 被迫要求数据返回时必须到 translations 表获取翻译版本, 影响接口效率;

### (荐)方法三: Attribute Pattern
```
{
  title: "",
  titles: [
    {
       lang: "en",
       text: "",
    }, 
    {
       lang: "fr",
       text: "",
    }, 
    {
       lang: "de",
       text: "",
    }
  ]
}
```

#### 优点
- 查询指定语言方便
- 对既有的业务逻辑不影响;
- 可以方便的新增支持的语言;

#### 缺点
- 新增语言需要多个表多个字段补充数据

## 参考资料
- [MongoDB Schema Design Patterns - Attribute | MongoDB](https://www.mongodb.com/blog/post/building-with-patterns-the-attribute-pattern)
- [Internationalization through tables and columns or databases](https://www2.microstrategy.com/producthelp/10.8/ProjectDesignGuide/WebHelp/Lang_1033/Content/ProjectDesign/Internationalization_through_tables_and_columns_or.htm)
- [Data Modeling for Multiple Languages: How to Design a Localization-Ready System](https://www.vertabelo.com/blog/technical-articles/data-modeling-for-multiple-languages-how-to-design-a-localization-ready-system)