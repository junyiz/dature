const http = require('http')
const iconv = require('iconv-lite')
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
/**
 * 网页下载器
 * @param {string} url - 网页的网络地址
 * @param {number} timeout - 超时时间，默认 1 分钟
 * @param {number} retries - 重试次数，默认重试 2 次
 * @return promise
 */
module.exports = function htmlDoanloader(url, timeout = 60 * 1000, retries = 2) {
  return new Promise(function (resolve, reject) {
    function wrapper (url, timeout, retries) {
      let isRetry = false
      let req = http.request(url, res => {
        let buf = [], size = 0
        res.on('data', (chunk) => {
          buf.push(chunk)
          size += chunk.length
        })
        res.on('end', () => {
          resolve(iconv.decode(Buffer.concat(buf, size), 'utf8'))
        })
      })
      req.setHeader('User-Agent', userAgent)
      req.setTimeout(timeout, () => {
        req.abort()
        isRetry = true
      })
      req.on('error', (err) => {
        if (retries <= 2) {
          isRetry = true
        } else {
          reject(err)
        }
      })
      req.on('close', () => {
        // 重试时，将超时时间递增 1 分钟
        if (isRetry && retries > 0) wrapper(url, timeout + 60 * 1000, retries - 1)
      })
      req.end()
    }
    wrapper(url, timeout, retries)
  })
}