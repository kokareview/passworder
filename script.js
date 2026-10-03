const input    = document.getElementById('password');
const toggle   = document.getElementById('toggle');
const eyeIcon  = document.getElementById('eyeIcon');
const bar      = document.getElementById('bar');
const levelEl  = document.getElementById('level');
const scoreEl  = document.getElementById('score-value');
const crackEl  = document.getElementById('crack');

const EYE_OPEN = `
  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
  <circle cx="12" cy="12" r="3"/>
`;

const EYE_CLOSED = `
  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
  <circle cx="12" cy="12" r="3"/>
  <line x1="2" y1="2" x2="22" y2="22"/>
`;

toggle.addEventListener('click', () => {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  eyeIcon.innerHTML = isHidden ? EYE_CLOSED : EYE_OPEN;
  toggle.title = isHidden ? 'Скрыть пароль' : 'Показать пароль';
});

input.addEventListener('input', () => check(input.value));

function check(pwd) {
  const c = {
    len:     pwd.length >= 8,
    lower:   /[a-z]/.test(pwd),
    upper:   /[A-Z]/.test(pwd),
    digit:   /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
    long:    pwd.length >= 12
  };

  mark('chk-len', c.len);
  mark('chk-lower', c.lower);
  mark('chk-upper', c.upper);
  mark('chk-digit', c.digit);
  mark('chk-special', c.special);
  mark('chk-long', c.long);

  let score = 0;
  if (c.len)     score += 20;
  if (c.lower)   score += 15;
  if (c.upper)   score += 15;
  if (c.digit)   score += 15;
  if (c.special) score += 20;
  if (c.long)    score += 15;
  if (pwd.length >= 16) score += 10;
  if (score > 100) score = 100;

  scoreEl.textContent = score;

  let color = '#444';
  let text  = '';

  if (pwd.length === 0) {
    text = '';
  } else if (score < 30) {
    color = '#c0392b';
    text = 'Очень слабый';
  } else if (score < 55) {
    color = '#c0392b';
    text = 'Слабый';
  } else if (score < 75) {
    color = '#d68910';
    text = 'Средний';
  } else if (score < 90) {
    color = '#2980b9';
    text = 'Сильный';
  } else {
    color = '#27ae60';
    text = 'Очень надёжный';
  }

  levelEl.textContent = text;
  levelEl.style.color = pwd.length === 0 ? '#555' : color;

  bar.style.width = score + '%';
  bar.style.background = pwd.length === 0 ? '#333' : color;

  crack(pwd, score);
}

function mark(id, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = el.querySelector('.mark');
  if (ok) {
    el.classList.add('ok');
    m.textContent = '✓';
  } else {
    el.classList.remove('ok');
    m.textContent = '✗';
  }
}

function crack(pwd, score) {
  if (!pwd) { crackEl.textContent = ''; return; }

  let size = 0;
  if (/[a-z]/.test(pwd)) size += 26;
  if (/[A-Z]/.test(pwd)) size += 26;
  if (/[0-9]/.test(pwd)) size += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) size += 32;
  if (size === 0) { crackEl.textContent = ''; return; }
  const combos = Math.pow(size, pwd.length);
  const seconds = combos / 1e9 / 2;
  crackEl.textContent = 'Время взлома: ' + fmt(seconds);
  crackEl.style.color = score >= 75 ? '#27ae60' : score >= 55 ? '#d68910' : '#c0392b';
}
function fmt(s) {
  if (s < 1) return 'мгновенно';
  if (s < 60) return Math.round(s) + ' сек';
  if (s < 3600) return Math.round(s / 60) + ' мин';
  if (s < 86400) return Math.round(s / 3600) + ' ч';
  if (s < 2592000) return Math.round(s / 86400) + ' дн';
  if (s < 31536000) return Math.round(s / 2592000) + ' мес';
  if (s < 31536000 * 1000) return Math.round(s / 31536000) + ' лет';
  return 'более 1000 лет';
    }
