const { createServer } = require('http');
const io = require('socket.io')(createServer(), { cors: { origin: '*' } });

const chatHistory = [];

io.on('connection', (socket) => {
  // Add a new "loadHistory" event to send the chat history to the client
  socket.emit('loadHistory', chatHistory);

  socket.on('message', ({ username = '<unknown username>', message = '<empty message>' }) => {
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

const port = process.env.PORT || 8080;
io.listen(port, () => console.log(`listening on http://localhost:${port}`));
