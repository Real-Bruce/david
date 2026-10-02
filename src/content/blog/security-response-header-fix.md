---
title: 安全扫描响应头漏洞修复指北
description: 网站安全扫描暴露的响应头缺失类低危漏洞排查与修复：Nginx 隐藏版本号、补齐 X-Frame-Options 等安全响应头及容器环境生效注意事项。
pubDate: 2024-12-25
tags:
  - Nginx
  - 安全
draft: false
---

最近公司的网站被安全部门被扫描出不少低危漏洞，排查后发现是因为响应头缺失导致的问题，因此整理了这篇文章供大家参考。

## 常见的安全漏洞

| 常见的响应头安全漏洞                               |
| ---------------------------------------- |
| X-Frame-Options Header 未配置                |
| HTTP Content-Security-Policy 缺失           |
| HTTP X-Content-Type-Options 缺失            |
| HTTP X-XSS-Protection 缺失                  |
| HTTP X-Download-Options 缺失                |
| HTTP X-Permitted-Cross-Domain-Policies 缺失 |
| HTTP Referrer-Policy 缺失                   |
| nginx 显示版本号信息                            |

> Tips:
> 
> 漏洞检测网址：https://securityheaders.com/

## 处理方式

针对显示 nginx 版本号问题，可以在配置不显示，需要在 http 层级内添加如下配置：

```conf
# 隐藏nginx版本号  
server_tokens off;
```

针对响应头相关的漏洞可以在 nginx 配置文件内添加响应头配置，注意添加在 server 层级内，nginx 配置信息如下：

```conf
# 响应头漏洞修复  
add_header X-Frame-Options SAMEORIGIN;  
add_header X-Download-Options "noopen";  
add_header Content-Security-Policy "script-src * 'unsafe-inline' 'unsafe-eval'";  
add_header Strict-Transport-Security 'max-age=15552000';  
add_header X-Permitted-Cross-Domain-Policies 'none';  
add_header Referrer-Policy "no-referrer";  
add_header X-XSS-Protection '1;mode=block';  
add_header X-Content-Type-Options 'nosniff';  
add_header Set-Cookie 'Path=/;httponly; Secure; SameSite=Lax';
```

> Tips：
> 
> 如果你的前端应用是部署在 docker 或 k8s 等容器服务内，仅修改代码内的 nginx 配置信息是不会生效的。因为打包镜像的时候 nginx 的配置通常会做外部映射，因此相关的配置都会在启动的时候设置，所以修改 docker 启动配置文件内有关 nginx 的配置或 k8s 内的 nginx 配置信息，此时再次重启前端服务 nginx 配置才会生效。

**参考资料：**

- https://www.kancloud.cn/smallchill/blade-safety/3244465
- https://blog.csdn.net/haoqi9999/article/details/123271036
