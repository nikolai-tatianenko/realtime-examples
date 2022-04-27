const socket = io('ws://localhost:8080');
function handleSubmit () {
  // Get text values.
  const username = document.querySelector('input[name="username"]').value;
  const message = document.querySelector('input[name="message"]').value;

  // Clear data.
  document.querySelector('input[name="message"]').value = '';

  socket.emit('message', { username, message });
}

/**
 * Handle Enter.
 */
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
};

socket.on('message', text => {
  const el = document.createElement('li');
  el.innerHTML = text;
  document.querySelector('ul').appendChild(el);

});
