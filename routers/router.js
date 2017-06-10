var fs = require('fs');
var path = require('path');
var handler = require('../handler/handler');

module.exports = function (req, res) {
  var url = req.url;
  var method = req.method.toLowerCase();
  if (method === "get" && url === '/') { // 请求首页
    handler.getIndexPage(req, res);
  } else if (method === "get" && url === "/add") { // 访问添加页面
    handler.getAddPage(req, res);
  } else if (method === 'post' && url === '/add') { // 添加英雄信息
    handler.addHero(req, res);
  } else if (url.indexOf('/img/') === 0 || url.indexOf('/node_modules/') === 0) { // 请求静态资源
    fs.readFile(path.join(__dirname, '../', url), function (err, data) {
      res.end(data);
    });
  } else { // 返回404内容
    res.end('<h1>404 Not found.</h1>');
  }
}