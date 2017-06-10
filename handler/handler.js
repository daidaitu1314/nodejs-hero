var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

module.exports = {
  getIndexPage(req, res) { // 获取首页页面
    fs.readFile(path.join(__dirname, './data.json'), 'utf-8', function (err, dataStr) {
      // 解析英雄数组
      var heros = JSON.parse(dataStr);
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
      // 读取文本文件中的数据
      fs.readFile(path.join(__dirname, './data.json'), 'utf-8', function (err, dataStr) {
        if (err) throw err;
        var heros = JSON.parse(dataStr);
        // 获取最新的Id值
        heros.forEach(item => {
          if (item.id > fields.id) {
            fields.id = item.id;
          }
        });
        // 为最大的Id值+1，得到的就是最新的Id值
        fields.id += 1;
        heros.push(fields);
        // 将最新的英雄列表写入到文件中
        fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(heros, null, '  '), function (err) {
          if (err) throw err;
          res.json({ err_code: 0 });
        });
      });
    });
  }
}