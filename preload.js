const fetch = require('./lib/fetch')
const join = require('path').join
const { shell } = require('electron')

const $ = (selector) => document.getElementById(selector)

window.addEventListener('DOMContentLoaded', () => {
  const btn = $('btn')
  const out = $('out')

  btn.addEventListener('click', () => {
    const uid = $('uid').value
    const cookie = ($('cookie').value || '')
      .replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, '')

    const dir = join(process.cwd(), `./blog-${uid}`)

    out.innerHTML = '' // 清空
    out.classList.add('loging')

    console.log = (log) => out.innerHTML += log.replace('\n', '<br>') + '<br>'

    if (!uid) {
      console.log('请输入 UID')
      return
    }

    console.log(`\n博客存储目录：<a href="${dir}/index.html">${dir}</a>\n`)

    fetch(dir, uid, cookie).then(() => {
      console.log(`\n备份完毕`)
    })
  })

  $('help').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      shell.openExternal(event.target.href)
    }
  })

  out.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      shell.openExternal(event.target.href)
    }
  })
})
