// http协议模块
var http = require('http');
// url解析模块
var url = require('url');
// 文件系统模块
var fs = require('fs');
// 路径解析模块
var path = require('path');
var server = http.createServer(function (request, response) {
    console.log('有人访问了服务器')

})

server.listen(3000, '0.0.0.0')