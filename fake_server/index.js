/*
 * 参考: [Node.js:使用hook+shell+git进行自动化构建](https://smallpath.me/post/Node.js:%E4%BD%BF%E7%94%A8git%E5%92%8Cwebhook%E8%BF%9B%E8%A1%8C%E8%87%AA%E5%8A%A8%E5%8C%96%E6%9E%84%E5%BB%BA)
 * */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// 挂载中间件, 解析请求中的json数据
// git oschina发来的应该是json格式数据
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

app.all('/bootstrap-table-addrbar', function(req, res, next){
    // 允许跨域请求
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.status(200).send('{"test": "options ok"}');
        return;
    }
    next();
});

// 创建100个数据.
var data = function(){
    var _data = [];
    for(var i = 0; i < 100; i ++){
        _data.push({
            id: i,
            name: 'name ' + i,
            price: '$' + i
    	});
    }
    return _data;
}();

app.get('/bootstrap-table-addrbar', function(req, res, next){
    console.log(req.query);
    var limit = req.query.limit || 20;
    var offset = req.query.offset || 0;
    var sort = req.query.sort || 'id';
    var order = req.query.order || 'asc';
    var search = req.query.search || '';
    limit = parseInt(limit);
    offset = parseInt(offset);

    var result = {rows: [], total: 100};
    for(var i = 0; i < limit; i ++){
        result.rows.push(data[offset + i]);
    }

    res.json(result);
});

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Webhook handler started at http://%s:%s...', host, port);
});
