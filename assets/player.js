/* ============================================================
   player.js — moteur des "vidéos web animées"
   ------------------------------------------------------------
   - Aucune dépendance, aucun build : HTML + CSS + ce fichier.
   - Chaque vidéo est décrite par un bloc JSON dans sa page :
       <script type="application/json" id="video-data">…</script>
   - Le moteur :
       * calcule la timeline à partir des scènes (durée "dur")
       * génère le HTML des scènes (terminal, code, titre, grille…)
       * anime la frappe au clavier, synchronisée sur la timeline
       * affiche les sous-titres ([début, durée, texte] relatifs à la scène)
       * joue la voix off (champ "audio" d'une scène) + effets sonores
         (clavier, transitions) générés en direct via WebAudio
   ============================================================ */
(() => {
  'use strict';

  /* ---------- petits utilitaires ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
  const fmt = t => {
    t = Math.max(0, Math.floor(t));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  };

  const TERM_CPS = 13;   // vitesse de frappe dans le terminal (caractères/s)
  const CODE_CPS = 26;   // vitesse de frappe dans l'éditeur de code

  /* ---------- état global ---------- */
  const S = {
    data: null,        // données de la vidéo (JSON)
    sceneEls: [],      // éléments DOM des scènes
    time: 0,           // temps courant (s)
    playing: false,
    speed: 1,
    cc: true,          // sous-titres activés
    soundOn: true,     // voix off + effets sonores
    vol: 0.9,          // volume général
    audioCache: new Map(),
    currentAudio: null,
    active: -1,        // index de la scène active
    started: false,    // la lecture a-t-elle commencé ?
    ended: false,
    dragging: false,
    lastTs: 0,
  };
  const els = {};      // références DOM des contrôles

  /* ============================================================
     EFFETS SONORES (synthétisés en WebAudio, aucun fichier)
     ============================================================ */
  const FX = {
    ctx: null, master: null, noiseBuf: null, lastClick: 0,

    ensure() {
      if (typeof window === 'undefined') return false;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = S.vol;
        this.master.connect(this.ctx.destination);
        const len = Math.floor(this.ctx.sampleRate * 0.5);
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    },

    setVol(v) { if (this.master) this.master.gain.value = v; },
    ok() { return S.soundOn && this.ensure(); },

    /* clic de touche mécanique */
    click() {
      if (!this.ok()) return;
      const now = performance.now();
      if (now - this.lastClick < 28) return;   // limite le débit
      this.lastClick = now;
      const t = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      src.playbackRate.value = 0.9 + Math.random() * 0.5;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1700 + Math.random() * 1700;
      bp.Q.value = 1.2;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      src.connect(bp); bp.connect(g); g.connect(this.master);
      src.start(t, Math.random() * 0.3, 0.08);
    },

    /* "whoosh" de transition entre scènes */
    whoosh() {
      if (!this.ok()) return;
      const t = this.ctx.currentTime, dur = 0.42;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf; src.loop = true;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(240, t);
      bp.frequency.exponentialRampToValueAtTime(1700, t + dur * 0.65);
      bp.frequency.exponentialRampToValueAtTime(850, t + dur);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.26, t + 0.09);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(this.master);
      src.start(t); src.stop(t + dur + 0.05);
    },

    /* petit "pop" quand un résultat apparaît */
    pop() {
      if (!this.ok()) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(520 + Math.random() * 90, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.07);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + 0.14);
    },

    /* petit jingle au lancement */
    jingle() {
      if (!this.ok()) return;
      const t = this.ctx.currentTime;
      [[440, 0], [660, 0.11]].forEach(([f, dt]) => {
        const o = this.ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.0001, t + dt);
        g.gain.exponentialRampToValueAtTime(0.14, t + dt + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.22);
        o.connect(g); g.connect(this.master);
        o.start(t + dt); o.stop(t + dt + 0.25);
      });
    },
  };

  /* ============================================================
     VOIX OFF (un fichier audio par scène, champ "audio" du JSON)
     ============================================================ */
  function playNarration(sc) {
    stopNarration();
    if (!sc || !sc.audio || !S.soundOn || !S.started) return;
    let a = S.audioCache.get(sc);
    if (!a) {
      a = new Audio(sc.audio);
      a.preload = 'auto';
      S.audioCache.set(sc, a);
    }
    a.volume = S.vol;
    a.currentTime = 0;
    S.currentAudio = a;
    try { a.play().catch(() => {}); } catch (e) { /* environnement sans audio */ }
  }
  function pauseNarration() {
    if (S.currentAudio && !S.currentAudio.paused) {
      try { S.currentAudio.pause(); } catch (e) {}
    }
  }
  function resumeNarration() {
    if (S.soundOn && S.currentAudio && S.currentAudio.paused && S.currentAudio.currentTime > 0) {
      try { S.currentAudio.play().catch(() => {}); } catch (e) {}
    }
  }
  function stopNarration() {
    pauseNarration();
    S.currentAudio = null;
  }

  /* ============================================================
     1. CHARGEMENT DES DONNÉES
     ============================================================ */
  function loadData() {
    const raw = $('#video-data');
    if (!raw) throw new Error('Bloc #video-data introuvable dans la page.');
    const data = JSON.parse(raw.textContent);

    // starts/ends cumulatifs + sous-titres aplatis en temps absolu
    let t = 0;
    data.scenes.forEach(sc => { sc.start = t; t += sc.dur; sc.end = t; });
    data.duration = t;
    data.subs = [];
    data.scenes.forEach(sc => (sc.subs || []).forEach(([o, d, txt]) =>
      data.subs.push({ start: sc.start + o, end: sc.start + o + d, text: txt })));
    data.subs.sort((a, b) => a.start - b.start);
    return data;
  }

  /* ============================================================
     2. CONSTRUCTION DES SCÈNES
     ============================================================ */

  // lignes de sortie du terminal (délais calculés après la frappe)
  function termOutputs(sc) {
    const typedEnd = 1.0 + (sc.cmd || '').length / TERM_CPS;
    const t0 = sc.outAt != null ? sc.outAt : +(typedEnd + 0.55).toFixed(2);
    return (sc.out || []).map((o, i) => {
      const at = +(t0 + i * 0.5).toFixed(2);
      const txt = typeof o === 'object' ? o.t : o;
      const cls = (typeof o === 'object' && o.c) ? ' ' + o.c : '';
      return `<div class="tl out${cls}" data-show="${at}">${esc(txt)}</div>`;
    }).join('');
  }

  function buildScene(sc) {
    const el = document.createElement('section');
    el.className = 'scene sc-' + sc.type;
    let h = '';

    switch (sc.type) {

      /* --- écran-titre (intro / outro) --- */
      case 'title':
        h = `${sc.kicker ? `<div class="t-kicker" data-show="0.1">${esc(sc.kicker)}</div>` : ''}
             <h1 class="t-main" data-show="0.45">${esc(sc.title || '')}</h1>
             ${sc.sub ? `<p class="t-sub" data-show="1.05">${esc(sc.sub)}</p>` : ''}
             ${sc.badge ? `<div class="t-badge" data-show="1.6">${sc.badge}</div>` : ''}`;
        break;

      /* --- fenêtre de terminal avec commande tapée --- */
      case 'terminal': {
        h = `<div class="head">
               <div class="chip" data-show="0.1">
                 <span class="chip-num">${esc(sc.num || '')}</span>
                 <span class="chip-name">${esc(sc.name || '')}</span>
               </div>
               ${sc.hint ? `<div class="hint" data-show="0.5">${esc(sc.hint)}</div>` : ''}
             </div>
             <div class="term">
               <div class="term-bar">
                 <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
                 <span class="term-title">${esc(sc.host || 'dorin@linux: ~')}</span>
               </div>
               <div class="term-body">
                 <div class="tl">
                   <span class="ps1">➜</span><span class="ps1-path">&nbsp;~</span><span
                     class="cmd" data-type="${esc(sc.cmd || '')}" data-type-delay="1.0"></span>
                 </div>
                 ${termOutputs(sc)}
               </div>
             </div>
             ${sc.warn ? `<div class="warn" data-show="${sc.warnAt != null ? sc.warnAt : 4.8}">⚠️ ${esc(sc.warn)}</div>` : ''}`;
        break;
      }

      /* --- éditeur de code avec frappe ligne par ligne --- */
      case 'code': {
        let at = sc.startAt != null ? sc.startAt : 0.8;
        let lines = '';
        (sc.lines || []).forEach((ln, i) => {
          const parts = ln.parts || [];
          const total = parts.reduce((n, p) => n + p[0].length, 0);
          lines += `<div class="cl-line" data-at="${at.toFixed(2)}">
                      <span class="cl-num">${i + 1}</span><span class="cl-code"></span>
                    </div>`;
          at = at + total / CODE_CPS + 0.22;
        });
        h = `<div class="editor">
               <div class="editor-bar">
                 <span class="filetab">${esc(sc.file || 'fichier')}</span>
                 <span class="ed-dots"><i></i><i></i><i></i></span>
               </div>
               <div class="editor-body">${lines}</div>
             </div>
             ${sc.note ? `<div class="hint codenote" data-show="${(at + 0.3).toFixed(2)}">${esc(sc.note)}</div>` : ''}`;
        break;
      }

      /* --- anatomie d'une règle CSS --- */
      case 'rule':
        h = `<div class="rule-card">
               <div class="rc-l1"><span class="rc-sel">${esc(sc.sel)}</span><span class="tk-pun">&nbsp;{</span></div>
               <div class="rc-l2">&nbsp;&nbsp;<span class="rc-prop">${esc(sc.prop)}</span><span class="tk-pun">:&nbsp;</span><span class="rc-val">${esc(sc.val)}</span><span class="tk-pun">;</span></div>
               <div class="rc-l3"><span class="tk-pun">}</span></div>
             </div>
             <div class="rule-legend">
               <div class="lg" data-show="2.4"><i class="sw sw-sel"></i><b>le sélecteur</b>&nbsp;— qui cibler</div>
               <div class="lg" data-show="3.6"><i class="sw sw-prop"></i><b>la propriété</b>&nbsp;— quoi changer</div>
               <div class="lg" data-show="4.8"><i class="sw sw-val"></i><b>la valeur</b>&nbsp;— comment le changer</div>
             </div>`;
        break;

      /* --- deux panneaux côte à côte --- */
      case 'split': {
        const card = (c, extra, at) => `
          <div class="s-card ${extra}" data-show="${at}">
            <div class="s-emoji">${c.emoji || ''}</div>
            <h3>${esc(c.title || '')}</h3>
            <ul>${(c.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>`;
        h = `<h2 class="g-title" data-show="0.15">${esc(sc.title || '')}</h2>
             <div class="s-cols">${card(sc.left, '', 0.55)}${card(sc.right, 'alt', 1.15)}</div>`;
        break;
      }

      /* --- grille de récap --- */
      case 'grid':
        h = `<h2 class="g-title" data-show="0.15">${esc(sc.title || '')}</h2>
             <div class="g-grid">${(sc.items || []).map((it, i) => `
               <div class="g-item" data-show="${(0.45 + i * 0.14).toFixed(2)}">
                 <b>${esc(it[0])}</b>${it[1] ? `<span>${esc(it[1])}</span>` : ''}
               </div>`).join('')}
             </div>`;
        break;

      /* --- box model CSS (boîtes imbriquées) --- */
      case 'boxmodel':
        h = `<h2 class="g-title" data-show="0.15">${esc(sc.title || 'Le modèle de boîte')}</h2>
             <div class="bm-wrap">
               <div class="bm bm-margin" data-show="3.6"><span class="bm-lb">margin</span>
                 <div class="bm bm-border" data-show="2.6"><span class="bm-lb">border</span>
                   <div class="bm bm-padding" data-show="1.6"><span class="bm-lb">padding</span>
                     <div class="bm bm-content" data-show="0.7">contenu</div>
                   </div>
                 </div>
               </div>
             </div>
             <p class="bm-hint" data-show="4.8">${esc(sc.hint || 'Chaque élément HTML est une boîte : contenu → padding → bordure → marge.')}</p>`;
        break;

      default:
        h = `<p class="t-sub">Type de scène inconnu : ${esc(sc.type)}</p>`;
    }

    el.innerHTML = h;

    // mémorise les tokens des lignes de code pour la frappe animée
    if (sc.type === 'code') {
      let i = 0;
      el.querySelectorAll('.cl-line').forEach(n => {
        const ln = (sc.lines || [])[i++] || { parts: [] };
        n.__parts = ln.parts || [];
        n.__total = n.__parts.reduce((x, p) => x + p[0].length, 0);
        n.__n = -1;
      });
    }
    return el;
  }

  /* ============================================================
     3. ANIMATION (appelée à chaque frame pour la scène active)
     ============================================================ */
  function paintTokens(codeEl, parts, n) {
    let html = '', left = n;
    for (const [txt, cls] of parts) {
      if (left <= 0) break;
      const take = left >= txt.length ? txt : txt.slice(0, left);
      html += cls ? `<span class="tk-${cls}">${esc(take)}</span>` : esc(take);
      left -= take.length;
    }
    codeEl.innerHTML = html;
  }

  function dynamics(el, sc) {
    const local = S.time - sc.start;

    // apparitions programmées (+ "pop" sonore sur les sorties terminal)
    el.querySelectorAll('[data-show]').forEach(n => {
      const on = local >= parseFloat(n.dataset.show);
      if (on && !n.__on && S.started && S.playing && n.classList.contains('tl')) FX.pop();
      n.__on = on;
      n.classList.toggle('show', on);
    });

    // frappe "terminal" (+ clics de clavier)
    el.querySelectorAll('[data-type]').forEach(n => {
      const full = n.dataset.type;
      const delay = parseFloat(n.dataset.typeDelay || '0.6');
      const nch = clamp(Math.floor((local - delay) * TERM_CPS), 0, full.length);
      const prev = n.__n == null ? 0 : n.__n;
      if (n.__n !== nch) { n.textContent = full.slice(0, nch); n.__n = nch; }
      if (nch > prev && S.started && S.playing) FX.click();
      n.classList.toggle('typing', nch > 0 && nch < full.length);
      n.classList.toggle('done', nch >= full.length && full.length > 0);
    });

    // frappe "éditeur de code" (+ clics de clavier)
    el.querySelectorAll('.cl-line').forEach(n => {
      if (!n.__parts) return;
      const at = parseFloat(n.dataset.at || '0');
      const nch = clamp(Math.floor((local - at) * CODE_CPS), 0, n.__total);
      const prev = n.__n;
      if (n.__n !== nch) {
        paintTokens(n.querySelector('.cl-code'), n.__parts, nch);
        n.__n = nch;
      }
      if (nch > prev && S.started && S.playing) FX.click();
      n.classList.toggle('typing', nch > 0 && nch < n.__total);
      n.classList.toggle('done', nch >= n.__total && n.__total > 0);
    });
  }

  /* ============================================================
     4. LECTURE / TIMELINE
     ============================================================ */
  function sceneAt(t) {
    const scs = S.data.scenes;
    for (let i = 0; i < scs.length; i++) if (t < scs[i].end) return i;
    return scs.length - 1;
  }

  function update() {
    const d = S.data;
    const pct = d.duration ? (S.time / d.duration) * 100 : 0;
    els.fill.style.width = pct + '%';
    els.handle.style.left = pct + '%';
    els.tNow.textContent = fmt(S.time);

    // scène active
    const idx = sceneAt(S.time);
    if (idx !== S.active) {
      if (S.active >= 0 && S.started) {
        FX.whoosh();
        els.stage.classList.remove('flash');
        void els.stage.offsetWidth;      // relance l'animation CSS
        els.stage.classList.add('flash');
      }
      S.sceneEls.forEach((el, i) => el.classList.toggle('active', i === idx));
      S.active = idx;
      playNarration(d.scenes[idx]);
    }
    if (idx >= 0) dynamics(S.sceneEls[idx], d.scenes[idx]);

    // sous-titres
    const sub = S.cc ? d.subs.find(s => S.time >= s.start && S.time < s.end) : null;
    const html = sub ? esc(sub.text).replace(/\n/g, '<br>') : '';
    if (els.subs.__t !== html) {
      els.subs.innerHTML = html;
      els.subs.__t = html;
      els.subs.toggleAttribute('hidden', !html);
    }
  }

  function syncPlayBtn() {
    els.btnPlay.innerHTML = S.playing ? ICON_PAUSE : ICON_PLAY;
    els.btnPlay.setAttribute('aria-label', S.playing ? 'Pause' : 'Lecture');
    els.bigplay.classList.toggle('gone', S.started);
  }

  function play() {
    if (S.ended) { S.time = 0; S.ended = false; els.endcard.hidden = true; }
    if (!S.started) { S.started = true; FX.ensure(); FX.jingle(); }
    S.playing = true;
    els.player.classList.add('playing');
    resumeNarration();
    syncPlayBtn();
  }
  function pause() {
    S.playing = false;
    els.player.classList.remove('playing');
    pauseNarration();
    syncPlayBtn();
  }
  const togglePlay = () => (S.playing ? pause() : play());

  function seek(t) {
    S.time = clamp(t, 0, S.data.duration);
    if (S.ended && S.time < S.data.duration) { S.ended = false; els.endcard.hidden = true; }
    update();
  }

  function showEnd() {
    S.ended = true;
    stopNarration();
    els.endcard.hidden = false;
  }

  function loop(ts) {
    const dt = Math.min(0.25, S.lastTs ? (ts - S.lastTs) / 1000 : 0);
    S.lastTs = ts;
    if (S.playing) {
      S.time += dt * S.speed;
      if (S.time >= S.data.duration) {
        S.time = S.data.duration;
        pause();
        showEnd();
      }
    }
    update();
    requestAnimationFrame(loop);
  }

  /* ============================================================
     5. INTERFACE (contrôles, chapitres, clavier…)
     ============================================================ */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const ICON_SND_ON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>';
  const ICON_SND_OFF = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm18.6 3 2.1-2.1-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4-2.1-2.1z"/></svg>';

  function syncSoundBtn() {
    els.btnSnd.innerHTML = S.soundOn ? ICON_SND_ON : ICON_SND_OFF;
    els.btnSnd.classList.toggle('on', S.soundOn);
    els.btnSnd.setAttribute('aria-label', S.soundOn ? 'Couper le son' : 'Activer le son');
  }

  function seekFromPointer(e) {
    const r = els.progress.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * S.data.duration);
  }

  function toggleChapters(force) {
    const open = force != null ? force : els.chapters.hidden;
    els.chapters.hidden = !open;
    els.btnChap.classList.toggle('on', open);
  }

  function wire() {
    // gros bouton play
    $('#bp-btn').addEventListener('click', play);

    // clic sur la scène = lecture/pause (hors overlays)
    els.stage.addEventListener('click', e => {
      if (e.target.closest('.overlay, .chapters')) return;
      if (!S.started) play(); else togglePlay();
    });

    els.btnPlay.addEventListener('click', togglePlay);

    // barre de progression
    els.progress.addEventListener('pointerdown', e => {
      S.dragging = true;
      els.progress.setPointerCapture(e.pointerId);
      seekFromPointer(e);
    });
    els.progress.addEventListener('pointermove', e => S.dragging && seekFromPointer(e));
    addEventListener('pointerup', () => S.dragging = false);

    // son (voix off + effets)
    els.btnSnd.addEventListener('click', () => {
      S.soundOn = !S.soundOn;
      if (S.soundOn) { FX.ensure(); if (S.playing) resumeNarration(); }
      else pauseNarration();
      syncSoundBtn();
    });
    els.vol.addEventListener('input', () => {
      S.vol = parseFloat(els.vol.value);
      FX.setVol(S.vol);
      if (S.currentAudio) S.currentAudio.volume = S.vol;
    });

    // sous-titres
    els.btnCc.addEventListener('click', () => {
      S.cc = !S.cc;
      els.btnCc.classList.toggle('on', S.cc);
      update();
    });

    // vitesse
    els.speed.addEventListener('change', () => { S.speed = parseFloat(els.speed.value); });

    // chapitres
    els.btnChap.addEventListener('click', () => toggleChapters());
    document.addEventListener('click', e => {
      if (!els.chapters.hidden && !e.target.closest('.chapters') && e.target.closest('#btn-chap') === null) {
        toggleChapters(false);
      }
    });

    // fin de vidéo
    $('#btn-replay').addEventListener('click', e => { e.preventDefault(); seek(0); play(); });

    // plein écran
    els.btnFull.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else els.player.requestFullscreen();
    });

    // clavier
    addEventListener('keydown', e => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'k') { e.preventDefault(); togglePlay(); }
      else if (k === 'arrowright') seek(S.time + 5);
      else if (k === 'arrowleft') seek(S.time - 5);
      else if (k === 'l') seek(S.time + 10);
      else if (k === 'j') seek(S.time - 10);
      else if (k === 'c') els.btnCc.click();
      else if (k === 's') els.btnSnd.click();
      else if (k === 'f') els.btnFull.click();
    });

    // pause quand on quitte l'onglet
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && S.playing) pause();
    });
  }

  /* ============================================================
     6. INITIALISATION
     ============================================================ */
  function build() {
    els.player = $('#player');
    els.stage = $('#stage');
    els.subs = $('#subs');
    els.bigplay = $('#bigplay');
    els.endcard = $('#endcard');
    els.btnPlay = $('#btn-play');
    els.btnChap = $('#btn-chap');
    els.btnCc = $('#btn-cc');
    els.btnSnd = $('#btn-snd');
    els.vol = $('#vol');
    els.btnFull = $('#btn-full');
    els.progress = $('#progress');
    els.fill = $('#fill');
    els.handle = $('#handle');
    els.tNow = $('#t-now');
    els.tDur = $('#t-dur');
    els.speed = $('#speed');
    els.chapters = $('#chapters');

    S.data = loadData();
    document.title = S.data.title + ' — vidéo animée';

    // écran de démarrage
    $('#bp-title').textContent = S.data.title;
    $('#bp-meta').textContent =
      fmt(S.data.duration) + ' · ' + S.data.scenes.length + ' scènes' +
      (S.data.tagline ? ' · ' + S.data.tagline : '');
    if (S.data.kicker) $('#bp-kicker').textContent = S.data.kicker;

    // description sous le lecteur
    const dt = $('#desc-title'), dx = $('#desc-text');
    if (dt) dt.textContent = S.data.title;
    if (dx) dx.textContent = S.data.description || '';

    // vidéo suivante ?
    if (S.data.next) {
      const btn = $('#btn-next');
      btn.hidden = false;
      btn.href = S.data.next.href;
      btn.querySelector('span').textContent = S.data.next.label || 'Vidéo suivante';
    }

    // scènes
    const wrap = $('#scenes');
    S.data.scenes.forEach(sc => {
      const el = buildScene(sc);
      S.sceneEls.push(el);
      wrap.appendChild(el);
    });

    // chapitres + repères sur la barre
    const marks = $('#marks'), chapList = $('#chap-list');
    S.data.scenes.forEach(sc => {
      const label = sc.chapter || sc.title || (sc.num ? sc.num + ' · ' + sc.name : null);
      const m = document.createElement('i');
      m.className = 'mark';
      m.style.left = (sc.start / S.data.duration * 100) + '%';
      marks.appendChild(m);
      if (!label) return;
      const b = document.createElement('button');
      b.className = 'chap-item';
      b.innerHTML = `<span class="chap-t">${fmt(sc.start)}</span><span>${esc(label)}</span>`;
      b.addEventListener('click', () => { seek(sc.start + 0.01); toggleChapters(false); play(); });
      chapList.appendChild(b);
    });

    els.tDur.textContent = fmt(S.data.duration);
    wire();
    syncPlayBtn();
    syncSoundBtn();
    update();                       // première image (poster)
    requestAnimationFrame(loop);    // boucle de lecture
  }

  try {
    build();
  } catch (err) {
    console.error('[player]', err);
    const st = $('#stage');
    if (st) st.innerHTML =
      '<div class="overlay bigplay"><h1 class="bp-title">Oups…</h1>' +
      '<p class="bp-meta">Impossible de charger la vidéo : ' + esc(err.message) + '</p></div>';
  }
})();
