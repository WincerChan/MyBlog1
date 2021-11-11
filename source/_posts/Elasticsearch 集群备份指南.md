---
title: Elasticsearch 集群备份指南
date: 2018/10/27 21:55:12
updated: 2018/10/27 21:55:12
categories: 分享境
tags:
  - Elasticsearch
  - 备份
  - 恢复
  - backup
abbrlink: 92d76830
thumbnail: https://ae01.alicdn.com/kf/HTB1dou4aovrK1RjSspcq6zzSXXax.jpg
---

Elasticsearch 官方对其的定义是一种搜索引擎，但我更喜欢把它当作一种非关系型数据库来看待，而作为数据库来看待的话，保障其中数据的安全性和可靠性自然是重中之重了。

首先声明，本文对 Elasticsearch 数据的备份是基于[官方提供的 API](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html)，其它的诸如 [elasticsearch-dump](https://github.com/taskrabbit/elasticsearch-dump) 等第三方工具暂且不谈。官方的提供的备份方式是一种 Snapshot，其中备份路径可以选择云端或本地，本文想就备份集群数据到本地写一份指南，并对遇到的问题做一些解答。 

<!-- more -->

## 搭建集群文件系统

为了创建一个 Elasticsearch 集群的 Snapshot，首先必须先搭建一个集群文件系统，用以确保集群的所有节点对同一个目录具有操作权限——这里推荐使用 NFS（Network File System）。

NAS 需要指定集群的某一个节点的文件夹作为服务器来提供硬盘存储，也是 NAS 存储文件的实际位置，集群的其他节点作为客户端挂载服务端的共享文件夹。

### 安装

```shell
sudo apt install nfs-kernel-server # 服务端
sudo apt install nfs-common # 客户端
```

### 创建共享文件夹

这里是我踩的第一个坑。**服务端的共享文件夹所有者必须也是运行 Elasticsearch 程序的用户**，不然 Elasticsearch 是无法将数据备份到该文件夹的，比如运行 Elasticsearch 的用户是 els 的话，可以用如下命令来创建共享文件夹：

```shell
sudo -u els mkdir /path/to/backups -p
```

### 修改配置文件

在服务端的 `/etc/exports` 中添加以下内容：

```conf
/path/to/backups 192.168.1.1(insecure,rw,sync,no_subtree_check,no_root_squash,no_acl)
```

其中 `192.168.1.1` 就是服务器本机的 IP。括号内的是配置参数，稍稍解释一下：

- `insecure`：允许客户端从大于 1024 的端口号连接。
- `rw`：所有连接者都具有读写权限。
- `sync`：将更改都提交到稳定存储之后再回复请求。
- `no_subtree_check`：禁用子树检查。
- `no_root_squash`：关闭 root 压缩。
- `no_acl`：不要向客户端显示 ACLs。

更多的参数可以参考[这里](https://linux.die.net/man/5/exports)。

### 生效配置

```shell
exportfs -r
```

这时你可以使用 `showmount -e localhost` 来查看本机的挂载情况：

```shell
/path/to/backups 192.168.1.1
```

### 客户端

注意，客户端也一定要使用运行 Elasticsearch 的用户的权限来创建相同的文件夹，这一点非常重要。然后把服务端的文件夹挂在到各个节点：

```shell
mount -t nfs 192.168.1.1:/path/to/backups /path/to/backups
```

没有报错的话，就挂载成功了。

## Elasticsearch 配置

需在每一个节点的 `elasticsearch.yml` 中加上一行：

```yaml
path.repo: ["/path/to/backups"]
```

然后重启 Elasticsearch。

这时就可以尝试创建一个 Snapshot 的仓库了：

```json
PUT /_snapshot/my_backup
{
    "type": "fs",
    "setting": {
        "location": "/path/to/backups"
    }
}
```

如果没有报了权限错误的话，就 OK 了。

如果报了权限错误，请检查 Elasticsearch 对该文件夹是否具有写权限。如果确认具有写权限，那么就需要把集群各节点运行 Elasticsearch 的用户的 UID 和 GID 统一起来，具体做法见附录。这里是我踩的第二个坑。

## 创建一个备份

你可以以如下命令来创建一个备份：

```json
PUT /_snapshot/my_backup/snap1?wait_for_completion=true
{
	"indices": "index_1,index_2"
}
```

其中 `wait_for_completion` 参数并不会马上返回结果，而是等备份完成之后再返回结果，如果备份的索引很多的话，可能会花费很多时间才返回，所以并不建议加上这个参数。可以为 `PUT` 加上请求体，指定索引，如上指定 `index_1`、`index_2` 两个索引备份，如果不加请求体的话会默认备份全部索引。

当 Snapshot 正在生成中的时候，可以使用如下命令来获取备份的进度：

```json
GET /_snapshot/my_backup/snap1
```

其返回的 `state` 项的值即是备份进度条。

Elasticsearch 是采取增量备份的形式，但需注意，Snapshot 不可重复创建，也就是说 Snapshot 的名字不能相同。

## 从备份中恢复

可采取如下命令从 Snapshot 中恢复：

```json
POST /_snapshot/my_backup/snap1/_restore
```

默认所有的索引都会恢复，当然你也可以指定索引：

```json
POST /_snapshot/my_backup/snap1._restore
{
    "indices": "index_1,index_2"
}
```

而有关恢复的进度，Elasticsearch 并不提供查询像备份进度那样的 API，所以只能使用 [indices recovery](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-recovery.html) 和 [cat recovery](https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-recovery.html) 来查询恢复进度。

与备份和恢复更详细的讲解请参照[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html)。

## 附：更改 UID 和 GID 的方法

首先假设各节点运行 Elasticsearch 的用户名为 `els`。先假设：他的旧 UID 为 1005，旧 GID 为 2000，要把他改成 UID 为 2005，GID 为 3000 的新用户。

首先为 `els` 更改新的 UID 和 GID：

```shell
sudo usermod -u 2005 els
sudo groupmod -g 3000 els
```

这就算完成了，可以用 `id els` 命令来查看用户的 UID 和 GID 是否被成功更改。

当然，这只是把用户名的 UID 和 GID 做了简单的更改，还需要把原用户的所有文件、目录的所有者都改成新的，不然是无法成功运行 Elasticsearch 的，会报权限错误。

以下命令来更改：

```shell
sudo find / -group 2000 -exec chgrp -h els {} \;
sudo find / -user 1005 -exec chown -h els {} \;
```

其中 `-exec` 参数对每个文件执行 `chgrp` 和 `chown` 命令。`-h` 参数是对符号链接起作用，而不是应用文件。

参考：

- [Snapshot API not working](https://stackoverflow.com/questions/44955219/snapshot-api-not-working)
- [elasticsearch backup and restore](http://smallasa.com/2017/03/09/elasticsearch-backup-and-restore/)
- [How to Change a USER and GROUP ID on Linux For All Owned Files](https://www.cyberciti.biz/faq/linux-change-user-group-uid-gid-for-all-owned-files/)
