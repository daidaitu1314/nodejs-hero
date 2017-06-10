var http = require('http');
var render = require('./render');
var router = require('./routers/router');

// 创建server服务器对象
var server = http.createServer();

// 预先指定server的request事件，用来监听客户端的请求
server.on('request', function (req, res) {
    render(res);
    router(req, res);
});

// 指定监听端口号并启动服务器
server.listen(3000, function () {
    console.log('server running at http://127.0.0.1:3000');
});