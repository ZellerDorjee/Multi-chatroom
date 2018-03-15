var express = require('express'), //引入express模块
    app = express(),//创建实例
    server = require('http').createServer(app),    
    io = require('socket.io')(server, { wsEngine: 'ws' }),  //解决ws慢的问题
    users = [];//当前在线数组
     
server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
  //socket 部分

  // 房间名单
var roomInfo = {};

io.on('connection',function(socket){
    let room='',
        token='';
    //join room
    socket.on('join',function(data){
        let da=JSON.parse(data)
        socket.nickname=da.username;
        room=da.roomId;
        token=socket.id;
        socket.join(room);
            // 将用户昵称加入房间名单中
        if (roomInfo[room] == undefined) {
            roomInfo[room] = [];
        }
        let index = roomInfo[room].indexOf(token);
        if (index == -1) {
            roomInfo[room].push(token);
        }
        console.log(roomInfo[room].length)
        socket.emit('joinSuccess',roomInfo[room].length);
        socket.emit('test')
        io.to(room).emit('someJoin',roomInfo[room].length);
    })
    //leave room
    socket.on('leave',function(data){
        if(room==''){
            socket.emit('leaveSuccess')
        }else {
            socket.leave(room);
            if(roomInfo[room]){
                var index = roomInfo[room].indexOf(token);
                if (index !== -1) {
                    roomInfo[room].splice(index, 1);
                }
            }
            socket.emit('leaveSuccess')
            io.to(room).emit('someLeave',roomInfo[room].length);
        }
        
    })
    //new message get
    socket.on('postMsg', function(msg, status) {
        socket.to(room).emit('newMsg',msg, status);
    });
    //detect is at room
    socket.on('detect', function(data) {
        let da=JSON.parse(data)
        if(room!=da.roomId){
            socket.nickname=da.username;
            room=da.roomId;
            socket.join(room);
                // 将用户昵称加入房间名单中
            if (!roomInfo[room]) {
                roomInfo[room] = [];
            }
            let index = roomInfo[room].indexOf(token);
            if (index == -1) {
                roomInfo[room].push(token);
            }
            socket.emit('joinSuccess',roomInfo[room].length);
            io.to(room).emit('someJoin',roomInfo[room].length);
        }
        socket.emit('joinSuccess',roomInfo[room].length)
    });
    //user leaves
     socket.on('disconnect', function() {
        if(room!==''){
            socket.leave(room);
            if(roomInfo[room]){
                var index = roomInfo[room].indexOf(token);
                if (index !== -1) {
                    roomInfo[room].splice(index, 1);
                }
            }
            socket.emit('leaveSuccess')
            io.to(room).emit('someLeave',roomInfo[room].length);
        }
    });
    //new image get
    // socket.on('img', function(imgData, color) {
    //     socket.to(room).emit('newImg', socket.nickname, imgData, color);
    // });
    //new voice get
    // socket.on('voice', function(voice, color) {
    //     socket.to(room).emit('newVoice', socket.nickname, voice, color);
    // });
    //user login
    // socket.on('login',function(nickname){
    //     console.log(nickname+'try login')
    //     if(users.indexOf(nickname)>-1){
    //         socket.emit('nickExisted')
    //     }else {
    //         console.log(nickname+'login success')
    //         users.push(nickname)
    //         socket.nickname=nickname;
    //         socket.userIndex=users.length;
    //         socket.emit('loginSuccess');
    //         io.sockets.emit('system', nickname, users.length, 'login');
    //     }
    // })
})