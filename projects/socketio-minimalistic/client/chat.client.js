const socket = io('ws://localhost:8080');

/*
 * Load conversation history
 */
socket.on('loadHistory', (history) => {
  const chatHistory = document.querySelector('.chat-history');

  history.forEach((message) => {
    const el = document.createElement('li');
    el.innerHTML = message;
    chatHistory.appendChild(el);
  });
});

socket.on('message', text => {
  const chatHistory = document.querySelector('.chat-history');
  const el = document.createElement('li');
  el.innerHTML = text;
  chatHistory.appendChild(el);
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
