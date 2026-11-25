(() => {
  const P = window.PROJECTS, CATS = window.CATS;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Numéros de catalogue : A1, A2… B1…
  const counters = {};
  P.forEach(p => { const f = CATS[p.cat].face; counters[f] = (counters[f] || 0) + 1; p.k = f + counters[f]; });
  $("count").textContent = P.length;

  let filter = "all", list = P.slice(), cur = 0;

  // ── pochette ──
  function artHTML(p) {
    const style = `--c1:${p.c[0]};--c2:${p.c[1]};--c3:${p.c[2]}` + (p.img ? `;--img:url('${p.img}')` : "");
    const cls = p.img ? "photo" : p.art;
    const big = p.title.replace(/^(Le |La |Les |Au |Atelier )/, "").charAt(0);
    return `<div class="art ${cls}" style="${style}">
      <div class="pattern" data-big="${esc(big)}"></div>
      <div class="cat"><span>${esc(CATS[p.cat].label)}</span><span>PR-${esc(p.k)}</span></div>
      <h3>${esc(p.title)}</h3>
      ${p.links.length && !p.links[0].private ? `<div class="sticker">EN<br>ÉCOUTE<br>LIBRE</div>` : ""}
    </div>`;
  }

  // ── intercalaires ──
  const divs = [["all", "Tout le bac", "★"], ...Object.entries(CATS).map(([k, v]) => [k, v.label, v.face])];
  $("dividers").innerHTML = divs.map(([k, l, f]) =>
    `<button class="div" data-f="${k}" aria-pressed="${k === "all"}"><small>${f}</small>${l}</button>`).join("");
  $("dividers").addEventListener("click", e => {
    const b = e.target.closest(".div"); if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll(".div").forEach(d => d.setAttribute("aria-pressed", d === b));
    build(0);
  });

  // ── bac ──
  const rail = $("rail");
  function build(start) {
    list = filter === "all" ? P.slice() : P.filter(p => p.cat === filter);
    rail.innerHTML = list.map((p, i) =>
      `<div class="sleeve" data-i="${i}" style="--c1:${p.c[0]}" role="button" tabindex="-1" aria-label="${esc(p.title)}">
        <div class="disc"></div><div class="face">${artHTML(p)}</div></div>`).join("");
    cur = Math.min(start, list.length - 1);
    layout();
  }
  function layout() {
    const w = rail.querySelector(".sleeve")?.offsetWidth || 300;
    const step = w * 0.22, gap = w * 0.62;
    rail.querySelectorAll(".sleeve").forEach((el, i) => {
      const d = i - cur, a = Math.abs(d), s = Math.sign(d);
      el.classList.toggle("current", d === 0);
      el.classList.toggle("hidden", a > 7);
      el.style.zIndex = 100 - a;
      el.style.transform = d === 0
        ? `translate3d(0,-15%,140px) rotateY(0deg)`
        : `translate3d(${s * (gap + (a - 1) * step)}px,${a * 1.2}%,${-a * 70}px) rotateY(${-s * 62}deg)`;
    });
    const p = list[cur];
    $("nowN").textContent = `${p.k} · ${CATS[p.cat].label} · ${p.year}`;
    $("nowT").textContent = p.title;
    $("nowS").textContent = p.tagline;
  }
  const go = i => { const n = Math.max(0, Math.min(list.length - 1, i)); if (n !== cur) { cur = n; layout(); tick(); } };

  rail.addEventListener("click", e => {
    if (moved) return;
    const s = e.target.closest(".sleeve"); if (!s) return;
    const i = +s.dataset.i; i === cur ? openPlayer(list[cur]) : go(i);
  });
  $("prev").onclick = () => go(cur - 1);
  $("next").onclick = () => go(cur + 1);
  $("play").onclick = () => openPlayer(list[cur]);

  // molette
  let acc = 0, wheelT;
  $("crate").addEventListener("wheel", e => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if ((cur === 0 && d < 0) || (cur === list.length - 1 && d > 0)) return; // laisse la page défiler aux bords
    e.preventDefault(); acc += d;
    if (Math.abs(acc) > 50) { go(cur + Math.sign(acc)); acc = 0; }
    clearTimeout(wheelT); wheelT = setTimeout(() => acc = 0, 160);
  }, { passive: false });

  // glisser / balayer
  let down = null, moved = false;
  const crate = $("crate");
  crate.addEventListener("pointerdown", e => { down = { x: e.clientX, c: cur }; moved = false; });
  window.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (Math.abs(dx) > 8) { moved = true; crate.classList.add("dragging"); }
    const n = down.c - Math.round(dx / 70);
    if (moved) go(n);
  });
  window.addEventListener("pointerup", () => { down = null; crate.classList.remove("dragging"); setTimeout(() => moved = false, 0); });

  // clavier
  document.addEventListener("keydown", e => {
    const open = $("player").classList.contains("open");
    if (open) {
      if (e.key === "Escape") closePlayer();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      return;
    }
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest("input,textarea")) return;
    if (e.key === "ArrowRight") { go(cur + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { go(cur - 1); e.preventDefault(); }
    if (e.key === "Enter" && !t?.closest("button,a")) openPlayer(list[cur]);
  });
  window.addEventListener("resize", layout);

  // ── liste des titres ──
  $("sides").innerHTML = Object.entries(CATS).map(([k, v]) => `
    <div class="side"><h3>Face ${v.face} — ${v.label}</h3>
    ${P.filter(p => p.cat === k).map(p => `<button class="row" data-id="${p.id}">
      <span class="k">${p.k}</span><span><b>${esc(p.title)}</b><span>${esc(p.tagline)}</span></span><span class="y">${p.year}</span></button>`).join("")}
    </div>`).join("");
  $("sides").addEventListener("click", e => {
    const r = e.target.closest(".row"); if (!r) return;
    openPlayer(P.find(p => p.id === r.dataset.id));
  });

  // ── platine ──
  const player = $("player");
  let playing = null, lastFocus = null, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function fill(p) {
    playing = p;
    player.style.setProperty("--c1", p.c[0]); player.style.setProperty("--c2", p.c[1]);
    $("vlabel").innerHTML = `<span>${esc(p.title)}</span><small>${p.k} · 33⅓</small>`;
    $("pN").textContent = `Face ${CATS[p.cat].face} · ${CATS[p.cat].label} · ${p.k}`;
    $("pY").textContent = p.year;
    $("pTitle").textContent = p.title;
    $("pTag").textContent = p.tagline;
    $("pDesc").textContent = p.desc;
    $("pTracks").innerHTML = p.tracks.map(t => `<li>${esc(t)}</li>`).join("");
    $("pTech").innerHTML = p.tech.map(t => `<span>${esc(t)}</span>`).join("");
    $("pLinks").innerHTML = p.links.length ? p.links.map((l, i) => {
      const ext = /^https?:/.test(l.url);
      return `<a class="btn ${i === 0 ? "main" : ""}" href="${esc(l.url)}" ${ext ? 'target="_blank" rel="noopener"' : ""}>${esc(l.label)} ↗${l.private ? " <small>(accès privé)</small>" : ""}</a>`;
    }).join("") : `<span class="btn" aria-disabled="true">Disque privé, pas d'écoute publique</span>`;
    const pol = $("polaroid");
    if (p.img) { $("pImg").src = p.img; pol.hidden = false; } else pol.hidden = true;
  }
  function spinUp() {
    timers.forEach(clearTimeout); timers = [];
    player.classList.remove("loaded", "spinning");
    void player.offsetWidth;
    later(() => player.classList.add("loaded"), 60);
    later(() => { player.classList.add("spinning"); audio.drop(playing); }, 1000);
  }
  function openPlayer(p) {
    if (!p) return;
    lastFocus = document.activeElement;
    fill(p);
    player.classList.add("open"); player.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    spinUp();
    $("close").focus();
  }
  function closePlayer() {
    timers.forEach(clearTimeout);
    audio.stop();
    player.classList.remove("open", "spinning");
    player.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    later(() => player.classList.remove("loaded"), 450);
    lastFocus?.focus?.();
  }
  function step(d) {
    const i = P.indexOf(playing), n = P[(i + d + P.length) % P.length];
    audio.stop(); fill(n); spinUp();
    const li = list.indexOf(n); if (li >= 0) { cur = li; layout(); }
  }
  $("close").onclick = closePlayer;
  $("pPrev").onclick = () => step(-1);
  $("pNext").onclick = () => step(1);
  player.addEventListener("click", e => { if (e.target === player) closePlayer(); });

  // ── son (coupé par défaut) ──
  const audio = (() => {
    let ctx, on = localStorage.getItem("bac-son") === "1", nodes = [];
    const btn = $("sound");
    const paint = () => { btn.setAttribute("aria-pressed", on); $("soundTxt").textContent = on ? "Son actif" : "Son coupé"; };
    paint();
    const ac = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
    function noise(sec) {
      const c = ac(), b = c.createBuffer(1, c.sampleRate * sec, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() < 0.0009 ? (Math.random() * 2 - 1) : (Math.random() * 2 - 1) * 0.04;
      return b;
    }
    function stop() { nodes.forEach(n => { try { n.stop ? n.stop() : clearInterval(n); } catch (e) {} }); nodes = []; }
    function drop(p) {
      if (!on || !p) return;
      stop();
      const c = ac(), t = c.currentTime, out = c.createGain(); out.gain.value = 0.9; out.connect(c.destination);
      // craquements du sillon
      const cr = c.createBufferSource(); cr.buffer = noise(2); cr.loop = true;
      const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1200;
      const cg = c.createGain(); cg.gain.value = 0.35;
      cr.connect(hp).connect(cg).connect(out); cr.start(); nodes.push(cr);
      // petite boucle propre à chaque disque
      const seed = [...p.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
      const root = 196 * Math.pow(2, (seed % 7) / 12);
      const scale = [0, 3, 7, 10, 12, 7, 5, 3];
      let n = 0;
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400; lp.connect(out);
      const note = () => {
        const tt = c.currentTime, o = c.createOscillator(), g = c.createGain();
        o.type = n % 2 ? "triangle" : "sine";
        o.frequency.value = root * Math.pow(2, scale[(n + seed) % scale.length] / 12);
        g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(0.09, tt + 0.02); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.5);
        o.connect(g).connect(lp); o.start(tt); o.stop(tt + 0.55); n++;
      };
      const iv = setInterval(note, 300); nodes.push(iv);
      // bruit de pose du diamant
      const th = c.createBufferSource(); th.buffer = noise(0.15);
      const tg = c.createGain(); tg.gain.setValueAtTime(0.8, t); tg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      th.connect(tg).connect(out); th.start();
    }
    btn.onclick = () => {
      on = !on; localStorage.setItem("bac-son", on ? "1" : "0"); paint();
      if (on) { ac().resume(); tick(); if (player.classList.contains("spinning")) drop(playing); } else stop();
    };
    return { drop, stop, tick: () => {
      if (!on) return;
      const c = ac(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = "square"; o.frequency.value = 1800;
      g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.04);
    } };
  })();
  function tick() { audio.tick(); }

  build(0);

  // Lien direct vers un disque : …/#disque=fournil
  const fromHash = () => {
    const m = location.hash.match(/^#disque=([\w-]+)/);
    const p = m && P.find(x => x.id === m[1]);
    if (p) { const i = list.indexOf(p); if (i >= 0) { cur = i; layout(); } openPlayer(p); }
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
