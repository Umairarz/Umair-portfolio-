// Theme (saved per visitor)
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem('theme') || 'dark'; } catch { root.dataset.theme = 'dark'; }
document.getElementById('theme')?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});
document.getElementById('burger')?.addEventListener('click', () => document.querySelector('.links').classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => document.querySelector('.links').classList.remove('open')));

// Typing animation
const t = document.querySelector('.typed');
if (t) {
  const words = ['Full-Stack Web Developer', 'UI Designer', 'Cybersecurity Enthusiast'];
  let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    t.textContent = word.slice(0, c);
    c += del ? -1 : 1;
    if (!del && c > word.length + 8) del = true;
    if (del && c < 0) { del = false; c = 0; w = (w + 1) % words.length; }
    setTimeout(tick, del ? 35 : 80);
  })();
}

// Counters + skill bars on reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; io.unobserve(el);
  if (el.dataset.to) {
    const to = parseFloat(el.dataset.to), dec = to % 1 ? 2 : 0, suf = el.dataset.suf || '';
    let n = 0; const step = () => { n = Math.min(to, n + to / 50); el.textContent = n.toFixed(dec) + suf; if (n < to) requestAnimationFrame(step); };
    step();
  }
  if (el.dataset.w) el.style.width = el.dataset.w + '%';
}), { threshold: .4 });
document.querySelectorAll('[data-to],[data-w]').forEach(el => io.observe(el));

// Project filter + modal
const modal = document.getElementById('modal');
document.querySelectorAll('.filters .btn').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.filters .btn').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  document.querySelectorAll('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.c !== b.dataset.f));
}));
document.querySelectorAll('.proj').forEach(p => p.addEventListener('click', () => {
  modal.querySelector('img').src = p.querySelector('img').src;
  modal.querySelector('h3').textContent = p.querySelector('h3').textContent;
  modal.querySelector('p').textContent = p.dataset.d;
  modal.classList.add('open');
}));
modal?.addEventListener('click', e => { if (e.target === modal || e.target.dataset.close) modal.classList.remove('open'); });
addEventListener('keydown', e => e.key === 'Escape' && modal?.classList.remove('open'));

// Back to top
const top_ = document.getElementById('top');
addEventListener('scroll', () => top_.classList.toggle('show', scrollY > 600));
top_.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form: validation + Web3Forms (get a free key at web3forms.com and paste it into the form's access_key field)
const form = document.getElementById('cf');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Enter a subject.',
    message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
  };
  for (const [k, fn] of Object.entries(rules)) {
    const r = fn(form[k].value);
    form[k].nextElementSibling.textContent = r === true ? '' : r;
    if (r !== true) ok = false;
  }
  const msg = document.getElementById('msg');
  if (!ok) return;
  msg.textContent = 'Sending…';
  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
    const data = await res.json();
    msg.textContent = data.success ? 'Message sent. I will reply soon.' : 'Could not send: ' + data.message;
    if (data.success) form.reset();
  } catch { msg.textContent = 'Network error. Check your connection and try again.'; }
});
if (window.AOS) AOS.init({ duration: 700, once: true });
