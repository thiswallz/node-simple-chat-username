var express = require("express");
var bodyParser = require("body-parser");
var todoController = require('./controllers/todoController');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use('/assets', express.static('public'));


app.get('/', function(req, res){
    res.render('index');
})

todoController(app);

var nsp = io.of('/chat'),
nicknames = {};

nsp.on('connection', function(socket){
    socket.on('chat message', function (msg) {
        nsp.emit('chat message', "-"+ socket.nickname + " : " + msg);
    });

    socket.on('nickname', function (nick, fn) {
        if (nicknames[nick]) {
            fn(true);
        } else {
            fn(false);
            nicknames[nick] = socket.nickname = nick;
            socket.broadcast.emit('announcement', nick + ' connected');
            nsp.emit('nicknames', nicknames);
        }
    });

    socket.on('disconnect', function () {
        if (!socket.nickname) return;

        delete nicknames[socket.nickname];
        socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
        socket.broadcast.emit('nicknames', nicknames);
    });

});

   

server.listen(3000, function(){
    console.log('listening on *:3000');
})
