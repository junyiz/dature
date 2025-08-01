import fs from 'fs'
import http from 'http'
import https from 'https'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

/**
 * 图片下载器
 * @param options
 * @param {string} options.url - 图片的网络地址
 * @param {string} options.dest - 保存图片的地址
 * @param {number} options.timeout - 超时时间，默认 3 分钟
 * @param {number} options.retries - 重试次数，默认重试 2 次
 * @param {string} options.userAgent
 * @param {string} options.referer
 */
export default function pictureDownloader(options) {
  let {
    url,
    dest,
    timeout = 3 * 60 * 1000,
    retries = 2,
    userAgent,
    referer
  } = options

  let isRetry = false

  const request = url.startsWith('https') ? https.request : http.request

  const req = request(url, res => {
    res.pipe(fs.createWriteStream(dest + '.cache'))
    res.on('end', () => {
      fs.rename(dest + '.cache', dest, () => {})
    })
  })

  req.setTimeout(timeout, () => {
    retries--
    isRetry = true // 超时需尝试重试
    req.destroy()
  })

  req.setHeader('User-Agent', userAgent ? userAgent : UA)

  if (referer) req.setHeader('Referer', referer)

  req.on('error', () => {
    retries--
    isRetry = true // 发生错误需尝试重试
  })

  // 连接关闭时，检查是否需要重试
  req.on('close', () => {
    // 重试时，将超时时间递增 1 分钟
    if (isRetry && retries > 0) pictureDownloader({
      url,
      dest,
      timeout: timeout + 60 * 1000,
      retries,
      userAgent,
      referer
    })
  })

  req.end()
}