# 成员
- kefei.zhao⭐
- wen.liu
- mengjun.xiang
- miaomiao.yang
- ArisCUI
- zhihui.zhao

# 开发工具（多搜索多研究多看官方文档）
- [IDEA](https://www.jetbrains.com/idea/) 
- [python](https://www.python.org/)
- [sanic](https://github.com/huge-success/sanic)
- [postgresql](https://www.postgresql.org/)
- [redis](https://redis.io/)

# 变更日志

# 系统环境
- dev环境
```
https://gdogdev.gemii.cc    http://127.0.0.1:5000
ssh://gdogdev:ufqkeM9GGmJ6vcn@52.82.2.37
postgresql://gdogdev:jGgZTkwkFe2Pxag@127.0.0.1:2000/gdogdev
redis://127.0.0.1:5030
amqp://gdogdev:QhcnHuW4abFsg7s@127.0.0.1:2100/gdogdev

链接服务器，需要先本机打隧道，打隧道命令 ssh -qTfnNC -L port1:localhost:port2 user@ip ，
例如打postgresql的隧道 ssh -qTfnNC -L 2000:localhost:2000 user@ip 。

postgresql/git/redis 用 IDEA 内置插件，也可以直接用命令行。
```

- prd环境
```
https://gdogprd.gemii.cc    http://127.0.0.1:5100
```

- op环境（只读）
```
ssh://gdogprdop:PASSWORD@52.82.2.37
postgresql://gdogprdop:PASSWORD@127.0.0.1:2000/gdogprd
```

# 重要内容
## 消息队列
```
作为消费者:
queue.rs.msg_class                  BI鉴定广告消息推送 

作为生产者:
rs.msg_clf.dog_ad_switch.queue      群广告消息开关推送

```

# 项目部署流程
- 项目环境搭建：
    1. 进入服务器拉取代码：`git clone https://gitlab.com/gemii/gdog.git`
    2. 进入项目根目录，安装python依赖包：`pip install --user -r requirements.txt`

- 后端项目运行前准备：
    1. 添加`config.py`配置文件(根据不同环境添加不同的配置)
    2. 创建`logs`文件夹

- 项目启动：
    - web项目启动：
        1. 使用tmux作为后台启动方式 https://gitlab.com/gemii/gpet/issues/200 https://gitlab.com/gemii/gpet/issues/286
        2. 进入tmux session: `tmux new -s gdog`
        3. 运行web项目：`python3 run.py`
        4. 退出session(进入后台模式)：`ctrl+b d`


# 项目版本迭代发布流程
- 书写变更日志
- 梳理项目发布前的准备事项(发布issue)
- 根据发布注意事项内容在服务器上进行发布
- 线上测试