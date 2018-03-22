const fs = require('fs')
const util = require('util')
const join = require('path').join
const mkdirp = require('mkdirp')
const dataExtractor = require('./dataExtractor')
const pictureDownloader = require('./pictureDownloader')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const copyFile = util.promisify(fs.copyFile)

module.exports = async function fetch(dir, uid) {
  // 生成目录
  mkdirp.sync(dir)
  mkdirp.sync(dir + '/imgs')

  const data = await dataExtractor(uid) // 抽取数据
  await writeFile(join(dir, 'data.js'), 'window.blog=' + JSON.stringify(data), 'utf8') // 写入数据文件data.js

  // 批量下载图片
  data.imgs.map(({url, name}) => {
    pictureDownloader(url, join(dir, 'imgs', name))
  })

  const tmpl = await readFile(__dirname + '/template.html', 'utf8') // 读取模版
  const render = new Function('d', 'return `' + tmpl + '`') // 生成渲染函数
  await writeFile(join(dir, 'index.html'), render({title: data.title}), 'utf8') // 生成并写入index.html

  // 复制依赖的js、css
  await copyFile(__dirname + '/assets/vue.js', join(dir, 'vue.js'))
  await copyFile(__dirname + '/assets/style.css', join(dir, 'style.css'))
}