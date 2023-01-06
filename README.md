# INSTALL app
```
npx create-react-app my-app --template typescript scripts-version=4.0.3
```

# API
## puppeteer爬取baidu关键词，使用socket.io推送最新记录
```
curl http://127.0.0.1:9527/api
```


## 获取爬取关键词列表
```
curl http://127.0.0.1:9527/api/get_cralwer
```

## CTE获取最佳路径

![image](https://github.com/chenshengda0/testProject/blob/main/my-app/src/recursive.jpeg)

```
curl http://127.0.0.1:9527/api/good_path
```

## CTE
```
curl http://127.0.0.1:9527/api/get_recursive
```

# 参考文档
1. [socket.io 聊天室](https://github.com/koolkishan/chat-app-react-nodejs)
2. [socket.io 官方文档](https://socket.io/zh-CN/docs/v4/)
3. [socket.io 配置文档](https://socket.gitbook.io/docs/)
4. [Puppeteer 官方文档](https://pptr.dev/api/)
