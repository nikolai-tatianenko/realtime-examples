const http = require('http').createServer();

const io = require('socket.io')(http, {
  cors: { origin: '*' },
});
io.on('connection', (socket) => {
  console.log('a user connected');
  // const messages = [];
  socket.on('message', ({ username="<unknown username>", message ="<empty message>"}) => {
    // messages.push(message);

    io.emit('message', `${username} : "${message}"`);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));


 
