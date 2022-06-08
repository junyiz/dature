# dature
基于 Node.js 的新浪博客备份程序，备份数据包含标题、正文、时间、分类、标签、图片，并生成 HTML 文件

![dature](https://gitee.com/junyiz/dature/raw/master/images/dature.jpg)

## 普通用户
下载安装，即可使用 [下载地址](https://github.com/junyiz/dature/releases)

## 专业用户
```bash
# 1. 安装 Node.js 参见：https://nodejs.org/zh-cn/download/

# 2. 安装命令

npm install -g dature 

# 3. 命令行使用

# 例如备份牛根生的博客(xxxxxx 为 cookie)
dature -u 1263917762 -c "xxxxxx"
```

## 备份后生成的新博客
![example](https://gitee.com/junyiz/dature/raw/master/images/example.jpg)

## 如何查看新浪博客的 UID
![example](https://gitee.com/junyiz/dature/raw/master/images/sina.jpg)

## 如何查看新浪博客的 cookie

登录新浪博客，打开浏览器的开发者工具，然后刷新页面，如下大红框，即是 cookie  
![cookie](https://gitee.com/junyiz/dature/raw/master/images/cookie.png)

注意只需复制大红框中冒号后面的部分

## buy-me-a-tea
如果这个仓库对你有帮助，欢迎 star 或 buy me a tea:

<img src="https://gitee.com/junyiz/dature/raw/master/images/wechat.jpg" width="300" />
