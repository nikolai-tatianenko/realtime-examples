require('dotenv').config();

const { createServer } = require('http');
const io = require('socket.io')(createServer(), { cors: { origin: '*' } });
const fs = require('fs');
const path = require('path');

const CHAT_ARCHIVE_FILE_PATH = process.env.CHAT_ARCHIVE_FILE_PATH || './data/chatArchive.json';

// Load chat history from file, or create an empty array if file doesn't exist
let chatHistory: any[] = [];
const preparedFile = path.resolve(__dirname, CHAT_ARCHIVE_FILE_PATH);

try {
  if (fs.existsSync(preparedFile)) {
    chatHistory = JSON.parse(fs.readFileSync(preparedFile, 'utf8'));
  } else {
    console.log(`Chat archive file not found at ${CHAT_ARCHIVE_FILE_PATH}`);
    console.log(`Creating new chat archive file at ${CHAT_ARCHIVE_FILE_PATH}`);
    fs.writeFileSync(preparedFile, JSON.stringify(chatHistory));
  }
} catch (err) {
  console.log(`Error loading chat history from file: ${err.message}`);
  console.log(`Creating new chat archive file at ${preparedFile}`);
  fs.writeFileSync(preparedFile, JSON.stringify(chatHistory));
}

const server: Server = createServer();
const io: SocketIOServer = new SocketIOServer(server, { cors: { origin: '*' } });

io.on('connection', (socket: Socket) => {
  // Send the chat history to the connected client
  socket.emit('loadHistory', chatHistory);

  socket.on('message', ({ username = '<unknown username>', message = '<empty message>' }) => {
    // Add the new message to the chat history
    const currentDateTime = new Date().toLocaleString();
    const chatItemObject = { username, message, dateTime: currentDateTime };

    chatHistory.push(chatItemObject);

    // Write updated chat history to file
    fs.writeFile(preparedFile, JSON.stringify(chatHistory), (err) => {
      if (err) {
        console.log(`Error writing chat history to file: ${err.message}`);
      }
    });

    // Emit the new message to all connected clients
    io.emit('message', chatItemObject);
  });
});

const port: string | number = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
