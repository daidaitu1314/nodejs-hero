var fs = require('fs');
var path = require('path');

// 获取所有的英雄信息
function getAll(callback) {
  fs.readFile(path.join(__dirname, './data.json'), 'utf-8', function (err, dataStr) {
    if (err) return callback(err);
    // 解析英雄数组
    var heros = JSON.parse(dataStr);
    callback(null, heros);
  });
}

// 将数据写入到文件中
function writeDataToFile(data, callback) {
  fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data, null, '  '), function (err) {
    if (err) return callback(err);
    callback(null, true);
  });
}

module.exports = {
  getAllHeros(callback) { // 获取所有英雄信息
    getAll(callback);
  },
  getHeroById(id, callback) { // 根据Id获取英雄信息
    getAll(function (err, heros) {
      if (err) return callback(err);
      // 使用数组的 some 方法，得到结果之后，立即退出循环！来提高循环的效率。
      heros.some(hero => {
        if (hero.id === parseInt(id)) {
          callback(null, hero);
          return true;
        }
      });
    });
  },
  addHero(hero, callback) { // 添加英雄
    getAll(function (err, heros) {
      if (err) return callback(err);
      heros.push(hero);
      writeDataToFile(heros, callback);
      /*fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(heros, null, '  '), function (err) {
        if (err) return callback(err);
        callback(null, true);
      });*/
    });
  },
  updateHero(hero, callback) { // 更新英雄信息
    hero.id = parseInt(hero.id);
    getAll(function (err, heros) {
      if (err) return callback(err);
      heros.some(item => {
        if (item.id === hero.id) {
          for (key in hero) {
            item[key] = hero[key];
          }
          writeDataToFile(heros, callback);
          return true;
        }
      });
    });
  },
  deleteHeroById(id, callback) { // 根据id删除英雄信息
    getAll(function (err, heros) {
      if (err) return callback(err);
      // 找到id相同的那个英雄
      heros.some((item, i) => {
        if (item.id === parseInt(id)) {
          heros.splice(i, 1);
          writeDataToFile(heros, callback);
          return true;
        }
      });
    });
  }
}