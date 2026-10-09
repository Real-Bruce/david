---
title: "How i think about debt"
description: 收集整理每周看到的好玩有趣的内容，本期收录文章 1 篇、开源项目 4 个、网站工具 3 个、资料博文 2 篇。
issue: 14
pubDate: 2024-09-30
tags:
  - 周刊
draft: false
---

## 📜有价值的文章

#### [How i think about debt](https://collabfund.com/blog/how-i-think-about-debt/)

作者在文中提出了个很有意思的观点，你的债务降低了你生活的可能性，让你的未来不再充满希望，下面是我摘抄的内容：

 “Debt defines your future, and when your future is defined, hope begins to die.”  
> “债务定义了你的未来，当你的未来被定义时，希望就开始消亡了。

Not only does hope begin to die, but the number of outcomes you can endure does, too.  
> 不仅希望开始破灭，而且你能忍受的结果数量也会破灭

I think this is the most practical way to think about debt: **As debt increases, you narrow the range of outcomes you can endure in life.**  
>我认为这是思考债务最实用的方式：**随着债务的增加，你会缩小你在生活中可以承受的结果范围。**

## 🛸开源项目

#### [certimate](https://github.com/usual2970/certimate)

域名SSL证书自动化管理解决方案，提供域名SSL证书的检查、申请、替换操作，项目完全开源，使用MIT开源协议。

#### [background music](https://github.com/kyleneideck/BackgroundMusic)

mac上的开源小工具，支持在地址栏单独控制每个应用程序的音量。

#### [pake](https://github.com/tw93/Pake)

使用rust将网页打包成桌面应用程序，支持 Windows 打包下设置语言、Linux 下使用 Docker 运行、Linux 和 Windows 下的 App 增加了标题、优化 Pake 打包网页里面关于超链接跳出的处理、支持 Mac 下设置强制黑暗模式。

#### [json4u](https://github.com/loggerhead/json4u/)

开源的JSON工具，支持JSON格式化和各种形式的查看，最重要的是支持JSON的在线树状图谱查看，体验地址：[json4u](https://json4u.cn/)

## 🚀网站&工具

#### [they can talk](https://theycantalk.com/)

一个在线的小动物沙雕漫画网站很有意思。

#### [每日值得一读的技术博客](https://daily-blog.chlinlearn.top/)

整合互联网大厂每日发布的微信公众号文章，会找到各种有意思的技术应用场景值得收藏。

#### [渡渡鸟国内镜像站点](https://docker.aityp.com/)

这个网站镜像同步了国外常用的几个镜像仓库，方便拉取镜像。

## ⛵资料&博文

#### [Java 内存泄露和内存溢出](https://www.cnblogs.com/three-fighter/p/14579622.html)

讲解Java内存泄漏和内存溢出的区别，文中举了很多相关的例子很推荐阅读。

#### [good vs bad refactoring](https://www.builder.io/blog/good-vs-bad-refactoring)

好的重构和错误重构，重构是件好事但并不是所有的重构都是好的，作者在文中指出了几种不好的重构方式，同时也给出了好的重构方式：

1. Be incremental: Make small, manageable changes rather than sweeping rewrites.  
    增量式：进行小的、可管理的更改，而不是彻底重写。
2. Deeply understand code before doing significant refactors or new abstractions.  
    在进行重大重构或新抽象之前，深入了解代码。
3. Match the existing code style: Consistency is key for maintainability.  
    匹配现有代码样式：一致性是可维护性的关键。
4. Avoid too many new abstractions: Keep it simple unless complexity is truly warranted.  
    避免太多的新抽象：除非确实需要复杂性，否则请保持简单。
5. Avoid adding new libraries, especially of a very different programming style, without buy-in from the team.  
    避免在没有团队支持的情况下添加新的库，尤其是非常不同的编程风格的库。
6. Write tests before refactoring and update them as you go. This ensures you're maintaining the original functionality.  
    在重构之前编写测试，并随时更新它们。这可确保您保持原始功能。
7. Hold your coworkers accountable to these principles.  
    让您的同事对这些原则负责。
