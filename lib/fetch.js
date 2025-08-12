import fs from 'fs'
import util from 'util'
import { join } from 'path'
import mkdirp from 'mkdirp'
import sina from './sina.js'

const copyFile = util.promisify(fs.copyFile)
const copyDir = async (src, dest) => {
  await fs.promises.mkdir(dest, { recursive: true })
  const entries = await fs.promises.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await copyFile(srcPath, destPath)
    }
  }
}

export default async function fetch(dir, uid, cookie) {
  // 生成目录
  mkdirp.sync(dir)
  mkdirp.sync(dir + '/imgs')
  mkdirp.sync(dir + '/blog')

  // 复制依赖的模版
  await copyDir(join(process.cwd(), 'tpl'), dir)

  await sina(uid, dir, cookie) // 备份博文
}
