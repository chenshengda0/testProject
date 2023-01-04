bind 127.0.0.1 #注释掉这部分，这是限制redis只能本地访问

protected-mode no #默认yes，开启保护模式，限制为本地访问

daemonize no#默认no，改为yes意为以守护进程方式启动，可后台运行，除非kill进程，改为yes会使配置文件方式启动redis失败

databases 16 #数据库个数（可选），我修改了这个只是查看是否生效。。

dir ./ #输入本地redis数据库存放文件夹（可选）

appendonly yes #redis持久化（可选）

logfile "access.log"

requirepass 123456(设置成你自己的密码)