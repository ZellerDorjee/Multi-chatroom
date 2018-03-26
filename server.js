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
        socket.emit('joinSuccess',roomInfo[room].length);
        socket.emit('test')
        io.to(room).emit('someJoin',roomInfo[room].length);
    })
    //leave room
    socket.on('leave',function(data){
        if(room==''){
            socket.emit('leaveSuccess')
        }else {
            console.log(socket.nickname+'leave room')
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
    //delete message
    socket.on('recallMsg', function(id, type) {
        socket.to(room).emit('deleteMsg',id, type);
    });
})