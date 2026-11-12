---
title: Rancher证书轮换过期导致不能访问UI问题处理
description: Rancher UI 无法访问时，检查容器内 TLS 证书有效期，并在 Rancher 2.4+ 中轮换证书。
pubDate: 2026-06-15
tags:
  - Rancher
  - Kubernetes
draft: false
---

## 问题描述

- Rancher UI 无法访问，或进入界面报错
- Rancher Server 日志报错：x509: certificate has expired or is not yet valid

## 解决方案

1. 进入到 rancher 容器内部，查看证书过期时间；
2. 进行证书轮换操作；
3. 重新链接新证书；

***

进入到 rancher 容器内部，查看证书过期时间

```bash
rancher_server_id=<rancher_server_container_id>
docker exec -it ${rancher_server_id} /bin/bash
```

```bash
cd k3s/server/tls
## 查看所有证书文件的期限
for i in `ls *.crt` ;do openssl x509 -in $i -noout -dates;echo $i;done
```

如果在这一步中发现有输出中有notAfter标识的时间小于当前时间，那么就肯定是有证书过期了，需要实行证书轮换。

如果这个时候你的Rancher 已经不能通过UI访问了，那说明你的Rancher Server已经不能正常工作了，需要修改当前时间让Rancher Server能够重新工作。

进行证书轮换操作，执行以下命令

```bash
kubectl --insecure-skip-tls-verify -n kube-system delete secrets k3s-serving

kubectl --insecure-skip-tls-verify delete secret serving-cert -n cattle-system

rm -f /var/lib/rancher/k3s/server/tls/dynamic-cert.json

# 退出rancher容器
exit
```

注意，只适用于2.4+版本，如果是之前的版本，请去看官方文档。

执行以下命令重新链接新证书

```bash
docker restart ${rancher_server_id}

# ${server-url} 此处填写你自己rancher的地址和端口
curl --insecure -sfL https://${server-url}/v3

docker restart ${rancher_server_id}
```

**参考连接：**

[rancher证书过期解决方案](https://www.cnblogs.com/lei-z/p/16453563.html)

[如何为 Rancher 轮换证书？ | Rancher文档](https://docs.rancher.cn/docs/rancher2/trending-topics/certificate-rotation/_index/#rancher-v22x-%E4%B8%AD%E7%9A%84%E8%AF%81%E4%B9%A6%E8%BD%AE%E6%8D%A2)

[blog.csdn.net/m0_37682535…](https://blog.csdn.net/m0_37682535/article/details/117223098)
