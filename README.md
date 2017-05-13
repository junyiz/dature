# dature
新浪博客抓取小程序

# 安装

```bash
npm install -g dature 
```

# 使用

抓取新浪博客的数据（标题、正文、时间、分类、图片），保存为blog/data.json，并生成HTML文件
```bash
dature -uc sina_blog_uid
```

抓取新浪博客的数据（标题、正文、时间、分类、图片），保存为blog/data.json
```bash
dature -u sina_blog_uid
```

只生成HTML文件
```bash
dature -c blog/data.json
```
