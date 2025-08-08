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

const server = http.createServer((req, res) => {
  const { pathname, query } = parse(req.url);
  if (pathname != "/api/sina") return;

  const { u, c } = parseSearch(query);
  if (!u && !c) return;

  const uid = u;
  const dir = `${process.env.ROOT}/blog/${uid}`;
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

  console.info("dir", dir);
  fetch(dir, uid, cookie);
});

server.listen(3000);
