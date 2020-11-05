---
title: 'Activity Streams'
date: 2017-12-17T14:25:43Z
tags: []

---

直接看  IBM [官方的介绍](https://developer.ibm.com/code/open/projects/activity-streams/):
> Activity Streams provides developers with a standard model and JSON-based encoding format for describing how users engage with both the application and with one another. This standard format can be used at every layer within an application, from back-end data storage to driving the user experience, and frees developers from the need to invent new adhoc application-specific data formats and models for describing the kinds of actions that users can perform within the system.

诸如 Facebook / Twitter 等各大社交网站都记录了用户在网站的动态信息. 

动态信息作为历史记录, 需要长期存在并可查询. 如果数据模型设计的不合理, 很容易就会导致后期难以维护.

Activity Streams 的出现更多的是给开发人员 **提供一套标准的数据模型** 用于描述用户的动态. 
Activity Streams [1.0](http://activitystrea.ms/specs/json/1.0/) 标准发布于 2011 年, 当前最新的版本是 [2.0](https://www.w3.org/TR/activitystreams-core/).

#### 深入了解
- [IBM Activity Streams](https://developer.ibm.com/code/open/projects/activity-streams/)
- [Activity Streams](http://activitystrea.ms/)
- [JSON Activity Streams 1.0](http://activitystrea.ms/specs/json/1.0/)
- [W3C Activity Streams 2.0 ](http://www.w3.org/TR/activitystreams-core/)
