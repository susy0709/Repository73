const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20); // escala para que los bloques sean grandes

const scoreElement = document.getElementById('score');
let score = 0;

function updateScore() {
  scoreElement.innerText = score.toString().padStart(4, '0');
}

// Crear matriz del tablero
function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

// Crear piezas
function createPiece(type) {
  const pieces = {
    T: [[0, 1, 0], [1, 1, 1]],
    O: [[2, 2], [2, 2]],
    L: [[0, 0, 3], [3, 3, 3]],
    J: [[4, 0, 0], [4, 4, 4]],
    I: [[5, 5, 5, 5]],
    S: [[0, 6, 6], [6, 6, 0]],
    Z: [[7, 7, 0], [0, 7, 7]],
  };
  return pieces[type];
}

// Dibujar la matriz
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// Unir pieza al tablero
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// Detectar colisión
function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] !== 0 &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

// Bajar pieza
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

// Mover pieza
function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

// Reiniciar jugador
function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    score = 0;
    updateScore();
  }
}

// Limpiar filas completas
function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    score += 10 * rowCount;
    rowCount *= 2;
  }
}

// Dibujar todo
function draw() {
  context.fillStyle = '#c0c0c0';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

// Variables de tiempo
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isPaused = false;

// Animación principal
function update(time = 0) {
  if (isPaused) {
    requestAnimationFrame(update);
    return;
  }

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

// Colores de piezas
const colors = [
  null,
  'purple',
  'yellow',
  'orange',
  'blue',
  'cyan',
  'green',
  'red',
];

// Crear tablero y jugador
const arena = createMatrix(12, 20);
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
};

// Controles del teclado
document.addEventListener('keydown', event => {
  if (event.key === 'a' || event.key === 'A') {
    playerMove(-1);
  } else if (event.key === 'd' || event.key === 'D') {
    playerMove(1);
  } else if (event.key === 's' || event.key === 'S') {
    playerDrop();
  }
});

// Botones de control (pausa/play/reinicio)
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = true;
});

document.getElementById('playBtn').addEventListener('click', () => {
  isPaused = false;
});

document.getElementById('restartBtn').addEventListener('click', () => {
  arena.forEach(row => row.fill(0)); // limpia el tablero
  playerReset();                     // genera nueva pieza
  score = 0;                         // reinicia puntuación
  updateScore();                     // actualiza puntuación en pantalla
  draw();                            // vuelve a dibujar el canvas limpio
});


// Iniciar juego
playerReset();
updateScore();
update();

document.getElementById('btnA').addEventListener('click', () => {
  playerMove(-1); // mueve a la izquierda
});

document.getElementById('btnD').addEventListener('click', () => {
  playerMove(1); // mueve a la derecha
});

document.getElementById('btnS').addEventListener('click', () => {
  playerDrop(); // mueve hacia abajo
});




