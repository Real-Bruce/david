---
title: IDEA插件Jrebel debug模式无法使用
description: 本文主要内容为解决新版IDEA使用Jrebel插件，debug启动项目失败问题，希望能帮到各位同学。
pubDate: 2024-05-27
tags:
  - IntelliJ IDEA
  - JRebel
draft: false
---

## 版本&环境

系统版本：win10

idea版本：IntelliJ IDEA 2023.3.6 (Ultimate Edition)

Jrebel版本：2024.2.1

## 问题现象

使用Jrebel debug模式启动项目时，显示完Jrebel授权信息后项目不能正常启动，如图1-1所示

| 图1-1 Jrebel启动失败图 |
| - |
| ![image-20240527164146017.png](../../assets/blog/intellij-idea-jrebel-debug-fix/01.webp) |

## 原因&解决

**问题产生原因** ：

idea 2023.3.x后续版本修改了 reactive streams的默认配置，导致Jrebel不能正确debug启动

**解决方式：**

修改以下位置的配置信息， `setting -> Languages & Frameworks -> Reactive Streams -> Debugger -> none` ，具体配置信息查看图2-1；

配置修改完成后重新使用Jrebel debug模式启动项目，项目正常加载。

| 图1-2 需要修改的配置 |
| - |
| ![image-20240527164658995.png](../../assets/blog/intellij-idea-jrebel-debug-fix/02.webp) |
