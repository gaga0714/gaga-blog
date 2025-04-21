# 前端项目部署

## centos

copy 一下在[stock_quant_frontend](https://github.com/gaga0714/stock_quant_frontend/tree/main?tab=readme-ov-file#%E6%9C%8D%E5%8A%A1%E5%99%A8aliyun%E5%89%8D%E7%AB%AF%E9%83%A8%E7%BD%B2-%EF%B8%8F)上写的

### 上传

本地打包 dist 上传至服务器该目录下：
`/home/html/`，我的命名是 stock_quant_frontend

### 修改配置文件

进入 nginx 配置目录：`cd /usr/local/nginx/conf/`

打开配置文件：`nano nginx.conf`

```
server {
        listen       10014;
        server_name  localhost;

        location / {
                root        /home/html/stock_quant_frontend/;
                try_files   $uri $uri/ /index.html;
                index       index.html;
        }
}
```

### 重启 nginx 服务

`cd /usr/local/nginx/sbin/`

`./nginx -s stop`

`./nginx`

## Ubuntu

### 上传

放在/home/html/下

### 写配置文件

```
sudo nano /etc/nginx/sites-available/配置文件名
```

举例：

```
server {
    listen 10002;
    server_name localhost;

    root /home/html/quant;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 添加软链接

```
sudo ln -s /etc/nginx/sites-available/quant /etc/nginx/sites-enabled/
```

`/etc/nginx/sites-available/` 存放所有站点配置（包括启用和未启用的）
`/etc/nginx/sites-enabled/` 只存放当前启用中的站点配置，是软链接指向上面的文件

解释：

- `ln`: Linux 的 link 命令，用来创建链接文件

- `-s`: 表示创建软链接（symbolic link）

- `/etc/nginx/sites-available/my-web`: 你新建的 Nginx 站点配置文件

- `/etc/nginx/sites-enabled/`: 是 Nginx 会读取启用站点配置的目录

### 检查语法错误

```
sudo nginx -t
```

### 重启

```
sudo systemctl restart nginx
```
