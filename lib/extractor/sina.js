const urlParse = require('url').parse
const path = require('path')
const cheerio = require('cheerio')
const isUrl = require('is-url')
const htmlDownloader = require('html-downloader')

module.exports = async function extract(uid) {
  let urls = []
  let data = {uid, post: [], imgs: []}

  // 遍历博文目录，抽取博客标题，博文地址
  let i = 1, page = 1
  do {
    let list = await htmlDownloader(`http://blog.sina.com.cn/s/articlelist_${uid}_0_${i}.html`).catch(console.error)
    let $ = cheerio.load(list)
    $('.articleList a[title]').each((i, el) => {
      let href = $(el).attr('href')
      if (isUrl(href)) urls.push(href)
    })
    if (i === 1) {
      page = ($('span[style]').text().match(/\d+/) || [0])[0] // 总页数
      data.title = $('title').text().split('_')[1]  // 博客标题
      data.link = $('.blogtitle a').attr('href')    // 博客链接
    }
  } while (++i <= page)

  // 遍历博文地址，抽取博文内容（标题、正文、时间、分类、图片、原文链接）
  for (let link of urls) {
    let post = await htmlDownloader(link).catch(console.error)
    let $ = cheerio.load(post, {decodeEntities: false})
    let title = $('.titName').text()       // 博文标题
    let date = $('.time.SG_txtc').text().replace(/(\(|\))/g, '')   // 博文发布时间
    let cate = $('.blog_class a').text()      // 博文分类
    let tags = []
    let content = ''
    // 有2种博文页面，根据title判断
    if (title) {
      content = $('div.articalContent').html()
    } else {
      title = $('.h1_tit').text()
      content = $('div.BNE_cont').html()
    }
    if (content) {
      // 抽取正文内容中的图片地址，并替换为本地图片地址
      content = content
        .replace(/<(p|span|td)[^>]*/gi, '<$1')        // 去掉p、span、td等标签的属性
        .replace(/\n?<\/?(span|wbr|br)[^>]*>\n?/gi, '')   // 去掉span、wbr、br等无用标签
        .replace(/<a[^>]*><\/a>/gi, '')
        .replace(/<img[^>]*real_src="([^"]*)"([^>]*)>/gi, (m, url, b) => {
          url = url.replace(/&amp;/gi, '&');
          let name = path.parse(urlParse(url).pathname).base
          if (url.indexOf('http') == 0) {
            if (!data.imgs.find(it => it.url === url)) {
              data.imgs.push({name, url, link, title})
            }
            return `<img src="./imgs/${name}"${b}>`
          } else {
            return ''
          }
        })
        .replace(/<a[^>]*>(<img[^>]*>)<\/a>/gi, '$1')
        .trim()
    } else {
      content = '很抱歉,该文章已经被加密!'
    }

    // 抽取博客的标签
    $('.blog_tag h3 a').each(function() {
      tags.push($(this).text())
    })

    data.post.push({title, date, cate, tags, link, content})
  }

  // 返回抽取的数据
  return data
}
