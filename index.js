#!/usr/bin/env node
let fs = require('fs');
let ejs = require('ejs');
let urlParse = require('url').parse;
let path = require('path');
let zenio = require('zenio');
let cheerio = require('cheerio');
let mkdirp = require('mkdirp');
let isUrl = require('is-url');
let join = path.join;
let headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'};
let blogDir = './blog';
let argv = require('yargs')
  .option('u', {
    alias : 'uid',
    demand: false,
    describe: '新浪博客作者的uid',
    type: 'number'
  })
  .option('c', {
    alias : 'create',
    demand: false,
    describe: '新浪博客数据文件',
    type: 'string'
  })
  .usage('Usage: dature [options]')
  .example('dature -u 1234567890')
  .help('h')
  .alias('h', 'help')
  .epilog('@copyright 2017 junyiz')
  .argv;

async function fetch(uid) {
  let blogUrl = `http://blog.sina.com.cn/s/articlelist_${uid}_0_1.html`;
  let data = {urls: [], blog: [], imgs: {}};
  let addUrl = $ => {
    $('.articleList a[title]').each((i, el) => {
      let href = $(el).attr('href');
      if (isUrl(href)) data.urls.push(href);
    });
  };

  //抓取博客的URL
  let list = await zenio.get(blogUrl, null, headers);
  let $ = cheerio.load(list);
  addUrl($);
  let page = $('span[style]').text().match(/\d+/)[0]; //总页数
  data.title = $('title').text().split('_')[1];
  data.link = $('.blogtitle a').attr('href');
  for (let i = 2; i <= page; i++) {
    let list = await zenio.get(blogUrl.replace(/1.html/, i + '.html'), null, headers);
    let $ = cheerio.load(list);
    addUrl($);
  }

  //抓取博客
  for (let i = 0; i < data.urls.length; i++) {
    let link = data.urls[i];
    let post = await zenio.get(link, null, headers);
    let $ = cheerio.load(post, {decodeEntities: false});
    let title = $('.artical .titName').text();
    let date = $('.artical .time.SG_txtc').text().replace(/(\(|\))/g, '');
    let cate = $('.blog_class a').text();
    let content = $('div.articalContent').html()
      .replace(/<(p)[^>]*/gi, '<$1')
      .replace(/\n?<\/?(span|font)[^>]*>\n?/gi, '')
      .replace(/<a[^>]*><\/a>/gi, '')
      .replace(/<img[^>]*real_src="([^"]*)"([^>]*)>/gi, (m, a, b) => {
        a = a.replace(/&amp;\d*/gi, '');
        let base = path.parse(urlParse(a).pathname).base;
        data.imgs[base] = a;
        return `<img src="${base}"${b}>`;
      })
      .replace(/<a[^>]*>(<img[^>]*>)<\/a>/gi, '$1')
      .trim();
    data.blog.push({title, date, cate, link, content});
  }

  //写入数据
  fs.writeFileSync(join(blogDir, 'data.json'), JSON.stringify(data), 'utf8');

  //抓取图片
  zenio.setOptions({encoding: 'binary'});
  for (let i in data.imgs) {
    let img;
    try {
      img = await zenio.get(data.imgs[i], null, headers);
    } catch(e) {
      continue;
    }
    img && fs.writeFileSync(join(blogDir, i), img, 'binary');
  }

  return data;
}

//生成HTML
function createHtml(data) {
  let tplIndex = fs.readFileSync(__dirname + '/tpl/index.html', 'utf8');
  let tplBlog = fs.readFileSync(__dirname + '/tpl/blog.html', 'utf8');
  //index.html
  fs.writeFileSync(join(blogDir, 'index.html'), ejs.render(tplIndex, data), 'utf8');
  //blog[n].html
  for (let i = 0; i < data.blog.length; i++) {
      fs.writeFileSync(join(blogDir, `blog${i + 1}.html`), ejs.render(tplBlog, data.blog[i]), 'utf8');
  }
}

if (argv.u) {
  mkdirp.sync(blogDir);
  fetch(argv.u).then(data => {
   if (argv.c) {
      createHtml(data);
   }
  }, console.log);
} else if (argv.c) {
  let dataFile = join(process.cwd(), argv.c || './blog/data.json');
  blogDir = path.dirname(dataFile);
  mkdirp.sync(blogDir);
  createHtml(require(dataFile));
}
