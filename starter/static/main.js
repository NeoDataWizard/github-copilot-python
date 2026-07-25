// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
const LEADERBOARD_STORAGE_KEY = 'sudoku-leaderboard';
let puzzle = [];
let elapsedSeconds = 0;
let timerIntervalId = null;
let hintsUsed = 0;
let gameCompleted = false;
let scoreSaved = false;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = formatTime(elapsedSeconds);
  }
}

function stopTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function startTimer() {
  stopTimer();
  timerIntervalId = window.setInterval(() => {
    elapsedSeconds += 1;
    updateTimerDisplay();
  }, 1000);
}

function resetTimer() {
  stopTimer();
  elapsedSeconds = 0;
  updateTimerDisplay();
}

function isValueInConflict(board, row, col, value) {
  if (value === 0) {
    return false;
  }

  for (let idx = 0; idx < SIZE; idx += 1) {
    if (idx !== col && board[row][idx] === value) {
      return true;
    }
    if (idx !== row && board[idx][col] === value) {
      return true;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r += 1) {
    for (let c = startCol; c < startCol + 3; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return true;
      }
    }
  }

  return false;
}

function updateCellValidation(input) {
  if (!input || !(input instanceof HTMLInputElement)) {
    return;
  }

  if (input.disabled || input.classList.contains('prefilled') || input.classList.contains('hinted')) {
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', 'false');
    return;
  }

  const row = parseInt(input.dataset.row, 10);
  const col = parseInt(input.dataset.col, 10);
  const value = input.value ? parseInt(input.value, 10) : 0;
  const board = getBoardState();
  const isInvalid = isValueInConflict(board, row, col, value);

  input.classList.toggle('invalid', isInvalid);
  input.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
}

function handleBoardInput(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.classList.contains('sudoku-cell')) {
    return;
  }

  const sanitizedValue = input.value.replace(/[^1-9]/g, '');
  if (input.value !== sanitizedValue) {
    input.value = sanitizedValue;
  }

  updateCellValidation(input);
}

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  if (!boardDiv.dataset.validationBound) {
    boardDiv.addEventListener('input', handleBoardInput);
    boardDiv.dataset.validationBound = 'true';
  }
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function renderPuzzle(puz) {
  puzzle = puz;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.className = 'sudoku-cell prefilled';
      } else {
        inp.value = '';
        inp.disabled = false;
        inp.className = 'sudoku-cell';
      }
    }
  }
}

function getBoardState() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

function getSelectedDifficulty() {
  const difficultySelect = document.getElementById('difficulty-select');
  return difficultySelect ? difficultySelect.value : 'Medium';
}

function getSelectedDifficultyClues() {
  const difficulty = getSelectedDifficulty();
  switch (difficulty) {
    case 'Easy':
      return 40;
    case 'Hard':
      return 30;
    case 'Medium':
    default:
      return 35;
  }
}

function readLeaderboardScores() {
  try {
    const storedScores = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!storedScores) {
      return [];
    }
    const parsedScores = JSON.parse(storedScores);
    if (!Array.isArray(parsedScores)) {
      return [];
    }
    return parsedScores.filter((score) => (
      score &&
      typeof score === 'object' &&
      typeof score.playerName === 'string' &&
      typeof score.elapsedTime === 'number' &&
      typeof score.hintsUsed === 'number' &&
      typeof score.difficulty === 'string'
    ));
  } catch (error) {
    console.warn('Could not read leaderboard scores:', error);
    return [];
  }
}

function saveLeaderboardScores(scores) {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(scores));
  } catch (error) {
    console.warn('Could not save leaderboard scores:', error);
  }
}

function sortLeaderboardScores(scores) {
  return [...scores].sort((left, right) => {
    if (left.elapsedTime !== right.elapsedTime) {
      return left.elapsedTime - right.elapsedTime;
    }
    return left.hintsUsed - right.hintsUsed;
  });
}

