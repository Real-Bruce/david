---
title: IDEA内调用本地Claude Code
description: 本文主要讲本地的Claude Code通过 AI Assistant插件整合到IDEA内使用，希望能帮到各位同学(*^▽^*)
pubDate: 2026-03-26
tags:
  - Claude
  - IntelliJ IDEA
draft: false
---

## 1.前置准备

- **系统**：Windows 11
- **nodejs 版本**：nodejs 版本大于 20.xx.xx
- **IDE 版本**：IntelliJ IDEA 2025.3.x 或更高版本。
- **AI Assistant 插件**：确保已安装并启用
- **Claude Code**：已安装并能正常运行
- **claude-code-acp**：Zed 提供的 ACP 适配器

### 1.1.AI Assistant 插件安装

- 进入 `setting-Plugins-Marketplace` ；
- 搜索 `JetBrains Al Assistant` 安装；
- 安装完成后重启 IDEA；

### 1.2.Claude Code 安装

- 安装 Claude Code；
- 跳过 Claude 地区校验；
- 配置使用国内大模型；
- 终端输入命令 `calude` 查看是否正常加载 Claude Code；

**【安装 Claude Code】**

```bash
npm install -g @anthropic-ai/claude-code
```

**【跳过地区校验】**

1. 在 `C:\Users\【你的用户名】\.claude\settings.json` 中添加 `"hasCompletedOnboarding": true` 作为顶层字段；
2. 保存后重新启动 Claude Code；

```bash
{
  "hasCompletedOnboarding": true
}
```

**【配置国内大模型平台】**

此处推荐使用 cc-switch 配置，下载地址：[cc-switch](https://github.com/farion1231/cc-switch/releases)，支持配置各个平台的大模型，界面配置化密钥和模型，快速方便的切换配置。

### 1.3.claude-code-acp 安装

- nodejs 版本需要大于 20！！！
- 全局安装 `@agentclientprotocol/claude-agent-acp`
- 查看是否安装成功；

```bash
# 全局安装@agentclientprotocol/claude-agent-acp
npm install -g @agentclientprotocol/claude-agent-acp

# 查看是否安装成功
npm list -g
```

## 2.添加 ACP 配置

- 点击 AI Chat 对话框右上角的 option 按钮（三个竖直的点）；
- 选择 Add customer Agent，进入 acp.json 配置界面；
- 添加以下 `acp.json` 配置；
- 重启 IDEA 后生效；

【acp.json 配置】

```json
{  
  "default_mcp_settings":{},  
  "agent_servers": {  
    "Claude Code Local": {  
      "command": "npx.cmd",  
      "args": [  
        "@agentclientprotocol/claude-agent-acp"  
      ],  
      "env": {  
        "ACP_PERMISSION_MODE": "bypassPermissions"  
      },  
      "use_idea_mcp": true,  
      "use_custom_mcp": true  
    }  
  }  
}
```

## 3.开始使用

打开 AI Chat 窗口，选择 **Claude Code Local** 在对话框内开始聊天，如：让 Claude 读取项目。运行可能比较慢，运行时会调用 mcp 服务，根据需要进行授权，更多使用方法请参考官方文档：[ai-assistant](https://www.jetbrains.com/zh-cn/ai-assistant/)

> 参考博客：
>
> - [IDEA 里终于能爽用 Claude Code了！](https://zhuanlan.zhihu.com/p/1999896023464686082)
> - [Code Plan 接入 Claude Code](https://help.aliyun.com/zh/model-studio/claude-code-coding-plan?spm=a2c4g.11186623.help-menu-2400256.d_0_2_1_2.58522b98EGRYdf)
> - [Code Plan常见问题](https://help.aliyun.com/zh/model-studio/coding-plan-faq?spm=0.0.0.i5)
