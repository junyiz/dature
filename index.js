#!/usr/bin/env node

const fs = require('fs')
const ejs = require('ejs')
const util = require('util')
const path = require('path')
const mkdirp = require('mkdirp')
const join = path.join
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const extract = require('./lib/extract')
const pictureDownloader = require('./lib/pictureDownloader')
const blogDir = join(process.cwd(), './blog')
const uid = process.argv[2]

async function fetch(uid) {
  // 生成目录
  mkdirp.sync(blogDir)
  mkdirp.sync(blogDir + '/imgs')
  mkdirp.sync(blogDir + '/post')

  // 获取数据
  let data = await extract(uid)

  // 写入数据
  writeFile(join(blogDir, 'data.json'), JSON.stringify(data), 'utf8')

  // 批量下载图片
  data.imgs.map(({url, name}) => {
    pictureDownloader(url, join(blogDir, 'imgs', name))
  })

  // 生成HTML
  let tplIndex = await readFile(__dirname + '/tpl/index.html', 'utf8')
  let tplBlog = await readFile(__dirname + '/tpl/blog.html', 'utf8')
  // index.html
  writeFile(join(blogDir, 'index.html'), ejs.render(tplIndex, data), 'utf8')
  // post/[n].html
  for (let i = 0; i < data.post.length; i++) {
    await writeFile(join(blogDir, `/post/${i + 1}.html`), ejs.render(tplBlog, data.post[i]), 'utf8')
  }
}

if (/\d{10}/.test(uid)) {
  fetch(uid)
} else {
  console.info(`\n请输入正确的新浪博客UID, 例如 dature 1263917762\n`)
}