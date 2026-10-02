---
title: 常用的 GIT 小技巧
description: 整理三个 Git 实用操作：撤销已推送的远程 commit、批量修改 commit 提交者信息、在 IDEA 内合并 commit 记录。
pubDate: 2025-07-25
tags:
  - Git
draft: false
---

## 1.撤销提交到远程仓库的 commit

**此命令会导致线上版本发生变更，请评估后使用！**

**【操作步骤】**

1. 撤销本地提交信息
2. 撤销远程提交信息
3. 修改代码重新提交

### 1.1 撤销本地提交信息

1. 通过 `git log` 查看提交记录，找到需要被撤销的提交记录；
2. 使用命令退回到提交的前一个版本 `git reset --soft [需要撤销的前一个版本号]`
3. 注意：参数 `soft` 意思为保留当前工作区，即修改后可以再次提交，选择 `hard` 会撤销当前工作区的修改；
4. 使用 `git log` 命令查看是否已经成功撤销；

### 1.2.撤销远程提交信息

1. 使用命令强制推送当前版本到远程仓库 `git push origin [远程仓库名称] --force`；
2. 注意：必须添加 `--force` 参数，否侧会提交失败；

### 1.3.修改代码重新提交

1. 修改代码：`git add [修改的文件]`
2. 重新提交：`git commit -m "[add some description]"`
3. 推送远程仓库：`git push origin [仓库名称]`

## 2.批量修改 commit 的提交者信息

**请评估后使用，仅建议在个人项目内使用！！！**

**【操作步骤】**

1. 创建修改脚本
2. 执行修改脚本
3. 确认后提交远程仓库

### 2.1.创建脚本文件

创建一个脚本 `modifyCommit.sh`，放在项目的根目录执行。

```
git filter-branch --commit-filter '
if [ "$GIT_AUTHOR_NAME" = "beforeUserNm" ];
then
        GIT_AUTHOR_NAME="afyerUserNm";
        GIT_AUTHOR_EMAIL="afterUserEmail@mail.com";
        git commit-tree "$@";
else
        git commit-tree "$@";
fi' HEAD
```

### 2.2.执行脚本替换所有的提交信息

```
chmod +x modifyCommit.sh
sh modifyCommit.sh
```

执行脚本后稍作等待，出现如下的输出说明已经在执行修改操作了。

![](https://cdn.nlark.com/yuque/0/2024/png/10379773/1705387913439-965abc3f-80c5-4f44-a316-acea73107f17.png)

如果没有修改成功，可以再次执行，出现错误提示 `A previous backup already exists in refs/original/`，说明已经执行过了，执行以下命令清除缓存即可再次执行。

```
git filter-branch -f --index-filter 'git rm --cached --ignore-unmatch Rakefile' HEAD
```

### 2.3.确认后提交远程仓库

使用 `git log` 命令查看本地是否已经成功修改

提交远程仓库 `git push origin main --force`

## 3.IDEA 内合并 commit 记录

**操作仅建议在本地开发分支使用！！！**

**【操作步骤】**

1. 打开代码提交记录树；
2. 选中要合并提交的第一个提交，右键打开菜单选择【Interactively Rebase from Here...】；
3. 进入合并提交菜单，保留第一个提交记录；
4. 其余要合并的提交记录选择为【squash】;
5. 重新输入 commit message；
6. 点击【start rebasing】按钮，完成代码合；
