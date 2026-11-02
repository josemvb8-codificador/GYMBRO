/* GYMBRO — app principal (sin dependencias, datos en localStorage) */
(() => {
  'use strict';

  const VERSION = '3.0.0';
  const KEY = 'gymbro.v1';
  const MUSCLES = window.GB_MUSCLES;
  const BASE_EX = window.GB_EXERCISES;
  const LEGACY = window.GB_LEGACY || [];
  const EQUIP = window.GB_EQUIPMENT || [];
  const MUSCLE_MAP = window.GB_MUSCLE_MAP || {};
  const BODY = window.GB_BODY || null;
  const DAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const DAY_NAME = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const REST_OPTIONS = [30, 45, 60, 90, 120, 150, 180, 240, 300];
  const LB = 2.20462;

  /* ---------------- Datos ---------------- */
  const defaults = () => ({
    settings: { unit: 'kg', rest: 90, sound: true, vibrate: true },
    profile: null,
    body: [],
    mealPlan: null,
    custom: [],
    routines: [],
    history: [],
    active: null,
    timer: null
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        const base = defaults();
        return { ...base, ...d, settings: { ...base.settings, ...(d.settings || {}) } };
      }
    } catch (e) { /* datos corruptos o almacenamiento bloqueado */ }
    return defaults();
  }

  const sortHistory = (d) => { d.history.sort((a, b) => a.start - b.start); return d; };
  let db = sortHistory(load());
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { toast('⚠️ No se pudo guardar en el dispositivo'); }
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 400);
  }
  window.addEventListener('pagehide', () => { if (saveTimer) save(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer) save(); });
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  /* ---------------- Utilidades ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const muscleName = (id) => (MUSCLES.find((m) => m.id === id) || { n: id }).n;
  const allEx = () => BASE_EX.concat(db.custom);
  const exById = (id) => BASE_EX.find((e) => e.id === id) || db.custom.find((e) => e.id === id) || LEGACY.find((e) => e.id === id) || { id, n: 'Ejercicio eliminado', m: 'core', p: [], e: '', d: '' };
  // Fotos reales (versión 1) o animaciones 3D (versión 2), a elegir en Ajustes
  const PHOTO_IDS = new Set(["abduccion-lateral", "abduccion-maquina", "aperturas", "bici-estatica", "caminata-banda", "cinta", "comba", "cruce-poleas", "crunch", "crunch-bicicleta", "crunch-polea", "curl-barra", "curl-concentrado", "curl-femoral", "curl-mancuernas", "curl-martillo", "curl-polea", "curl-predicador", "dead-bug", "dominadas", "dominadas-supinas", "elevacion-piernas", "elevacion-piernas-colgado", "elevaciones-frontales", "elevaciones-laterales", "elevaciones-laterales-banda", "eliptica", "extension-cuadriceps", "extension-polea", "extension-sobre-cabeza", "face-pull", "flexiones", "flexiones-declinadas", "flexiones-diamante", "flexiones-inclinadas", "flexiones-pino", "fondos-paralelas", "fondos-silla", "hip-thrust", "jalon-pecho", "jumping-jacks", "mountain-climbers", "pajaros", "pantorrillas", "patada-polea", "patada-triceps", "peso-muerto", "peso-muerto-rumano", "peso-muerto-rumano-mancuernas", "plancha", "plancha-lateral", "prensa", "press-banca", "press-frances", "press-hombro-banda", "press-hombro-mancuernas", "press-inclinado-mancuernas", "press-mancuernas", "press-maquina-pecho", "press-militar", "puente-gluteo", "puente-una-pierna", "pullover", "remo-barra", "remo-ergometro", "remo-invertido", "remo-mancuerna", "remo-polea-baja", "rueda-abdominal", "russian-twist", "sentadilla-barra", "sentadilla-bulgara", "sentadilla-goblet", "sentadilla-libre", "sentadilla-salto", "separacion-banda", "step-up", "superman", "zancadas"]);
  const imgStyle = () => db.settings.imgStyle || 'foto';
  const usePhoto = (ex) => imgStyle() === 'foto' && PHOTO_IDS.has(ex.id);
  const imgSrc = (ex, f) => (usePhoto(ex) ? `img/foto/${ex.id}-${f}.webp` : `img/ex/${ex.id}-${f}.webp`);
  const thumb = (ex, cls = '') => ex.img
    ? `<img class="thumb ${cls}" src="${imgSrc(ex, 't')}" alt="" loading="lazy" decoding="async">`
    : `<span class="avatar ${cls}">${esc(initials(ex.n))}</span>`;
  const animSrc = (ex) => `img/ex/${ex.id}.webp`;
  const demoHtml = (ex) => usePhoto(ex)
    ? `<div class="demo photo" role="img" aria-label="Demostración: ${esc(ex.n)}">
         <img src="${imgSrc(ex, 0)}" alt="" decoding="async"><img class="b" src="${imgSrc(ex, 1)}" alt="" decoding="async">
         <span class="demo-badge"><i></i>Demostración</span>
       </div>`
    : ex.img
    ? `<div class="demo" role="img" aria-label="Animación: ${esc(ex.n)}">
         <img src="${animSrc(ex)}" alt="" decoding="async">
         <span class="demo-badge"><i></i>En movimiento</span>
       </div>`
    : `<div class="demo none"><span>${esc(initials(ex.n))}</span></div>`;

  /* ---------- Mapa muscular (frente y espalda) ---------- */
  const GROUP_KEYS = {
    pecho: ['chest'], espalda: ['upper-back', 'lower-back', 'trapezius'], hombros: ['front-deltoids', 'back-deltoids'],
    biceps: ['biceps'], triceps: ['triceps'], piernas: ['quadriceps', 'hamstring', 'calves', 'left-soleus', 'right-soleus', 'adductor'],
    gluteos: ['gluteal', 'abductors'], core: ['abs', 'obliques'], cardio: ['quadriceps', 'hamstring', 'calves', 'left-soleus', 'right-soleus']
  };
  const bodyBox = {};
  function bodyView(view) {
    if (!bodyBox[view]) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const list of Object.values(BODY[view])) for (const pts of list) {
        const n = pts.trim().split(/\s+/).map(Number);
        for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
      }
      const pad = 12;
      bodyBox[view] = `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`;
    }
    return bodyBox[view];
  }
  function bodyMap(prim = [], sec = [], view = 'front', cls = '') {
    if (!BODY) return '';
    const polys = Object.entries(BODY[view]).map(([k, list]) => {
      const c = prim.includes(k) ? 'p' : sec.includes(k) ? 's' : (k === 'head' || k === 'knees' || k === 'neck') ? 'n' : '';
      return list.map((pts) => `<polygon class="${c}" points="${pts}"/>`).join('');
    }).join('');
    return `<svg class="bodymap ${cls}" viewBox="${bodyView(view)}" aria-hidden="true">${polys}</svg>`;
  }
  const exMuscles = (ex) => MUSCLE_MAP[ex.id] || [GROUP_KEYS[ex.m] || [], []];
  function musclesHtml(ex) {
    const [p, s] = exMuscles(ex);
    if (!BODY || !p.length) return '';
    return `<div class="section-title">Músculos trabajados</div>
      <div class="muscle-card">
        <div class="maps"><figure>${bodyMap(p, s, 'front')}<figcaption>Frente</figcaption></figure><figure>${bodyMap(p, s, 'back')}<figcaption>Espalda</figcaption></figure></div>
        <div class="legend"><span><i class="p"></i>Principal</span><span><i class="s"></i>Secundario</span></div>
      </div>`;
  }
  const unitOf = (ex) => ex.u || 'reps';
  const unit = () => db.settings.unit;
  const toDisp = (kg) => (kg == null ? '' : unit() === 'lb' ? round(kg * LB, 1) : round(kg, 2));
  const fromDisp = (v) => (v == null ? null : unit() === 'lb' ? v / LB : v);
  const round = (n, d) => { const f = 10 ** d; return Math.round(n * f) / f; };
  const fmtN = (n) => (n == null || n === '' ? '' : Number(n).toLocaleString('es', { maximumFractionDigits: 1 }));
  const parseNum = (v) => {
    const s = String(v).replace(',', '.').trim();
    if (s === '') return null;
    const n = parseFloat(s);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const fmtVol = (kg) => { const v = toDisp(kg) || 0; return v >= 10000 ? fmtN(round(v / 1000, 1)) + 'k' : fmtN(Math.round(v)); };
  const fmtDate = (ts, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => new Date(ts).toLocaleDateString('es', opts);
  const fmtClock = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
  };
  const activeMs = (a) => (a.pausedAt || Date.now()) - a.start - (a.pausedMs || 0);
  const sesDur = (s) => s.end - s.start - (s.pausedMs || 0);
  const STALE_MS = 3 * 3600 * 1000;
  const fmtDur = (ms) => {
    const min = Math.round(ms / 60000);
    return min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
  };
  const fmtRest = (s) => (s >= 60 ? (s % 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s / 60} min`) : `${s} s`);
  const initials = (name) => name.split(/\s+/).filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
  const startOfWeek = (d = new Date()) => {
    const x = new Date(d); x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x.getTime();
  };
  const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>'
  };

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------------- Sonido / vibración ---------------- */
  let audioCtx = null;
  function unlockAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* sin audio */ }
  }
  function beep() {
    if (db.settings.sound && audioCtx) {
      try {
        const t0 = audioCtx.currentTime;
        [0, 0.22, 0.44].forEach((dt, i) => {
          const o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sine'; o.frequency.value = i === 2 ? 1320 : 880;
          g.gain.setValueAtTime(0.0001, t0 + dt);
          g.gain.exponentialRampToValueAtTime(0.4, t0 + dt + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.18);
          o.connect(g).connect(audioCtx.destination);
          o.start(t0 + dt); o.stop(t0 + dt + 0.2);
        });
      } catch (e) { /* ignorar */ }
    }
    if (db.settings.vibrate && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
  }
  document.addEventListener('pointerdown', unlockAudio, { passive: true });

  /* ---------------- Historial: consultas ---------------- */
  function lastSetsFor(exId, beforeTs = Infinity) {
    for (let i = db.history.length - 1; i >= 0; i--) {
      const s = db.history[i];
      if (s.start >= beforeTs) continue;
      const e = s.entries.find((x) => x.exId === exId);
      if (e && e.sets.length) return e.sets;
    }
    return null;
  }
  const e1rm = (w, r) => (w && r ? w * (1 + Math.min(r, 30) / 30) : 0);

  function exerciseStats(exId) {
    const points = [];
    for (const s of db.history) {
      const e = s.entries.find((x) => x.exId === exId);
      if (!e || !e.sets.length) continue;
      let maxW = 0, maxR = 0, best = 0, vol = 0, bestSet = null;
      for (const st of e.sets) {
        const w = st.w || 0, r = st.r || 0;
        if (w > maxW || (w === maxW && r > (bestSet ? bestSet.r : 0))) { maxW = w; bestSet = st; }
        maxR = Math.max(maxR, r);
        best = Math.max(best, e1rm(w, r));
        vol += w * r;
      }
      points.push({ ts: s.start, sid: s.id, maxW, maxR, best, vol, sets: e.sets, bestSet });
    }
    return points;
  }

  function sessionVolume(s) {
    let v = 0, n = 0;
    for (const e of s.entries) {
      if (unitOf(exById(e.exId)) !== 'reps') { n += e.sets.length; continue; }
      for (const st of e.sets) { v += (st.w || 0) * (st.r || 0); n++; }
    }
    return { vol: v, sets: n };
  }

  /* ---------------- Estado de UI ---------------- */
  const ui = {
    tab: 'train',
    lib: { q: '', place: 'all', muscle: 'all' },
    histMode: 'body'
  };

  const TITLES = { train: 'GYMBRO', routines: 'Rutinas', library: 'Ejercicios', nutrition: 'Nutrición', history: 'Progreso' };

  function setTab(tab) {
    ui.tab = tab;
    document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    $('#title').textContent = ui.tab === 'train' && db.active ? 'Entrenando' : TITLES[ui.tab];
    const view = $('#view');
    const fn = { train: renderTrain, routines: renderRoutines, library: renderLibrary, nutrition: renderNutrition, history: renderHistory }[ui.tab];
    view.innerHTML = fn();
    const trainBtn = document.querySelector('.tabbar [data-tab="train"]');
    trainBtn.querySelector('.dot')?.remove();
    if (db.active && ui.tab !== 'train') trainBtn.insertAdjacentHTML('beforeend', '<i class="dot"></i>');
    renderTimer();
    updateClock();
  }

  /* ================= ENTRENAR ================= */
  function renderTrain() {
    if (db.active) return renderWorkout();
    const now = new Date();
    const today = now.getDay();
    const weekStart = startOfWeek(now);
    const thisWeek = db.history.filter((s) => s.start >= weekStart);
    const doneDays = new Set(thisWeek.map((s) => new Date(s.start).getDay()));
    const weekVol = thisWeek.reduce((a, s) => a + sessionVolume(s).vol, 0);
    const todays = db.routines.filter((r) => r.days.includes(today));
    const others = db.routines.filter((r) => !r.days.includes(today));
    const trainedToday = db.history.some((s) => sameDay(s.start, now));

    let html = `
      <section class="hero">
        <div class="kicker">${esc(fmtDate(now, { weekday: 'long', day: 'numeric', month: 'long' }))}</div>
        <h2>${trainedToday ? '¡Buen trabajo hoy! 💪' : todays.length ? 'Hoy toca entrenar' : 'Listo para entrenar'}</h2>
        <div class="stats">
          <div class="stat"><b>${thisWeek.length}</b><span>esta semana</span></div>
          <div class="stat"><b>${streak()}</b><span>racha (sem.)</span></div>
          <div class="stat"><b>${fmtVol(weekVol)}</b><span>${unit()} movidos</span></div>
        </div>
        <div class="week">
          ${WEEK_ORDER.map((d) => `<div class="${doneDays.has(d) ? 'done' : ''} ${d === today ? 'today' : ''}">${DAY_SHORT[d]}<i></i></div>`).join('')}
        </div>
      </section>`;

    const T = profileReady() ? nutritionTargets() : null;
    html += T
      ? `<button class="card tap nutri-mini" data-action="go-nutrition">
          <span class="nm-i">🍽️</span>
          <span class="grow"><b>${fmtN(T.kcal)} kcal hoy</b><small>Proteína ${T.p} g · Carbos ${T.c} g · Grasa ${T.f} g</small></span>${ICON.chev}
        </button>`
      : `<button class="card tap nutri-mini" data-action="edit-profile">
          <span class="nm-i">📏</span>
          <span class="grow"><b>Completa tu perfil</b><small>Calorías, comidas e índices personales (IMC, % grasa…)</small></span>${ICON.chev}
        </button>`;

    if (!db.routines.length) {
      html += `
        <div class="card empty">
          <div class="big">🏋️</div>
          <h3>Empecemos tu plan</h3>
          <p>Responde 4 preguntas y GYMBRO te arma una rutina completa, con imágenes de cada ejercicio.</p>
          <div class="stack">
            <button class="btn primary block" data-action="generator">✨ Armar mi rutina</button>
            <button class="btn block" data-action="new-routine">${ICON.plus} Crearla yo mismo</button>
            <button class="btn ghost block" data-action="sample-routines">Cargar rutinas de ejemplo</button>
          </div>
        </div>`;
    } else {
      html += `<div class="section-title">Para hoy · ${DAY_NAME[today]}</div>`;
      html += todays.length
        ? todays.map((r) => routineCard(r, true)).join('')
        : `<div class="card muted small">No tienes rutinas asignadas a hoy. Elige otra o haz un entrenamiento libre.</div>`;
      if (others.length) {
        html += `<div class="section-title">Otras rutinas</div><div class="ex-list">`;
        html += others.map((r) => `
          <button class="ex-item" data-action="start-routine" data-id="${r.id}">
            ${r.items[0] ? thumb(exById(r.items[0].exId)) : `<span class="avatar">${esc(initials(r.name))}</span>`}
            <span class="grow"><div class="name ellipsis">${esc(r.name)}</div><div class="meta">${r.items.length} ejercicios · ${daysLabel(r.days)}</div></span>
            <span class="tag accent">Empezar</span>
          </button>`).join('');
        html += `</div>`;
      }
    }
    html += `<div class="section-title">Rápido</div>
      <button class="btn block" data-action="start-free">${ICON.plus} Entrenamiento libre</button>`;
    return html;
  }

  function streak() {
    if (!db.history.length) return 0;
    const weeks = new Set(db.history.map((s) => startOfWeek(new Date(s.start))));
    let w = startOfWeek();
    if (!weeks.has(w)) w = startOfWeek(new Date(w - 3 * 864e5)); // la semana actual aún puede completarse
    let n = 0;
    while (weeks.has(w)) { n++; w = startOfWeek(new Date(w - 3 * 864e5)); }
    return n;
  }

  function daysLabel(days) {
    if (!days.length) return 'Sin día';
    if (days.length === 7) return 'Todos los días';
    return WEEK_ORDER.filter((d) => days.includes(d)).map((d) => DAY_NAME[d].slice(0, 3)).join(', ');
  }

  function routineCard(r, startBig) {
    const today = new Date().getDay();
    const names = r.items.map((it) => exById(it.exId).n);
    return `
      <div class="card routine-card">
        <div class="row between">
          <div class="grow">
            <h3 class="ellipsis">${esc(r.name)}</h3>
            <div class="day-pills">${WEEK_ORDER.map((d) => `<span class="${r.days.includes(d) ? 'on' : ''} ${d === today ? 'today' : ''}">${DAY_SHORT[d]}</span>`).join('')}</div>
          </div>
          <button class="icon-btn" data-action="edit-routine" data-id="${r.id}" aria-label="Editar rutina">${ICON.more}</button>
        </div>
        ${r.items.length ? `<div class="thumb-strip">${r.items.slice(0, 6).map((it) => thumb(exById(it.exId), 'sm')).join('')}${r.items.length > 6 ? `<span class="more">+${r.items.length - 6}</span>` : ''}</div>` : ''}
        ${r.note ? `<div class="note"><span class="tag accent">${esc(r.note)}</span></div>` : ''}
        <div class="list">${names.length ? esc(names.slice(0, 4).join(' · ')) + (names.length > 4 ? ` · +${names.length - 4}` : '') : 'Sin ejercicios'}</div>
        <button class="btn ${startBig ? 'primary' : ''} block" data-action="start-routine" data-id="${r.id}">${ICON.play} Empezar · ${r.items.length} ejercicios</button>
      </div>`;
  }

  /* ---------- Sesión activa ---------- */
  function newEntry(exId, sets = 3, target = '', rest = db.settings.rest) {
    const prev = lastSetsFor(exId) || [];
    const n = Math.max(1, sets);
    return {
      exId, target, rest,
      sets: Array.from({ length: n }, (_, i) => ({ w: null, r: null, done: false, pw: prev[i]?.w ?? prev[prev.length - 1]?.w ?? null, pr: prev[i]?.r ?? null }))
    };
  }

  function startWorkout(routine) {
    if (db.active) { setTab('train'); return; }
    db.active = {
      id: uid(),
      name: routine ? routine.name : 'Entrenamiento libre',
      routineId: routine ? routine.id : null,
      start: Date.now(),
      entries: routine ? routine.items.map((it) => newEntry(it.exId, it.sets, it.reps, it.rest)) : []
    };
    save();
    closeAllSheets();
    setTab('train');
    if (!routine) openPicker((ids) => { ids.forEach((id) => db.active.entries.push(newEntry(id))); save(); render(); });
  }

  function renderWorkout() {
    const a = db.active;
    const total = a.entries.reduce((n, e) => n + e.sets.length, 0);
    const done = a.entries.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
    let html = `
      <section class="wk-head">
        <div class="grow">
          <h2 class="ellipsis">${esc(a.name)}</h2>
          <div class="muted small">${done}/${total} series completadas</div>
          <div class="progress"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
        </div>
        <button class="wk-clock ${a.pausedAt ? 'paused' : ''}" data-action="clock-menu" aria-label="Pausar, terminar o descartar el entrenamiento">
          <span id="wk-clock">0:00</span><small>${a.pausedAt ? '⏸ En pausa' : 'Toca para pausar'}</small>
        </button>
      </section>
      ${a.pausedAt ? `<button class="pause-banner" data-action="wk-resume">⏸ Entrenamiento en pausa · <b>Toca para reanudar</b></button>` : ''}`;

    if (!a.entries.length) {
      html += `<div class="card empty"><div class="big">➕</div><h3>Añade ejercicios</h3><p>Elige de la biblioteca lo que vas a entrenar hoy.</p></div>`;
    }

    a.entries.forEach((e, ei) => {
      const ex = exById(e.exId);
      const u = unitOf(ex);
      const uLabel = u === 'reps' ? 'Reps' : u === 'seg' ? 'Seg' : 'Min';
      const complete = e.sets.length && e.sets.every((s) => s.done);
      const targetTxt = e.target ? `Objetivo: ${e.sets.length} × ${esc(e.target)}` : `${e.sets.length} series`;
      html += `
        <article class="ex-card ${complete ? 'complete' : ''}" data-e="${ei}">
          <header>
            <button class="ex-thumb" data-action="ex-detail" data-id="${esc(ex.id)}" aria-label="Ver cómo se hace ${esc(ex.n)}">${thumb(ex)}${ex.s ? '<i>?</i>' : ''}</button>
            <div class="grow">
              <h3>${esc(ex.n)}</h3>
              <div class="sub">${muscleName(ex.m)} · ${targetTxt}</div>
            </div>
            <button class="rest-chip" data-action="entry-rest" data-e="${ei}" aria-label="Cambiar descanso">${ICON.clock} ${fmtRest(e.rest)}</button>
            <button class="icon-btn" data-action="entry-menu" data-e="${ei}" aria-label="Opciones del ejercicio">${ICON.more}</button>
          </header>
          <div class="sets">
            <div class="set-head"><span>#</span><span>Anterior</span><span>${unit()}</span><span>${uLabel}</span><span></span></div>
            ${e.sets.map((s, si) => {
              const prev = s.pw != null && s.pr != null ? `${fmtN(toDisp(s.pw))} × ${s.pr}`
                : s.pr != null ? `${s.pr} ${u}`
                : s.pw != null ? `${fmtN(toDisp(s.pw))} ${unit()}` : '—';
              const phW = s.pw != null ? fmtN(toDisp(s.pw)) : '0';
              const phR = s.pr ?? (parseInt(e.target, 10) || '');
              return `
              <div class="set-row ${s.done ? 'done' : ''}">
                <span class="num">${si + 1}</span>
                <button class="prev" data-action="copy-prev" data-e="${ei}" data-s="${si}" aria-label="Copiar serie anterior">${prev}</button>
                <input type="text" inputmode="decimal" enterkeyhint="next" autocomplete="off" data-field="w" data-e="${ei}" data-s="${si}" value="${s.w != null ? fmtN(toDisp(s.w)) : ''}" placeholder="${esc(phW)}" aria-label="Peso serie ${si + 1}">
                <input type="text" inputmode="numeric" enterkeyhint="done" autocomplete="off" data-field="r" data-e="${ei}" data-s="${si}" value="${s.r ?? ''}" placeholder="${esc(phR)}" aria-label="${uLabel} serie ${si + 1}">
                <button class="done-btn" data-action="toggle-set" data-e="${ei}" data-s="${si}" aria-label="Marcar serie ${si + 1}">${ICON.check}</button>
              </div>`;
            }).join('')}
          </div>
          <div class="tools">
            <button class="btn sm" data-action="add-set" data-e="${ei}">${ICON.plus} Serie</button>
            <button class="btn sm ghost" data-action="remove-set" data-e="${ei}" ${e.sets.length <= 1 ? 'disabled' : ''}>Quitar serie</button>
          </div>
        </article>`;
    });

    html += `
      <button class="btn block" data-action="add-to-workout">${ICON.plus} Añadir ejercicio</button>
      <div class="finish-bar stack">
        <button class="btn sm block" data-action="manual-timer">${ICON.clock} Iniciar descanso (${fmtRest(db.settings.rest)})</button>
        <button class="btn primary block" data-action="finish-workout">Terminar entrenamiento</button>
        <button class="btn ghost block" data-action="cancel-workout">Descartar</button>
      </div>`;
    return html;
  }

  let clockInt = null;
  function updateClock() {
    clearInterval(clockInt);
    const el = $('#wk-clock');
    if (!el || !db.active) return;
    const tick = () => { el.textContent = fmtClock(activeMs(db.active) / 1000); };
    tick();
    clockInt = setInterval(() => { if (!document.body.contains(el) || !db.active) return clearInterval(clockInt); tick(); }, 1000);
  }

  function pauseWorkout() {
    const a = db.active;
    if (!a || a.pausedAt) return;
    a.pausedAt = Date.now();
    db.timer = null;
    save(); render(); toast('Entrenamiento en pausa ⏸');
  }
  function resumeWorkout(silent) {
    const a = db.active;
    if (!a || !a.pausedAt) return;
    a.pausedMs = (a.pausedMs || 0) + (Date.now() - a.pausedAt);
    delete a.pausedAt;
    save(); render();
    if (!silent) toast('¡Seguimos! ▶');
  }
  function discardWorkout() {
    db.active = null; db.timer = null; save(); render(); toast('Entrenamiento descartado');
  }

  function clockMenu() {
    const a = db.active;
    if (!a) return;
    const done = a.entries.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);
    const s = openSheet({
      title: 'Entrenamiento',
      body: () => `
        <p class="muted" style="margin:0 2px 12px">Tiempo activo: <b style="color:var(--text)">${fmtClock(activeMs(a) / 1000)}</b> · ${done} series completadas</p>
        <div class="set-group">
          ${a.pausedAt
            ? `<button class="set-line" data-action="cm-resume"><span>▶️ Reanudar</span>${ICON.chev}</button>`
            : `<button class="set-line" data-action="cm-pause"><span>⏸ Pausar el reloj</span>${ICON.chev}</button>`}
          <button class="set-line" data-action="cm-finish"><span>✅ Terminar y guardar</span>${ICON.chev}</button>
          <button class="set-line" data-action="cm-discard" style="color:var(--danger)"><span>🗑️ Descartar entrenamiento</span>${ICON.chev}</button>
        </div>`,
      foot: () => `<button class="btn block" data-action="close-sheet">Seguir entrenando</button>`,
      actions: {
        'cm-pause': () => { s.close(); pauseWorkout(); },
        'cm-resume': () => { s.close(); resumeWorkout(); },
        'cm-finish': () => { s.close(); finishWorkout(); },
        'cm-discard': () => { s.close(); ask('¿Descartar entrenamiento?', 'No se guardará nada de esta sesión.', 'Descartar', true).then((ok) => { if (ok) discardWorkout(); }); }
      }
    });
  }

  // Si un entrenamiento lleva más de 3 horas abierto, preguntar si se olvidó
  function checkStale() {
    const a = db.active;
    if (!a || a.pausedAt || sheets.length) return;
    const ms = activeMs(a);
    if (ms < STALE_MS || (a.staleAck && ms - a.staleAck < STALE_MS)) return;
    const done = a.entries.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);
    const s = openSheet({
      title: '¿Sigues entrenando?',
      body: () => `
        <div class="empty" style="padding:6px 0 10px"><div class="big">⏰</div>
          <p>"${esc(a.name)}" lleva <b style="color:var(--text)">${fmtDur(ms)}</b> abierto${done ? ` con ${done} series completadas` : ' y no has marcado ninguna serie'}.</p></div>`,
      foot: () => `
        ${done ? '<button class="btn primary block" data-action="st-finish">Terminar y guardar</button>' : ''}
        <button class="btn ${done ? '' : 'danger'} block" data-action="st-discard">Descartar entrenamiento</button>
        <button class="btn ghost block" data-action="st-keep">Sigo entrenando</button>`,
      actions: {
        'st-finish': () => { s.close(); finishWorkout(); },
        'st-discard': () => { s.close(); discardWorkout(); },
        'st-keep': () => { a.staleAck = activeMs(a); save(); s.close(); }
      }
    });
  }

  function toggleSet(ei, si) {
    if (db.active.pausedAt) resumeWorkout(true);
    const e = db.active.entries[ei];
    const s = e.sets[si];
    if (s.done) { s.done = false; save(); render(); return; }
    if (s.w == null && s.pw != null) s.w = s.pw;
    if (s.r == null) s.r = s.pr ?? (parseInt(e.target, 10) || null);
    if (s.r == null) {
      const unitName = unitOf(exById(e.exId)) === 'reps' ? 'las repeticiones' : 'el tiempo';
      toast(`Escribe ${unitName} de la serie`);
      const inp = document.querySelector(`input[data-field="r"][data-e="${ei}"][data-s="${si}"]`);
      inp && inp.focus();
      return;
    }
    s.done = true;
    // Propagar peso a las siguientes series vacías para escribir menos
    for (let k = si + 1; k < e.sets.length; k++) {
      if (!e.sets[k].done && e.sets[k].w == null && s.w != null) e.sets[k].pw = e.sets[k].pw ?? s.w;
    }
    save();
    if (navigator.vibrate && db.settings.vibrate) navigator.vibrate(30);
    const isLastOverall = db.active.entries.every((x) => x.sets.every((y) => y.done));
    if (!isLastOverall) startTimer(e.rest);
    render();
    if (isLastOverall) toast('¡Todas las series hechas! Termina el entreno 🎉');
  }

  function finishWorkout() {
    const a = db.active;
    const entries = a.entries
      .map((e) => ({ exId: e.exId, sets: e.sets.filter((s) => s.done).map((s) => ({ w: s.w, r: s.r })) }))
      .filter((e) => e.sets.length);
    if (!entries.length) {
      ask('Sin series completadas', 'No marcaste ninguna serie. ¿Quieres descartar este entrenamiento?', 'Descartar', true).then((ok) => {
        if (ok) { db.active = null; db.timer = null; save(); render(); }
      });
      return;
    }
    const pending = a.entries.reduce((n, e) => n + e.sets.filter((s) => !s.done).length, 0);
    ask('¿Terminar entrenamiento?', pending ? `Quedan ${pending} series sin marcar; no se guardarán.` : 'Se guardará en tu historial.', 'Guardar y terminar').then((ok) => {
      if (!ok) return;
      // Récords: comparar con el historial previo
      const prs = [];
      for (const e of entries) {
        const prevBest = exerciseStats(e.exId).reduce((m, p) => Math.max(m, p.maxW), 0);
        const prevReps = exerciseStats(e.exId).reduce((m, p) => Math.max(m, p.maxR), 0);
        const had = exerciseStats(e.exId).length > 0;
        const maxW = Math.max(...e.sets.map((s) => s.w || 0));
        const maxR = Math.max(...e.sets.map((s) => s.r || 0));
        if (had && maxW > 0 && maxW > prevBest) prs.push(`${exById(e.exId).n}: ${fmtN(toDisp(maxW))} ${unit()}`);
        else if (had && maxW === 0 && prevBest === 0 && maxR > prevReps) prs.push(`${exById(e.exId).n}: ${maxR} ${unitOf(exById(e.exId))}`);
      }
      const now = Date.now();
      const pausedMs = (a.pausedMs || 0) + (a.pausedAt ? now - a.pausedAt : 0);
      const session = { id: a.id, name: a.name, routineId: a.routineId, start: a.start, end: now, pausedMs, entries, prs };
      db.history.push(session);
      db.active = null;
      db.timer = null;
      save();
      render();
      showSummary(session);
    });
  }

  function showSummary(s) {
    const { vol, sets } = sessionVolume(s);
    openSheet({
      title: '¡Entrenamiento guardado!',
      body: () => `
        <div class="empty" style="padding:8px 0 16px"><div class="big">🏆</div><h3>${esc(s.name)}</h3><p class="muted cap">${esc(fmtDate(s.start, { weekday: 'long', day: 'numeric', month: 'long' }))}</p></div>
        <div class="kpis">
          <div class="kpi"><b>${fmtDur(sesDur(s))}</b><span>Duración</span></div>
          <div class="kpi"><b>${sets}</b><span>Series</span></div>
          <div class="kpi"><b>${fmtN(round(toDisp(vol), 0))}</b><span>Volumen (${unit()})</span></div>
        </div>
        ${s.prs && s.prs.length ? `<div class="section-title">Nuevos récords</div><div class="stack">${s.prs.map((p) => `<div class="card" style="margin:0"><span class="pr-badge">PR</span> ${esc(p)}</div>`).join('')}</div>` : ''}`,
      foot: () => `<button class="btn primary block" data-action="close-sheet">Genial</button>`
    });
  }

  /* ---------------- Temporizador de descanso ---------------- */
  let timerInt = null;
  let finishedShownUntil = 0;
  function startTimer(sec) {
    db.timer = { end: Date.now() + sec * 1000, dur: sec };
    finishedShownUntil = 0;
    save();
    renderTimer();
  }
  function stopTimer() { db.timer = null; save(); renderTimer(); }
  function adjustTimer(delta) {
    if (!db.timer) return;
    db.timer.end += delta * 1000;
    db.timer.dur = Math.max(1, db.timer.dur + delta);
    if (db.timer.end <= Date.now()) { stopTimer(); return; }
    save(); renderTimer();
  }
  function renderTimer() {
    const el = $('#timer');
    clearInterval(timerInt);
    if (!db.timer) {
      if (Date.now() < finishedShownUntil) return;
      el.hidden = true; el.className = 'timer'; return;
    }
    el.hidden = false;
    el.className = 'timer';
    el.innerHTML = `
      <button class="t-btn" data-action="timer-adj" data-d="-15" aria-label="Restar 15 segundos">−15</button>
      <div class="t-main"><div class="t-label">Descanso</div><div class="t-time" id="t-time">0:00</div></div>
      <button class="t-btn" data-action="timer-adj" data-d="15" aria-label="Sumar 15 segundos">+15</button>
      <button class="t-btn" data-action="timer-skip" aria-label="Saltar descanso">${ICON.close}</button>
      <i class="bar" id="t-bar"></i>`;
    const tick = () => {
      if (!db.timer) return;
      const left = (db.timer.end - Date.now()) / 1000;
      if (left <= 0) {
        clearInterval(timerInt);
        db.timer = null; save();
        if (left < -10) { el.hidden = true; return; } // terminó hace rato (app cerrada)
        beep();
        finishedShownUntil = Date.now() + 2500;
        el.className = 'timer finished';
        el.innerHTML = `<div class="t-main"><div class="t-label">Descanso terminado</div><div class="t-time">¡A darle! 💪</div></div><button class="t-btn" data-action="timer-skip" aria-label="Cerrar">${ICON.close}</button>`;
        setTimeout(() => { if (!db.timer) { el.hidden = true; el.className = 'timer'; } }, 2500);
        return;
      }
      $('#t-time').textContent = fmtClock(Math.ceil(left));
      $('#t-bar').style.width = `${Math.max(0, Math.min(100, (left / db.timer.dur) * 100))}%`;
      el.classList.toggle('ending', left <= 5);
    };
    tick();
    timerInt = setInterval(tick, 250);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    renderTimer();
    if (db.active) { updateClock(); checkStale(); }
  });

  /* ================= RUTINAS ================= */
  function renderRoutines() {
    let html = `
      <button class="gen-cta" data-action="generator">
        <span class="gen-cta-art">${['sentadilla-goblet', 'press-banca', 'dominadas'].map((id) => thumb(exById(id))).join('')}</span>
        <span class="grow"><b>Armar mi rutina ✨</b><small>Plan personalizado según tu objetivo, nivel y días</small></span>${ICON.chev}
      </button>
      <button class="btn block" data-action="new-routine" style="margin-bottom:14px">${ICON.plus} Nueva rutina manual</button>`;
    if (!db.routines.length) {
      html += `<div class="card empty"><div class="big">📅</div><h3>Aún no tienes rutinas</h3><p>Crea una rutina, asígnale días de la semana y añade ejercicios con sus series, repeticiones y descanso.</p><button class="btn block" data-action="sample-routines">Cargar rutinas de ejemplo</button></div>`;
      return html;
    }
    for (const d of WEEK_ORDER) {
      const rs = db.routines.filter((r) => r.days.includes(d));
      if (!rs.length) continue;
      html += `<div class="section-title">${DAY_NAME[d]}</div>` + rs.map((r) => routineCard(r, d === new Date().getDay())).join('');
    }
    const free = db.routines.filter((r) => !r.days.length);
    if (free.length) html += `<div class="section-title">Sin día asignado</div>` + free.map((r) => routineCard(r)).join('');
    return html;
  }

  function editRoutine(id) {
    const orig = db.routines.find((r) => r.id === id);
    const draft = orig ? JSON.parse(JSON.stringify(orig)) : { id: uid(), name: '', days: [], items: [] };
    const sheet = openSheet({
      title: orig ? 'Editar rutina' : 'Nueva rutina',
      full: true,
      body: () => `
        <label class="field"><span>Nombre</span><input class="input" data-r="name" value="${esc(draft.name)}" placeholder="Ej. Pecho y tríceps" maxlength="60" autocomplete="off"></label>
        <div class="field"><span>Días de la semana</span>
          <div class="days">${WEEK_ORDER.map((d) => `<button class="${draft.days.includes(d) ? 'on' : ''}" data-action="r-day" data-d="${d}" aria-pressed="${draft.days.includes(d)}">${DAY_NAME[d].slice(0, 3)}</button>`).join('')}</div>
        </div>
        <div class="section-title">Ejercicios (${draft.items.length})</div>
        ${draft.items.length ? '' : '<p class="muted small">Añade ejercicios desde la biblioteca.</p>'}
        ${draft.items.map((it, i) => {
          const ex = exById(it.exId);
          const u = unitOf(ex);
          return `
          <div class="re-item">
            <div class="top">
              <button class="ex-thumb sm" data-action="ex-detail" data-id="${esc(ex.id)}" aria-label="Ver técnica">${thumb(ex, 'sm')}</button>
              <b class="ellipsis">${i + 1}. ${esc(ex.n)}</b>
              <button class="mini" data-action="r-move" data-i="${i}" data-d="-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
              <button class="mini" data-action="r-move" data-i="${i}" data-d="1" aria-label="Bajar" ${i === draft.items.length - 1 ? 'disabled' : ''}>${ICON.down}</button>
              <button class="mini del" data-action="r-del" data-i="${i}" aria-label="Quitar">${ICON.trash}</button>
            </div>
            <div class="re-grid">
              <label><span>Series</span>
                <div class="stepper"><button data-action="r-sets" data-i="${i}" data-d="-1" aria-label="Menos series">−</button><b>${it.sets}</b><button data-action="r-sets" data-i="${i}" data-d="1" aria-label="Más series">+</button></div>
              </label>
              <label><span>${u === 'reps' ? 'Reps' : u === 'seg' ? 'Segundos' : 'Minutos'}</span>
                <input class="input" data-r="reps" data-i="${i}" value="${esc(it.reps)}" placeholder="${u === 'reps' ? '8-12' : '30'}" inputmode="text" maxlength="9" autocomplete="off">
              </label>
              <label><span>Descanso</span>
                <select class="input" data-r="rest" data-i="${i}">${REST_OPTIONS.map((s) => `<option value="${s}" ${s === it.rest ? 'selected' : ''}>${fmtRest(s)}</option>`).join('')}</select>
              </label>
            </div>
          </div>`;
        }).join('')}
        <button class="btn block" data-action="r-add">${ICON.plus} Añadir ejercicios</button>
        ${orig ? `<button class="btn danger block" data-action="r-delete" style="margin-top:22px">${ICON.trash} Eliminar rutina</button>` : ''}`,
      foot: () => `<button class="btn primary block" data-action="r-save">Guardar rutina</button>`,
      onInput(t) {
        if (t.dataset.r === 'name') draft.name = t.value;
        if (t.dataset.r === 'reps') draft.items[+t.dataset.i].reps = t.value.trim();
        if (t.dataset.r === 'rest') draft.items[+t.dataset.i].rest = +t.value;
      },
      actions: {
        'r-day': (b) => { const d = +b.dataset.d; draft.days = draft.days.includes(d) ? draft.days.filter((x) => x !== d) : draft.days.concat(d); sheet.refresh(); },
        'r-move': (b) => { const i = +b.dataset.i, j = i + +b.dataset.d; if (j < 0 || j >= draft.items.length) return; [draft.items[i], draft.items[j]] = [draft.items[j], draft.items[i]]; sheet.refresh(); },
        'r-del': (b) => { draft.items.splice(+b.dataset.i, 1); sheet.refresh(); },
        'r-sets': (b) => { const it = draft.items[+b.dataset.i]; it.sets = Math.max(1, Math.min(10, it.sets + +b.dataset.d)); sheet.refresh(); },
        'r-add': () => openPicker((ids) => {
          ids.forEach((exId) => { const u = unitOf(exById(exId)); draft.items.push({ exId, sets: 3, reps: u === 'reps' ? '10' : u === 'seg' ? '30' : '10', rest: db.settings.rest }); });
          sheet.refresh();
          requestAnimationFrame(() => { const b = sheet.el.querySelector('.sheet-body'); b.scrollTop = b.scrollHeight; });
        }),
        'r-delete': () => ask('¿Eliminar rutina?', `"${draft.name || 'Sin nombre'}" se borrará. Tu historial se conserva.`, 'Eliminar', true).then((ok) => {
          if (!ok) return;
          db.routines = db.routines.filter((r) => r.id !== draft.id);
          save(); sheet.close(); render(); toast('Rutina eliminada');
        }),
        'r-save': () => {
          draft.name = draft.name.trim();
          if (!draft.name) { toast('Ponle un nombre a la rutina'); sheet.el.querySelector('[data-r="name"]').focus(); return; }
          const idx = db.routines.findIndex((r) => r.id === draft.id);
          if (idx >= 0) db.routines[idx] = draft; else db.routines.push(draft);
          save(); sheet.close(); render(); toast('Rutina guardada ✅');
        }
      }
    });
    if (!orig) setTimeout(() => sheet.el.querySelector('[data-r="name"]')?.focus(), 300);
  }

  function loadSamples() {
    const mk = (name, days, list) => ({ id: uid(), name, days, items: list.map(([exId, sets, reps, rest]) => ({ exId, sets, reps, rest: rest || 90 })) });
    db.routines.push(
      mk('Full body en casa', [1, 3, 5], [
        ['flexiones', 3, '10-15', 60], ['sentadilla-libre', 3, '15', 60], ['remo-invertido', 3, '8-12', 60],
        ['zancadas', 3, '12', 60], ['flexiones-declinadas', 3, '8-12', 60], ['puente-gluteo', 3, '15', 45], ['plancha', 3, '30', 45]
      ]),
      mk('Torso gym', [2], [
        ['press-banca', 4, '6-8', 150], ['remo-barra', 4, '8', 120], ['press-inclinado-mancuernas', 3, '10', 90],
        ['jalon-pecho', 3, '10', 90], ['elevaciones-laterales', 3, '12-15', 60], ['curl-mancuernas', 3, '10', 60], ['extension-polea', 3, '12', 60]
      ]),
      mk('Pierna gym', [4], [
        ['sentadilla-barra', 4, '6-8', 180], ['peso-muerto-rumano', 3, '8-10', 120], ['prensa', 3, '12', 90],
        ['curl-femoral', 3, '12', 60], ['hip-thrust', 3, '10', 90], ['pantorrillas', 4, '15', 45]
      ])
    );
    save(); render(); toast('Rutinas de ejemplo añadidas');
  }

  /* ================= GENERADOR DE RUTINAS ================= */
  const GOALS = [
    { id: 'musculo', n: 'Ganar músculo', d: 'Hipertrofia: más volumen y tamaño', i: '💪' },
    { id: 'fuerza', n: 'Ganar fuerza', d: 'Cargas altas y pocas repeticiones', i: '🏋️' },
    { id: 'grasa', n: 'Perder grasa', d: 'Ritmo alto, descansos cortos y cardio', i: '🔥' },
    { id: 'salud', n: 'Tonificar y salud', d: 'Ponerte en forma y sentirte bien', i: '❤️' }
  ];
  const LEVELS = [
    { id: 'principiante', n: 'Principiante', d: 'Llevo menos de 6 meses entrenando', i: '🌱' },
    { id: 'intermedio', n: 'Intermedio', d: 'Entreno de forma constante hace 6 meses–2 años', i: '⚡' },
    { id: 'avanzado', n: 'Avanzado', d: 'Más de 2 años entrenando en serio', i: '🏆' }
  ];
  const DURATIONS = [[30, '30 min'], [45, '45 min'], [60, '60 min'], [75, '75+ min']];
  const DEFAULT_DAYS = { 1: [1], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 5, 6], 6: [1, 2, 3, 4, 5, 6] };

  // Cada "hueco" de la rutina con candidatos en orden de preferencia
  const SLOTS = {
    sq: ['sentadilla-barra', 'sentadilla-goblet', 'prensa', 'sentadilla-bulgara', 'sentadilla-libre'],
    sq2: ['prensa', 'zancadas', 'sentadilla-bulgara', 'sentadilla-goblet', 'step-up', 'sentadilla-libre'],
    hinge: ['peso-muerto-rumano', 'peso-muerto-rumano-mancuernas', 'hip-thrust', 'puente-una-pierna', 'puente-gluteo'],
    deadlift: ['peso-muerto', 'peso-muerto-rumano', 'peso-muerto-rumano-mancuernas', 'puente-una-pierna'],
    pushH: ['press-banca', 'press-mancuernas', 'press-maquina-pecho', 'flexiones', 'flexiones-inclinadas'],
    pushInc: ['press-inclinado-mancuernas', 'fondos-paralelas', 'cruce-poleas', 'flexiones-declinadas', 'aperturas', 'flexiones-inclinadas'],
    pushV: ['press-militar', 'press-hombro-mancuernas', 'press-hombro-banda', 'flexiones-pino', 'flexiones-declinadas'],
    pullV: ['dominadas', 'jalon-pecho', 'dominadas-supinas', 'remo-invertido'],
    pullH: ['remo-barra', 'remo-polea-baja', 'remo-mancuerna', 'remo-invertido', 'superman'],
    lat: ['elevaciones-laterales', 'elevaciones-laterales-banda', 'elevaciones-frontales'],
    rear: ['face-pull', 'pajaros', 'separacion-banda', 'superman'],
    bi: ['curl-barra', 'curl-mancuernas', 'curl-martillo', 'curl-polea', 'curl-concentrado', 'curl-predicador', 'curl-banda', 'dominadas-supinas'],
    tri: ['extension-polea', 'press-frances', 'extension-sobre-cabeza', 'fondos-silla', 'flexiones-diamante', 'patada-triceps'],
    quadIso: ['extension-cuadriceps', 'zancadas', 'step-up', 'sentadilla-bulgara'],
    ham: ['curl-femoral', 'peso-muerto-rumano-mancuernas', 'puente-una-pierna', 'superman'],
    glute: ['hip-thrust', 'abduccion-maquina', 'caminata-banda', 'puente-una-pierna', 'extension-cadera-banda', 'abduccion-lateral', 'puente-gluteo'],
    calf: ['pantorrillas'],
    abd: ['abduccion-maquina', 'caminata-banda', 'abduccion-lateral'],
    core: ['crunch-polea', 'plancha', 'elevacion-piernas-colgado', 'crunch-bicicleta', 'dead-bug', 'elevacion-piernas', 'plancha-lateral', 'russian-twist', 'crunch'],
    cardio: ['cinta', 'bici-estatica', 'remo-ergometro', 'eliptica', 'mountain-climbers', 'burpees', 'jumping-jacks', 'sentadilla-salto']
  };
  const COMPOUND = ['sq', 'sq2', 'hinge', 'deadlift', 'pushH', 'pushInc', 'pushV', 'pullV', 'pullH'];
  const NOT_BEGINNER = ['peso-muerto', 'flexiones-pino', 'elevacion-piernas-colgado', 'rueda-abdominal', 'fondos-paralelas', 'dominadas', 'dominadas-supinas', 'sentadilla-barra', 'press-frances', 'sentadilla-bulgara'];
  const TEMPLATES = {
    fullA: { n: 'Full body A', s: [['sq', 0], ['pushH', 0], ['pullH', 0], ['hinge', 0], ['pushV', 0], ['core', 0], ['bi', 0], ['tri', 0], ['calf', 0]] },
    fullB: { n: 'Full body B', s: [['sq2', 0], ['pushInc', 0], ['pullV', 0], ['hinge', 1], ['lat', 0], ['core', 1], ['tri', 1], ['bi', 1], ['glute', 0]] },
    fullC: { n: 'Full body C', s: [['sq', 1], ['pushH', 1], ['pullH', 1], ['glute', 0], ['rear', 0], ['core', 2], ['bi', 0], ['tri', 0], ['calf', 0]] },
    upA: { n: 'Torso A', s: [['pushH', 0], ['pullV', 0], ['pushV', 0], ['pullH', 0], ['lat', 0], ['bi', 0], ['tri', 0], ['rear', 0]] },
    upB: { n: 'Torso B', s: [['pullH', 1], ['pushInc', 0], ['pullV', 1], ['pushH', 1], ['rear', 0], ['tri', 1], ['bi', 1], ['lat', 0]] },
    lowA: { n: 'Pierna A', s: [['sq', 0], ['hinge', 0], ['quadIso', 0], ['ham', 0], ['glute', 0], ['calf', 0], ['core', 0]] },
    lowB: { n: 'Pierna B', s: [['hinge', 1], ['sq2', 0], ['glute', 0], ['ham', 0], ['quadIso', 1], ['calf', 0], ['core', 1]] },
    push: { n: 'Empuje', s: [['pushH', 0], ['pushV', 0], ['pushInc', 0], ['lat', 0], ['tri', 0], ['tri', 1], ['core', 0]] },
    pull: { n: 'Tirón', s: [['pullV', 0], ['pullH', 0], ['pullH', 0], ['rear', 0], ['bi', 0], ['bi', 1], ['core', 1]] },
    fullG: { n: 'Full body glúteo', s: [['glute', 0], ['sq', 0], ['pushH', 0], ['pullH', 0], ['hinge', 0], ['abd', 0], ['core', 0], ['pushV', 0], ['ham', 0]] },
    lowG: { n: 'Glúteo y pierna', s: [['glute', 0], ['sq2', 0], ['hinge', 0], ['abd', 0], ['ham', 0], ['glute', 1], ['calf', 0], ['core', 0]] },
    arms: { n: 'Hombro y brazo', s: [['pushV', 0], ['lat', 0], ['bi', 0], ['tri', 0], ['bi', 1], ['tri', 1], ['rear', 0], ['core', 0]] }
  };
  const FOCUS = [
    { id: 'equilibrado', n: 'Equilibrado', d: 'Todo el cuerpo por igual', i: '⚖️' },
    { id: 'gluteos', n: 'Glúteos y piernas', d: 'Más volumen para tren inferior', i: '🍑' },
    { id: 'superior', n: 'Tren superior', d: 'Más pecho, espalda, hombros y brazos', i: '💪' }
  ];

  function splitFor(n, level, focus) {
    if (focus === 'gluteos') {
      return [[['fullG', 0]], [['fullG', 0], ['fullB', 0]], [['lowG', 0], ['upA', 0], ['lowG', 1]], [['lowG', 0], ['upA', 0], ['lowG', 1], ['upB', 0]],
        [['lowG', 0], ['upA', 0], ['lowA', 0], ['upB', 0], ['lowG', 1]], [['lowG', 0], ['push', 0], ['pull', 0], ['lowG', 1], ['upA', 0], ['lowB', 0]]][Math.min(n, 6) - 1];
    }
    if (focus === 'superior') {
      return [[['fullA', 0]], [['upA', 0], ['fullB', 0]], [['upA', 0], ['lowA', 0], ['upB', 0]], [['upA', 0], ['lowA', 0], ['upB', 0], ['arms', 0]],
        [['upA', 0], ['lowA', 0], ['push', 0], ['pull', 0], ['arms', 0]], [['push', 0], ['pull', 0], ['lowA', 0], ['push', 1], ['pull', 1], ['arms', 0]]][Math.min(n, 6) - 1];
    }
    if (n <= 1) return [['fullA', 0]];
    if (n === 2) return [['fullA', 0], ['fullB', 0]];
    if (n === 3) return level === 'avanzado' ? [['push', 0], ['pull', 0], ['lowA', 0]] : [['fullA', 0], ['fullB', 0], ['fullC', 0]];
    if (n === 4) return [['upA', 0], ['lowA', 0], ['upB', 0], ['lowB', 0]];
    if (n === 5) return [['upA', 0], ['lowA', 0], ['push', 1], ['pull', 1], ['lowB', 0]];
    return [['push', 0], ['pull', 0], ['lowA', 0], ['push', 1], ['pull', 1], ['lowB', 0]];
  }

  const ONLY_BEGINNER = ['flexiones-inclinadas'];
  const ONLY_ADVANCED = ['flexiones-pino'];
  const WEAK = ['superman', 'elevaciones-frontales', 'puente-gluteo', 'crunch']; // solo si no hay nada mejor

  function exAvailable(ex, g) {
    if (!ex || !ex.p.includes(g.place)) return false;
    if (g.level === 'principiante' && NOT_BEGINNER.includes(ex.id)) return false;
    if (g.level !== 'principiante' && ONLY_BEGINNER.includes(ex.id)) return false;
    if (g.level !== 'avanzado' && ONLY_ADVANCED.includes(ex.id)) return false;
    if (g.place === 'casa') return (ex.q || []).every((q) => g.equip.includes(q));
    return true;
  }

  function prescription(slot, ex, g, idx) {
    const u = unitOf(ex);
    const L = { principiante: 0, intermedio: 1, avanzado: 2 }[g.level];
    if (u === 'min') return { sets: 1, reps: g.goal === 'grasa' ? '15' : '10', rest: 60 };
    if (u === 'seg') return { sets: 3, reps: ['30', '40', '60'][L], rest: g.goal === 'grasa' ? 30 : 45 };
    const comp = COMPOUND.includes(slot);
    const bodyweight = !ex.q || !ex.q.length ? g.place === 'casa' && !/mancuern|barra/i.test(ex.e || '') : false;
    let sets, reps, rest;
    switch (g.goal) {
      case 'fuerza':
        if (comp && idx < 2) { sets = [3, 4, 5][L]; reps = '4-6'; rest = 180; }
        else if (comp) { sets = [3, 3, 4][L]; reps = '6-8'; rest = 120; }
        else { sets = 3; reps = '8-12'; rest = 75; }
        break;
      case 'grasa':
        sets = comp ? [3, 3, 4][L] : 3; reps = comp ? '12-15' : '15-20'; rest = comp ? 60 : 45;
        break;
      case 'salud':
        sets = comp ? 3 : [2, 3, 3][L]; reps = comp ? '10-12' : '12-15'; rest = comp ? 75 : 60;
        break;
      default: // músculo
        if (comp && idx === 0 && L > 0) { sets = 4; reps = '6-10'; rest = 120; }
        else if (comp) { sets = [3, 4, 4][L]; reps = '8-12'; rest = 90; }
        else { sets = [2, 3, 4][L]; reps = '10-15'; rest = 60; }
    }
    if (bodyweight && g.place === 'casa') {
      reps = { fuerza: '6-12', musculo: '10-20', grasa: '15-20', salud: '10-15' }[g.goal];
      if (rest > 90) rest = 90;
    }
    return { sets, reps, rest };
  }

  function generatePlan(g) {
    const days = WEEK_ORDER.filter((d) => g.days.includes(d));
    const split = splitFor(days.length, g.level, g.focus);
    const perDay = { 30: 4, 45: 5, 60: 6, 75: 7 }[g.dur] - (g.level === 'principiante' && g.dur > 45 ? 1 : 0);
    const goal = GOALS.find((x) => x.id === g.goal);
    const level = LEVELS.find((x) => x.id === g.level);
    return split.map(([tid, vOff], i) => {
      const t = TEMPLATES[tid];
      const used = new Set();
      const items = [];
      let slots = t.s.map(([slot, v]) => [g.goal === 'fuerza' && slot === 'hinge' && v === 0 && g.place === 'gym' && g.level !== 'principiante' ? 'deadlift' : slot, v]);
      if (g.goal === 'grasa') slots = slots.slice(0, perDay - 1).concat([['cardio', i]]);
      for (const [slot, v] of slots) {
        if (items.length >= perDay) break;
        const cands = SLOTS[slot].map(exById).filter((ex) => exAvailable(ex, g) && !used.has(ex.id));
        if (!cands.length) continue;
        const strong = cands.filter((ex) => !WEAK.includes(ex.id));
        const pool = strong.length ? strong : cands;
        const ex = pool[(v + vOff + g.seed) % Math.min(pool.length, 2)];
        used.add(ex.id);
        items.push({ exId: ex.id, ...prescription(slot, ex, g, items.length) });
      }
      // Rellenar si faltan ejercicios (p. ej. en casa sin material)
      const fill = ['core', 'glute', 'sq2', 'pushH', 'pullH', 'cardio'];
      for (let k = 0; items.length < Math.min(perDay, 5) && k < fill.length; k++) {
        const ex = SLOTS[fill[k]].map(exById).find((e) => exAvailable(e, g) && !used.has(e.id));
        if (ex) { used.add(ex.id); items.push({ exId: ex.id, ...prescription(fill[k], ex, g, items.length) }); }
      }
      const name = t.n + (vOff && /Empuje|Tirón|Glúteo/.test(t.n) ? ' B' : '') + (g.place === 'casa' ? ' · Casa' : '');
      return { id: uid(), name, days: [days[i]], items, note: `${goal.n} · ${level.n}` };
    });
  }

  function openGenerator() {
    const pSex = db.profile && db.profile.sex ? db.profile.sex : null;
    const g = { step: 0, goal: null, sex: pSex, focus: pSex === 'm' ? 'gluteos' : 'equilibrado', place: null, equip: [], level: null, days: DEFAULT_DAYS[3].slice(), dur: 60, seed: 0, replace: db.routines.length > 0 };
    let plan = null;
    const STEPS = 6;
    const optCard = (action, o, on) => `
      <button class="opt ${on ? 'on' : ''}" data-action="${action}" data-v="${o.id}">
        <span class="opt-i">${o.i}</span><span class="grow"><b>${esc(o.n)}</b><small>${esc(o.d)}</small></span>
        <span class="check">${on ? ICON.check.replace('stroke-width="3"', 'stroke-width="3" width="16" height="16"') : ''}</span>
      </button>`;
    const stepBody = () => {
      const dots = `<div class="wiz-dots">${Array.from({ length: STEPS }, (_, k) => `<i class="${k <= g.step ? 'on' : ''}"></i>`).join('')}</div>`;
      if (g.step === 0) return dots + `<h3 class="wiz-q">¿Cuál es tu objetivo?</h3><div class="opts">${GOALS.map((o) => optCard('g-goal', o, g.goal === o.id)).join('')}</div>`;
      if (g.step === 1) return dots + `<h3 class="wiz-q">¿Para quién es la rutina?</h3>
        <div class="seg big-seg" style="margin-bottom:16px">
          <button class="${g.sex === 'h' ? 'on' : ''}" data-action="g-sex" data-v="h">👨 Hombre</button>
          <button class="${g.sex === 'm' ? 'on' : ''}" data-action="g-sex" data-v="m">👩 Mujer</button>
        </div>
        ${g.sex ? `<div class="section-title">¿Qué quieres priorizar?</div><div class="opts">${FOCUS.map((o) => optCard('g-focus', o, g.focus === o.id)).join('')}</div>
        <p class="muted small">${g.sex === 'm' ? 'Para mujeres sugerimos más glúteos y piernas, pero puedes elegir lo que prefieras.' : 'Elige equilibrado si no tienes una preferencia clara.'}</p>` : ''}`;
      if (g.step === 2) return dots + `<h3 class="wiz-q">¿Dónde vas a entrenar?</h3>
        <div class="opts">
          ${optCard('g-place', { id: 'gym', n: 'En el gimnasio', d: 'Máquinas, barras, poleas y mancuernas', i: '🏋️' }, g.place === 'gym')}
          ${optCard('g-place', { id: 'casa', n: 'En casa', d: 'Con tu peso corporal y lo que tengas', i: '🏠' }, g.place === 'casa')}
        </div>
        ${g.place === 'casa' ? `<div class="section-title">¿Qué material tienes?</div>
          <div class="chips wrap">${EQUIP.map((q) => `<button class="chip ${g.equip.includes(q.id) ? 'on' : ''}" data-action="g-equip" data-v="${q.id}">${esc(q.n)}</button>`).join('')}</div>
          <p class="muted small">Si no marcas nada, la rutina será solo con peso corporal (suelo, silla y mesa).</p>` : ''}`;
      if (g.step === 3) return dots + `<h3 class="wiz-q">¿Cuál es tu nivel?</h3><div class="opts">${LEVELS.map((o) => optCard('g-level', o, g.level === o.id)).join('')}</div>`;
      if (g.step === 4) return dots + `<h3 class="wiz-q">¿Cuántos días por semana?</h3>
        <div class="chips wrap" style="margin-bottom:14px">${[2, 3, 4, 5, 6].map((n) => `<button class="chip big ${g.days.length === n ? 'on' : ''}" data-action="g-ndays" data-v="${n}">${n} días</button>`).join('')}</div>
        <div class="field"><span>Elige qué días</span>
          <div class="days">${WEEK_ORDER.map((d) => `<button class="${g.days.includes(d) ? 'on' : ''}" data-action="g-day" data-d="${d}">${DAY_NAME[d].slice(0, 3)}</button>`).join('')}</div>
        </div>
        <div class="field"><span>Tiempo por sesión</span>
          <div class="seg">${DURATIONS.map(([v, l]) => `<button class="${g.dur === v ? 'on' : ''}" data-action="g-dur" data-v="${v}">${l}</button>`).join('')}</div>
        </div>
        <p class="muted small">${splitInfo(g.days.length, g.level, g.focus)}</p>`;
      // Paso 5: vista previa
      plan = generatePlan(g);
      return dots + `<h3 class="wiz-q">Tu plan está listo ✨</h3>
        <p class="muted" style="margin-top:-6px">${esc(GOALS.find((x) => x.id === g.goal).n)} · ${sexName(g.sex)} · ${esc(FOCUS.find((x) => x.id === g.focus).n)} · ${g.place === 'casa' ? 'Casa' : 'Gimnasio'} · ${esc(LEVELS.find((x) => x.id === g.level).n)} · ${g.days.length} días · ${g.dur} min</p>
        ${plan.map((r) => `
          <div class="gen-day">
            <div class="gen-head"><span class="gen-dayname">${DAY_NAME[r.days[0]]}</span><b>${esc(r.name)}</b><span class="muted small">${r.items.length} ejercicios</span></div>
            ${r.items.map((it) => { const ex = exById(it.exId); const u = unitOf(ex); return `
              <button class="gen-ex" data-action="ex-detail" data-id="${esc(ex.id)}">
                ${thumb(ex)}
                <span class="grow"><span class="name">${esc(ex.n)}</span><span class="meta">${it.sets} × ${esc(it.reps)}${u === 'reps' ? ' reps' : ' ' + u} · descanso ${fmtRest(it.rest)}</span></span>
                ${ICON.chev}
              </button>`; }).join('')}
          </div>`).join('')}
        <p class="muted small">Toca un ejercicio para ver cómo se hace. Podrás editar todo después en Rutinas.</p>
        ${db.routines.length ? `<button class="set-line plain" data-action="g-replace"><span>Reemplazar mis rutinas actuales (${db.routines.length})</span><span class="switch ${g.replace ? 'on' : ''}"></span></button>` : ''}`;
    };
    const canNext = () => [g.goal, g.sex, g.place, g.level, g.days.length][g.step] != null && (g.step !== 4 || g.days.length > 0);
    const s = openSheet({
      title: 'Armar mi rutina',
      full: true,
      body: stepBody,
      foot: () => g.step < 5
        ? `<div class="btn-row">${g.step > 0 ? '<button class="btn" data-action="g-back">Atrás</button>' : ''}<button class="btn primary" data-action="g-next" ${canNext() ? '' : 'disabled style="opacity:.45"'}>${g.step === 4 ? 'Crear mi plan' : 'Siguiente'}</button></div>`
        : `<button class="btn primary block" data-action="g-save">${ICON.check.replace('<svg', '<svg width="20" height="20"')} Guardar plan</button>
           <div class="btn-row" style="margin-top:8px"><button class="btn" data-action="g-back">Atrás</button><button class="btn" data-action="g-shuffle">🔄 Otra variante</button></div>`,
      actions: {
        'g-goal': (b) => { g.goal = b.dataset.v; go(1); },
        'g-sex': (b) => { g.sex = b.dataset.v; if (!g.focusSet) g.focus = g.sex === 'm' ? 'gluteos' : 'equilibrado'; s.refresh(); },
        'g-focus': (b) => { g.focus = b.dataset.v; g.focusSet = true; s.refresh(); },
        'g-place': (b) => { g.place = b.dataset.v; if (g.place === 'gym') go(1); else s.refresh(); },
        'g-equip': (b) => { const v = b.dataset.v; g.equip = g.equip.includes(v) ? g.equip.filter((x) => x !== v) : g.equip.concat(v); s.refresh(); },
        'g-level': (b) => { g.level = b.dataset.v; go(1); },
        'g-ndays': (b) => { g.days = DEFAULT_DAYS[+b.dataset.v].slice(); s.refresh(); },
        'g-day': (b) => {
          const d = +b.dataset.d;
          if (g.days.includes(d)) g.days = g.days.filter((x) => x !== d);
          else if (g.days.length >= 6) { toast('Máximo 6 días: el descanso también cuenta 😉'); return; }
          else g.days = g.days.concat(d);
          s.refresh();
        },
        'g-dur': (b) => { g.dur = +b.dataset.v; s.refresh(); },
        'g-next': () => { if (canNext()) go(1); },
        'g-back': () => go(-1),
        'g-shuffle': () => { g.seed++; s.refresh(); toast('Nueva variante generada'); },
        'g-replace': () => { g.replace = !g.replace; s.refresh(); },
        'g-save': () => {
          if (!plan || !plan.length) return;
          db.routines = g.replace ? plan : db.routines.concat(plan);
          save(); s.close(); ui.tab = 'routines'; setTab('routines');
          toast(`¡Plan guardado! ${plan.length} rutinas creadas 💪`);
        }
      }
    });
    function go(delta) {
      g.step = Math.max(0, Math.min(5, g.step + delta));
      s.refresh();
      s.el.querySelector('.sheet-body').scrollTop = 0;
    }
  }

  function splitInfo(n, level, focus) {
    if (!n) return 'Elige al menos un día.';
    const names = splitFor(n, level, focus).map(([t, v]) => TEMPLATES[t].n + (v && /Empuje|Tirón/.test(TEMPLATES[t].n) ? ' B' : ''));
    return `Tu semana: ${names.join(' → ')}.`;
  }

  /* ================= RUTINAS POR MÚSCULO (infografía) ================= */
  // [ejercicio, series, reps] por nivel. Gym y casa.
  const STAGES = {
    pecho: {
      gym: { principiante: [['press-maquina-pecho', 3, '12-15'], ['flexiones', 3, '8-12']], intermedio: [['press-mancuernas', 4, '8-12'], ['press-inclinado-mancuernas', 3, '10-12']], avanzado: [['press-banca', 4, '6-8'], ['fondos-paralelas', 3, '8-12']] },
      casa: { principiante: [['flexiones-inclinadas', 3, '10-15'], ['flexiones', 2, '6-10']], intermedio: [['flexiones', 4, '12-20'], ['flexiones-declinadas', 3, '10-15']], avanzado: [['flexiones-declinadas', 4, '15-20'], ['flexiones-diamante', 4, '12-15']] }
    },
    espalda: {
      gym: { principiante: [['jalon-pecho', 3, '12-15'], ['remo-polea-baja', 3, '12-15']], intermedio: [['remo-mancuerna', 4, '8-12'], ['dominadas', 3, '6-10']], avanzado: [['peso-muerto', 4, '5'], ['remo-barra', 4, '6-8']] },
      casa: { principiante: [['superman', 3, '12-15'], ['remo-invertido', 3, '8-10']], intermedio: [['remo-invertido', 4, '10-15'], ['remo-mancuerna', 4, '10-12']], avanzado: [['dominadas', 4, '6-10'], ['dominadas-supinas', 3, '8-10']] }
    },
    hombros: {
      gym: { principiante: [['press-hombro-mancuernas', 3, '10-12'], ['elevaciones-laterales', 3, '12-15']], intermedio: [['press-militar', 4, '8-10'], ['face-pull', 3, '12-15']], avanzado: [['press-militar', 5, '5-8'], ['pajaros', 4, '12-15']] },
      casa: { principiante: [['press-hombro-banda', 3, '10-12'], ['elevaciones-laterales-banda', 3, '12-15']], intermedio: [['press-hombro-mancuernas', 4, '10-12'], ['elevaciones-laterales', 3, '12-15']], avanzado: [['flexiones-pino', 4, '5-8'], ['pajaros', 4, '12-15']] }
    },
    biceps: {
      gym: { principiante: [['curl-polea', 3, '12-15'], ['curl-mancuernas', 3, '10-12']], intermedio: [['curl-barra', 4, '8-12'], ['curl-martillo', 3, '10-12']], avanzado: [['curl-predicador', 4, '8-10'], ['curl-concentrado', 3, '10-12']] },
      casa: { principiante: [['curl-banda', 3, '12-15'], ['curl-mancuernas', 3, '10-12']], intermedio: [['curl-martillo', 4, '10-12'], ['curl-concentrado', 3, '10-12']], avanzado: [['dominadas-supinas', 4, '6-10'], ['curl-mancuernas', 4, '8-10']] }
    },
    triceps: {
      gym: { principiante: [['extension-polea', 3, '12-15'], ['fondos-silla', 3, '10-12']], intermedio: [['press-frances', 4, '8-12'], ['extension-sobre-cabeza', 3, '10-12']], avanzado: [['fondos-paralelas', 4, '8-10'], ['press-frances', 4, '6-8']] },
      casa: { principiante: [['fondos-silla', 3, '10-12'], ['flexiones-diamante', 2, '6-10']], intermedio: [['extension-sobre-cabeza', 4, '10-12'], ['patada-triceps', 3, '12-15']], avanzado: [['flexiones-diamante', 4, '12-15'], ['fondos-silla', 4, '15-20']] }
    },
    piernas: {
      gym: { principiante: [['prensa', 3, '12-15'], ['extension-cuadriceps', 3, '12-15']], intermedio: [['sentadilla-goblet', 4, '8-12'], ['sentadilla-barra', 4, '6-10']], avanzado: [['sentadilla-bulgara', 4, '8-10'], ['peso-muerto-rumano', 4, '6-8']] },
      casa: { principiante: [['sentadilla-libre', 3, '15'], ['step-up', 3, '10']], intermedio: [['zancadas', 4, '12'], ['sentadilla-goblet', 4, '10-12']], avanzado: [['sentadilla-bulgara', 4, '10-12'], ['sentadilla-salto', 4, '12']] }
    },
    gluteos: {
      gym: { principiante: [['abduccion-maquina', 3, '15'], ['puente-gluteo', 3, '15']], intermedio: [['hip-thrust', 4, '10-12'], ['patada-polea', 3, '12-15']], avanzado: [['hip-thrust', 4, '6-8'], ['peso-muerto-rumano', 4, '8']] },
      casa: { principiante: [['puente-gluteo', 3, '15'], ['abduccion-lateral', 3, '15']], intermedio: [['puente-una-pierna', 4, '12'], ['extension-cadera-banda', 3, '15']], avanzado: [['sentadilla-bulgara', 4, '10'], ['caminata-banda', 4, '15']] }
    },
    core: {
      gym: { principiante: [['plancha', 3, '30'], ['crunch', 3, '15']], intermedio: [['crunch-polea', 4, '12-15'], ['plancha-lateral', 3, '30']], avanzado: [['elevacion-piernas-colgado', 4, '10-12'], ['rueda-abdominal', 4, '8-12']] },
      casa: { principiante: [['plancha', 3, '30'], ['dead-bug', 3, '10']], intermedio: [['crunch-bicicleta', 4, '20'], ['plancha-lateral', 3, '40']], avanzado: [['elevacion-piernas', 4, '15'], ['russian-twist', 4, '20']] }
    },
    cardio: {
      gym: { principiante: [['cinta', 1, '20'], ['bici-estatica', 1, '15']], intermedio: [['eliptica', 1, '20'], ['remo-ergometro', 1, '10']], avanzado: [['comba', 5, '2'], ['burpees', 5, '15']] },
      casa: { principiante: [['jumping-jacks', 3, '30'], ['mountain-climbers', 3, '20']], intermedio: [['burpees', 4, '10'], ['sentadilla-salto', 3, '15']], avanzado: [['burpees', 5, '15'], ['mountain-climbers', 5, '45']] }
    }
  };
  const STAGE_NAMES = { principiante: 'Principiante', intermedio: 'Intermedio', avanzado: 'Avanzado' };
  const STAGE_REST = { principiante: 60, intermedio: 90, avanzado: 120 };
  const unitShort = (ex) => ({ reps: 'reps', seg: 'seg', min: 'min' }[unitOf(ex)]);

  function renderMuscleGroups() {
    return `<p class="muted small" style="margin:0 2px 12px">Elige un grupo muscular y verás qué hacer según tu nivel, con series y repeticiones.</p>
      <div class="mg-grid">${MUSCLES.map((m) => `
        <button class="mg-card" data-action="muscle-poster" data-v="${m.id}">
          <span class="mg-maps">${bodyMap(GROUP_KEYS[m.id], [], ['espalda', 'gluteos', 'triceps'].includes(m.id) ? 'back' : 'front')}</span>
          <b>${esc(m.n)}</b>
        </button>`).join('')}</div>`;
  }

  function musclePoster(group) {
    const st = { place: ui.lib.place === 'casa' ? 'casa' : 'gym', stage: 'principiante' };
    const m = MUSCLES.find((x) => x.id === group);
    const s = openSheet({
      title: m.n,
      full: true,
      body: () => {
        const data = STAGES[group][st.place];
        return `
          <div class="seg" style="margin-bottom:12px">
            <button class="${st.place === 'gym' ? 'on' : ''}" data-action="mp-place" data-v="gym">🏋️ Gimnasio</button>
            <button class="${st.place === 'casa' ? 'on' : ''}" data-action="mp-place" data-v="casa">🏠 Casa</button>
          </div>
          <div class="poster">
            <div class="poster-title"><span>Rutina estándar</span><h2>${esc(m.n.toUpperCase())}</h2></div>
            <div class="poster-maps">${bodyMap(GROUP_KEYS[group], [], 'front')}${bodyMap(GROUP_KEYS[group], [], 'back')}</div>
            ${Object.entries(data).map(([lvl, list]) => `
              <button class="poster-stage ${st.stage === lvl ? 'on' : ''}" data-action="mp-stage" data-v="${lvl}">
                <div class="ps-text">
                  <h3>${STAGE_NAMES[lvl]}</h3>
                  ${list.map(([id, sets, reps]) => { const ex = exById(id); return `<p><b>${esc(ex.n)}:</b><br><span>${sets} ${sets === 1 ? 'serie' : 'series'} × ${esc(reps)} ${unitShort(ex)}</span></p>`; }).join('')}
                </div>
                <div class="ps-tiles">
                  ${list.map(([id, sets, reps]) => { const ex = exById(id); return `<span class="ps-tile" data-action="ex-detail" data-id="${esc(id)}">${thumb(ex)}<b>${sets}x${esc(String(reps).split('-')[0])}</b></span>`; }).join('')}
                </div>
              </button>`).join('')}
          </div>
          <p class="muted small" style="margin-top:12px">Toca un nivel para elegirlo y una imagen para ver cómo se hace.</p>`;
      },
      foot: () => `<button class="btn primary block" data-action="mp-train">${ICON.play} Entrenar nivel ${STAGE_NAMES[st.stage].toLowerCase()}</button>
        <button class="btn block" data-action="mp-save">${ICON.plus} Guardar como rutina</button>`,
      actions: {
        'mp-place': (b) => { st.place = b.dataset.v; s.refresh(); },
        'mp-stage': (b, ev) => { st.stage = b.dataset.v; s.refresh(); },
        'mp-train': () => {
          if (db.active) { toast('Ya tienes un entrenamiento en curso'); return; }
          const r = stageRoutine();
          s.close(); startWorkout(r);
        },
        'mp-save': () => {
          const r = stageRoutine();
          r.id = uid();
          db.routines.push(r); save(); s.close(); render();
          toast(`Rutina "${r.name}" guardada ✅`);
        }
      }
    });
    function stageRoutine() {
      const list = STAGES[group][st.place][st.stage];
      return {
        id: 'tmp', name: `${m.n} · ${STAGE_NAMES[st.stage]}${st.place === 'casa' ? ' · Casa' : ''}`, days: [], note: `Rutina por músculo · ${STAGE_NAMES[st.stage]}`,
        items: list.map(([exId, sets, reps]) => ({ exId, sets, reps: String(reps), rest: unitOf(exById(exId)) === 'reps' ? STAGE_REST[st.stage] : 45 }))
      };
    }
  }

  /* ================= BIBLIOTECA ================= */
  function filterEx(f) {
    const q = f.q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return allEx().filter((e) =>
      (f.muscle === 'all' || e.m === f.muscle) &&
      (f.place === 'all' || e.p.includes(f.place)) &&
      (!q || (e.n + ' ' + muscleName(e.m) + ' ' + (e.e || '')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q))
    ).sort((a, b) => MUSCLES.findIndex((m) => m.id === a.m) - MUSCLES.findIndex((m) => m.id === b.m) || a.n.localeCompare(b.n, 'es'));
  }

  function filtersHtml(f, scope) {
    return `
      <div class="search">${ICON.search}<input class="input" type="search" data-search="${scope}" value="${esc(f.q)}" placeholder="Buscar ejercicio…" autocomplete="off" enterkeyhint="search"></div>
      <div class="seg" style="margin-bottom:10px">
        ${[['all', 'Todos'], ['casa', '🏠 Casa'], ['gym', '🏋️ Gym']].map(([v, l]) => `<button class="${f.place === v ? 'on' : ''}" data-action="f-place" data-scope="${scope}" data-v="${v}">${l}</button>`).join('')}
      </div>
      <div class="chips" style="margin-bottom:12px">
        <button class="chip ${f.muscle === 'all' ? 'on' : ''}" data-action="f-muscle" data-scope="${scope}" data-v="all">Todos</button>
        ${MUSCLES.map((m) => `<button class="chip ${f.muscle === m.id ? 'on' : ''}" data-action="f-muscle" data-scope="${scope}" data-v="${m.id}">${m.n}</button>`).join('')}
      </div>`;
  }

  function exRow(e, opts = {}) {
    const placeTags = e.p.map((p) => `<span class="tag ${p}">${p === 'casa' ? 'Casa' : 'Gym'}</span>`).join(' ');
    return `
      <button class="ex-item ${opts.sel ? 'sel' : ''}" data-action="${opts.action || 'ex-detail'}" data-id="${esc(e.id)}">
        ${thumb(e)}
        <span class="grow">
          <div class="name">${esc(e.n)}</div>
          <div class="meta">${muscleName(e.m)}${e.custom ? ' · Personalizado' : ''} · ${placeTags}</div>
        </span>
        ${opts.pick ? `<span class="check">${opts.sel ? ICON.check.replace('stroke-width="3"', 'stroke-width="3" width="16" height="16"') : ''}</span>` : ICON.chev}
      </button>`;
  }

  function libListHtml() {
    const list = filterEx(ui.lib);
    return list.length
      ? `<div class="muted small" style="margin:0 2px 8px">${list.length} ejercicios</div><div class="ex-list">${list.map((e) => exRow(e)).join('')}</div>`
      : `<div class="card empty"><div class="big">🔍</div><h3>Sin resultados</h3><p>Prueba otro filtro o crea tu propio ejercicio.</p></div>`;
  }

  function renderLibrary() {
    const tabs = `<div class="seg" style="margin-bottom:12px">
      <button class="${ui.libMode !== 'muscles' ? 'on' : ''}" data-action="lib-mode" data-v="list">Biblioteca</button>
      <button class="${ui.libMode === 'muscles' ? 'on' : ''}" data-action="lib-mode" data-v="muscles">Por músculo</button>
    </div>`;
    if (ui.libMode === 'muscles') return tabs + renderMuscleGroups();
    return tabs + filtersHtml(ui.lib, 'lib') +
      `<div id="lib-list">${libListHtml()}</div>
       <button class="btn block" data-action="new-exercise" style="margin-top:14px">${ICON.plus} Crear ejercicio personalizado</button>`;
  }

  function exDetail(id) {
    const ex = exById(id);
    const stats = exerciseStats(id);
    const sheet = openSheet({
      title: ex.n,
      full: true,
      body: () => `
        ${demoHtml(ex)}
        <div class="tags" style="margin:14px 0 10px">
          <span class="tag accent">${muscleName(ex.m)}</span>
          ${ex.p.map((p) => `<span class="tag ${p}">${p === 'casa' ? '🏠 Casa' : '🏋️ Gym'}</span>`).join('')}
          ${ex.custom ? '<span class="tag">Personalizado</span>' : ''}
        </div>
        ${ex.d ? `<p class="lead">${esc(ex.d)}</p>` : ''}
        <div class="info-grid">
          ${ex.mu ? `<div><span>Músculos</span><b>${esc(ex.mu)}</b></div>` : ''}
          ${ex.e ? `<div><span>Equipo</span><b>${esc(ex.e)}</b></div>` : ''}
        </div>
        ${musclesHtml(ex)}
        ${ex.s && ex.s.length ? `<div class="section-title">Cómo hacerlo</div><ol class="steps">${ex.s.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : ''}
        ${ex.t && ex.t.length ? `<div class="section-title">Consejos clave</div><ul class="tips">${ex.t.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${stats.length ? progressHtml(id) : '<div class="card muted small" style="margin-top:18px">Aún no has registrado este ejercicio. Cuando lo hagas verás aquí tu progreso.</div>'}
        ${ex.custom ? `<button class="btn danger block" data-action="del-exercise" style="margin-top:16px">${ICON.trash} Eliminar ejercicio</button>` : ''}`,
      foot: () => db.routines.length ? `<button class="btn primary block" data-action="ex-to-routine">${ICON.plus} Añadir a una rutina</button>` : '',
      actions: {
        'metric': (b) => { ui.metric = b.dataset.v; sheet.refresh(); },
        'ex-to-routine': () => chooseRoutine(id),
        'del-exercise': () => ask('¿Eliminar ejercicio?', 'Se quitará de la biblioteca y de tus rutinas.', 'Eliminar', true).then((ok) => {
          if (!ok) return;
          db.custom = db.custom.filter((e) => e.id !== id);
          db.routines.forEach((r) => { r.items = r.items.filter((it) => it.exId !== id); });
          save(); sheet.close(); render(); toast('Ejercicio eliminado');
        })
      }
    });
  }

  function chooseRoutine(exId) {
    const s = openSheet({
      title: 'Añadir a rutina',
      body: () => `<div class="ex-list">${db.routines.map((r) => `
        <button class="ex-item" data-action="pick-routine" data-id="${r.id}">
          <span class="avatar">${esc(initials(r.name))}</span>
          <span class="grow"><div class="name">${esc(r.name)}</div><div class="meta">${r.items.length} ejercicios · ${daysLabel(r.days)}</div></span>${ICON.chev}
        </button>`).join('')}</div>`,
      actions: {
        'pick-routine': (b) => {
          const r = db.routines.find((x) => x.id === b.dataset.id);
          const u = unitOf(exById(exId));
          r.items.push({ exId, sets: 3, reps: u === 'reps' ? '10' : '30', rest: db.settings.rest });
          save(); s.close(); render(); toast(`Añadido a "${r.name}"`);
        }
      }
    });
  }

  function newExercise() {
    const d = { n: '', m: ui.lib.muscle !== 'all' ? ui.lib.muscle : 'pecho', p: ['casa', 'gym'], u: 'reps', e: '', d: '' };
    const s = openSheet({
      title: 'Nuevo ejercicio',
      body: () => `
        <label class="field"><span>Nombre</span><input class="input" data-x="n" value="${esc(d.n)}" placeholder="Ej. Remo con toalla" maxlength="60" autocomplete="off"></label>
        <label class="field"><span>Grupo muscular</span><select class="input" data-x="m">${MUSCLES.map((m) => `<option value="${m.id}" ${m.id === d.m ? 'selected' : ''}>${m.n}</option>`).join('')}</select></label>
        <div class="field"><span>¿Dónde?</span>
          <div class="chips wrap">
            <button class="chip ${d.p.includes('casa') ? 'on' : ''}" data-action="x-place" data-v="casa">🏠 Casa</button>
            <button class="chip ${d.p.includes('gym') ? 'on' : ''}" data-action="x-place" data-v="gym">🏋️ Gym</button>
          </div>
        </div>
        <label class="field"><span>Se mide en</span><select class="input" data-x="u">
          <option value="reps" ${d.u === 'reps' ? 'selected' : ''}>Repeticiones</option>
          <option value="seg" ${d.u === 'seg' ? 'selected' : ''}>Segundos</option>
          <option value="min" ${d.u === 'min' ? 'selected' : ''}>Minutos</option>
        </select></label>
        <label class="field"><span>Equipo (opcional)</span><input class="input" data-x="e" value="${esc(d.e)}" placeholder="Ej. Banda elástica" maxlength="60" autocomplete="off"></label>
        <label class="field"><span>Notas (opcional)</span><textarea class="input" data-x="d" placeholder="Técnica, ajustes de máquina…" maxlength="300">${esc(d.d)}</textarea></label>`,
      foot: () => `<button class="btn primary block" data-action="x-save">Guardar ejercicio</button>`,
      onInput(t) { if (t.dataset.x) d[t.dataset.x] = t.value; },
      actions: {
        'x-place': (b) => {
          const v = b.dataset.v;
          d.p = d.p.includes(v) ? d.p.filter((x) => x !== v) : d.p.concat(v);
          b.classList.toggle('on', d.p.includes(v));
        },
        'x-save': () => {
          d.n = d.n.trim();
          if (!d.n) { toast('Escribe un nombre'); return; }
          if (!d.p.length) { toast('Elige casa, gym o ambos'); return; }
          db.custom.push({ id: 'c-' + uid(), n: d.n, m: d.m, p: d.p, u: d.u, e: d.e.trim(), d: d.d.trim(), custom: true });
          save(); s.close(); render(); toast('Ejercicio creado ✅');
        }
      }
    });
  }

  /* ---------- Selector de ejercicios (multi) ---------- */
  function openPicker(onDone) {
    const f = { q: '', place: 'all', muscle: 'all' };
    const sel = [];
    const listHtml = () => {
      const list = filterEx(f);
      return list.length ? `<div class="ex-list">${list.map((e) => exRow(e, { pick: true, sel: sel.includes(e.id), action: 'pick-toggle' })).join('')}</div>` : '<div class="empty">Sin resultados</div>';
    };
    const s = openSheet({
      title: 'Elegir ejercicios',
      full: true,
      body: () => filtersHtml(f, 'pick') + `<div id="pick-list">${listHtml()}</div>`,
      foot: () => `<button class="btn primary block" data-action="pick-done" ${sel.length ? '' : 'disabled style="opacity:.5"'}>Añadir ${sel.length ? `(${sel.length})` : ''}</button>`,
      onSearch(v) { f.q = v; s.el.querySelector('#pick-list').innerHTML = listHtml(); },
      actions: {
        'f-place': (b) => { f.place = b.dataset.v; s.refresh(); },
        'f-muscle': (b) => { f.muscle = b.dataset.v; s.refresh(); },
        'pick-toggle': (b) => {
          const id = b.dataset.id;
          const i = sel.indexOf(id);
          if (i >= 0) sel.splice(i, 1); else sel.push(id);
          b.outerHTML = exRow(exById(id), { pick: true, sel: i < 0, action: 'pick-toggle' });
          s.refreshFoot();
        },
        'pick-done': () => { if (!sel.length) return; s.close(); onDone(sel.slice()); }
      }
    });
  }

  /* ================= HISTORIAL / PROGRESO ================= */
  function renderHistory() {
    let html = `<div class="seg" style="margin-bottom:14px">
      <button class="${ui.histMode === 'body' ? 'on' : ''}" data-action="hist-mode" data-v="body">Mi cuerpo</button>
      <button class="${ui.histMode === 'sessions' ? 'on' : ''}" data-action="hist-mode" data-v="sessions">Sesiones</button>
      <button class="${ui.histMode === 'progress' ? 'on' : ''}" data-action="hist-mode" data-v="progress">Ejercicios</button>
    </div>`;
    if (ui.histMode === 'body') return html + renderBody();
    if (!db.history.length) {
      return html + `<div class="card empty"><div class="big">📈</div><h3>Sin entrenamientos todavía</h3><p>Cuando termines tu primer entrenamiento aparecerá aquí con tu progreso.</p><button class="btn primary block" data-action="go-train">Ir a entrenar</button></div>`;
    }
    if (ui.histMode === 'sessions') {
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const month = db.history.filter((s) => s.start >= monthStart.getTime()).length;
      const totalVol = db.history.reduce((a, s) => a + sessionVolume(s).vol, 0);
      html += `<div class="kpis" style="margin-bottom:6px">
        <div class="kpi"><b>${db.history.length}</b><span>Entrenos</span></div>
        <div class="kpi"><b>${month}</b><span>Este mes</span></div>
        <div class="kpi"><b>${fmtVol(totalVol)}</b><span>${unit()} totales</span></div>
      </div>`;
      let lastMonth = '';
      for (const s of db.history.slice().reverse()) {
        const m = fmtDate(s.start, { month: 'long', year: 'numeric' });
        if (m !== lastMonth) { html += `<div class="section-title">${esc(m)}</div>`; lastMonth = m; }
        const { vol, sets } = sessionVolume(s);
        html += `
          <button class="card tap hist-item" data-action="session-detail" data-id="${s.id}">
            <div class="row between"><span class="date">${esc(fmtDate(s.start))} · ${new Date(s.start).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>${s.prs && s.prs.length ? `<span class="pr-badge">${s.prs.length} PR</span>` : ''}</div>
            <h3 class="ellipsis">${esc(s.name)}</h3>
            <div class="nums"><span><b>${fmtDur(sesDur(s))}</b></span><span><b>${sets}</b> series</span><span><b>${fmtN(round(toDisp(vol), 0))}</b> ${unit()}</span></div>
            <div class="muted small ellipsis" style="margin-top:6px">${esc(s.entries.map((e) => exById(e.exId).n).join(' · '))}</div>
          </button>`;
      }
      return html;
    }
    // Por ejercicio
    const map = new Map();
    for (const s of db.history) for (const e of s.entries) {
      const o = map.get(e.exId) || { n: 0, last: 0 };
      o.n++; o.last = Math.max(o.last, s.start); map.set(e.exId, o);
    }
    const rows = [...map.entries()].sort((a, b) => b[1].last - a[1].last);
    html += `<div class="ex-list">` + rows.map(([id, o]) => {
      const ex = exById(id);
      const st = exerciseStats(id);
      const best = st.reduce((m, p) => Math.max(m, p.maxW), 0);
      const bestR = st.reduce((m, p) => Math.max(m, p.maxR), 0);
      const u = unitOf(ex);
      return `
        <button class="ex-item" data-action="ex-progress" data-id="${esc(id)}">
          ${thumb(ex)}
          <span class="grow"><div class="name">${esc(ex.n)}</div><div class="meta">${o.n} sesiones · último ${esc(fmtDate(o.last, { day: 'numeric', month: 'short' }))}</div></span>
          <span class="tag accent">${best ? `${fmtN(toDisp(best))} ${unit()}` : `${bestR} ${u}`}</span>
        </button>`;
    }).join('') + `</div>`;
    return html;
  }

  function progressHtml(exId) {
    const ex = exById(exId);
    const u = unitOf(ex);
    const st = exerciseStats(exId);
    const hasWeight = st.some((p) => p.maxW > 0);
    const metrics = hasWeight
      ? [['maxW', 'Peso máx'], ['best', '1RM est.'], ['vol', 'Volumen']]
      : [['maxR', u === 'reps' ? 'Reps máx' : u === 'seg' ? 'Seg. máx' : 'Min. máx']];
    let metric = ui.metric && metrics.some((m) => m[0] === ui.metric) ? ui.metric : metrics[0][0];
    const isWeight = metric !== 'maxR';
    const pts = st.map((p) => ({ x: p.ts, y: isWeight ? toDisp(p[metric]) : p[metric] }));
    const suffix = isWeight ? unit() : u;
    const bestW = st.reduce((m, p) => Math.max(m, p.maxW), 0);
    const best1 = st.reduce((m, p) => Math.max(m, p.best), 0);
    const bestR = st.reduce((m, p) => Math.max(m, p.maxR), 0);
    const first = pts[0]?.y || 0, last = pts[pts.length - 1]?.y || 0;
    const diff = pts.length > 1 && first ? Math.round(((last - first) / first) * 100) : null;

    return `
      <div class="section-title">Progreso</div>
      <div class="kpis">
        ${hasWeight
          ? `<div class="kpi"><b>${fmtN(toDisp(bestW))}</b><span>Récord (${unit()})</span></div><div class="kpi"><b>${fmtN(round(toDisp(best1), 1))}</b><span>1RM est. (${unit()})</span></div>`
          : `<div class="kpi"><b>${bestR}</b><span>Récord (${u})</span></div><div class="kpi"><b>${st.length}</b><span>Sesiones</span></div>`}
        <div class="kpi"><b style="color:${diff == null ? 'inherit' : diff >= 0 ? 'var(--accent)' : 'var(--danger)'}">${diff == null ? '—' : (diff > 0 ? '+' : '') + diff + '%'}</b><span>Desde el inicio</span></div>
      </div>
      ${metrics.length > 1 ? `<div class="seg" style="margin-top:12px">${metrics.map(([k, l]) => `<button class="${k === metric ? 'on' : ''}" data-action="metric" data-v="${k}">${l}</button>`).join('')}</div>` : ''}
      <div class="chart-box">${chart(pts, suffix)}</div>
      <div class="section-title">Registro</div>
      <table class="log-table"><tbody>
        ${st.slice().reverse().slice(0, 30).map((p) => `<tr><td>${esc(fmtDate(p.ts, { day: 'numeric', month: 'short', year: '2-digit' }))}</td><td>${p.sets.map((s) => `${s.w ? fmtN(toDisp(s.w)) + '×' : ''}${s.r ?? 0}`).join(', ')}</td></tr>`).join('')}
      </tbody></table>`;
  }

  function chart(pts, suffix) {
    if (!pts.length) return '';
    if (pts.length === 1) {
      return `<div class="empty small" style="padding:18px">Registrado: <b>${fmtN(pts[0].y)} ${esc(suffix)}</b><br>Entrena este ejercicio otra vez para ver la tendencia.</div>`;
    }
    const W = 340, H = 180, pl = 36, pr = 14, pt = 18, pb = 24;
    const data = pts.slice(-20);
    const ys = data.map((p) => p.y);
    let min = Math.min(...ys), max = Math.max(...ys);
    if (min === max) { min = min * 0.9; max = max * 1.1 || 1; }
    const pad = (max - min) * 0.12; min = Math.max(0, min - pad); max += pad;
    const X = (i) => pl + (i / (data.length - 1)) * (W - pl - pr);
    const Y = (v) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
    const line = data.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
    const area = `${line} L${X(data.length - 1).toFixed(1)},${H - pb} L${pl},${H - pb} Z`;
    const grid = [0, 0.5, 1].map((t) => {
      const v = min + (max - min) * t, y = Y(v);
      return `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="axis" x="${pl - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${fmtN(Math.round(v))}</text>`;
    }).join('');
    const lastI = data.length - 1;
    const xLabels = [0, lastI].map((i) => `<text class="axis" x="${X(i).toFixed(1)}" y="${H - 6}" text-anchor="${i ? 'end' : 'start'}">${esc(fmtDate(data[i].x, { day: 'numeric', month: 'short' }))}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de progreso">
      <defs><linearGradient id="gArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c6ff3d" stop-opacity=".28"/><stop offset="1" stop-color="#c6ff3d" stop-opacity="0"/></linearGradient></defs>
      ${grid}
      <path class="area" d="${area}"/>
      <path class="line" d="${line}"/>
      ${data.map((p, i) => `<circle class="pt ${i === lastI ? 'last' : ''}" cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${i === lastI ? 5 : 3.5}"/>`).join('')}
      <text class="val" x="${Math.min(X(lastI), W - pr).toFixed(1)}" y="${(Y(data[lastI].y) - 10).toFixed(1)}" text-anchor="end">${fmtN(data[lastI].y)} ${esc(suffix)}</text>
      ${xLabels}
    </svg>`;
  }

  function exProgress(id) {
    const s = openSheet({
      title: exById(id).n,
      full: true,
      body: () => progressHtml(id),
      actions: { 'metric': (b) => { ui.metric = b.dataset.v; s.refresh(); } }
    });
  }

  function sessionDetail(id) {
    const ses = db.history.find((x) => x.id === id);
    if (!ses) return;
    const { vol, sets } = sessionVolume(ses);
    const s = openSheet({
      title: ses.name,
      full: true,
      body: () => `
        <p class="muted cap" style="margin-top:0">${esc(fmtDate(ses.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}</p>
        <div class="kpis" style="margin-bottom:16px">
          <div class="kpi"><b>${fmtDur(sesDur(ses))}</b><span>Duración</span></div>
          <div class="kpi"><b>${sets}</b><span>Series</span></div>
          <div class="kpi"><b>${fmtN(round(toDisp(vol), 0))}</b><span>Volumen (${unit()})</span></div>
        </div>
        ${ses.entries.map((e) => {
          const ex = exById(e.exId);
          const u = unitOf(ex);
          const maxW = Math.max(...e.sets.map((x) => x.w || 0));
          return `<div class="detail-ex">
            <h4>${esc(ex.n)} <button class="tag" data-action="ex-progress" data-id="${esc(e.exId)}">Ver progreso</button></h4>
            <div class="detail-sets">${e.sets.map((x) => `<span class="${maxW && x.w === maxW ? 'pr' : ''}">${x.w ? `${fmtN(toDisp(x.w))} ${unit()} × ` : ''}${x.r ?? 0}${u === 'reps' ? '' : ' ' + u}</span>`).join('')}</div>
          </div>`;
        }).join('')}
        <button class="btn danger block" data-action="del-session" style="margin-top:12px">${ICON.trash} Eliminar del historial</button>`,
      actions: {
        'del-session': () => ask('¿Eliminar entrenamiento?', 'Esta acción no se puede deshacer.', 'Eliminar', true).then((ok) => {
          if (!ok) return;
          db.history = db.history.filter((x) => x.id !== id);
          save(); s.close(); render(); toast('Entrenamiento eliminado');
        })
      }
    });
  }

  /* ================= PERFIL, MEDIDAS E ÍNDICES ================= */
  const ACTIVITY = [
    { id: 'sedentario', n: 'Sedentario', d: 'Trabajo sentado, poco movimiento', f: 1.2 },
    { id: 'ligero', n: 'Ligero', d: 'Entreno 1–3 días por semana', f: 1.375 },
    { id: 'moderado', n: 'Moderado', d: 'Entreno 3–5 días por semana', f: 1.55 },
    { id: 'activo', n: 'Activo', d: 'Entreno 6–7 días por semana', f: 1.725 },
    { id: 'muy', n: 'Muy activo', d: 'Entreno intenso y trabajo físico', f: 1.9 }
  ];
  const NUTRI_GOALS = [
    { id: 'deficit', n: 'Perder grasa', s: 'Déficit calórico', i: '🔥' },
    { id: 'mantener', n: 'Mantener', s: 'Recomposición', i: '⚖️' },
    { id: 'volumen', n: 'Ganar músculo', s: 'Superávit ligero', i: '💪' }
  ];
  const MEASURES = [
    { k: 'weight', n: 'Peso', u: 'kg', help: 'En ayunas, después de ir al baño.' },
    { k: 'fat', n: '% de grasa', u: '%', help: 'Opcional, si lo mide tu báscula. Si no, lo estimamos.' },
    { k: 'neck', n: 'Cuello', u: 'cm', help: 'Justo debajo de la nuez.' },
    { k: 'waist', n: 'Cintura', u: 'cm', help: 'A la altura del ombligo, sin apretar.' },
    { k: 'hip', n: 'Cadera', u: 'cm', help: 'En la parte más ancha de los glúteos.' },
    { k: 'chest', n: 'Pecho', u: 'cm', help: 'A la altura de los pezones.' },
    { k: 'arm', n: 'Brazo', u: 'cm', help: 'Bíceps contraído, en la parte más ancha.' },
    { k: 'thigh', n: 'Muslo', u: 'cm', help: 'En la parte más ancha.' }
  ];
  const sexName = (s) => (s === 'm' ? 'Mujer' : 'Hombre');
  const profileReady = () => db.profile && db.profile.sex && db.profile.age && db.profile.height;
  const bodyLog = () => (db.body || []).slice().sort((a, b) => a.date - b.date);
  // último valor conocido de cada medida
  function latest() {
    const out = {};
    for (const e of bodyLog()) for (const m of MEASURES) if (e[m.k] != null) out[m.k] = e[m.k];
    return out;
  }
  const fmt1 = (n) => fmtN(round(n, 1));

  function indices() {
    if (!profileReady()) return null;
    const P = db.profile, L = latest();
    const w = L.weight, h = P.height, hm = h / 100, age = P.age, male = P.sex !== 'm';
    if (!w) return { noWeight: true };
    const bmi = w / (hm * hm);
    let fat = L.fat, fatSrc = 'báscula';
    if (fat == null && L.waist && L.neck && (male || L.hip)) {
      fat = male
        ? 495 / (1.0324 - 0.19077 * Math.log10(L.waist - L.neck) + 0.15456 * Math.log10(h)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(L.waist + L.hip - L.neck) + 0.221 * Math.log10(h)) - 450;
      fatSrc = 'medidas (método US Navy)';
    }
    if (fat == null || !Number.isFinite(fat)) { fat = 1.2 * bmi + 0.23 * age - 10.8 * (male ? 1 : 0) - 5.4; fatSrc = 'estimado por IMC y edad'; }
    fat = Math.max(3, Math.min(60, fat));
    const lean = w * (1 - fat / 100);
    const ffmi = lean / (hm * hm) + 6.1 * (1.8 - hm);
    const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    const act = ACTIVITY.find((a) => a.id === P.activity) || ACTIVITY[2];
    const tdee = bmr * act.f;
    return {
      w, h, male, bmi, fat, fatSrc, lean, ffmi, bmr, tdee, act,
      whtr: L.waist ? L.waist / h : null,
      whr: L.waist && L.hip ? L.waist / L.hip : null,
      healthy: [18.5 * hm * hm, 24.9 * hm * hm],
      water: w * 0.035
    };
  }

  // [texto, nivel] nivel: ok | warn | bad | info
  function bmiCat(b) {
    if (b < 18.5) return ['Bajo peso', 'warn'];
    if (b < 25) return ['Saludable', 'ok'];
    if (b < 30) return ['Sobrepeso', 'warn'];
    return ['Obesidad', 'bad'];
  }
  function fatCat(f, male) {
    const t = male ? [6, 14, 18, 25] : [14, 21, 25, 32];
    if (f < t[0]) return ['Muy bajo', 'warn'];
    if (f < t[1]) return ['Atlético', 'ok'];
    if (f < t[2]) return ['Fitness', 'ok'];
    if (f < t[3]) return ['Promedio', 'info'];
    return ['Alto', 'bad'];
  }
  function whtrCat(r) {
    if (r < 0.4) return ['Bajo', 'warn'];
    if (r < 0.5) return ['Saludable', 'ok'];
    if (r < 0.6) return ['Riesgo aumentado', 'warn'];
    return ['Riesgo alto', 'bad'];
  }
  function whrCat(r, male) {
    const lim = male ? 0.9 : 0.85;
    return r <= lim ? ['Saludable', 'ok'] : r <= lim + 0.05 ? ['Riesgo moderado', 'warn'] : ['Riesgo alto', 'bad'];
  }
  function ffmiCat(v, male) {
    const t = male ? [18, 20, 22, 25] : [14, 16, 18, 21];
    if (v < t[0]) return ['Bajo', 'warn'];
    if (v < t[1]) return ['Normal', 'info'];
    if (v < t[2]) return ['Bueno', 'ok'];
    if (v < t[3]) return ['Muy bueno', 'ok'];
    return ['Excelente', 'ok'];
  }

  function idxCard(label, value, unitTxt, cat, sub) {
    return `<div class="idx">
      <span class="idx-l">${label}</span>
      <b>${value}<small>${unitTxt || ''}</small></b>
      ${cat ? `<span class="pill ${cat[1]}">${cat[0]}</span>` : ''}
      ${sub ? `<span class="idx-s">${sub}</span>` : ''}
    </div>`;
  }

  function profileCta(text) {
    return `<div class="card empty">
      <div class="big">📏</div><h3>Completa tu perfil</h3>
      <p>${text}</p>
      <button class="btn primary block" data-action="edit-profile">Completar perfil</button>
    </div>`;
  }

  function renderBody() {
    if (!profileReady()) return profileCta('Con tu sexo, edad, altura y peso calculamos tu IMC, % de grasa, metabolismo, calorías diarias y más.');
    const P = db.profile, I = indices();
    const act = ACTIVITY.find((a) => a.id === P.activity) || ACTIVITY[2];
    let html = `
      <button class="card tap profile-line" data-action="edit-profile">
        <span>${P.sex === 'm' ? '👩' : '👨'} ${sexName(P.sex)} · ${P.age} años · ${P.height} cm · ${esc(act.n)}</span><span class="tag">Editar</span>
      </button>`;
    if (!I || I.noWeight) {
      return html + `<div class="card empty"><div class="big">⚖️</div><h3>Registra tu peso</h3><p>Añade tu primera medición para ver tus índices.</p>
        <button class="btn primary block" data-action="add-measure">${ICON.plus} Registrar medidas</button></div>`;
    }
    const log = bodyLog().filter((e) => e.weight != null);
    const first = log[0], last = log[log.length - 1];
    const diff = first && last && first !== last ? last.weight - first.weight : null;
    html += `
      <section class="hero body-hero">
        <div class="row between">
          <div><div class="kicker">Peso actual</div><h2>${fmt1(toDisp(I.w))} <small>${unit()}</small></h2></div>
          ${diff != null ? `<span class="pill ${diff <= 0 ? 'ok' : 'info'}">${diff > 0 ? '+' : ''}${fmt1(toDisp(diff))} ${unit()} desde ${esc(fmtDate(first.date, { day: 'numeric', month: 'short' }))}</span>` : ''}
        </div>
        <button class="btn primary block" data-action="add-measure" style="margin-top:12px">${ICON.plus} Registrar medidas</button>
      </section>
      <div class="section-title">Tus índices</div>
      <div class="idx-grid">
        ${idxCard('IMC', fmt1(I.bmi), '', bmiCat(I.bmi), `Saludable: ${fmt1(toDisp(I.healthy[0]))}–${fmt1(toDisp(I.healthy[1]))} ${unit()}`)}
        ${idxCard('% de grasa', fmt1(I.fat), '%', fatCat(I.fat, I.male), I.fatSrc)}
        ${idxCard('Masa magra', fmt1(toDisp(I.lean)), ` ${unit()}`, null, `Grasa: ${fmt1(toDisp(I.w - I.lean))} ${unit()}`)}
        ${idxCard('FFMI', fmt1(I.ffmi), '', ffmiCat(I.ffmi, I.male), 'Índice de masa libre de grasa')}
        ${idxCard('Metabolismo basal', fmtN(Math.round(I.bmr)), ' kcal', null, 'Lo que gastas en reposo')}
        ${idxCard('Gasto diario', fmtN(Math.round(I.tdee)), ' kcal', null, `Actividad: ${esc(I.act.n.toLowerCase())}`)}
        ${I.whtr ? idxCard('Cintura / altura', fmtN(round(I.whtr, 2)), '', whtrCat(I.whtr), 'Ideal por debajo de 0,5') : idxCard('Cintura / altura', '—', '', null, 'Mide tu cintura')}
        ${I.whr ? idxCard('Cintura / cadera', fmtN(round(I.whr, 2)), '', whrCat(I.whr, I.male), `Límite ${I.male ? '0,90' : '0,85'}`) : idxCard('Cintura / cadera', '—', '', null, 'Mide cintura y cadera')}
        ${idxCard('Agua diaria', fmt1(I.water), ' L', null, '35 ml por kg de peso')}
        ${idxCard('Proteína diaria', `${Math.round(I.w * 1.6)}–${Math.round(I.w * 2.2)}`, ' g', null, '1,6–2,2 g por kg')}
      </div>`;
    // gráfica de evolución
    const opts = MEASURES.filter((m) => bodyLog().filter((e) => e[m.k] != null).length > 0);
    const metric = opts.some((m) => m.k === ui.bodyMetric) ? ui.bodyMetric : 'weight';
    const mm = MEASURES.find((m) => m.k === metric);
    const pts = bodyLog().filter((e) => e[metric] != null).map((e) => ({ x: e.date, y: metric === 'weight' ? toDisp(e[metric]) : e[metric] }));
    html += `<div class="section-title">Evolución</div>
      <div class="chips" style="margin-bottom:6px">${opts.map((m) => `<button class="chip ${m.k === metric ? 'on' : ''}" data-action="body-metric" data-v="${m.k}">${m.n}</button>`).join('')}</div>
      <div class="chart-box">${chart(pts, metric === 'weight' ? unit() : mm.u)}</div>
      <div class="section-title">Historial de medidas</div>
      <div class="ex-list">${bodyLog().slice().reverse().slice(0, 40).map((e) => `
        <button class="ex-item" data-action="edit-measure" data-id="${e.id}">
          <span class="avatar sm-date">${new Date(e.date).getDate()}<small>${esc(fmtDate(e.date, { month: 'short' }))}</small></span>
          <span class="grow"><div class="name">${e.weight != null ? `${fmt1(toDisp(e.weight))} ${unit()}` : 'Medidas'}</div>
          <div class="meta">${MEASURES.filter((m) => m.k !== 'weight' && e[m.k] != null).map((m) => `${m.n} ${fmt1(e[m.k])}${m.u === '%' ? '%' : ''}`).join(' · ') || '—'}</div></span>${ICON.chev}
        </button>`).join('')}</div>
      <p class="muted small" style="margin-top:14px">Los índices son estimaciones generales y no sustituyen la valoración de un profesional de la salud.</p>`;
    return html;
  }

  function editProfile(after) {
    const P = { sex: 'h', age: '', height: '', activity: 'moderado', goal: 'mantener', diet: 'omni', meals: 4, ...(db.profile || {}) };
    const w0 = latest().weight;
    let weight = w0 != null ? toDisp(w0) : '';
    const s = openSheet({
      title: 'Mi perfil',
      full: true,
      body: () => `
        <div class="field"><span>Sexo</span>
          <div class="seg"><button class="${P.sex === 'h' ? 'on' : ''}" data-action="pf-sex" data-v="h">👨 Hombre</button><button class="${P.sex === 'm' ? 'on' : ''}" data-action="pf-sex" data-v="m">👩 Mujer</button></div>
        </div>
        <div class="re-grid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:14px">
          <label><span>Edad</span><input class="input" data-pf="age" inputmode="numeric" value="${esc(P.age)}" placeholder="30"></label>
          <label><span>Altura (cm)</span><input class="input" data-pf="height" inputmode="numeric" value="${esc(P.height)}" placeholder="175"></label>
          <label><span>Peso (${unit()})</span><input class="input" data-pf="weight" inputmode="decimal" value="${esc(weight === '' ? '' : fmtN(weight))}" placeholder="75"></label>
        </div>
        <div class="field"><span>Nivel de actividad</span>
          <div class="opts">${ACTIVITY.map((a) => `<button class="opt slim ${P.activity === a.id ? 'on' : ''}" data-action="pf-act" data-v="${a.id}"><span class="grow"><b>${a.n}</b><small>${a.d}</small></span><span class="check">${P.activity === a.id ? ICON.check.replace('stroke-width="3"', 'stroke-width="3" width="16" height="16"') : ''}</span></button>`).join('')}</div>
        </div>`,
      foot: () => `<button class="btn primary block" data-action="pf-save">Guardar perfil</button>`,
      onInput(t) {
        if (t.dataset.pf === 'weight') weight = t.value;
        else if (t.dataset.pf) P[t.dataset.pf] = t.value;
      },
      actions: {
        'pf-sex': (b) => { P.sex = b.dataset.v; s.refresh(); },
        'pf-act': (b) => { P.activity = b.dataset.v; s.refresh(); },
        'pf-save': () => {
          const age = parseNum(P.age), height = parseNum(P.height), w = parseNum(weight);
          if (!age || age < 12 || age > 100) { toast('Escribe una edad válida'); return; }
          if (!height || height < 120 || height > 230) { toast('Escribe tu altura en cm (120–230)'); return; }
          if (!w || fromDisp(w) < 30 || fromDisp(w) > 300) { toast('Escribe tu peso'); return; }
          db.profile = { ...P, age: Math.round(age), height: Math.round(height) };
          const kg = fromDisp(w);
          if (w0 == null || Math.abs(kg - w0) > 0.05) addMeasure({ weight: kg });
          save(); s.close(); render(); toast('Perfil guardado ✅');
          if (after) after();
        }
      }
    });
  }

  function addMeasure(vals) {
    db.body = db.body || [];
    const today = new Date(); today.setHours(12, 0, 0, 0);
    const e = db.body.find((x) => sameDay(x.date, today.getTime()));
    if (e) Object.assign(e, vals); else db.body.push({ id: uid(), date: today.getTime(), ...vals });
  }

  function measureSheet(id) {
    db.body = db.body || [];
    const orig = id ? db.body.find((e) => e.id === id) : null;
    const d = orig ? { ...orig } : { date: Date.now() };
    const L = latest();
    const toISO = (ts) => { const x = new Date(ts); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
    const s = openSheet({
      title: orig ? 'Editar medición' : 'Registrar medidas',
      full: true,
      body: () => `
        <label class="field"><span>Fecha</span><input class="input" type="date" data-ms="date" value="${toISO(d.date)}"></label>
        <p class="muted small" style="margin-top:-4px">Rellena solo lo que midas. Con cuello, cintura${db.profile && db.profile.sex === 'm' ? ' y cadera' : ''} calculamos tu % de grasa.</p>
        ${MEASURES.map((m) => {
          const v = d[m.k] != null ? (m.k === 'weight' ? toDisp(d[m.k]) : d[m.k]) : '';
          const ph = L[m.k] != null ? fmt1(m.k === 'weight' ? toDisp(L[m.k]) : L[m.k]) : '';
          return `<label class="measure-row"><span><b>${m.n}</b><small>${m.help}</small></span>
            <span class="mr-in"><input class="input" inputmode="decimal" data-ms="${m.k}" value="${v === '' ? '' : fmtN(v)}" placeholder="${ph}"><i>${m.k === 'weight' ? unit() : m.u}</i></span></label>`;
        }).join('')}
        ${orig ? `<button class="btn danger block" data-action="ms-del" style="margin-top:12px">${ICON.trash} Eliminar medición</button>` : ''}`,
      foot: () => `<button class="btn primary block" data-action="ms-save">Guardar</button>`,
      onInput(t) {
        const k = t.dataset.ms; if (!k) return;
        if (k === 'date') { const [y, mo, da] = t.value.split('-').map(Number); if (y) d.date = new Date(y, mo - 1, da, 12).getTime(); return; }
        const v = parseNum(t.value);
        d[k] = v == null ? null : k === 'weight' ? fromDisp(v) : v;
      },
      actions: {
        'ms-save': () => {
          const has = MEASURES.some((m) => d[m.k] != null);
          if (!has) { toast('Escribe al menos una medida'); return; }
          if (orig) Object.assign(orig, d);
          else {
            const same = db.body.find((x) => sameDay(x.date, d.date));
            if (same) MEASURES.forEach((m) => { if (d[m.k] != null) same[m.k] = d[m.k]; });
            else db.body.push({ id: uid(), ...d });
          }
          save(); s.close(); render(); toast('Medidas guardadas ✅');
        },
        'ms-del': () => ask('¿Eliminar medición?', 'Se borrará este registro.', 'Eliminar', true).then((ok) => {
          if (!ok) return;
          db.body = db.body.filter((e) => e.id !== id); save(); s.close(); render();
        })
      }
    });
  }

  /* ================= NUTRICIÓN ================= */
  const MEALS = window.GB_MEALS || [];
  const mealKcal = (m) => 4 * m.p + 4 * m.c + 9 * m.f;
  const SLOT_SPLIT = {
    3: [['desayuno', 0.3], ['almuerzo', 0.4], ['cena', 0.3]],
    4: [['desayuno', 0.25], ['almuerzo', 0.35], ['snack', 0.15], ['cena', 0.25]],
    5: [['desayuno', 0.22], ['snack', 0.12], ['almuerzo', 0.32], ['snack', 0.12], ['cena', 0.22]]
  };
  const SLOT_NAME = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Merienda' };

  function nutritionTargets() {
    const I = indices();
    if (!I || I.noWeight) return null;
    const goal = db.profile.goal || 'mantener';
    let kcal = goal === 'deficit' ? I.tdee * 0.8 : goal === 'volumen' ? I.tdee * 1.1 : I.tdee;
    const floor = I.male ? 1500 : 1200;
    if (goal === 'deficit') kcal = Math.max(kcal, floor, I.bmr * 1.0);
    kcal = Math.round(kcal / 10) * 10;
    // peso de referencia para la proteína (si hay mucho sobrepeso, se usa el peso "saludable" alto)
    const refW = I.bmi > 30 ? I.healthy[1] * 1.1 : I.w;
    const pPerKg = goal === 'deficit' ? 2.2 : goal === 'volumen' ? 2.0 : 1.8;
    const p = Math.round(refW * pPerKg);
    const f = Math.round(Math.max(I.w * 0.7, (kcal * 0.25) / 9));
    const c = Math.max(50, Math.round((kcal - p * 4 - f * 9) / 4));
    const weekly = goal === 'deficit' ? -(I.tdee - kcal) * 7 / 7700 : goal === 'volumen' ? (kcal - I.tdee) * 7 / 7700 : 0;
    return { kcal, p, c, f, tdee: I.tdee, goal, weekly, water: I.water };
  }

  function mealPool(type, goal, veg) {
    let list = MEALS.filter((m) => m.t.includes(type) && (!veg || m.veg) && (!m.onlyGoal || m.onlyGoal === goal));
    if (goal === 'deficit') list = list.slice().sort((a, b) => b.p / mealKcal(b) - a.p / mealKcal(a)).slice(0, Math.max(3, Math.ceil(list.length * 0.7)));
    if (goal === 'volumen') list = list.slice().sort((a, b) => mealKcal(b) - mealKcal(a)).slice(0, Math.max(3, Math.ceil(list.length * 0.7)));
    return list;
  }

  function dayPlan(T) {
    const P = db.profile;
    const todayKey = new Date().toDateString();
    if (!db.mealPlan || db.mealPlan.day !== todayKey) db.mealPlan = { day: todayKey, shift: Math.floor(Math.random() * 1000), swaps: {} };
    const MP = db.mealPlan;
    const slots = SLOT_SPLIT[P.meals] || SLOT_SPLIT[4];
    const used = new Set();
    return slots.map(([type, share], i) => {
      const pool = mealPool(type, T.goal, P.diet === 'veg');
      let k = MP.shift + i * 7 + (MP.swaps[i] || 0), meal = null;
      for (let tries = 0; tries < pool.length; tries++) {
        const m = pool[(k + tries) % pool.length];
        if (!used.has(m.id)) { meal = m; break; }
      }
      meal = meal || pool[k % pool.length];
      used.add(meal.id);
      const target = T.kcal * share;
      const factor = Math.min(2, Math.max(0.5, Math.round((target / mealKcal(meal)) * 4) / 4));
      return { slot: i, type, meal, factor, target };
    });
  }

  const fmtQty = (q, unitTxt, factor) => {
    let v = q * factor;
    if (unitTxt === 'g' || unitTxt === 'ml') v = Math.round(v / 5) * 5;
    else v = v >= 1.75 ? Math.round(v) : Math.max(0.5, Math.round(v * 2) / 2);
    const whole = Math.floor(v), half = v - whole >= 0.5;
    const shown = half ? (whole ? `${whole}½` : '½') : String(whole);
    return unitTxt === 'ud' ? `${shown} ` : `${shown} ${unitTxt} `;
  };

  function renderNutrition() {
    if (!profileReady() || !latest().weight) return profileCta('Necesitamos tu sexo, edad, altura, peso y actividad para calcular tus calorías y proponerte comidas.');
    const P = db.profile;
    const T = nutritionTargets();
    const goalInfo = NUTRI_GOALS.find((g) => g.id === T.goal);
    const plan = dayPlan(T);
    const tot = plan.reduce((a, x) => ({ k: a.k + mealKcal(x.meal) * x.factor, p: a.p + x.meal.p * x.factor, c: a.c + x.meal.c * x.factor, f: a.f + x.meal.f * x.factor }), { k: 0, p: 0, c: 0, f: 0 });
    const bar = (label, g, kc, color) => {
      const pct = Math.round((kc / T.kcal) * 100);
      return `<div class="macro"><div class="row between"><span>${label}</span><b>${g} g</b></div><div class="mbar"><i style="width:${pct}%;background:${color}"></i></div><small>${fmtN(Math.round(kc))} kcal · ${pct}%</small></div>`;
    };
    let html = `
      <div class="goal-seg">${NUTRI_GOALS.map((g) => `<button class="${T.goal === g.id ? 'on' : ''}" data-action="nu-goal" data-v="${g.id}"><span>${g.i}</span><b>${g.n}</b><small>${g.s}</small></button>`).join('')}</div>
      <section class="hero kcal-hero">
        <div class="kicker">Tu objetivo diario · ${esc(goalInfo.n.toLowerCase())}</div>
        <h2>${fmtN(T.kcal)} <small>kcal</small></h2>
        <p class="muted small" style="margin:-8px 0 12px">Gasto estimado ${fmtN(Math.round(T.tdee))} kcal · ${T.goal === 'mantener' ? 'mantienes tu peso' : `${T.weekly > 0 ? '+' : ''}${fmtN(round(toDisp(T.weekly), 2))} ${unit()}/semana aprox.`}</p>
        ${bar('Proteína', T.p, T.p * 4, '#c6ff3d')}
        ${bar('Carbohidratos', T.c, T.c * 4, '#5db8ff')}
        ${bar('Grasas', T.f, T.f * 9, '#ffb04d')}
        <div class="row between small muted" style="margin-top:10px"><span>💧 Agua: ${fmt1(T.water)} L/día</span><button class="tag" data-action="edit-profile">Editar perfil</button></div>
      </section>
      <div class="section-title">Comidas de hoy <button class="tag accent" data-action="nu-shuffle">🔄 Otra propuesta</button></div>
      <div class="row" style="gap:8px;margin-bottom:10px;flex-wrap:wrap">
        <div class="seg small-seg">${[3, 4, 5].map((n) => `<button class="${(P.meals || 4) === n ? 'on' : ''}" data-action="nu-meals" data-v="${n}">${n} comidas</button>`).join('')}</div>
        <div class="seg small-seg">${[['omni', 'Omnívora'], ['veg', 'Vegetariana']].map(([v, l]) => `<button class="${(P.diet || 'omni') === v ? 'on' : ''}" data-action="nu-diet" data-v="${v}">${l}</button>`).join('')}</div>
      </div>
      ${plan.map((x) => `
        <div class="meal-card">
          <div class="row between"><span class="meal-type">${SLOT_NAME[x.type]}</span><button class="icon-btn sm" data-action="nu-swap" data-v="${x.slot}" aria-label="Cambiar esta comida">🔄</button></div>
          <h3>${esc(x.meal.n)}</h3>
          <div class="meal-macros"><b>${fmtN(Math.round(mealKcal(x.meal) * x.factor))} kcal</b><span>P ${Math.round(x.meal.p * x.factor)} g</span><span>C ${Math.round(x.meal.c * x.factor)} g</span><span>G ${Math.round(x.meal.f * x.factor)} g</span>${x.factor !== 1 ? `<span class="tag">ración ×${String(x.factor).replace('.', ',')}</span>` : ''}</div>
          <ul class="ing">${x.meal.ing.map(([q, u, n]) => `<li>${q == null ? '' : `<b>${fmtQty(q, u, x.factor)}</b>`}${esc(n)}${q == null ? ' (al gusto)' : ''}</li>`).join('')}</ul>
        </div>`).join('')}
      <div class="card totals">
        <div class="row between"><b>Total del día</b><b>${fmtN(Math.round(tot.k))} / ${fmtN(T.kcal)} kcal</b></div>
        <div class="row between small muted" style="margin-top:4px"><span>Proteína ${Math.round(tot.p)} / ${T.p} g</span><span>Carbos ${Math.round(tot.c)} / ${T.c} g</span><span>Grasa ${Math.round(tot.f)} / ${T.f} g</span></div>
      </div>
      <div class="section-title">Consejos para ${esc(goalInfo.n.toLowerCase())}</div>
      <ul class="tips">${nutriTips(T.goal).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="muted small" style="margin-top:14px">Cálculos orientativos (fórmula Mifflin-St Jeor). Si tienes alguna condición médica, estás embarazada o eres menor de edad, consulta a un profesional de la nutrición.</p>`;
    return html;
  }

  function nutriTips(goal) {
    const common = ['Llega a tu proteína diaria: es lo más importante para cuidar tu músculo.', 'Pésate 3–4 mañanas por semana y fíjate en la media semanal, no en un día suelto.'];
    if (goal === 'deficit') return ['Prioriza verduras, proteína magra y alimentos poco procesados: sacian más con menos calorías.', 'Mantén el entrenamiento de fuerza: así pierdes grasa y no músculo.', 'Si te estancas 2–3 semanas, baja 100–150 kcal o camina más.', ...common];
    if (goal === 'volumen') return ['Busca subir 0,25–0,5 % de tu peso por semana: más rápido suele ser grasa.', 'Si te cuesta comer tanto, usa batidos, frutos secos y aceite de oliva.', 'Progresa en tus pesos cada semana: el superávit solo sirve si entrenas fuerte.', ...common];
    return ['Mantén el peso estable mientras ganas fuerza: es la recomposición corporal.', 'Reparte la proteína en 3–5 comidas a lo largo del día.', ...common];
  }

  /* ================= AJUSTES ================= */
  function styleChooserHtml() {
    const cur = imgStyle();
    const ex = exById('press-banca');
    return `<div class="style-pick">
      <button class="sp ${cur === 'foto' ? 'on' : ''}" data-action="img-style" data-v="foto">
        <img src="img/foto/${ex.id}-t.webp" alt="" loading="lazy"><b>Versión 1</b><small>Fotos reales</small>
      </button>
      <button class="sp ${cur === '3d' ? 'on' : ''}" data-action="img-style" data-v="3d">
        <img src="img/ex/${ex.id}-t.webp" alt="" loading="lazy"><b>Versión 2</b><small>Animación 3D</small>
      </button>
    </div>`;
  }
  function setImgStyle(v) {
    db.settings.imgStyle = v;
    save(); render();
    toast(v === 'foto' ? 'Usando la versión 1: fotos reales 📷' : 'Usando la versión 2: animaciones 3D 🧍');
  }
  function firstRunChooser() {
    if (db.settings.imgStyle || sheets.length) return;
    const s = openSheet({
      title: '¿Qué versión prefieres?',
      body: () => `<p class="muted" style="margin:0 2px 12px">Elige cómo quieres ver los ejercicios. Puedes cambiarlo cuando quieras en Ajustes ⚙️.</p>${styleChooserHtml()}`,
      foot: () => `<button class="btn primary block" data-action="close-sheet">Listo</button>`,
      actions: { 'img-style': (b) => { setImgStyle(b.dataset.v); s.refresh(); } },
      onClose: () => { if (!db.settings.imgStyle) { db.settings.imgStyle = 'foto'; save(); render(); } }
    });
  }

  function openSettings() {
    const s = openSheet({
      title: 'Ajustes',
      body: () => `
        <div class="section-title" style="margin-top:4px">Versión de imágenes</div>
        ${styleChooserHtml()}
        <div class="set-group" style="margin-top:12px">
          <button class="set-line" data-action="edit-profile"><span>👤 Mi perfil <span class="muted small">${profileReady() ? `${sexName(db.profile.sex)} · ${db.profile.age} años · ${db.profile.height} cm` : 'sin completar'}</span></span>${ICON.chev}</button>
        </div>
        <div class="set-group">
          <div class="set-line"><span>Unidad de peso</span>
            <div class="seg">${['kg', 'lb'].map((u) => `<button class="${db.settings.unit === u ? 'on' : ''}" data-action="set-unit" data-v="${u}">${u}</button>`).join('')}</div>
          </div>
          <label class="set-line"><span>Descanso por defecto</span>
            <select class="input" data-set="rest" style="width:auto;min-height:42px">${REST_OPTIONS.map((x) => `<option value="${x}" ${x === db.settings.rest ? 'selected' : ''}>${fmtRest(x)}</option>`).join('')}</select>
          </label>
          <button class="set-line" data-action="set-toggle" data-k="sound"><span>Sonido al terminar descanso</span><span class="switch ${db.settings.sound ? 'on' : ''}"></span></button>
          <button class="set-line" data-action="set-toggle" data-k="vibrate"><span>Vibración <span class="muted small">(Android)</span></span><span class="switch ${db.settings.vibrate ? 'on' : ''}"></span></button>
        </div>
        <div class="section-title">Tus datos</div>
        <p class="muted small" style="margin-top:0">Todo se guarda solo en este dispositivo y navegador. Usa una copia de seguridad para pasar tus datos del celular a la Mac (o viceversa).</p>
        <div class="set-group">
          <button class="set-line" data-action="export"><span>⬇️ Exportar copia de seguridad</span>${ICON.chev}</button>
          <label class="set-line"><span>⬆️ Importar copia de seguridad</span>${ICON.chev}<input type="file" accept="application/json,.json" data-import hidden></label>
        </div>
        <div class="section-title">Imágenes</div>
        <div class="set-group">
          <button class="set-line" data-action="cache-images"><span>📥 Guardar imágenes para usar sin internet <span class="muted small" id="img-progress"></span></span>${ICON.chev}</button>
        </div>
        <div class="set-group">
          <button class="set-line" data-action="reset" style="color:var(--danger)"><span>Borrar todos los datos</span>${ICON.trash.replace('<svg', '<svg width="20" height="20"')}</button>
        </div>
        <p class="muted small" style="text-align:center">GYMBRO v${VERSION} · ${db.history.length} entrenos · ${db.routines.length} rutinas<br>Animaciones: <a href="https://github.com/AbanoubAmir/open-exercise-figures" target="_blank" rel="noopener">Open Exercise Figures</a> (CC0) · Mapa muscular: <a href="https://github.com/giavinh79/react-body-highlighter" target="_blank" rel="noopener">react-body-highlighter</a> (MIT)</p>`,
      onInput(t) {
        if (t.dataset.set === 'rest') { db.settings.rest = +t.value; save(); render(); }
      },
      actions: {
        'set-unit': (b) => { db.settings.unit = b.dataset.v; save(); s.refresh(); render(); },
        'img-style': (b) => { setImgStyle(b.dataset.v); s.refresh(); },
        'set-toggle': (b) => { const k = b.dataset.k; db.settings[k] = !db.settings[k]; save(); s.refresh(); if (k === 'sound' && db.settings.sound) { unlockAudio(); beep(); } },
        'export': exportData,
        'cache-images': () => cacheImages(s.el.querySelector('#img-progress')),
        'reset': () => ask('¿Borrar todo?', 'Se eliminarán rutinas, historial y ejercicios personalizados de este dispositivo.', 'Borrar todo', true).then((ok) => {
          if (!ok) return;
          db = defaults(); save(); closeAllSheets(); setTab('train'); toast('Datos borrados');
        })
      }
    });
    s.el.querySelector('[data-import]').addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(reader.result);
          const data = d.data || d;
          if (!Array.isArray(data.history) || !Array.isArray(data.routines)) throw new Error('formato');
          ask('¿Importar copia?', `Contiene ${data.history.length} entrenos y ${data.routines.length} rutinas. Reemplazará los datos actuales de este dispositivo.`, 'Importar').then((ok) => {
            if (!ok) return;
            const base = defaults();
            db = sortHistory({ ...base, ...data, settings: { ...base.settings, ...(data.settings || {}) } });
            save(); closeAllSheets(); render(); toast('Copia importada ✅');
          });
        } catch (e) { toast('Archivo no válido'); }
      };
      reader.readAsText(file);
      ev.target.value = '';
    });
  }

  let caching = false;
  async function cacheImages(label) {
    if (caching) return;
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      toast('Abre la app desde su dirección web (https) para usar esta opción');
      return;
    }
    caching = true;
    const urls = BASE_EX.filter((e) => e.img).flatMap((e) => (usePhoto(e) ? [imgSrc(e, 't'), imgSrc(e, 0), imgSrc(e, 1)] : [imgSrc(e, 't'), animSrc(e)]));
    let done = 0, failed = 0;
    const next = async () => {
      while (urls.length) {
        const u = urls.shift();
        try { const r = await fetch(u); if (!r.ok) failed++; } catch (e) { failed++; }
        done++;
        if (label && document.body.contains(label)) label.textContent = `${Math.round((done / (done + urls.length)) * 100)}%`;
      }
    };
    await Promise.all(Array.from({ length: 6 }, next));
    caching = false;
    if (label && document.body.contains(label)) label.textContent = failed ? '' : '✓';
    toast(failed ? `Faltaron ${failed} imágenes: inténtalo con mejor conexión` : 'Imágenes guardadas: ya funcionan sin internet ✅');
  }

  function exportData() {
    const payload = JSON.stringify({ app: 'GYMBRO', version: VERSION, exported: new Date().toISOString(), data: { ...db, timer: null } }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const name = `gymbro-${new Date().toISOString().slice(0, 10)}.json`;
    const file = typeof File === 'function' ? new File([blob], name, { type: 'application/json' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /iphone|ipad|android/i.test(navigator.userAgent)) {
      navigator.share({ files: [file], title: 'Copia GYMBRO' }).catch(() => {});
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Copia descargada');
  }

  /* ================= Hojas (bottom sheets) ================= */
  const sheets = [];
  function openSheet(cfg) {
    const wrap = document.createElement('div');
    wrap.className = 'sheet-wrap';
    wrap.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"></div>
      <div class="sheet ${cfg.full ? 'full' : ''}" role="dialog" aria-modal="true" aria-label="${esc(cfg.title)}">
        <div class="grab"></div>
        <div class="sheet-head"><h2 class="ellipsis">${esc(cfg.title)}</h2><button class="icon-btn" data-action="close-sheet" aria-label="Cerrar">${ICON.close}</button></div>
        <div class="sheet-body"></div>
        <div class="sheet-foot"></div>
      </div>`;
    const api = {
      el: wrap, cfg,
      refresh() {
        const body = wrap.querySelector('.sheet-body');
        const top = body.scrollTop;
        body.innerHTML = cfg.body();
        body.scrollTop = top;
        api.refreshFoot();
      },
      refreshFoot() {
        const foot = wrap.querySelector('.sheet-foot');
        const f = cfg.foot ? cfg.foot() : '';
        foot.innerHTML = f;
        foot.hidden = !f;
      },
      close() {
        const i = sheets.indexOf(api);
        if (i >= 0) sheets.splice(i, 1);
        wrap.remove();
        document.body.classList.toggle('sheet-open', sheets.length > 0);
        cfg.onClose && cfg.onClose();
      }
    };
    sheets.push(api);
    $('#sheets').appendChild(wrap);
    document.body.classList.add('sheet-open');
    api.refresh();
    return api;
  }
  const topSheet = () => sheets[sheets.length - 1];
  function closeAllSheets() { while (sheets.length) sheets[sheets.length - 1].close(); }

  function ask(title, text, okLabel, danger) {
    return new Promise((resolve) => {
      let answered = false;
      const s = openSheet({
        title,
        body: () => `<p class="muted" style="margin:4px 2px 4px">${esc(text)}</p>`,
        foot: () => `<button class="btn ${danger ? 'danger' : 'primary'} block" data-action="ask-ok">${esc(okLabel)}</button><button class="btn ghost block" data-action="close-sheet">Cancelar</button>`,
        actions: { 'ask-ok': () => { answered = true; s.close(); resolve(true); } },
        onClose: () => { if (!answered) resolve(false); }
      });
    });
  }

  function entryMenu(ei) {
    const e = db.active.entries[ei];
    const ex = exById(e.exId);
    const n = db.active.entries.length;
    const s = openSheet({
      title: ex.n,
      body: () => `<div class="set-group">
        <button class="set-line" data-action="em-progress"><span>📈 Ver progreso</span>${ICON.chev}</button>
        <button class="set-line" data-action="em-move" data-d="-1" ${ei === 0 ? 'disabled style="opacity:.4"' : ''}><span>⬆️ Mover arriba</span></button>
        <button class="set-line" data-action="em-move" data-d="1" ${ei === n - 1 ? 'disabled style="opacity:.4"' : ''}><span>⬇️ Mover abajo</span></button>
        <button class="set-line" data-action="em-remove" style="color:var(--danger)"><span>Quitar del entrenamiento</span></button>
      </div>`,
      actions: {
        'em-progress': () => { s.close(); exProgress(e.exId); },
        'em-move': (b) => {
          const j = ei + +b.dataset.d;
          if (j < 0 || j >= n) return;
          const arr = db.active.entries;
          [arr[ei], arr[j]] = [arr[j], arr[ei]];
          save(); s.close(); render();
        },
        'em-remove': () => { db.active.entries.splice(ei, 1); save(); s.close(); render(); }
      }
    });
  }

  function entryRest(ei) {
    const e = db.active.entries[ei];
    const s = openSheet({
      title: 'Descanso entre series',
      body: () => `<div class="chips wrap">${REST_OPTIONS.map((x) => `<button class="chip ${x === e.rest ? 'on' : ''}" data-action="er-set" data-v="${x}">${fmtRest(x)}</button>`).join('')}</div>`,
      actions: { 'er-set': (b) => { e.rest = +b.dataset.v; save(); s.close(); render(); } }
    });
  }

  /* ================= Eventos ================= */
  const globalActions = {
    'settings': openSettings,
    'close-sheet': () => topSheet() && topSheet().close(),
    'go-train': () => setTab('train'),
    'new-routine': () => editRoutine(null),
    'edit-routine': (b) => editRoutine(b.dataset.id),
    'sample-routines': loadSamples,
    'generator': openGenerator,
    'start-routine': (b) => {
      const r = db.routines.find((x) => x.id === b.dataset.id);
      if (!r) return;
      if (!r.items.length) { toast('Esta rutina no tiene ejercicios'); editRoutine(r.id); return; }
      if (db.active) { toast('Ya tienes un entrenamiento en curso'); setTab('train'); return; }
      startWorkout(r);
    },
    'start-free': () => startWorkout(null),
    'toggle-set': (b) => toggleSet(+b.dataset.e, +b.dataset.s),
    'copy-prev': (b) => {
      const s = db.active.entries[+b.dataset.e].sets[+b.dataset.s];
      if (s.done || (s.pw == null && s.pr == null)) return;
      s.w = s.pw; s.r = s.pr; save(); render();
    },
    'add-set': (b) => {
      const e = db.active.entries[+b.dataset.e];
      const last = e.sets[e.sets.length - 1];
      e.sets.push({ w: null, r: null, done: false, pw: last ? (last.w ?? last.pw) : null, pr: last ? (last.r ?? last.pr) : null });
      save(); render();
    },
    'remove-set': (b) => {
      const e = db.active.entries[+b.dataset.e];
      if (e.sets.length > 1) { e.sets.pop(); save(); render(); }
    },
    'entry-menu': (b) => entryMenu(+b.dataset.e),
    'entry-rest': (b) => entryRest(+b.dataset.e),
    'add-to-workout': () => openPicker((ids) => { ids.forEach((id) => db.active.entries.push(newEntry(id))); save(); render(); }),
    'finish-workout': finishWorkout,
    'cancel-workout': () => ask('¿Descartar entrenamiento?', 'No se guardará nada de esta sesión.', 'Descartar', true).then((ok) => {
      if (ok) discardWorkout();
    }),
    'clock-menu': clockMenu,
    'wk-resume': () => resumeWorkout(),
    'manual-timer': () => startTimer(db.settings.rest),
    'timer-adj': (b) => adjustTimer(+b.dataset.d),
    'timer-skip': () => { finishedShownUntil = 0; stopTimer(); },
    'f-place': (b) => { ui.lib.place = b.dataset.v; render(); },
    'f-muscle': (b) => { ui.lib.muscle = b.dataset.v; render(); },
    'ex-detail': (b) => exDetail(b.dataset.id),
    'new-exercise': newExercise,
    'lib-mode': (b) => { ui.libMode = b.dataset.v; render(); },
    'muscle-poster': (b) => musclePoster(b.dataset.v),
    'hist-mode': (b) => { ui.histMode = b.dataset.v; render(); },
    'edit-profile': () => editProfile(),
    'add-measure': () => measureSheet(null),
    'edit-measure': (b) => measureSheet(b.dataset.id),
    'body-metric': (b) => { ui.bodyMetric = b.dataset.v; render(); },
    'nu-goal': (b) => { db.profile.goal = b.dataset.v; save(); render(); },
    'nu-meals': (b) => { db.profile.meals = +b.dataset.v; save(); render(); },
    'nu-diet': (b) => { db.profile.diet = b.dataset.v; save(); render(); },
    'nu-shuffle': () => { db.mealPlan.shift += 3; db.mealPlan.swaps = {}; save(); render(); },
    'nu-swap': (b) => { const k = +b.dataset.v; db.mealPlan.swaps[k] = (db.mealPlan.swaps[k] || 0) + 1; save(); render(); },
    'go-nutrition': () => setTab('nutrition'),
    'session-detail': (b) => sessionDetail(b.dataset.id),
    'ex-progress': (b) => exProgress(b.dataset.id)
  };

  document.addEventListener('click', (ev) => {
    const tabBtn = ev.target.closest('.tabbar button');
    if (tabBtn) { closeAllSheets(); setTab(tabBtn.dataset.tab); return; }
    const b = ev.target.closest('[data-action]');
    if (!b || b.disabled) return;
    const action = b.dataset.action;
    const sheet = b.closest('.sheet-wrap') ? sheets.find((s) => s.el === b.closest('.sheet-wrap')) : null;
    if (sheet && sheet.cfg.actions && sheet.cfg.actions[action]) { sheet.cfg.actions[action](b); return; }
    if (sheet && action === 'close-sheet') { sheet.close(); return; }
    const fn = globalActions[action];
    if (fn) fn(b);
  });

  function onField(ev) {
    const t = ev.target;
    const wrap = t.closest('.sheet-wrap');
    if (wrap) {
      const sheet = sheets.find((s) => s.el === wrap);
      if (!sheet) return;
      if (t.dataset.search && sheet.cfg.onSearch) { if (ev.type === 'input') sheet.cfg.onSearch(t.value); return; }
      sheet.cfg.onInput && sheet.cfg.onInput(t, ev.type);
      return;
    }
    if (t.dataset.search === 'lib') {
      ui.lib.q = t.value;
      $('#lib-list').innerHTML = libListHtml();
      return;
    }
    if (t.dataset.field && db.active) {
      const e = db.active.entries[+t.dataset.e];
      const s = e && e.sets[+t.dataset.s];
      if (!s) return;
      const v = parseNum(t.value);
      if (t.dataset.field === 'w') s.w = v == null || v === 0 ? null : fromDisp(v);
      else s.r = v == null ? null : Math.round(v);
      saveSoon();
    }
  }
  document.addEventListener('input', onField);
  document.addEventListener('change', (ev) => { if (ev.target.tagName === 'SELECT') onField(ev); });

  // "Enter" en peso salta a reps; en reps marca la serie
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && topSheet()) { topSheet().close(); return; }
    const t = ev.target;
    if (ev.key !== 'Enter' || !t.dataset || !t.dataset.field) return;
    ev.preventDefault();
    if (t.dataset.field === 'w') {
      document.querySelector(`input[data-field="r"][data-e="${t.dataset.e}"][data-s="${t.dataset.s}"]`)?.focus();
    } else {
      t.blur();
      toggleSet(+t.dataset.e, +t.dataset.s);
    }
  });

  // Seleccionar todo al enfocar un campo numérico (más rápido de corregir)
  document.addEventListener('focusin', (ev) => {
    if (ev.target.dataset && ev.target.dataset.field) setTimeout(() => ev.target.select && ev.target.select(), 0);
  });

  /* ================= Inicio ================= */
  render();
  checkStale();
  firstRunChooser();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    const hadController = !!navigator.serviceWorker.controller;
    const bootAt = Date.now();
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    // Cuando hay una versión nueva: recargar si acabas de abrir la app; si no, avisar.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      const typing = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if (Date.now() - bootAt < 15000 && !typing && !sheets.length) { save(); location.reload(); }
      else toast('Nueva versión de GYMBRO lista: ciérrala y ábrela de nuevo');
    });
  }
})();
