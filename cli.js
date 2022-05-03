#!/usr/bin/env node

const join = require('path').join
const yargs = require('yargs')
const fetch = require('./lib/fetch')

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
  const dir = join(process.cwd(), `./blog-${argv.uid}`)
  const cookie = (argv.cookie || '')
    .replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, '')
  fetch(dir, argv.uid, cookie).then(function() {
    console.info(`\n抓取完毕, 博客存储目录：${dir}\n`)
  })
} else {
  yargs.showHelp()
}

/*
 新浪博客UID, 例 1263917762
*/
