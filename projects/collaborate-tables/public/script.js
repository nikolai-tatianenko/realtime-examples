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

  /**
   * Create or update the tooltip element.
   */
  function createTooltip () {
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

  function updateUserName () {
    const usernameInput = document.querySelector('input[name=username]');
    usernameInput.value = nickname;
    usernameInput.addEventListener('input', function (event) {
      nickname = event.target.value;
      console.log({ nickname });
    });

  }
})();
