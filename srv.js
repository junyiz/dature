import http from "http";
import { parse } from "url";
// import { join } from 'path'
import fetch from "./lib/fetch.js";
import fs from "fs";
import util from "util";
const writeFile = util.promisify(fs.writeFile);

export const parseSearch = (search) => {
  return search.split("&").reduce((acc, cur) => {
    const [key, val] = cur.split("=");
    if (key) acc[key] = decodeURIComponent(val);
    return acc;
  }, {});
};

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parse(req.url);
  if (pathname != "/api/sina") return;

  const { u, c, re } = parseSearch(query);
  if (!u && !c) return;

  const uid = u;
  const www = process.env.ROOT || "/var/www/html";
  const dir = `${www}/blog/${uid}`;
  const zipFile = `${www}/blog/${uid}.zip`;
  const cookie = c.replace(/(NowDate|BLOG_TITLE|mblog_userinfo)[^;]*;/g, "");
  const logfile = `./logs/${uid}.` + Math.random();
  writeFile(logfile, `${cookie}\n\n`, "utf8");

  // 设置响应头以启用 SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  console.log = (msg) => {
    console.info(msg);
    res.write(`data: ${msg}\n\n`);
    fs.appendFile(logfile, `${msg}\n`, (err) => {
      if (err) console.error(err);
    });
  };

  // 如果用户选择重新备份，删除旧数据
  if (re === "1") {
    try {
      // 删除博客目录
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
        console.log(`已删除目录: ${uid}`);
      }

      // 删除压缩文件
      if (fs.existsSync(zipFile)) {
        fs.unlinkSync(zipFile);
        console.log(`已删除压缩文件: ${uid}.zip`);
      }
    } catch (err) {
      console.log(`删除旧备份失败: ${err.message}`);
    }
  }

  fetch(dir, uid, cookie);
});

server.listen(3000);
