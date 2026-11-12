---
title: IDEA 常用配置指南
description: 记录一下常用的IDEA配置信息，以及一些好玩的插件，提高开发的效率，让工具更好用，希望能帮到各位同学ヾ(^▽^*)))
pubDate: 2023-07-10
tags:
  - IntelliJ IDEA
draft: false
---

## 1、外观配置

### 1.1 基本配置

| 图 1.1-1 修改更改主题 + 背景图片 |
| - |
| ![image-20230705155717189.png](../../assets/blog/intellij-idea-configuration-guide/01.webp) |

> 如果IDEA版本是2023.1.2以后的版本可以开启 newUI 体验新版的UI界面，我个人是挺喜欢的🌝

### 1.2 快捷键配置

| 图1.2-1 修改快捷键 |
| - |
| ![image-20230705160242097.png](../../assets/blog/intellij-idea-configuration-guide/02.webp) |

> IDEA默认快捷键：
>
> - [windows版](https://intellijidea.com.cn/help/idea/reference-keymap-win-default.html)
> - [Mac版](https://intellijidea.com.cn/help/idea/reference-keymap-mac-default.html)

### 1.3 Tab单行显示

| 图 1.3-1 Tab单行展示 |
| - |
| ![image-20230824155109428.png](../../assets/blog/intellij-idea-configuration-guide/03.webp) |

## 2、配置开发环境

### 2.1 配置GIT

| 图2.1-1配置git |
| - |
| ![image-20230705161247492.png](../../assets/blog/intellij-idea-configuration-guide/04.webp) |

> 【git提交的几个小建议】
>
> 建议对git提交人和提交信息进行规范，同时代码提交应当清晰的反映所属任务和修改内容，方便后续进行代码分支合并避免漏掉功能提交。
>
> 1. 建议代码提交模式为：***操作(影响的模块\[可不填]): 具体修改(任务编码)***，举例：`fix(service): 修复xxx引发的bug(20230807)`、`feat: xxx功能(20230905)`
> 2. 建议设置git提交人员和邮箱：[git配置作者信息](https://blog.csdn.net/abu935009066/article/details/128544479)
> 3. 更加的规范的 `git commit` 书写方式请参考：[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

### 2.2 配置maven

| 图2.2-1 配置maven |
| - |
| ![image-20230705161715333.png](../../assets/blog/intellij-idea-configuration-guide/05.webp) |

### 2.3 配置JDK

| 图 2.3-1 配置项目的JDK |
| - |
| ![image-20230707163308798.png](../../assets/blog/intellij-idea-configuration-guide/06.webp) |
| ![image-20230707163311898.png](../../assets/blog/intellij-idea-configuration-guide/07.webp) |

> 配置项目的语言版本指的是设置 JDK 版本，比如有些比较老的项目需要JDK-6启动，此时不需要安装JDK-6，可以把语言版本设置为6即可运行项目。

## 3、编辑器设置

### 3.1 基本配置

| 图 3.1-1 代码补全提示去掉匹配规则 |
| - |
| ![image-20230705162157455.png](../../assets/blog/intellij-idea-configuration-guide/08.webp) |

| 图 3.1-2 配置字体样式和大小 |
| - |
| ![image-20230705162514296.png](../../assets/blog/intellij-idea-configuration-guide/09.webp) |

> 字体建议使用等宽字体，如 `Consolas` 或者 `JetBrains Mono`，最近英特尔开源的 [intel-one-mono](https://github.com/intel/intel-one-mono) 字体也挺好用的，喜欢的话可以安装一下。

| 图3.1-3 配置行号显示和方法分割 |
| - |
| ![image-20230706084729859.png](../../assets/blog/intellij-idea-configuration-guide/10.webp) |

### 3.3 编码风格配置

| 图 3.3-1 Java引入折叠 |
| - |
| ![image-20230705162853383.png](../../assets/blog/intellij-idea-configuration-guide/11.webp) |

| 图 3.3-2 Java代码超字符数换行 |
| - |
| ![image-20230706090037457.png](../../assets/blog/intellij-idea-configuration-guide/12.webp) |

### 3.4 配置代码模板

可以生成常见的代码模板，方便开发使用

1. 配置文件模板，如图3.4-1所示；
2. 配置文件的所有者信息，新建文件后会添加在类的头部，如图3.4-2所示；
3. 代码生成模板，输入关键词，点击回车后即可触发生成代码，配置如图 3.4-3所示，使用效果如图3.4-4所示；

| 图 3.4-1 文件生成模板 |
| - |
| ![image-20230705163048097.png](../../assets/blog/intellij-idea-configuration-guide/13.webp) |

| 图 3.4-2 文件头设置 |
| - |
| ![image-20230705163545871.png](../../assets/blog/intellij-idea-configuration-guide/14.webp) |

| 图 3.4-3 配置代码生成模板 |
| - |
| ![image-20230705165216751.png](../../assets/blog/intellij-idea-configuration-guide/15.webp) |
| ![image-20230705164753838.png](../../assets/blog/intellij-idea-configuration-guide/16.webp) |
| ![image-20230705164825676.png](../../assets/blog/intellij-idea-configuration-guide/17.webp) |

> 代码生成模板建议建立新的分组后，在新的分组内编写代码生成模板。

| 图 3.4-4 代码模板使用效果 |
| - |
| ![image-20230705165006840.png](../../assets/blog/intellij-idea-configuration-guide/18.webp) |
| ![image-20230705165017812.png](../../assets/blog/intellij-idea-configuration-guide/19.webp) |

### 3.5 配置编辑器编码格式

建议都设置为 `UTF-8` 避免出现文件乱码问题

| 3.5-1 配置编辑器编码格式 |
| - |
| ![image-20230705163642870.png](../../assets/blog/intellij-idea-configuration-guide/20.webp) |

### 3.6 配置忽略的文件和文件夹

建议在忽略文件和文件夹内配置IDEA编辑器生成的文件，防止git提交时提交IDEA配置文件被打🦉

| 图 3.6-1 配置忽略的文件和文件夹 |
| - |
| ![image-20230705165811144.png](../../assets/blog/intellij-idea-configuration-guide/21.webp) |

## 4、界面布局设置

### 4.1 工具栏增加常用小组件

上方的工具栏点击鼠标右键，会出现增加工具选项，如build、分支操作等工具，可以添加常用的工具到工具栏，如图4.1-1所示

下方工具栏单击鼠标右键，也可以添加常用的工具，如：内存使用、当前分支等，如图4.2-2所示

| 图 4.1-1 上导航栏增加常用组件 |
| - |
| ![image-20230824155722686.png](../../assets/blog/intellij-idea-configuration-guide/22.webp) |

| 图 4.1-2 下方工具栏添加小组件 |
| - |
| ![image-20230824160328533.png](../../assets/blog/intellij-idea-configuration-guide/23.webp) |

## 5、好玩的插件

| 插件 | 名称 |
| - | - |
| Alibaba Java Coding Guidelines | 阿里巴巴代码规范检查插件，根据《Java开发手册》进行代码规范性检查 |
| Easy Code | 代码生成器，配置好代码模板后，可以从数据库一键生成从dao层到service层的代码 |
| GenerateSerialVersionUID | 一键生成SerivalVersionUID |
| JRebel and XRebel | 热部署插件，代码更改后点击build可以免重启热部署 |
| JSON Parser | JSON 格式化，在IDEA内增加JSON格式化窗口 |
| LeetCode Editor | 实现IDEA内刷LeetCod题目 |
| MyBatisX | 方便找到mapper和XML的映射 |
| Rainbow Brackets Lite | 彩虹括号，方便查看代码 |
| Star Wars Progress Bar | 星球大战主题进度条 |
| Translation | 翻译插件，支持翻译代码、注释等等 |
| CamelCase | 快捷的从全大写、下划线、大驼峰、小驼峰命名之间切换 |

相关链接：[www.cnblogs.com/sansui6/p/1…](https://www.cnblogs.com/sansui6/p/17043448.html)
