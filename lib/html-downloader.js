const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'

function isRedirect(code) {
  return code === 300 || code === 301 || code === 302 || code === 303 || code === 305 || code === 307 || code === 308
}

/**
 * 网页下载器
 * @param {string} url - 网页的网络地址
 * @param {number} options.timeout - 超时时间，默认 1 分钟
 * @param {number} options.retries - 重试次数，默认重试 2 次；为 0 时，不支持重试
 * @param {number} options.redirect - 支持重定向次数，默认重试 5 次；为 0 时，不支持重定向
 * @param {cookie} options.cookie - 登录的cookie
 * @return promise
 */
module.exports = function htmlDownloader(url, { timeout = 60 * 1000, retries = 2, redirect = 5, cookie = ''}) {
  return new Promise(function (resolve, reject) {
    function wrapper (url, timeout, retries, redirect) {
      let isRetry = false
      const request = url.startsWith('https') ? https.request : http.request
      let req = request(url, res => {
        let buf = [], size = 0 
        if (isRedirect(res.statusCode) && 'location' in res.headers && redirect > 0) {
          wrapper(res.headers.location, timeout, retries, redirect - 1)
          return
        }
        res.on('data', (chunk) => {
          buf.push(chunk)
          size += chunk.length
        })
        res.on('end', () => {
          resolve(iconv.decode(Buffer.concat(buf, size), 'utf8'))
        })
      })
      req.setHeader('User-Agent', userAgent)
      // req.setHeader('Referer', 'http://blog.sina.com.cn/u/2151510273')
      // req.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9')
      if (cookie) req.setHeader('Cookie', cookie)
      req.setTimeout(timeout, () => {
        retries--
        isRetry = true
        req.abort()
      })
      req.on('error', (err) => {
        isRetry = true
        retries > 0 ? retries-- : reject(err)
      })
      req.on('close', () => {
        // 重试时，将超时时间递增 1 分钟
        if (isRetry && retries > 0) wrapper(url, timeout + 60 * 1000, retries, redirect)
      })
      req.end()
    }
    wrapper(url, timeout, retries, redirect)
  })
}