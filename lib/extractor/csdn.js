const urlParse = require('url').parse
const path = require('path')
const cheerio = require('cheerio')
const isUrl = require('is-url')
const htmlDownloader = require('../htmlDownloader')

module.exports = async function extract(uid) {
  let urls = []
  let data = {uid, post: [], imgs: []}

  // 遍历博文目录，抽取博客标题，博文地址
  let i = 1, page = 1
  do {
    let url = `https://blog.csdn.net/${uid}/article/list/${i}`
    let list = await htmlDownloader(url).catch(console.error)
    let $ = cheerio.load(list)
    let title = $('h1.title').text()
    let links = $('.blog-unit a')
    if (!title) {
      links = $('.link_title a')
      title = $('#blog_title a').text()
    }
    links.each((i, el) => {
      let href = $(el).attr('href')
      if (isUrl(href)) urls.push(href)
    })
    if (i === 1) {
      let last = $('.page-link').last()
      if (last.attr('rel') == 'next') {
        page = Number(last.parent().prev().find('a').text())
      } else {
        page = Number(last.text())
      }
      data.title = title  // 博客标题
      data.link = url     // 博客链接
    }
  } while (++i <= page)

  // 遍历博文地址，抽取博文内容（标题、正文、时间、图片、原文链接）
  for (let link of urls) {
    let post = await htmlDownloader(link).catch(console.error)
    let $ = cheerio.load(post, {decodeEntities: false})
    let title = $('.csdn_top').text()       // 博文标题
    let date = $('span.time').text().replace(/(\(|\))/g, '')   // 博文发布时间
    let content = $('div.article_content').html()
    let protocol = urlParse(link).protocol
    if (!title) {
      title = $('.link_title a').text()
      date = $('.link_postdate').text()
    }
    // 抽取正文内容中的图片地址，并替换为本地图片地址
    content = content
      .replace(/<(p|span|font|div|h2|h3)[^>]*/gi, '<$1')        // 去掉p、span、font、div、h2、h3等标签的属性
      .replace(/\n?<\/?(span|font|wbr|br|link)[^>]*>\n?/gi, '')   // 去掉span、font、wbr、br、link等无用标签
      .replace(/<a[^>]*><\/a>/gi, '')
      .replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, (m, a, url, b) => {
        url = url.replace(/&amp\d*/gi, '');
        if (url == '') {
          return ''
        } else {
          url = url.startsWith('//') ? protocol + url : url   // 给未带协议的url，添加协议
          let name = path.parse(urlParse(url).pathname).base
          if (!data.imgs.find(it => it.url === url)) {
            data.imgs.push({name, url})
          }
          return `<img${a}src="./imgs/${name}"${b}>`
        }
      })
      .replace(/<a[^>]*>(<img[^>]*>)<\/a>/gi, '$1') // 去掉套在 img 标签为的 a 链接
      .trim()
    data.post.push({title, date, link, content})
  }

  // 返回抽取的数据
  return data
}
