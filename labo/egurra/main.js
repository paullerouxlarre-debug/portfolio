/* Atelier Egurra — démo vitrine premium. QG / Léo, 2026-11-17.
   Pas de clé, pas de réseau hors CDN (gsap, Lenis). Tout le reste est local.
   Structure : outils → shader WebGL du hero → préloader → sections dans l'ordre du document
   (l'ordre compte pour ScrollTrigger et les pins) → curseur / magnétisme → intro. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = matchMedia('(max-width: 860px)').matches;
  const hasLibs = !!(window.gsap && window.ScrollTrigger);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Découpe en lettres masquées (accessible : aria-label sur le parent) ---------- */
  function split(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const frag = document.createDocumentFragment();
    const chars = [];
    const walk = (node, target) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { target.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            [...p].forEach((ch) => {
              const m = document.createElement('span'); m.className = 'm';
              const c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
              m.appendChild(c); w.appendChild(m); chars.push(c);
            });
            target.appendChild(w);
          });
        } else if (n.nodeType === 1) {
          const clone = n.cloneNode(false); target.appendChild(clone); walk(n, clone);
        }
      });
    };
    walk(el, frag);
    el.textContent = ''; el.appendChild(frag);
    return chars;
  }

  /* ---------- Shader WebGL : fil du bois, grain, distorsion au survol ---------- */
  function initGL() {
    const cv = $('#gl');
    let gl = null;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { /* fond CSS */ }
    if (!gl) return null;
    const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FS = `
precision highp float;
uniform vec2 u_res; uniform float u_t; uniform vec2 u_m; uniform float u_s; uniform float u_p;
float h(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x), mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 d = uv - u_m; d.x *= asp;
  float r = length(d);
  /* lentille : les veines s'écartent autour du curseur */
  vec2 push = d / (r + 1e-3) * exp(-r*r*14.) * u_s * .075; push.x /= asp;
  uv -= push;
  vec2 q = vec2(uv.x*asp*.9, uv.y*4.2);
  float warp = fbm(vec2(q.x*.35, q.y*.28) + u_t*.012);
  float g = q.y + 2.6*warp + .6*fbm(q*vec2(.9,.4)+3.1);
  float ring = abs(fract(g*1.15)-.5)*2.;
  ring = pow(ring, 1.7);
  float fiber = n(vec2(q.x*2.2 + warp*3., q.y*70.));
  vec3 dark = vec3(.085,.055,.04);
  vec3 light = vec3(.43,.27,.15);
  vec3 col = mix(dark, light, ring*.62 + fiber*.22);
  /* lumière chaude qui suit le curseur */
  col += vec3(.30,.15,.06) * exp(-r*r*7.) * (.55 + u_s*.5);
  /* grain de pellicule, léger */
  col += (h(gl_FragCoord.xy + fract(u_t)*91.) - .5) * .07;
  /* vignette + assombrissement au scroll */
  vec2 c = uv - .5; c.x *= asp*.7;
  col *= 1. - dot(c,c)*.9;
  col *= 1. - u_p*.65;
  gl_FragColor = vec4(col, 1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) { console.warn('Shader non compilé : fond CSS conservé'); return null; }
    const pr = gl.createProgram();
    gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['u_res', 'u_t', 'u_m', 'u_s', 'u_p'].forEach((k) => { U[k] = gl.getUniformLocation(pr, k); });

    // Résolution de rendu réduite : le fbm est coûteux, le grain masque la perte.
    const scale = small ? .5 : .7;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.max(2, Math.round(cv.clientWidth * dpr * scale));
      const h = Math.max(2, Math.round(cv.clientHeight * dpr * scale));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const draw = (t, mx, my, s, p) => {
      gl.uniform2f(U.u_res, cv.width, cv.height);
      gl.uniform1f(U.u_t, t); gl.uniform2f(U.u_m, mx, my); gl.uniform1f(U.u_s, s); gl.uniform1f(U.u_p, p);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    return { resize, draw, cv };
  }

  const gl = initGL();
  const heroEl = $('#top');
  if (gl) {
    const st = { tx: .5, ty: .5, mx: .5, my: .5, s: 0, last: -1e9, visible: true };
    gl.resize();
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { gl.resize(); if (reduce) gl.draw(2.5, .5, .5, .3, 0); }, 120); });
    if (reduce) {
      gl.draw(2.5, .5, .5, .3, 0); // une seule image, pas d'animation
    } else {
      heroEl.addEventListener('pointermove', (e) => {
        const r = gl.cv.getBoundingClientRect();
        st.tx = clamp((e.clientX - r.left) / r.width, 0, 1);
        st.ty = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
        st.last = performance.now();
      }, { passive: true });
      new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; }).observe(heroEl);
      let lastT = 0;
      const render = (time) => {
        if (!st.visible) return;
        const now = performance.now();
        if (now - st.last > 2500) { // sans souris (mobile, repos) : la lumière dérive seule
          st.tx = .5 + .3 * Math.sin(time * .35); st.ty = .5 + .2 * Math.sin(time * .5 + 1);
        }
        const dx = st.tx - st.mx, dy = st.ty - st.my;
        st.mx += dx * .09; st.my += dy * .09;
        st.s += (Math.min(Math.hypot(dx, dy) * 14, 1) - st.s) * .08;
        const p = clamp(scrollY / Math.max(1, innerHeight), 0, 1);
        gl.draw(time, st.mx, st.my, .3 + st.s, p);
      };
      if (hasLibs) gsap.ticker.add(render);
      else { const loop = (t) => { render(t / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
    }
  }

  /* ---------- Replis : mouvement réduit ou bibliothèques absentes ---------- */
  const pre = $('#pre');
  if (reduce || !hasLibs) {
    if (pre) pre.remove();
    if (!reduce) console.warn('gsap indisponible : site affiché sans animations');
    return;
  }

  /* ---------- Lenis + ScrollTrigger ---------- */
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  html.classList.add('locked');

  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (target === 0) scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- Éléments d'interface globaux ---------- */
  const nav = $('#nav');
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  gsap.to('.nav-lb', { rotation: 720, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => nav.classList.toggle('is-hidden', s.direction === 1 && s.scroll() > 500) });

  const clip = (bg) => {
    const kind = bg.dataset.clip;
    const from = kind === 'dome' ? 'ellipse(38% 14% at 50% 0%)' : 'inset(12% 5% 12% 5% round 56px)';
    const to = kind === 'dome' ? 'ellipse(150% 130% at 50% 0%)' : 'inset(0% 0% 0% 0% round 0px)';
    gsap.fromTo(bg, { clipPath: from }, { clipPath: to, ease: 'none', scrollTrigger: { trigger: bg.parentElement, start: 'top 96%', end: 'top 18%', scrub: true } });
  };
  const reveal = (el) => {
    const ch = split(el);
    gsap.from(ch, { yPercent: 115, rotate: 5, duration: 1.1, stagger: .02, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  };

  /* ===== HERO : titre découpé + parallaxe multi-couches ===== */
  const heroChars = $$('[data-split]', heroEl).flatMap(split);
  const helloChars = split($('#hello'));
  gsap.to('#heroBg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
  $$('[data-p]', heroEl).forEach((el) => gsap.to(el, { yPercent: +el.dataset.p, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } }));
  gsap.to('#heroIn', { yPercent: -22, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: '70% top', scrub: true } });

  /* ===== 01 MANIFESTE : section épinglée, mots qui s'allument ===== */
  const manif = $('.manif');
  const mt = $('#mtext');
  const label = mt.textContent.trim();
  mt.setAttribute('aria-label', label); mt.textContent = '';
  const words = label.split(/\s+/).map((w) => { const s = document.createElement('span'); s.className = 'mw'; s.setAttribute('aria-hidden', 'true'); s.textContent = w; mt.appendChild(s); return s; });
  gsap.fromTo(words, { opacity: .12 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: manif, pin: true, start: 'top top', end: '+=130%', scrub: true } });
  clip($('.bg', manif));

  /* ===== 02 SAVOIR-FAIRE : scroll horizontal épinglé (desktop) ===== */
  const hs = $('.hs');
  const track = $('.hs-track', hs);
  reveal($('[data-reveal]', hs));
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    hs.classList.add('pinned');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: hs, pin: true, scrub: .8, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => gsap.set('.hs-prog i', { scaleX: s.progress }) }
    });
    $$('.panel', hs).forEach((p) => {
      gsap.fromTo($('.panel-art', p), { x: 90 }, { x: -90, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo($('.panel-num', p), { x: 40 }, { x: -40, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => hs.classList.remove('pinned');
  });
  mm.add('(max-width: 860px)', () => {
    $$('.panel', hs).forEach((p) => gsap.from(p, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%', once: true } }));
  });
  clip($('.bg', hs));

  /* ===== 03 LE GESTE : assemblage tenon-mortaise piloté par le scroll ===== */
  const geste = $('.geste');
  reveal($('[data-reveal]', geste));
  const li = $$('#steps li');
  gsap.set(li.slice(1), { opacity: .28 });
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: geste, pin: true, start: 'top top', end: small ? '+=170%' : '+=220%', scrub: .6 } });
  tl.fromTo('#beamA', { x: -300, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
    .fromTo('#beamB', { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
    .to(li[1], { opacity: 1, duration: .3 }, 1.2)
    .fromTo('#peg', { y: -170, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.in' }, 1.6)
    .to(li[2], { opacity: 1, duration: .3 }, 1.7)
    .fromTo('#jline', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6 }, 2.3)
    .to({}, { duration: .5 }, 2.9);
  clip($('.bg', geste));

  /* ===== 04 RÉALISATIONS : parallaxe d'images + distorsion au survol ===== */
  const works = $('.works');
  reveal($('[data-reveal]', works));
  $$('.card', works).forEach((card, i) => {
    const art = $('.card-art', card);
    gsap.fromTo($('.card-img', card), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(card, { y: 90, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } });
    if (!fine) return;
    const disp = $('#d' + i + ' feDisplacementMap');
    const st = { s: 0 };
    const apply = () => disp.setAttribute('scale', st.s.toFixed(1));
    card.addEventListener('pointerenter', () => {
      art.style.filter = 'url(#d' + i + ')';
      gsap.to(st, { s: 46, duration: .7, ease: 'power2.out', onUpdate: apply, overwrite: true });
      gsap.to($('.card-img', card), { scale: 1.06, duration: 1, ease: 'expo.out', overwrite: 'auto' });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(st, { s: 0, duration: .8, ease: 'power3.out', onUpdate: apply, overwrite: true, onComplete: () => { art.style.filter = ''; } });
      gsap.to($('.card-img', card), { scale: 1, duration: 1, ease: 'expo.out', overwrite: 'auto' });
    });
  });
  clip($('.bg', works));

  /* ===== 05 CONTACT : titre, marquee sensible à la vitesse de scroll ===== */
  const contact = $('.contact');
  reveal($('[data-reveal]', contact));
  const mq = gsap.to('#mq', { xPercent: -50, repeat: -1, ease: 'none', duration: 38 });
  let boost = 1;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { boost = 1 + Math.min(Math.abs(s.getVelocity()) / 500, 7); } });
  gsap.ticker.add(() => { boost += (1 - boost) * .06; mq.timeScale(boost); });
  clip($('.bg', contact));

  /* ---------- Curseur et boutons magnétiques (souris uniquement) ---------- */
  if (fine) {
    html.classList.add('has-cursor');
    const dot = $('.cur-dot'), ring = $('.cur-ring'), lab = $('span', ring);
    const dx = gsap.quickTo(dot, 'x', { duration: .1, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: .1, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    const mags = $$('[data-magnetic]').map((el) => ({ el, x: gsap.quickTo(el, 'x', { duration: .7, ease: 'elastic.out(1,.45)' }), y: gsap.quickTo(el, 'y', { duration: .7, ease: 'elastic.out(1,.45)' }), on: false }));
    addEventListener('pointermove', (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      mags.forEach((m) => {
        const r = m.el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const reach = Math.max(r.width, r.height) * .75 + 24;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < reach) { m.x((e.clientX - cx) * .35); m.y((e.clientY - cy) * .35); m.on = true; }
        else if (m.on) { m.x(0); m.y(0); m.on = false; }
      });
    }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      const l = e.target.closest('a, button, [data-magnetic]');
      if (t) lab.textContent = t.dataset.cursor;
      ring.classList.toggle('has-label', !!t && !!t.matches('.card'));
      ring.classList.toggle('is-link', !!l && !(t && t.matches('.card')));
    });
    document.addEventListener('pointerleave', () => gsap.to([dot, ring], { opacity: 0, duration: .2 }));
    document.addEventListener('pointerenter', () => gsap.to([dot, ring], { opacity: 1, duration: .2 }));
  }

  /* ---------- Intro cinématique ---------- */
  const cnt = $('#cnt');
  const counter = { v: 0 };
  const canvasEl = $('#gl');
  const finish = () => {
    if (!pre.isConnected) return;
    pre.remove();
    html.classList.remove('locked');
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
  };
  gsap.set(['.nav', '.hero .tag', '.lede', '.cta .btn', '.scrollhint'], { opacity: 0 });
  const intro = gsap.timeline({ onComplete: finish });
  intro
    .to('.pre-lb path', { strokeDashoffset: 0, duration: 1.5, stagger: .2, ease: 'power2.inOut' }, 0)
    .to(counter, { v: 100, duration: 2.1, ease: 'power1.inOut', onUpdate: () => { cnt.textContent = String(Math.round(counter.v)).padStart(3, '0'); } }, 0)
    .from(helloChars, { yPercent: 115, duration: .9, stagger: .06, ease: 'expo.out' }, .9)
    .to('.pre-in', { opacity: 0, y: -24, duration: .5, ease: 'power2.in' }, 2.35)
    .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'expo.inOut' }, 2.7)
    .from(canvasEl, { scale: 1.35, duration: 2.4, ease: 'expo.out' }, 2.75)
    .from('.ridge, .etxe', { y: 140, duration: 1.8, stagger: .12, ease: 'expo.out' }, 2.9)
    .from(heroChars, { yPercent: 118, rotate: 6, duration: 1.2, stagger: .035, ease: 'expo.out' }, 3.1)
    .to(['.hero .tag', '.lede', '.cta .btn', '.nav', '.scrollhint'], { opacity: 1, duration: .9, stagger: .08, ease: 'power2.out' }, 3.7);
  const skip = () => intro.timeScale(4);
  pre.addEventListener('pointerdown', skip);
  addEventListener('keydown', (e) => { if (pre.isConnected && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) skip(); });
  setTimeout(() => { if (pre.isConnected) { intro.progress(1); } }, 12000); // filet de sécurité
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
