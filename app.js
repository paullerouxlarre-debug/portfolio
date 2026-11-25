(() => {
  const CATS = window.CATS, ORDER = Object.keys(CATS);
  const P = window.PROJECTS.slice().sort((x, y) => ORDER.indexOf(x.cat) - ORDER.indexOf(y.cat));
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Numéros de catalogue : A1, A2… B1…
  const counters = {};
  P.forEach(p => { const f = CATS[p.cat].face; counters[f] = (counters[f] || 0) + 1; p.k = f + counters[f]; });
  $("count").textContent = P.length;

  let filter = "all", list = P.slice(), cur = 0, JOURNAL = null;
  const lastOf = p => JOURNAL?.projects?.[p.id]?.last;
  const isFresh = p => { const l = lastOf(p); return !!l && (new Date(JOURNAL.generated) - new Date(l)) / 864e5 <= 7; };
  const fmt = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  // ── pochette ──
  function artHTML(p) {
    const style = `--c1:${p.c[0]};--c2:${p.c[1]};--c3:${p.c[2]}` + (p.img ? `;--img:url('${p.img}')` : "");
    const cls = p.img ? "photo" : p.art;
    const big = p.title.replace(/^(Le |La |Les |Au |Atelier )/, "").charAt(0);
    const fresh = isFresh(p) ? `<div class="ribbon">Neuf</div>` : "";
    return `<div class="art ${cls}" style="${style}">${fresh}
      <div class="pattern" data-big="${esc(big)}"></div>
      <div class="cat"><span>${esc(CATS[p.cat].label)}</span><span>PR-${esc(p.k)}</span></div>
      <h3>${esc(p.title)}</h3>
      ${p.status ? `<div class="sticker alt">${esc(p.status)}</div>` : p.links.length && !p.links[0].private ? `<div class="sticker">EN<br>ÉCOUTE<br>LIBRE</div>` : ""}
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
      if (e.key === " " && !e.target.closest?.("button,a")) { e.preventDefault(); setDeck(!deckOn); }
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
  const drawSides = () => $("sides").innerHTML = Object.entries(CATS).map(([k, v]) => `
    <div class="side"><h3>Face ${v.face} — ${v.label}</h3>
    ${P.filter(p => p.cat === k).map(p => `<button class="row" data-id="${p.id}">
      <span class="k">${p.k}</span><span><b>${esc(p.title)}</b><span>${esc(p.tagline)}</span></span><span class="y">${lastOf(p) ? "màj " + fmt(lastOf(p)) : p.year}</span></button>`).join("")}
    </div>`).join("");
  drawSides();
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
    $("pY").textContent = p.year + (p.status ? " · " + p.status : "");
    spotify.show(p);
    fillNews(p);
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
  function fillNews(p) {
    const j = JOURNAL?.projects?.[p.id];
    $("pY").textContent = p.year + (p.status ? " · " + p.status : "") + (j ? " · màj " + fmt(j.last) : "");
  }
  // ── platine : un seul état « deckOn » = plateau lancé + diamant sur le disque (+ musique) ──
  const tt = player.querySelector(".tt"), arm = player.querySelector(".arm"), ss = $("ss");
  const ARM_REST = -2, ARM_PLAY = 21, ARM_MAX = 30;
  let deckOn = false, startedAt = 0;
  function setArm(deg, animate = true) {
    arm.style.transition = animate ? "" : "none";
    arm.style.transform = `rotate(${deg}deg)`;
  }
  function setDeck(on, { music = true, sound = true } = {}) {
    deckOn = on;
    player.classList.toggle("spinning", on);
    player.classList.remove("needs-start");
    ss.setAttribute("aria-pressed", on);
    ss.setAttribute("aria-label", on ? "Stop" : "Start");
    setArm(on ? ARM_PLAY : ARM_REST);
    if (on) { startedAt = Date.now(); if (sound) audio.drop(playing); if (music) spotify.play(); }
    else { audio.stop(); if (music) spotify.pause(); }
  }
  function blocked() { // musique bloquée par le navigateur : on attend un geste
    if (deckOn) setDeck(false, { music: false });
    player.classList.add("needs-start");
  }
  function spinUp() {
    timers.forEach(clearTimeout); timers = [];
    setDeck(false, { music: false });
    rot = 0; speed = 0;
    player.classList.remove("loaded");
    void player.offsetWidth;
    later(() => player.classList.add("loaded"), 60);
    later(() => audio.isOn() ? setDeck(true) : player.classList.add("needs-start"), 1000);
    later(() => { if (deckOn && playing?.song && spotify.paused()) blocked(); }, 5000);
  }
  ss.addEventListener("click", () => { audio.tick(); setDeck(!deckOn); });

  // Plateau : accélère au départ, freine à l'arrêt, se fait tourner à la main (scratch)
  const label = $("vlabel"), vinyl = $("vinyl");
  const RPM = 200; // degrés par seconde, environ 33 tours/min
  let rot = 0, speed = 0, last = performance.now(), grab = null;
  (function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!grab) {
      const target = deckOn ? RPM : 0;
      speed += (target - speed) * Math.min(1, dt * (deckOn ? 2.6 : 1.4));
      if (Math.abs(speed) < 0.5 && !deckOn) speed = 0;
      rot += speed * dt;
    }
    label.style.transform = `rotate(${rot}deg)`;
    requestAnimationFrame(loop);
  })(last);
  const centerAngle = (ev, el) => {
    const r = el.getBoundingClientRect();
    return Math.atan2(ev.clientY - (r.top + r.height / 2), ev.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  vinyl.addEventListener("pointerdown", ev => {
    ev.preventDefault(); try { vinyl.setPointerCapture(ev.pointerId); } catch (e) {}
    grab = { a: centerAngle(ev, vinyl), moved: 0, lastSnd: 0 };
    player.classList.add("scratching");
  });
  vinyl.addEventListener("pointermove", ev => {
    if (!grab) return;
    const a = centerAngle(ev, vinyl);
    let d = a - grab.a; if (d > 180) d -= 360; if (d < -180) d += 360;
    rot += d; grab.a = a; grab.moved += Math.abs(d);
    if (Math.abs(d) > 4 && performance.now() - grab.lastSnd > 110) { audio.scratch(Math.sign(d)); grab.lastSnd = performance.now(); }
  });
  const release = () => {
    if (!grab) return;
    if (grab.moved < 3) { rot -= 24; audio.scratch(-1); } // petit coup de doigt
    grab = null; player.classList.remove("scratching");
  };
  vinyl.addEventListener("pointerup", release);
  vinyl.addEventListener("pointercancel", release);

  // Bras : on le saisit et on pose le diamant sur le disque (ou on le relève)
  let armDrag = null;
  const pivot = () => { const r = tt.getBoundingClientRect(); return { x: r.left + r.width * 0.885, y: r.top + r.height * 0.136 }; };
  arm.addEventListener("pointerdown", ev => {
    ev.preventDefault(); ev.stopPropagation(); try { arm.setPointerCapture(ev.pointerId); } catch (e) {}
    armDrag = { moved: false, deg: deckOn ? ARM_PLAY : ARM_REST, startX: ev.clientX, startY: ev.clientY };
    player.classList.add("arm-grab");
  });
  arm.addEventListener("pointermove", ev => {
    if (!armDrag) return;
    if (Math.hypot(ev.clientX - armDrag.startX, ev.clientY - armDrag.startY) > 4) armDrag.moved = true;
    if (!armDrag.moved) return;
    const p = pivot();
    let deg = -Math.atan2(ev.clientX - p.x, ev.clientY - p.y) * 180 / Math.PI;
    deg = Math.max(ARM_REST, Math.min(ARM_MAX, deg));
    armDrag.deg = deg; setArm(deg, false);
  });
  const armUp = () => {
    if (!armDrag) return;
    const { moved, deg } = armDrag; armDrag = null; player.classList.remove("arm-grab");
    if (!moved) { setDeck(!deckOn); return; }            // simple clic : start / stop
    const onRecord = deg > 11;
    if (onRecord !== deckOn) setDeck(onRecord); else setArm(deckOn ? ARM_PLAY : ARM_REST);
  };
  arm.addEventListener("pointerup", armUp);
  arm.addEventListener("pointercancel", armUp);
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
    setDeck(false);
    player.classList.remove("open", "needs-start");
    player.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    later(() => player.classList.remove("loaded"), 450);
    lastFocus?.focus?.();
  }
  function step(d) {
    const i = P.indexOf(playing), n = P[(i + d + P.length) % P.length];
    setDeck(false); fill(n); spinUp();
    const li = list.indexOf(n); if (li >= 0) { cur = li; layout(); }
  }
  $("close").onclick = closePlayer;
  $("pPrev").onclick = () => step(-1);
  $("pNext").onclick = () => step(1);
  player.addEventListener("click", e => { if (e.target === player) closePlayer(); });

  // ── son (coupé par défaut) ──
  const audio = (() => {
    let ctx, on = localStorage.getItem("bac-son") !== "0", nodes = [];
    const btn = $("sound");
    const paint = () => { btn.setAttribute("aria-pressed", on); $("soundTxt").textContent = on ? "Musique auto" : "Musique coupée"; };
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
      if (p.song) { cg.gain.setValueAtTime(0.35, t + 1); cg.gain.linearRampToValueAtTime(0, t + 1.6); cr.stop(t + 1.7); }
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
      if (!p.song) { const iv = setInterval(note, 300); nodes.push(iv); }
      // bruit de pose du diamant
      const th = c.createBufferSource(); th.buffer = noise(0.15);
      const tg = c.createGain(); tg.gain.setValueAtTime(0.8, t); tg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      th.connect(tg).connect(out); th.start();
    }
    btn.onclick = () => {
      on = !on; localStorage.setItem("bac-son", on ? "1" : "0"); paint();
      if (on) { ac().resume(); tick(); if (player.classList.contains("open") && !deckOn) setDeck(true); } else if (deckOn) setDeck(false);
    };
    function scratch(dir = 1) {
      if (!on) return;
      const c = ac(), t = c.currentTime, src = c.createBufferSource();
      const b = c.createBuffer(1, c.sampleRate * 0.35, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      src.buffer = b;
      const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 6;
      const f0 = dir > 0 ? 350 : 1800, f1 = dir > 0 ? 2200 : 300;
      bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + 0.14);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.45, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      src.connect(bp).connect(g).connect(c.destination); src.start(t);
    }
    return { isOn: () => on, drop, stop, scratch, tick: () => {
      if (!on) return;
      const c = ac(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = "square"; o.frequency.value = 1800;
      g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.04);
    } };
  })();
  function tick() { audio.tick(); }

  // ── bande-son Spotify ──
  const spotify = (() => {
    let api = null, ctrl = null, current = null, wantPlay = false, loadedUri = null, pending = false, state = { isPaused: true };
    const box = $("pSpot");
    window.onSpotifyIframeApiReady = IFrameAPI => { api = IFrameAPI; if (current?.song) mount(current); };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1"; s.async = true; document.head.appendChild(s);
    function onUpdate(e) {
      state = e.data || state;
      if (pending && state.duration > 0) { pending = false; if (wantPlay) ctrl.play(); }
      // la platine suit la vraie lecture (bouton du lecteur Spotify, fin du morceau…)
      if (!player.classList.contains("open")) return;
      if (!state.isPaused && !deckOn) setDeck(true, { music: false, sound: false });
      else if (state.isPaused && deckOn && !state.isBuffering && state.position > 0 && Date.now() - startedAt > 1500) setDeck(false, { music: false });
    }
    function mount(p) {
      const uri = "spotify:track:" + p.song.id;
      if (ctrl) {
        if (loadedUri !== uri) {
          loadedUri = uri; pending = true; state = { isPaused: true };
          ctrl.loadUri(uri);
          setTimeout(() => { if (pending) { pending = false; if (wantPlay) ctrl.play(); } }, 1500);
        }
        return;
      }
      if (!api) { // repli tant que l'API n'est pas chargée : lecteur intégré simple
        box.querySelector(".spot-player").innerHTML = `<iframe title="Lecteur Spotify : ${esc(p.song.title)}" src="https://open.spotify.com/embed/track/${p.song.id}?utm_source=generator" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        return;
      }
      const el = document.createElement("div");
      box.querySelector(".spot-player").replaceChildren(el);
      loadedUri = uri; pending = true;
      api.createController(el, { uri, width: "100%", height: 80 }, c => {
        ctrl = c;
        c.addListener("ready", () => { pending = false; if (wantPlay) c.play(); });
        c.addListener("playback_update", onUpdate);
      });
    }
    return {
      show(p) {
        current = p; wantPlay = false;
        box.hidden = !p.song;
        if (!p.song) { ctrl?.pause?.(); return; }
        $("pSong").textContent = `${p.song.title} — ${p.song.artist}`;
        mount(p);
      },
      play() { if (!current?.song) return; wantPlay = true; if (ctrl && !pending) ctrl.play(); },
      pause() { wantPlay = false; ctrl?.pause?.(); },
      paused: () => !ctrl || state.isPaused
    };
  })();

  build(0);

  // ── journal des nouveautés (data/journal.json, mis à jour par le robot GitHub) ──
  function journal() {
    fetch("data/journal.json?t=" + Date.now()).then(r => r.ok ? r.json() : null).then(j => {
      if (!j) return;
      JOURNAL = j;
      build(cur); drawSides();
      const byId = Object.fromEntries(P.map(p => [p.id, p]));
      const feed = j.feed.filter(e => byId[e.id]);
      $("feed").innerHTML = feed.slice(0, 12).map(e => {
        const p = byId[e.id];
        return `<li style="--c1:${p.c[0]}"><span class="dot"></span><time datetime="${e.date}">${fmt(e.date)} · ${esc(CATS[p.cat].label)}</time>
          <button data-id="${p.id}">${esc(p.title)}</button><p>${esc(e.text)}</p>${e.more ? `<span class="more">+ ${e.more} autre${e.more > 1 ? "s" : ""} modification${e.more > 1 ? "s" : ""} ce jour-là</span>` : ""}</li>`;
      }).join("");
      $("ticker").innerHTML = feed.slice(0, 10).map(e => `<span><b>${fmt(e.date)}</b>${esc(byId[e.id].title)} — ${esc(e.text)}</span>`).join("");
      const g = new Date(j.generated);
      $("newsStamp").innerHTML = `<b>Mise à jour automatique</b><br>dernière collecte le ${g.toLocaleDateString("fr-FR")} à ${g.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
      $("nouveautes").hidden = false;
      if (playing && player.classList.contains("open")) fillNews(playing);
    }).catch(() => {});
  }
  $("feed").addEventListener("click", e => {
    const b = e.target.closest("button[data-id]"); if (b) openPlayer(P.find(p => p.id === b.dataset.id));
  });
  journal();

  // Lien direct vers un disque : …/#disque=fournil
  const fromHash = () => {
    const m = location.hash.match(/^#disque=([\w-]+)/);
    const p = m && P.find(x => x.id === m[1]);
    if (p) { const i = list.indexOf(p); if (i >= 0) { cur = i; layout(); } openPlayer(p); }
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
