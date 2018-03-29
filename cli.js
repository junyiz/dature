#!/usr/bin/env node

const join = require('path').join
const yargs = require('yargs')
const fetch = require('./lib/fetch')

const dir = join(process.cwd(), './blog')
const uid = process.argv[2]

let argv = yargs
  .option('t', {
    alias : 'type',
    demand: false,
    requiresArg: true,
    describe: '博客的类型，如 sina: 新浪博客, csdn: CSDN博客, b163: 网易博客',
    type: 'string'
  })
  .option('u', {
    alias : 'uid',
    demand: false,
    requiresArg: true,
    describe: '博客uid',
    type: 'string'
  })
  .usage('Usage: dature [options]')
  .help('h')
  .alias('h', 'help')
  .example('dature -t sina -u 1263917762')
  .epilog('@junyiz')
  .argv;

if (argv.uid && argv.type) {
  fetch(dir, argv.uid, argv.type).then(function() {
      console.info(`\n抓取完毕, 文件目录：${dir}\n`)
  })
} else {
  yargs.showHelp()
}

/*
 新浪博客UID, 例 1263917762
 CSDN博客UId，例 v_xchen_v
*/