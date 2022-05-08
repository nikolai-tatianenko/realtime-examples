const socket = io('ws://localhost:8080');

function prepareChatItem (chatHistory, message) {
  const el = document.createElement('li');
  el.innerHTML = prepareChatItemMessage(message);
  chatHistory.appendChild(el);
}

function prepareChatItemMessage ({ username, message, dateTime }) {
  console.log({ username, message, dateTime });
  return `${username}: ${message} (${dateTime})`;
}

/*
 * Load conversation history
 */
socket.on('loadHistory', (history) => {
  const chatHistory = document.querySelector('.chat-history');

  history.forEach((message) => {
    prepareChatItem(chatHistory, message);
  });
});

socket.on('message', message => {
  const chatHistory = document.querySelector('.chat-history');
  prepareChatItem(chatHistory, message);
});

function handleSubmit () {
  // Get text values.
  const username = document.querySelector('input[name="username"]').value;
  const message = document.querySelector('input[name="message"]').value;

  // Clear data.
  document.querySelector('input[name="message"]').value = '';

  socket.emit('message', { username, message });
}

document.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    handleSubmit();
  }
});

/**
 * Handle Submit.
 */
document.querySelector('button[name="send"]').onclick = () => {
  handleSubmit();
}
