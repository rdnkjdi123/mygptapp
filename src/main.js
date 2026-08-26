import './style.css';

const areas = [
  { name: 'Shoulders', icon: 'shoulders', accent: 'sage' },
  { name: 'Chest', icon: 'chest', accent: 'blue' },
  { name: 'Biceps', icon: 'biceps', accent: 'peach' },
  { name: 'Triceps', icon: 'triceps', accent: 'lilac' },
  { name: 'Legs', icon: 'legs', accent: 'sand' },
];

const exercises = {
  Shoulders: ['Lateral Raises', 'Reverse Pec Deck'],
  Chest: ['Incline Bench', 'Chest Press', 'Pec Fly'],
  Biceps: ['Preacher Curl Bar', 'Preacher Curl Dumbbell'],
  Triceps: ['Tricep Pushdown', 'Overhead Extension'],
  Legs: ['Leg Press', 'Hack Squat', 'Leg Extension'],
};

const icons = {
  shoulders: '<svg viewBox="0 0 48 48"><path d="M17 15c-5 1-9 5-10 11m24-11c5 1 9 5 10 11M18 10c1 3 3 5 6 5s5-2 6-5M14 34v-9c0-5 4-9 10-9s10 4 10 9v9"/></svg>',
  chest: '<svg viewBox="0 0 48 48"><path d="M9 28c1-9 5-14 12-14 1 4 1 8 3 11 2-3 2-7 3-11 7 0 11 5 12 14M13 35c2-5 6-8 11-8s9 3 11 8"/></svg>',
  biceps: '<svg viewBox="0 0 48 48"><path d="M13 32c7 7 20 4 23-5 1-4-1-8-5-9-4-1-7 1-9 4l-3-4 3-6-6-3-5 11c-2 5-1 9 2 12Z"/></svg>',
  triceps: '<svg viewBox="0 0 48 48"><path d="M31 11c-4 2-7 6-7 11l-5-4-5 4 7 10c3 5 10 6 14 2 5-5 4-13-1-17m-10 5 3 6"/></svg>',
  legs: '<svg viewBox="0 0 48 48"><path d="M17 8c0 9 2 15 6 21l-4 11m12-32c0 10-2 16-6 22l4 10M18 20h12"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
};

let state = { screen: 'home', area: null, exercise: null, sets: [], timerStart: null };
let timerInterval;

const app = document.querySelector('#app');

function shell(content, step = 1) {
  return `<main class="phone-shell">
    <header class="topbar">
      <button class="brand" data-home aria-label="Go home"><span>R</span> REP</button>
      <div class="step">TODAY <strong>${step}/3</strong></div>
    </header>
    ${content}
  </main>`;
}

function renderHome() {
  const cards = areas.map((area, index) => `
    <button class="area-card ${area.accent} ${index === 4 ? 'wide' : ''}" data-area="${area.name}">
      <span class="area-icon">${icons[area.icon]}</span>
      <span class="area-label">${area.name}</span>
      <span class="round-arrow">${icons.arrow}</span>
    </button>`).join('');
  app.innerHTML = shell(`<section class="screen home-screen">
    <p class="eyebrow">LET'S GET TO WORK</p>
    <h1>What are we<br><em>training</em> today?</h1>
    <p class="subhead">Pick a muscle group to get started.</p>
    <div class="area-grid">${cards}</div>
  </section>`);
}

function renderExercises() {
  const list = exercises[state.area].map((name, i) => `
    <button class="exercise-card" data-exercise="${name}">
      <span class="exercise-number">0${i + 1}</span>
      <span><strong>${name}</strong><small>Track your working sets</small></span>
      <span class="exercise-arrow">${icons.arrow}</span>
    </button>`).join('');
  app.innerHTML = shell(`<section class="screen">
    <button class="back" data-back>${icons.back} All muscle groups</button>
    <div class="section-heading"><p class="eyebrow">${state.area.toUpperCase()} DAY</p><h1>Choose your<br><em>exercise.</em></h1></div>
    <div class="exercise-list">${list}</div>
    <p class="tip"><span>TIP</span> Start with your heaviest movement.</p>
  </section>`, 2);
}

function elapsed() {
  if (!state.timerStart) return '00:00';
  const seconds = Math.floor((Date.now() - state.timerStart) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderTracker() {
  clearInterval(timerInterval);
  const setRows = state.sets.length ? state.sets.map((weight, i) => `
    <li><span class="set-check">${icons.check}</span><span>Set ${i + 1}</span><strong>${weight} lb</strong><small>DONE</small></li>`).join('') : '<li class="empty-set">Your completed sets will appear here.</li>';
  app.innerHTML = shell(`<section class="screen tracker-screen">
    <button class="back" data-back>${icons.back} ${state.area}</button>
    <div class="tracker-title"><div><p class="eyebrow">NOW TRAINING</p><h1>${state.exercise}</h1></div><span class="set-count">${state.sets.length}<small>SETS</small></span></div>
    ${state.timerStart ? `<div class="timer-card"><span class="timer-icon">${icons.timer}</span><span><small>REST TIMER</small><strong id="timer">${elapsed()}</strong></span><p>Take a breath.<br>Go when you're ready.</p></div>` : ''}
    <form id="set-form" class="weight-card">
      <label for="weight">WEIGHT</label>
      <div class="weight-input"><input id="weight" name="weight" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" autofocus><span>LB</span></div>
      <button type="submit" class="add-set">${icons.check} Add set</button>
    </form>
    <div class="set-history"><div class="history-title"><h2>Today's sets</h2><span>${state.sets.length} completed</span></div><ol>${setRows}</ol></div>
    <button class="finish" data-home>Finish exercise</button>
  </section>`, 3);
  if (state.timerStart) timerInterval = setInterval(() => {
    const timer = document.querySelector('#timer');
    if (timer) timer.textContent = elapsed();
  }, 1000);
  document.querySelector('#weight')?.focus();
}

function render() {
  if (state.screen === 'home') renderHome();
  else if (state.screen === 'exercises') renderExercises();
  else renderTracker();
}

app.addEventListener('click', (event) => {
  const area = event.target.closest('[data-area]');
  const exercise = event.target.closest('[data-exercise]');
  if (area) { state = { ...state, screen: 'exercises', area: area.dataset.area }; render(); }
  if (exercise) { state = { ...state, screen: 'tracker', exercise: exercise.dataset.exercise, sets: [], timerStart: null }; render(); }
  if (event.target.closest('[data-home]')) { state = { screen: 'home', area: null, exercise: null, sets: [], timerStart: null }; render(); }
  if (event.target.closest('[data-back]')) {
    state = state.screen === 'tracker' ? { ...state, screen: 'exercises', timerStart: null } : { ...state, screen: 'home' };
    render();
  }
});

app.addEventListener('submit', (event) => {
  if (event.target.id !== 'set-form') return;
  event.preventDefault();
  const input = event.target.elements.weight;
  const weight = Number(input.value);
  if (!input.value || weight <= 0) { input.focus(); input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 350); return; }
  state.sets.push(Number.isInteger(weight) ? weight : weight.toFixed(1));
  state.timerStart = Date.now();
  renderTracker();
});

render();
