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

  /**
   * Updates the cell text based on the received data.
   * @param {HTMLElement} cell - The cell element to update.
   * @param {Object} data - The data received from the WebSocket.
   */
  function updateCellText(cell, data) {
    if (data.value) {
      cell.value = data.value;
    }
    if (data.author) {
      cell.dataset.author = data.author;
      cell.setAttribute('title', `${data.author}`);
    }
  }

  /**
   * Updates the tooltip text.
   * @param {string} text - The text to display in the tooltip.
   */
  function updateTooltipText(text) {
    tooltip.textContent = text;
  }

  document.addEventListener('mousemove', function (event) {
    // Handle mousemove event
  });

  /**
   * Calculates the position of the cell relative to the table.
   * @param {HTMLElement} cell - The cell element.
   * @returns {Object} - The position of the cell (top and left offsets).
   */
  function calculateCellPosition(cell) {
    const tableRect = table.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    const cellPosition = {
      top: cellRect.top - tableRect.top,
      left: cellRect.left - tableRect.left,
    };

    return cellPosition;
  }

  /**
   * Handles the keyup event and sends the updated cell data via WebSocket.
   * @param {Event} event - The keyup event.
   */
  function onKeyup(event) {
    const message = {
      cell: event.target.id,
      value: event.target.value,
      author: nickname,
    };
    socket.send(JSON.stringify(message));
  }

  /**
   * Generates the table structure with columns and an initial row.
   * @param {HTMLElement} table - The table element.
   * @param {Array} columns - An array of column names.
   */
  function generateTable(table, columns) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td></td>' +
      columns.map((column) => `<td>${column}</td>`).join('');
    table.appendChild(tr);
  }

  /**
   * Generates a new row in the table.
   * @param {HTMLElement} table - The table element.
   * @param {number} rowIndex - The index of the row.
   * @param {Array} columns - An array of column names.
   */
  function generateRow(table, rowIndex, columns) {
    const tr = document.createElement('tr');

    tr.innerHTML =
      `<td>${rowIndex}</td>` +
      columns.map(
        (column) => `<td><input id="${column}${rowIndex}" type="text"></td>`).
        join('');
    table.appendChild(tr);

    columns.forEach((column) => {
      const cellId = `${column}${rowIndex}`;
      const input = document.getElementById(cellId);
      input.addEventListener('keyup', onKeyup);
      cells[cellId] = input;
    });
  }

  /**
   * Fills the table with columns and rows.
   * @param {HTMLElement} table - The table element.
   */
  function fillTable(table) {
    const COLUMNS = [];
    for (let i = 65; i <= 90; i++) {
      const column = String.fromCharCode(i);
      COLUMNS.push(column);
    }
    const ROWS_COUNT = 100;

    generateTable(table, COLUMNS);

    for (let i = 1; i <= ROWS_COUNT; i++) {
      generateRow(table, i, COLUMNS);
    }
  }

  fillTable(table);
}

// Initialize the application
(function () {
  initApplication();
})();