function renderLeaderboard() {
  const leaderboardBody = document.getElementById('leaderboard-body');
  if (!leaderboardBody) {
    return;
  }

  const scores = sortLeaderboardScores(readLeaderboardScores()).slice(0, 10);
  if (scores.length === 0) {
    leaderboardBody.innerHTML = '<tr><td colspan="5">No completed games yet.</td></tr>';
    return;
  }

  leaderboardBody.innerHTML = scores.map((score, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${score.playerName}</td>
      <td>${formatTime(score.elapsedTime)}</td>
      <td>${score.hintsUsed}</td>
      <td>${score.difficulty}</td>
    </tr>
  `).join('');
}

function saveCompletedGame(playerName) {
  const safePlayerName = playerName ? playerName.trim() : '';
  if (!safePlayerName) {
    return;
  }

  const entry = {
    playerName: safePlayerName,
    elapsedTime: elapsedSeconds,
    hintsUsed,
    difficulty: getSelectedDifficulty()
  };

  const scores = sortLeaderboardScores(readLeaderboardScores());
  scores.push(entry);
  const topScores = sortLeaderboardScores(scores).slice(0, 10);
  saveLeaderboardScores(topScores);
  renderLeaderboard();
}

function resetScoreEntry() {
  const scoreEntry = document.getElementById('score-entry');
  const playerNameInput = document.getElementById('player-name');
  const scoreEntryMessage = document.getElementById('score-entry-message');
  if (scoreEntry) {
    scoreEntry.hidden = true;
  }
  if (playerNameInput) {
    playerNameInput.value = '';
  }
  if (scoreEntryMessage) {
    scoreEntryMessage.innerText = '';
  }
}

async function newGame() {
  resetTimer();
  startTimer();
  hintsUsed = 0;
  gameCompleted = false;
  scoreSaved = false;
  resetScoreEntry();
  const clues = getSelectedDifficultyClues();
  const res = await fetch(`/new?clues=${clues}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  document.getElementById('message').innerText = '';
}

async function hintSolution() {
  const board = getBoardState();
  const res = await fetch('/hint', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }
  if (data.message) {
    msg.style.color = '#1976d2';
    msg.innerText = data.message;
    return;
  }

  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const idx = data.row * SIZE + data.col;
  const inp = inputs[idx];
  inp.value = String(data.value);
  inp.disabled = true;
  inp.className = 'sudoku-cell hinted';
  hintsUsed += 1;
  msg.style.color = '#1976d2';
  msg.innerText = 'Hint applied.';
}

function showScoreEntry() {
  if (scoreSaved) {
    return;
  }
  const scoreEntry = document.getElementById('score-entry');
  if (scoreEntry) {
    scoreEntry.hidden = false;
  }
}

function handleSaveScore() {
  if (scoreSaved) {
    return;
  }

  const playerNameInput = document.getElementById('player-name');
  const scoreEntryMessage = document.getElementById('score-entry-message');
  const playerName = playerNameInput ? playerNameInput.value : '';
  const trimmedName = playerName ? playerName.trim() : '';

  if (!trimmedName) {
    if (scoreEntryMessage) {
      scoreEntryMessage.innerText = 'Please enter a name before saving.';
    }
    return;
  }

  scoreSaved = true;
  saveCompletedGame(trimmedName);
  resetScoreEntry();
}

async function checkSolution() {
  const msg = document.getElementById('message');
  if (gameCompleted) {
    msg.style.color = '#388e3c';
    msg.innerText = `Congratulations! You solved it in ${formatTime(elapsedSeconds)} with ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'}.`;
    if (!scoreSaved) {
      showScoreEntry();
    }
    return;
  }

  const board = getBoardState();
  const boardIsFilled = board.every((row) => row.every((value) => value !== 0));

  const request = new XMLHttpRequest();
  request.open('POST', '/check', false);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({board}));

  let data;
  try {
    data = JSON.parse(request.responseText);
  } catch (error) {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Unable to validate puzzle at the moment.';
    return;
  }

  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }
  const incorrect = new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) {
      continue;
    }
    inp.classList.toggle('incorrect', incorrect.has(idx));
  }
  if (boardIsFilled && incorrect.size === 0) {
    gameCompleted = true;
    stopTimer();
    msg.style.color = '#388e3c';
    msg.innerText = `Congratulations! You solved it in ${formatTime(elapsedSeconds)} with ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'}.`;
    showScoreEntry();
  } else {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Puzzle is not yet correct. Keep trying.';
  }
}

// Wire buttons
window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('hint-solution').addEventListener('click', hintSolution);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('save-score').addEventListener('click', handleSaveScore);
  renderLeaderboard();
  // initialize
  newGame();
});