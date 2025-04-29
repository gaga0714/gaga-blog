# docker

## 拉取镜像

```
sudo docker pull nginx
```

## 创建挂载目录

```
mkdir -p /home/nginx/conf
mkdir -p /home/nginx/log
mkdir -p /home/nginx/html
```

## 运行 nginx

```
sudo docker run -d -p 80:80 --name nginx nginx
```

- -d：让容器在后台运行。
- -p 80:80：将容器的 80 端口映射到主机的 80 端口。
- --name nginx：给容器指定一个名称

## 将容器内的文件复制到宿主机

```
 docker cp nginx:/etc/nginx/nginx.conf /home/nginx/conf/nginx.conf
 docker cp nginx:/etc/nginx/conf.d /home/nginx/conf/conf.d
 docker cp nginx:/usr/share/nginx/html /home/nginx/
```

## 删除原有的 nginx 容器

```
 #直接执行docker rm nginx或者以容器id方式关闭容器
 #找到nginx对应的容器id
 docker ps -a
 #停止容器
 docker stop id
 #删除容器
 docker rm id
 #删除正在运行的
 docker rm -f id

```

## 重建一个并挂载

```
docker run \
 -p 80:80 \
 --name nginx \
 -v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
 -v /home/nginx/conf/conf.d:/etc/nginx/conf.d \
 -v /home/nginx/log:/var/log/nginx \
 -v /home/nginx/html:/usr/share/nginx/html \
 -d nginx:latest
```

## 查看容器状态

```
sudo docker ps
```

```
docker ps -a
```

## 重新加载 nginx 配置

```
sudo nginx -s reload
```

## 重启 nginx

```
sudo docker restart nginx
```
