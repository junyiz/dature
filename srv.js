import http from 'http'
import { parse } from 'url'
import { join } from 'path'
import fetch from './lib/fetch.js'

export const parseSearch = (search) => {
  return search.split('&').reduce((acc, cur) => {
    const [key, val] = cur.split('=')
    if (key) acc[key] = decodeURIComponent(val)
    return acc
  }, {})
}

const server = http.createServer((req, res) => {
  const { pathname, query } = parse(req.url) 
  if (pathname != '/api/sina') return

  const { u, c } = parseSearch(query)
  if (!u && !c) return

  const uid = u
  const dir = join(process.cwd(), `./blog/${uid}`)
  const cookie = c.replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, '')

  // 设置响应头以启用 SSE
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })

  console.log = (msg) => {
    console.info(msg)
    res.write(`data: ${msg}\n\n`)
  }

  fetch(dir, uid, cookie)
})

server.listen(3000)