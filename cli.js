#!/usr/bin/env node

const join = require('path').join
const yargs = require('yargs')
const fetch = require('./lib/fetch')
const package = require('./package.json')

let argv = yargs
  .option('u', {
    alias : 'uid',
    demand: false,
    requiresArg: true,
    describe: '博客uid',
    type: 'string'
  })
  .option('c', {
    alias : 'cookie',
    demand: false,
    requiresArg: false,
    describe: '登录后的cookie',
    type: 'string'
  })
  .usage('Usage: dature [options]')
  .help('h')
  .alias('h', 'help')
  .example('dature -u 1263917762')
  .epilog('@junyiz')
  .argv;

if (argv.uid) {
  console.log(`dature@${package.version}\n`)

  const dir = join(process.cwd(), `./blog-${argv.uid}`)
  const cookie = (argv.cookie || '')
    .replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, '')

  console.info(`\n博客存储目录：${dir}\n`)

  fetch(dir, argv.uid, cookie).then(() => {
    console.info(`\n备份还在继续，请等待程序结束\n`)
  })
} else {
  yargs.showHelp()
}

/*
 新浪博客UID, 例 1263917762
*/
