'use strict';

/* ============ 常量与数据 ============ */
const BUDGET_TOTAL = 5 * 3600; // 5 小时
const CATS = ['哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表', '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心', '动态规划', '多维动态规划', '技巧'];
const P = window.HOT100 || [];
const FULL = window.HOT100_FULL || {}; // lc → 力扣完整题面 HTML
const LS_KEY = 'fasthot100.v1';
const KEY_GRADE = { '1': 'ok', '2': 'fuzzy', '3': 'fail' };

/* ============ 状态 ============ */
let S = loadState();          // { grades: {lc: 'ok'|'fuzzy'|'fail'}, time: 秒 }
let view = 'dash';
let drill = null;             // { queue: [idx], pos, flipped, spent, title }
let tick = null;

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (s && typeof s === 'object') return Object.assign({ grades: {}, time: 0 }, s);
  } catch (e) { /* 损坏则重置 */ }
  return { grades: {}, time: 0 };
}
const save = () => localStorage.setItem(LS_KEY, JSON.stringify(S));

/* ============ 工具 ============ */
const $ = s => document.querySelector(s);
const gradeOf = p => S.grades[p.lc];
const cur = () => P[drill.queue[drill.pos]];

function fmtHMS(sec) {
  sec = Math.max(0, Math.round(sec));
  return Math.floor(sec / 3600) + ':' +
    String(Math.floor(sec % 3600 / 60)).padStart(2, '0') + ':' +
    String(sec % 60).padStart(2, '0');
}
function fmtMS(sec) {
  const neg = sec < 0;
  sec = Math.abs(Math.round(sec));
  return (neg ? '−' : '') + Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Java 语法高亮：注释 > 字符串 > 关键字 > 类型 > 数字 */
const HL_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(public|private|protected|static|final|abstract|class|interface|enum|void|int|long|double|float|boolean|char|byte|short|new|return|if|else|for|while|do|break|continue|switch|case|default|null|true|false|this|super|extends|implements|import|instanceof|throw|throws|try|catch|finally|var)\b|\b([A-Z][A-Za-z0-9_]*)\b|\b(\d[\w]*)\b/g;
function hl(src) {
  return esc(src).replace(HL_RE, (m, c, st, k, ty, n) =>
    c  ? '<span class="tk-c">' + c + '</span>' :
    st ? '<span class="tk-s">' + st + '</span>' :
    k  ? '<span class="tk-k">' + k + '</span>' :
    ty ? '<span class="tk-t">' + ty + '</span>' :
         '<span class="tk-n">' + n + '</span>');
}

function tally() {
  const t = { ok: 0, fuzzy: 0, fail: 0, un: 0 };
  P.forEach(p => { t[gradeOf(p) || 'un']++; });
  return t;
}
const plannedDone = () => P.reduce((a, p) => a + (gradeOf(p) ? p.budget : 0), 0);
const planLeft = () => P.reduce((a, p) => a + (gradeOf(p) === 'ok' ? 0 : p.budget), 0);

/* ============ HUD：总用时 / 预算条 / 节奏 ============ */
function paintHud() {
  $('#hud-used').textContent = fmtHMS(S.time);
  const fill = $('#budget-fill');
  fill.style.width = Math.min(100, S.time / BUDGET_TOTAL * 100) + '%';
  fill.classList.toggle('over', S.time > BUDGET_TOTAL);

  const paceEl = $('#hud-pace');
  const planned = plannedDone();
  if (!planned && !S.time) { paceEl.textContent = '—'; paceEl.className = 'mono'; return; }
  const diff = planned - S.time; // 已完成题的计划用时 − 实际用时
  paceEl.textContent = (diff >= 0 ? '快 ' : '慢 ') + fmtMS(Math.abs(diff));
  paceEl.className = 'mono ' + (diff >= 0 ? 'good' : 'bad');
}

/* ============ 计时（仅刷题视图走表，切走标签页自动暂停） ============ */
function startTick() {
  if (tick) return;
  tick = setInterval(() => {
    if (document.hidden || view !== 'drill' || !drill) return;
    S.time++;
    drill.spent++;
    if (S.time % 5 === 0) save();
    paintHud();
    paintTimer();
  }, 1000);
}
function stopTick() {
  if (tick) { clearInterval(tick); tick = null; }
  save();
}

const RING_LEN = 2 * Math.PI * 26;
function paintTimer() {
  if (!drill) return;
  const p = cur();
  const remain = p.budget - drill.spent;
  document.querySelectorAll('.t-num').forEach(el => {
    el.textContent = fmtMS(remain);
    el.classList.toggle('over', remain < 0);
  });
  const frac = Math.max(0, Math.min(1, remain / p.budget));
  document.querySelectorAll('.ring-fg').forEach(el => {
    el.style.strokeDashoffset = RING_LEN * (1 - frac);
    el.classList.toggle('over', remain < 0);
  });
}

/* ============ 总览 ============ */
function renderDash() {
  view = 'dash';
  drill = null;
  stopTick();

  const t = tally();
  const remainPlan = planLeft();
  const leftBudget = BUDGET_TOTAL - S.time;
  const reQ = t.fuzzy + t.fail;

  const catRows = CATS.map((c, ci) => {
    const items = P.map((p, i) => ({ p, i })).filter(x => x.p.cat === c);
    if (!items.length) return '';
    const done = items.filter(x => gradeOf(x.p) === 'ok').length;
    const segs = items.map(x =>
      `<i class="seg ${gradeOf(x.p) || ''}" title="LC${x.p.lc} ${esc(x.p.title)}"></i>`).join('');
    return `<button class="catrow" data-cat="${c}" style="--d:${ci * 35}ms">
      <span class="catname">${c}</span>
      <span class="segs">${segs}</span>
      <span class="catnum mono">${done}/${items.length}</span>
    </button>`;
  }).join('');

  $('#view').innerHTML = `
  <section class="dash">
    <div class="hero">
      <div class="hero-big">
        <b class="mono">${t.un + t.fuzzy + t.fail}</b>
        <span>题待拿下<br>全量 ${P.length} 题<br>含 13 道 Hard 已全部补齐</span>
      </div>
      <div class="hero-stats">
        <div class="stat ok"><b class="mono">${t.ok}</b><span>秒会</span></div>
        <div class="stat fuzzy"><b class="mono">${t.fuzzy}</b><span>模糊</span></div>
        <div class="stat fail"><b class="mono">${t.fail}</b><span>不会</span></div>
        <div class="stat"><b class="mono">${t.un}</b><span>未刷</span></div>
      </div>
      <div class="hero-plan">剩余计划用时
        <b class="mono">${fmtHMS(remainPlan)}</b> · 剩余预算
        <b class="mono ${remainPlan > leftBudget ? 'bad' : 'good'}">${fmtHMS(Math.max(0, leftBudget))}</b>
        ${remainPlan > leftBudget ? '<span class="bad">（要加速了）</span>' : ''}
      </div>
    </div>

    <div class="actions">
      <button class="btn primary" id="btn-start" ${t.un ? '' : 'disabled'}>${t.un < P.length ? '继续冲刺' : '开始冲刺'} <kbd>空格</kbd></button>
      <button class="btn warn" id="btn-requeue" ${reQ ? '' : 'disabled'}>重刷队列 <b class="mono">${reQ}</b></button>
      <button class="btn ghost" id="btn-reset">重置进度</button>
    </div>

    <div class="method">
      <div><i>01</i><b>主动回忆</b>看到题面先在脑内复述：套路、关键步骤、复杂度，再翻面对答案。直接看答案 ≈ 白看。</div>
      <div><i>02</i><b>三档分流</b>秒会 → 永久移出；模糊 / 不会 → 进重刷队列循环，直到全部变成秒会。</div>
      <div><i>03</i><b>卡点止损</b>圆环是单题建议用时（S 4min · A 2.5min · B 1min）。超时就翻面背思路，不硬磕。</div>
    </div>

    <div class="cats">${catRows}</div>
    <p class="foot">快捷键 — <kbd>空格</kbd> 翻面 · <kbd>1</kbd> 秒会 <kbd>2</kbd> 模糊 <kbd>3</kbd> 不会 · <kbd>Esc</kbd> 返回总览 · 进度自动保存在本机</p>
  </section>`;

  $('#btn-start').onclick = startMain;
  $('#btn-requeue').onclick = startRequeue;
  $('#btn-reset').onclick = () => {
    if (confirm('清空全部自评与计时，从零开始？')) {
      S = { grades: {}, time: 0 };
      save();
      renderDash();
    }
  };
  document.querySelectorAll('.catrow').forEach(el => el.onclick = () => startCat(el.dataset.cat));
  paintHud();
}

/* ============ 队列构建 ============ */
function startMain() {
  const q = P.map((p, i) => i).filter(i => !gradeOf(P[i]));
  if (!q.length) return startRequeue();
  beginDrill(q, '全程冲刺');
}
function startCat(cat) {
  let q = P.map((p, i) => i).filter(i => P[i].cat === cat && gradeOf(P[i]) !== 'ok');
  if (!q.length) q = P.map((p, i) => i).filter(i => P[i].cat === cat); // 全秒会则整组复盘
  beginDrill(q, cat);
}
function startRequeue() {
  const fails = P.map((p, i) => i).filter(i => gradeOf(P[i]) === 'fail');
  const fuzz = P.map((p, i) => i).filter(i => gradeOf(P[i]) === 'fuzzy');
  const q = fails.concat(fuzz); // 不会的优先
  if (!q.length) return;
  beginDrill(q, '重刷队列');
}
function beginDrill(queue, title) {
  drill = { queue, pos: 0, flipped: false, spent: 0, title };
  view = 'drill';
  renderDrill();
  startTick();
}

/* ============ 刷题视图 ============ */
function ringSvg() {
  return `<svg class="ring" viewBox="0 0 60 60">
    <circle class="ring-bg" cx="30" cy="30" r="26"/>
    <circle class="ring-fg" cx="30" cy="30" r="26" style="stroke-dasharray:${RING_LEN}"/>
    <text class="t-num" x="30" y="34.5" text-anchor="middle"></text>
  </svg>`;
}

function renderDrill() {
  const p = cur();
  const diffCls = p.diff === '困难' ? 'hard' : p.diff === '中等' ? 'mid' : 'easy';
  $('#view').innerHTML = `
  <section class="drill">
    <div class="drill-bar">
      <button class="btn ghost sm" id="btn-exit">‹ 总览 <kbd>Esc</kbd></button>
      <div class="crumbs">
        <span class="chip">${esc(drill.title)}</span>
        <span class="chip ${diffCls}">${p.diff}</span>
        <span class="chip tier t${p.tier}">优先级 ${p.tier}</span>
      </div>
      <div class="pos mono">${drill.pos + 1}<i> / ${drill.queue.length}</i></div>
    </div>

    <div class="card ${drill.flipped ? 'flipped' : ''}" id="card">
      <div class="face front">
        ${ringSvg()}
        <div class="lc mono">LC ${p.lc}</div>
        <h2>${esc(p.title)}</h2>
        <div class="statement">${FULL[p.lc] || '<p>' + esc(p.desc) + '</p>'}</div>
        <div class="recall">先回忆 — <b>套路？关键步骤？复杂度？</b></div>
        <button class="btn primary" id="btn-flip">翻面对答案 <kbd>空格</kbd></button>
      </div>

      <div class="face back">
        <div class="back-head">
          <span class="lc mono">LC ${p.lc} · ${esc(p.title)}</span>
          <span class="chip pattern">⚡ ${esc(p.pattern)}</span>
          <span class="t-num mono"></span>
        </div>
        <p class="idea">${esc(p.idea)}</p>
        <ul class="traps">${p.traps.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="comp mono">${esc(p.comp)}</div>
        <pre class="code"><code>${hl(p.code)}</code></pre>
        <div class="grade">
          <button class="g ok" data-g="ok"><kbd>1</kbd>秒会<small>移出队列</small></button>
          <button class="g fuzzy" data-g="fuzzy"><kbd>2</kbd>模糊<small>进重刷</small></button>
          <button class="g fail" data-g="fail"><kbd>3</kbd>不会<small>优先重刷</small></button>
        </div>
      </div>
    </div>
  </section>`;

  $('#btn-exit').onclick = renderDash;
  $('#btn-flip').onclick = flip;
  document.querySelectorAll('.grade .g').forEach(b => b.onclick = () => grade(b.dataset.g));
  paintTimer();
  paintHud();
  window.scrollTo(0, 0);
}

function flip() {
  if (drill.flipped) return;
  drill.flipped = true;
  $('#card').classList.add('flipped');
}

function grade(g) {
  if (!drill || !drill.flipped) return;
  S.grades[cur().lc] = g;
  save();
  drill.pos++;
  drill.spent = 0;
  drill.flipped = false;
  if (drill.pos >= drill.queue.length) renderDone();
  else renderDrill();
}

/* ============ 单轮完成 ============ */
function renderDone() {
  stopTick();
  view = 'done';
  const t = tally();
  const reQ = t.fuzzy + t.fail;
  $('#view').innerHTML = `
  <section class="done">
    <h2>本轮完成</h2>
    <p class="big mono">${fmtHMS(S.time)} <span>/ 5:00:00</span></p>
    <div class="hero-stats">
      <div class="stat ok"><b class="mono">${t.ok}</b><span>秒会</span></div>
      <div class="stat fuzzy"><b class="mono">${t.fuzzy}</b><span>模糊</span></div>
      <div class="stat fail"><b class="mono">${t.fail}</b><span>不会</span></div>
      <div class="stat"><b class="mono">${t.un}</b><span>未刷</span></div>
    </div>
    ${reQ
      ? `<button class="btn warn" id="btn-requeue">进入重刷队列（${reQ} 题）</button>`
      : (t.un ? '' : `<p class="all-clear">${P.length} 题全部秒会，状态拉满，周一直接开秒 🎯</p>`)}
    ${t.un ? `<button class="btn primary" id="btn-continue">继续刷未完成（${t.un} 题）</button>` : ''}
    <button class="btn ghost" id="btn-back">返回总览 <kbd>Esc</kbd></button>
  </section>`;
  const rq = $('#btn-requeue'); if (rq) rq.onclick = startRequeue;
  const ct = $('#btn-continue'); if (ct) ct.onclick = startMain;
  $('#btn-back').onclick = renderDash;
  paintHud();
}

/* ============ 键盘 ============ */
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (view === 'drill' && drill) {
    if (e.code === 'Space') { e.preventDefault(); flip(); }
    else if (e.key === 'Escape') renderDash();
    else if (KEY_GRADE[e.key]) grade(KEY_GRADE[e.key]);
  } else if (view === 'dash' && e.code === 'Space') {
    e.preventDefault();
    startMain();
  } else if (view === 'done' && e.key === 'Escape') {
    renderDash();
  }
});

window.addEventListener('beforeunload', save);

/* ============ 启动 ============ */
window.addEventListener('error', e => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#7a1f12;color:#fff;padding:8px 14px;font:12px monospace;z-index:9999';
  el.textContent = 'JS 错误: ' + e.message + ' @ ' + (e.filename || '').split('/').pop() + ':' + e.lineno;
  document.body.appendChild(el);
});

if (!P.length) {
  $('#view').innerHTML = '<p class="foot">数据未加载：请确认 data/data1.js ~ data4.js 存在。</p>';
} else {
  renderDash();
  if (location.hash === '#autodrill') { startMain(); }
  if (location.hash === '#autoflip') { startMain(); flip(); }
}
