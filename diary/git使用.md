拉取仓库，

```bash
rm -rf .git
```
清空原来的git提交记录


# git常用命令
- git status 查看工作区和暂存区的状态，
- git push origin(远端仓库名，默认为origin,git自动起的别名) 本地分支名:远端分支名
- 第一次推送，-u首次推送设置上游 git push -u origin 本地分支名 ; 后续推送 git push
- git commit -m "msg" 

- git fetch 获取远程更改，但不合并
- git pull 拉取并合并

- git push --force


工作区：本地正在编辑和可见所有文件

暂存区：即将提交的文件 git add

本地仓库：从暂存区永久保存到本地仓库 git commit

远端仓库：将本地提交同步到远端仓库 git push 

