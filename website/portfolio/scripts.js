const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const cellColor = "dark-grey"
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const speedInput = document.getElementById('speed');
const generationCounter = document.getElementById('generation');

let interval, speed = 500, isPaused = true, grid = createEmptyGrid(), generation = 0;

function createEmptyGrid() {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, i) => row.forEach((cell, j) => {
      if (cell) {
        ctx.fillStyle = cellColor; // Change this to the desired color for the cells
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }));
    generationCounter.innerText = generation;
  }
  

function updateGrid() {
  grid = grid.map((row, i) => row.map((_, j) => {
    const count = countNeighbors(i, j);
    return (grid[i][j] && (count === 2 || count === 3)) || (!grid[i][j] && count === 3) ? 1 : 0;
  }));
  generation++;
}

function countNeighbors(x, y) {
  return [...Array(3)].flatMap((_, i) => [...Array(3)].map((_, j) => [((x + i - 1 + rows) % rows), ((y + j - 1 + cols) % cols)])).filter(([a, b]) => !(a === x && b === y)).reduce((acc, [a, b]) => acc + grid[a][b], 0);
}

function gameLoop() {
  if (!isPaused) {
    drawGrid();
    updateGrid();
  }
}

function startGame() { isPaused = false; }
function pauseGame() { isPaused = true; }
function resetGame() { isPaused = true; generation = 0; grid = createEmptyGrid(); drawGrid(); }
function handleSpeedChange() { clearInterval(interval); interval = setInterval(gameLoop, 1000 - speedInput.value); }

function toggleCell(event) {
  const { x, y } = { x: event.clientX - canvas.getBoundingClientRect().left, y: event.clientY - canvas.getBoundingClientRect().top };
  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  if ((['mousedown', 'mousemove'].includes(event.type) && isMouseDown) || event.type === 'click') {
    grid[row][col] = 1;
    drawGrid();
  }
}

let isMouseDown = false;
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  toggleCell(event);
});
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    toggleCell(event);
  }
});
canvas.addEventListener('click', toggleCell);

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);
speedInput.addEventListener('input', handleSpeedChange);

interval = setInterval(gameLoop, speed);
drawGrid();
