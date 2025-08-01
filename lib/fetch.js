import fs from 'fs'
import util from 'util'
import { join } from 'path'
import mkdirp from 'mkdirp'
import sina from './sina.js'

const copyFile = util.promisify(fs.copyFile)

export default async function fetch(dir, uid, cookie) {
  // 生成目录
  mkdirp.sync(dir)
  mkdirp.sync(dir + '/imgs')
  mkdirp.sync(dir + '/blog')

  // 复制依赖的模版
  await copyFile(join(process.cwd(), 'tpl/vue.js'), join(dir, 'vue.js'))
  await copyFile(join(process.cwd(), 'tpl/style.css'), join(dir, 'style.css'))
  await copyFile(join(process.cwd(), 'tpl/index.html'), join(dir, 'index.html'))

  await sina(uid, dir, cookie) // 备份博文
}
