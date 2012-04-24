//var app = require('http').createServer(handler);
var app = require('express').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8080);

//function handler (req, res) {
//  fs.readFile(__dirname + '/index.html',
//  function (err, data) {
//    if (err) {
//      res.writeHead(500);
//      return res.end('Error loading index.html');
//    }
//
//    res.writeHead(200);
//    return res.end(data);
//  });
//}

app.get('/',function(req, resp){
  resp.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('msg', 'Welcome!');
  socket.on('message',function(data){
    socket.get('nickname', function(err, nickname){
      if (err) {
        socket.emit('msg', err);
      } else if (nickname != null) {
        socket.broadcast.emit('msg', nickname + ' says ' + data);
        socket.emit('msg', 'Message sent.');
      } else {
        socket.emit('msg', 'I have no memory of you.');
      }
    });
  });
  socket.on('hello', function (nickname) {
    socket.set('nickname',nickname);
    socket.emit('msg', 'Nickname set to '+nickname);
  });
  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});
