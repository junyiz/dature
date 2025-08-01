#!/usr/bin/env node

const join = require('path').join
const yargs = require('yargs')
const fetch = require('./lib/fetch')
const package = require('./package.json')

let argv = yargs(process.argv.slice(2))
  .usage('Usage: dature [options]')
  .options({
    'uid': {
      alias : 'u',
      demandOption: true,
      describe: '博客uid',
    },
    'cookie': {
      alias : 'c',
      demandOption: true,
      describe: '登录后的cookie',
    }
  })
  .help()
  .example('dature -uid 1263917762 -cookie "xxxxxxxxx"')
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
}

/*
 新浪博客UID, 例 1263917762
*/
