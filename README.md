# dature
基于 Node 的博客抓取程序，抓取数据包含标题、正文、时间、分类、标签、图片，并生成 HTML 文件

## 安装

```bash
npm install -g dature 
```

## 使用

```bash
# 抓取牛根生的博客
dature -t sina -u 1263917762

# 抓取36氪发布在CSDN的文章
daturn -t csdn -u bkmk01mz3w
```
## 抓取后生成的新博客
![example](https://raw.githubusercontent.com/junyiz/dature/master/images/example.jpg)

## 如何查看博客的UID
 
#### 新浪博客
![example](https://raw.githubusercontent.com/junyiz/dature/master/images/sina.jpg)

#### CSDN博客
![example](https://raw.githubusercontent.com/junyiz/dature/master/images/csdn.jpg)