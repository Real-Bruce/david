---
title: SSH 连接本地 VM 虚拟机
description: 在 Windows + VMware NAT 模式下配置端口转发，用 Termius 通过 SSH 连接 Fedora 虚拟机的完整步骤与常见问题排查。
pubDate: 2025-10-29
tags:
  - Linux
  - SSH
  - VMware
draft: false
---

## 一、环境说明

- **宿主机**：Windows（安装 Termius）
- **虚拟机平台**：VMware 18
- **系统**：Fedora（NAT 模式）
- **连接方式**：SSH
- **SSH 工具**：Termius

## 二、Fedora 端设置

### 1.安装并启动 SSH 服务

```shell
 sudo dnf install -y openssh-server  
 sudo systemctl enable --now sshd  
 sudo systemctl status sshd
```

### 2.开放防火墙端口

```shell
 sudo firewall-cmd --permanent --add-service=ssh  
 sudo firewall-cmd --reload
```

### 3.查询 Fedora IP 地址

```shell
sudo ip addr show
```

## 三、VMware 网络配置（NAT 模式）

1. 打开 VMware → 编辑 → 虚拟网络编辑器；
2. 选择 **VMnet8 (NAT)** → 点击 **NAT Settings**；
3. 添加端口转发规则，如下表；
4. 保存并退出；

| 参数                   | 示例         |
| -------------------- | ---------- |
| Host port            | 2222       |
| Type                 | TCP        |
| Virtual machine IP   | 10.1.80.6  |
| Virtual machine port | 22         |
| Description          | Fedora SSH |

## 四、用户配置

### 1.root 用户连接

Fedora 默认禁止 root 登录，若要使用 root 登录：

```shell
sudo vim /etc/ssh/sshd_config
```

修改或添加：

```shell
PermitRootLogin yes
```

保存后重启服务：

```shell
sudo systemctl restart sshd
```

### 2.创建普通用户

创建新用户并设置密码：

```shell
sudo adduser bruce  
sudo passwd bruce
```

将用户加入管理员组：

```shell
sudo usermod -aG wheel bruce
```

之后即可使用 `bruce` 账户 SSH 登录，必要时使用：

```shell
sudo su -
```

切换至 root。

## 五、SSH 工具配置

|配置项|值|
|----|----|
|Host|127.0.0.1|
|Port|2222|
|Username|root 或 bruce|
|Password|对应密码|

点击 **Connect** 即可登录。

## 六、常见问题排查

|问题|原因|解决方案|
|----|----|----|
|Connection refused|SSH 未启动|`sudo systemctl start sshd`|
|Permission denied|root 登录被禁|修改 `PermitRootLogin yes`|
|Timeout|NAT 未端口转发|按上文配置 Host:2222 → Guest:22|
|ping 不通|网络隔离|尝试桥接模式或检查防火墙|

**【测试连接命令示例】**

```shell
ssh bruce@127.0.0.1 -p 2222
```

或：

```shell
ssh root@127.0.0.1 -p 2222
```
