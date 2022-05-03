const http = require('http').createServer();

const io = require('socket.io')(http, {
  cors: { origin: '*' },
});

const chatHistory = [];

io.on('connection', (socket) => {
  // Add a new "loadHistory" event to send the chat history to the client
  socket.emit('loadHistory', chatHistory);
  socket.on('message', ({ username="<unknown username>", message ="<empty message>"}) => {
    // Add the new message to the chat history
    chatHistory.push(`${username}: ${message}`);

    // Emit the new message to all connected clients
    io.emit('message', `${username}: ${message}`);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));


 
