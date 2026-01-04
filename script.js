const board = document.querySelector('.game-board');
const timerDisplay = document.querySelector('.timer');
const buttons = document.querySelectorAll('.sidebar button');

let firstCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let timer = null;
let seconds = 0;

const levels = { easy: 6, normal: 8, hard: 12 };
const backImage = 'images/back.png';

buttons.forEach(btn => {
  btn.addEventListener('click', () => startGame(btn.dataset.level));
});

function startGame(level) {
  resetGame();

  const pairs = levels[level];
  const images = [];

  for (let i = 1; i <= pairs; i++) {
    images.push(`images/img${i}.png`);
    images.push(`images/img${i}.png`);
  }

  shuffle(images);
  setupGrid(pairs);

  images.forEach(src => board.appendChild(createCard(src)));

  startTimer();
}

function setupGrid(pairs) {
  if (pairs <= 6) board.style.gridTemplateColumns = 'repeat(3, 100px)';
  else if (pairs <= 8) board.style.gridTemplateColumns = 'repeat(4, 100px)';
  else board.style.gridTemplateColumns = 'repeat(6, 100px)';
}

function createCard(imageSrc) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.image = imageSrc;

  card.innerHTML = `
    <div class="card-inner">
      <img class="card-front" src="${backImage}" draggable="false">
      <img class="card-back" src="${imageSrc}" draggable="false">
    </div>
  `;

  // Prevent drag entirely
  card.addEventListener('dragstart', e => e.preventDefault());

  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  moves++;

  if (firstCard.dataset.image === card.dataset.image) {
    card.classList.add('matched');
    firstCard.classList.add('matched');
    matches++;
    firstCard = null;

    if (matches === document.querySelectorAll('.card').length / 2) {
      setTimeout(() => alert(`🎉 You won in ${moves} moves and ${formatTime(seconds)}!`), 500);
      stopTimer();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card.classList.remove('flipped');
      firstCard.classList.remove('flipped');
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetGame() {
  board.innerHTML = '';
  firstCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = 'Time: 00:00';
}

function startTimer() {
  stopTimer();
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = 'Time: ' + formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
