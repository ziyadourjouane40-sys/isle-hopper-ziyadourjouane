const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const aiToggle = document.getElementById('aiToggle');
const difficultySelect = document.getElementById('difficulty');
const downloadBtn = document.getElementById('download');
const downloadImageBtn = document.getElementById('downloadImage');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let running = true;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(text){
  statusEl.textContent = text;
}

function checkWinner(boardState = board){
  for(const combo of winningCombos){
    const [a,b,c] = combo;
    if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
      return boardState[a];
    }
  }
  if(boardState.every(Boolean)) return 'draw';
  return null;
}

function render(){
  cells.forEach((cell, idx) => {
    cell.textContent = board[idx] || '';
    cell.disabled = !!board[idx] || !running;
  });
}

function handleMove(idx){
  if(!running || board[idx]) return;
  board[idx] = currentPlayer;
  const result = checkWinner();
  if(result){
    running = false;
    if(result === 'draw'){
      updateStatus("It's a draw.");
    } else {
      updateStatus(`Player ${result} wins!`);
    }
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
    if(aiToggle.checked && currentPlayer === 'O' && running){
      setTimeout(() => aiMove(difficultySelect.value), 250);
    }
  }
  render();
}

/* AI Implementations (easy/medium/hard + aiMove) — insert your existing AI code here */
/* For example: easyAI, mediumAI, hardAI and aiMove functions from prior file versions. */

/* Events */
cells.forEach((cell, idx) => {
  cell.addEventListener('click', () => handleMove(idx));
});

resetBtn.addEventListener('click', () => {
  board.fill(null);
  currentPlayer = 'X';
  running = true;
  updateStatus("Player X's turn");
  render();
});

/* --- DOWNLOAD FUNCTIONS --- */

/* Download current page HTML as file */
function downloadPageHTML(filename = 'isle-hopper-tic-tac-toe.html'){
  // Create a copy of the current document HTML
  const html = '<!doctype html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* Download the current board as a PNG image */
function downloadBoardImage(filename = 'tic-tac-toe-board.png'){
  // Canvas size
  const size = 600; // high resolution
  const cell = size / 3;
  const padding = cell * 0.15;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 8;
  for(let i=1;i<=2;i++){
    ctx.beginPath();
    // vertical
    ctx.moveTo(cell * i, 0);
    ctx.lineTo(cell * i, size);
    ctx.stroke();
    // horizontal
    ctx.beginPath();
    ctx.moveTo(0, cell * i);
    ctx.lineTo(size, cell * i);
    ctx.stroke();
  }

  // Draw X and O
  for(let i=0;i<9;i++){
    const r = Math.floor(i / 3);
    const c = i % 3;
    const centerX = c * cell + cell / 2;
    const centerY = r * cell + cell / 2;

    const value = board[i];
    if(value === 'X'){
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(centerX - (cell/2 - padding), centerY - (cell/2 - padding));
      ctx.lineTo(centerX + (cell/2 - padding), centerY + (cell/2 - padding));
      ctx.moveTo(centerX + (cell/2 - padding), centerY - (cell/2 - padding));
      ctx.lineTo(centerX - (cell/2 - padding), centerY + (cell/2 - padding));
      ctx.stroke();
    } else if(value === 'O'){
      ctx.strokeStyle = '#e6eef8';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (cell/2 - padding), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Create download
  canvas.toBlob(function(blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/* Wire buttons */
if(downloadBtn) downloadBtn.addEventListener('click', () => downloadPageHTML());
if(downloadImageBtn) downloadImageBtn.addEventListener('click', () => downloadBoardImage());

/* Initialize */
updateStatus("Player X's turn");
render();