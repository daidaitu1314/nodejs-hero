var fs = require('fs');
var path = require('path');
var handler = require('../handler/handler');
var url = require('url');

module.exports = function (req, res) {
  // 解析URL地址为一个对象
  var urlObj = url.parse(req.url, true);
  // 将查询参数添加到req对象的自定义query属性上
  req.query = urlObj.query;
  var urlPath = urlObj.pathname;
  var method = req.method.toLowerCase();
  if (method === "get" && urlPath === '/') { // 请求首页
    handler.getIndexPage(req, res);
  } else if (method === "get" && urlPath === "/add") { // 访问添加页面
    handler.getAddPage(req, res);
  } else if (method === 'post' && urlPath === '/add') { // 添加英雄信息
    handler.addHero(req, res);
  } else if (method === 'get' && urlPath === '/showinfo') { // 查看英雄信息页面
    handler.showHeroInfo(req, res);
  } else if (method === 'get' && urlPath === '/edithero') { // 显示编辑英雄页面
    handler.showEditPage(req, res);
  } else if (method === 'post' && urlPath === '/uploadPreviewImage') { // 上传预览图片
    handler.uploadPreviewImage(req, res);
  } else if (method === 'post' && urlPath === '/updateHero') { // 更新英雄信息
    handler.updateHero(req, res);
  } else if (urlPath.indexOf('/img/') === 0 || urlPath.indexOf('/node_modules/') === 0) { // 请求静态资源
    fs.readFile(path.join(__dirname, '../', urlPath), function (err, data) {
      res.end(data);
    });
  } else { // 返回404内容
    res.end('<h1>404 Not found.</h1>');
  }
}