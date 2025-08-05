const fs = require('fs')
const { request, stream } = require('undici')

// const files = fs.readdirSync('./blog-1274634973/imgs/')

// let n = 0

// files.map((file, index) => {
//   console.log('->', n++)
//   fs.readFile('./blog-1274634973/imgs/' + file, (err, text) => {
//     console.log('======>', n--)
//   })
// })

stream({
  origin: 'http://s1.sinaimg.cn/large/001ogeMBzy7TmphHjUTab',
  method: 'GET',
  headers: {
    'User-Agent' :'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'referer': 'http://blog.sina.com.cn/s/blog_4bf962dd0102z4p9.html'
  },
  throwOnError: true
}, {
  opaque: fs.createWriteStream('x.png')
}, ({ opaque }) => opaque)

