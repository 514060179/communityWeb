## 安装部署

HC小区管理系统前段项目部署，部署前段前，请确保您已经安装部署了后端项目（https://gitee.com/wuxw7/MicroCommunity），安装请参考如下视频:</br>

HC小区管理系统开发环境搭建  https://www.bilibili.com/video/BV1gs4y187Fg/?spm_id_from=333.999.0.0&vd_source=1129535056a7e5a086c2e24dc39ef7d2

HC小区管理系统linux生产环境安装(推荐稳定) https://www.bilibili.com/video/BV1AY411v7kY/?spm_id_from=333.999.0.0

### 开发环境

在根目录下执行 npm install .

修改app.js 中的ip和端口信息

```
// todo 测试环境 测试使用，生产环境请用nginx带来
app.use('/callComponent', proxy('http://192.168.100.108:8008', opts));
app.use('/app', proxy('http://192.168.100.108:8008', opts));
app.use('/ws', createProxyMiddleware({
    target: 'http://192.168.100.108:8008',
    changeOrigin: true,
    ws: true
}));

```



然后执行 npm start 命令，出现如下：

```
[HPM] Proxy created: /  -> http://192.168.100.108:8008
```
说明启动成功

浏览器访问 http://localhost:3000

### 生产环境安装

此项目通过html 和js 的方式开发，所以不需要做前端打包，重要的事情说三遍：</br>

不需要做前端打包</br>

不需要做前端打包</br>

不需要做前端打包</br>

好了。

将项目中的public 目录传到/home/data/web/ 下，并且将public 目录修改为 propertyWeb

nginx 配置如下：

```
server {
	listen       80;
	server_name  wuye.homecommunity.cn;

	location / {
	    root   /home/data/web/propertyWeb;
	}
	location /callComponent
	{
	  add_header 'Access-Control-Allow-Origin' '*';
	  proxy_pass   http://后端服务ip:8008;
	}
	location /app
	{

	  add_header 'Access-Control-Allow-Origin' '*';
	  proxy_pass  http://后端服务ip:8008;
	}
location /ws {

	    proxy_http_version 1.1;

proxy_set_header Upgrade $http_upgrade;

proxy_set_header Connection "$connection_upgrade";

	  proxy_pass   http://后端服务ip:8008;

	}
}

```

注意 ：/home/data/web/ 这个目录是这里举例的 可以根据自己的喜好修改
