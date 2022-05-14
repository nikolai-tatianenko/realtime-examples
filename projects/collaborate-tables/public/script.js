(function () {
  const table = document.querySelector('#table');
  const cells = {};
  const HOST = '127.0.0.1';
  const PORT = '8000';
  const API_URL = `ws://${HOST}:${PORT}/`;
  const socket = new WebSocket(API_URL);
  console.log({ socket });
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  let nickname = `User #${randomNumber}`;
  let tooltip;
  let sessionId;

})();
