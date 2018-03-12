var express = require('express'), //引入express模块
    socketLogic = require('./socket.js'),
    app = express(),//创建实例
    server = require('http').createServer(app),    
    io = require('socket.io')(server, { wsEngine: 'ws' })//解决ws慢的问题
    users = [],//当前在线数组
    i=0,//登入用户记录
    fss = require('./fs-async.js');
     
const filePath = `${__dirname}/user.json`;

app.use('/', express.static(__dirname + '/src')); //指定静态HTML文件的位置
server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
  //socket 部分
io.on('connection',function(socket){
    console.log('a user connected',socket.id);
    let room;
    //接受并处理客户端发送的foo事件
    socket.on('join',function(data){
        console.log('join room',data)
        room=data;
        socket.join(room);
        socket.emit('joinSuccess')
        io.to(room).emit('someJoin',socket.nickname);
    })
    socket.on('leave',function(data){
        console.log('leave room',data)
        socket.leave(room);
        io.to(room).emit('someLeave',socket.nickname);
    })
    //user login
    socket.on('login',function(nickname){
        console.log(nickname+'try login')
        if(users.indexOf(nickname)>-1){
            //name occupation
            socket.emit('nickExisted')
        }else {
            console.log(nickname+'login success')
            users.push(nickname)
            socket.nickname=nickname;
            socket.userIndex=users.length;
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
            socketLogic.socketHander.saveUserSocketId(i, nickname)
            i++;
        }
    })
     //user leaves
     socket.on('disconnect', function() {
        if (socket.nickname != null) {
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
        console.log('user disconnect')
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.to(room).emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.to(room).emit('newImg', socket.nickname, imgData, color);
    });
})