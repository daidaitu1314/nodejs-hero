var http = require('http');
var fs = require('fs');
var path = require('path');
var render = require('./render');
var formidable = require('formidable');

// 创建server服务器对象
var server = http.createServer();

// 预先指定server的request事件，用来监听客户端的请求
server.on('request', function (req, res) {
    render(res);
    var url = req.url;
    var method = req.method.toLowerCase();
    if (method === "get" && url === '/') { // 请求首页
        // 读取数据
        fs.readFile(path.join(__dirname, './data.json'), 'utf-8', function (err, dataStr) {
            // 解析英雄数组
            var heros = JSON.parse(dataStr);
            res.render('index', { heros: heros });
        });
    } else if (method === "get" && url === "/add") { // 访问添加页面
        res.render('add');
    } else if (method === 'post' && url === '/add') { // 添加英雄信息
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8'; // 设置编码方式
        form.uploadDir = path.join(__dirname, "/img"); // 设置上传路径
        form.keepExtensions = true; // 设置保留扩展名
        form.parse(req, function (err, fields, files) { // 解析表单内容
            fields.id = 1;
            fields.avatar = path.join('/img', path.basename(files.avatar.path));
            // 读取文本文件中的数据
            fs.readFile(path.join(__dirname, './data.json'), 'utf-8', function (err, dataStr) {
                if (err) throw err;
                var heros = JSON.parse(dataStr);
                heros.push(fields);
                // 将最新的英雄列表写入到文件中
                fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(heros), function (err) {
                    if (err) throw err;
                    res.json({ err_code: 0 });
                });
            });
        });
    } else if (url.indexOf('/img/') === 0 || url.indexOf('/node_modules/') === 0) { // 请求静态资源
        fs.readFile(path.join(__dirname, url), function (err, data) {
            res.end(data);
        });
    } else {
        res.end('<h1>404 Not found.</h1>');
    }
});

// 指定监听端口号并启动服务器
server.listen(3000, function () {
    console.log('server running at http://127.0.0.1:3000');
});