const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use('/assets', express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

const nsp = io.of('/chat'),
  nicknames = {};

nsp.on('connection', socket => {
  socket.on('chat message', msg => {
    nsp.emit('chat message', '-' + socket.nickname + ' : ' + msg);
  });

  socket.on('nickname', (nick, fn) => {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', nick + ' connected');
      nsp.emit('nicknames', nicknames);
    }
  });

  socket.on('disconnect', () => {
    if (!socket.nickname) return;
    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
