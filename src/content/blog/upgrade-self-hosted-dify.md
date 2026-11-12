---
title: 私有化部署版 Dify 版本升级
description: 本文记录了基于docker compose版本部署的 Dify 版本升级操作，涉及到升级前备份、配置信息修改跨版本问题解决，数据库链接修改等操作，希望能帮到大家。
pubDate: 2026-03-09
tags:
  - Dify
  - Docker
draft: false
---

## 1.升级前数据备份

升级前务必确保数据安全，这是回滚的唯一依据。

```bash
cd dify/docker
# 停止所有服务
docker compose down

# 备份数据卷
tar -cvf dify_backup_v1.9.1.tar ./volumes

# 备份配置文件
cp .env .env.bak
```

## 2.更新代码与配置

拉取最新代码并更新配置模板。

**【切换版本】**

```bash
cd ..
git fetch --all
git checkout v1.13.0
```

**【同步环境变量】**

- **生成新模板**：`cp docker/.env.example docker/.env`
- **手动合并**：将 `.env.bak` 中的 `SECRET_KEY`、数据库信息 (`DB_HOST`, `DB_PASSWORD` 等) 及各模型 API Key 迁移至新 `.env`。
- **关键核对**：执行 `docker compose config --services`，确保 `.env` 中的 `DB_HOST` 与输出的数据库服务名（如 `db_postgres`）完全匹配。

## 3.处理权限与环境变更

自 v1.10.x 起，容器运行权限发生变更，需手动调整存储目录权限。

```bash
# 在 dify 根目录下执行
sudo chown -R 1001:1001 ./docker/volumes/app/storage
```

## 4.拉取镜像并执行升级

操作步骤：

- 更新镜像
- 启动服务
- 强制触发数据库迁移

```bash
# 更新镜像
cd docker
docker compose pull

# 启动服务
docker compose up -d

# 强制触发数据库迁移
docker compose exec api flask db upgrade
```

**注意事项！！！**

| **检查项** | **说明** |
| - | - |
| **数据库连接** | 确保 `DB_HOST` 与 `docker compose config --services` 输出的服务名一致，否则将导致 `Connection refused`。 |
| **容器权限** | 若 API 服务启动失败，检查是否遗漏了 `chown -R 1001:1001` 操作。 |
| **任务堆积** | 1.13.0 若工作流变慢，可在 `.env` 中调大 `CELERY_WORKER_CONCURRENCY`。 |
| **知识库问题** | 若搜索异常，建议在 UI 界面重新索引或重新上传知识库。 |

## 5.验证状态

升级完成后，通过以下命令确认系统健康：

```bash
# 检查容器状态
docker compose ps

# 查看 API 日志，排除隐藏报错
docker compose logs -f api
```
