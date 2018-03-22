#!/usr/bin/env node

const join = require('path').join
const fetch = require('./lib/fetch')

const dir = join(process.cwd(), './blog')
const uid = process.argv[2]

if (/\d{10}/.test(uid)) {
  fetch(dir, uid).then(function() {
    console.info(`\n抓取完毕, 文件目录：${dir}\n`)
  })
} else {
  console.info(`\n请输入正确的新浪博客UID, 例如 dature 1263917762\n`)
}