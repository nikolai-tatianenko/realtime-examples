/**
 * Initializes the application and sets up the WebSocket connection.
 */
function initApplication() {
  const table = document.querySelector('#table');
  const cells = {};
  // URL of the WebSocket server.
  const HOST = '127.0.0.1';
  const PORT = '8000';
  const API_URL = `ws://${HOST}:${PORT}/`;
  const socket = new WebSocket(API_URL);
  // Generate user name
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  let nickname = `User #${randomNumber}`;
  let tooltip;
  let sessionId;

  /**
   * Creates or updates the tooltip element.
   */
  function createTooltip() {
    // Remove existing tooltip if present
    if (tooltip) {
      tooltip.remove();
    }

    // Create new tooltip element
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);
  }

  /**
   * Updates the username input field and event listener.
   */
  function updateUserName() {
    const usernameInput = document.querySelector('input[name=username]');
    usernameInput.value = nickname;
    usernameInput.addEventListener('input', function (event) {
      nickname = event.target.value;
      console.log({ nickname });
    });
  }

  createTooltip();
  updateUserName();

  socket.onopen = function () {
    const message = {
      nickname: nickname,
      action: 'get_session_id',
    };
    socket.send(JSON.stringify(message));
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.session_id) {
      // Set the base username using the session ID
      nickname = `User${data.session_id}`;
      console.log('Base username:', nickname);
    }
    const cell = cells[data.cell];
    updateCellText(cell, data);

    const cellPosition = calculateCellPosition(cell);
    updateTooltipText(`${data.author}`);
    tooltip.style.top = `${cellPosition.top + 10}px`;
    tooltip.style.left = `${cellPosition.left}px`;
  };
})();
