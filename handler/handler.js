var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var heroModel = require('../model/HeroModel');
var querystring = require('querystring');

module.exports = {
  getIndexPage(req, res) { // 获取首页页面
    heroModel.getAllHeros(function (err, heros) {
      if (err) throw err;
      res.render('index', { heros: heros });
    });
  },
  getAddPage(req, res) { // 获取添加英雄页面
    res.render('add');
  },
  addHero(req, res) { // 添加英雄到数据列表中
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 设置编码方式
    form.uploadDir = path.join(__dirname, '../', "/img"); // 设置上传路径
    form.keepExtensions = true; // 设置保留扩展名
    form.parse(req, function (err, fields, files) { // 解析表单内容
      fields.id = 0;
      fields.avatar = path.join('/img', path.basename(files.avatar.path));

      heroModel.getAllHeros(function (err, heros) {
        if (err) throw err;
        // 获取最新的Id值
        heros.forEach(item => {
          if (item.id > fields.id) {
            fields.id = item.id;
          }
        });
        // 为最大的Id值+1，得到的就是最新的Id值
        fields.id += 1;
        // 保存英雄信息
        heroModel.addHero(fields, function (err, result) {
          if (err) throw err;
          res.json({ err_code: 0 });
        });
      });
    });
  },
  showHeroInfo(req, res) { // 展示英雄信息
    var id = req.query.id;
    heroModel.getHeroById(id, function (err, hero) {
      if (err) throw err;
      res.render('info', { hero: hero });
    });
  },
  showEditPage(req, res) { // 展示编辑英雄页面
    var id = req.query.id;
    heroModel.getHeroById(id, function (err, hero) {
      if (err) throw err;
      res.render('edit', { hero: hero });
    });
  },
  uploadPreviewImage(req, res) { // 上传预览图片
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 设置编码方式
    form.uploadDir = path.join(__dirname, '../', "/img"); // 设置上传路径
    form.keepExtensions = true; // 设置保留扩展名
    form.parse(req, function (err, fields, files) { // 解析表单内容
      var filepath = path.join('/img/', path.basename(files.avatar.path));
      res.json({
        err_code: 0,
        previewImagePath: filepath
      });
    });
  },
  updateHero(req, res) { // 更新英雄信息
    var dataStr = '';
    // 通过 data 事件来接受客户端发送过来的表单内容
    req.on('data', function (chunk) {
      dataStr += chunk;
    });
    // 当出发 end 事件的时候，可以对传递进来的数据进行相关操作
    req.on('end', function () {
      var hero = querystring.parse(dataStr);
      // 更新英雄信息
      heroModel.updateHero(hero, function (err, result) {
        if (err) throw err;
        if (result) {
          // 重新获取最新的英雄数据
          heroModel.getAllHeros(function (err, heros) {
            if (err) throw err;
            // 通过 302 重定向展示最新的英雄数据
            res.writeHeader(302, {
              'Location': '/'
            });
            // 【注意：】在每次发往客户端的内容写完之后，一定要使用 res.end() 来结束写入的动作，此时才能完成服务端相应的过程
            res.end();
          });
        }
      });
    })
  }
}