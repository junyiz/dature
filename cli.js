#!/usr/bin/env node

import { join } from 'path'
import yargs from 'yargs'
import fetch from './lib/fetch'

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
  const dir = join(process.cwd(), `./blog-${argv.uid}`)
  const cookie = (argv.cookie || '')
    .replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, '')

  console.info(`\n博客存储目录：${dir}\n`)

  fetch(dir, argv.uid, cookie).then(() => {
    console.info(`\n备份还在继续，请耐心等待...\n`)
  })
}

/*
 新浪博客UID, 例 1263917762
*/
