var template = require('art-template');
var path = require('path');
// 修改原始语法的定界符
template.defaults.rules[0].test = /<\?(#?)((?:==|=#|[=-])?)([\w\W]*?)(-?)\?>/;

module.exports = function (res) {
  // 为 res 对象绑定自定义的 render 函数，调用时候需要传递文件名和要渲染的数据对象
  res.render = function (filename, data) {
    // 使用art-template来渲染页面HTMl
    var html = template(path.join(__dirname, './views/' + filename + '.html'), data || {});
    // 将渲染出来的HTMl发送到页面上显示
    res.end(html);
  }

  // 将数据对象转成JSON字符串返回
  res.json = function (dataObj) {
    res.end(JSON.stringify(dataObj));
  }
}