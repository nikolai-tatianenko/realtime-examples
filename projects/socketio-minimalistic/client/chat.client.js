const socket = io('ws://localhost:8080');
const chatHistory = document.querySelector('.chat-history');
const usernameInput = document.querySelector('input[name="username"]');
const messageInput = document.querySelector('input[name="message"]');
const sendButton = document.querySelector('button[name="send"]');

// Prepare and append chat item to the chat history.
function prepareChatItem (message) {
  const el = document.createElement('li');
  el.innerHTML = prepareChatItemMessage(message);
  el.classList.add('chat-item');
  chatHistory.appendChild(el);
}

// Prepare chat item message.
function prepareChatItemMessage ({ username, message, dateTime }) {
  console.log({ username, message, dateTime });
  return `${username}: ${message} (${dateTime})`;
}

// Load conversation history.
socket.on('loadHistory', (history) => {
  history.forEach((message) => {
    prepareChatItem(message);
  });
});

// Handle incoming message.
socket.on('message', (message) => {
  prepareChatItem(message);
});

// Handle form submission.
function handleSubmit () {
  const username = usernameInput.value;
  const message = messageInput.value;
  messageInput.value = '';

  socket.emit('message', { username, message });
}

// Submit on Enter key press.
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    handleSubmit();
  }
});

// Submit on button click.
sendButton.onclick = handleSubmit;
