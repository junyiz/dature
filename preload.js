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

    console.log = (log) => out.innerHTML += log.replace('\n', '<br>')

    fetch(dir, uid, cookie).then(function() {
      console.log(`\n备份完毕, 博客存储目录：<a href="${dir}/index.html">${dir}</a>\n`)
    })
  })

  out.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      shell.openExternal(event.target.href)
    }
  })
})
