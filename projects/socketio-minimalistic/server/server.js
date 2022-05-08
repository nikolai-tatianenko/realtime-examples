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
    const currentDateTime = new Date().toLocaleString();
    const chatItemObject = { username, message, dateTime: currentDateTime };
    const chatItemFormatter = ({ username, message, dateTime }) => {

      return `${username}: ${message} (${dateTime})`;
    };
    chatHistory.push(chatItemObject);

    // Emit the new message to all connected clients
    io.emit('message', chatItemObject);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));


 
