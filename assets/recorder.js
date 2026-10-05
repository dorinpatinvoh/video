/* ============================================================
   recorder.js — bouton « Télécharger la vidéo » (export MP4/WebM)
   ------------------------------------------------------------
   Capture l'onglet courant (image + son de l'onglet : voix off,
   bruitages, musique) pendant une lecture complète, puis propose
   le téléchargement du fichier.

   - Si le navigateur sait faire du MP4 (Chrome récent / Safari),
     le fichier sort en .mp4, sinon en .webm (accepté par YouTube).
   - La page doit être ouverte via http://localhost (serveur local)
     ou https — pas en double-clic file:// sur certains navigateurs.
   ============================================================ */
(() => {
  'use strict';
  const P = window.VPlayer;
  if (!P) return;

  const controls = document.querySelector('.controls');
  const btnFull = document.querySelector('#btn-full');
  if (!controls || !btnFull) return;

  const btn = document.createElement('button');
  btn.className = 'ctl';
  btn.id = 'btn-rec';
  btn.title = 'Télécharger la vidéo (MP4 / WebM)';
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3a1 1 0 0 1 1 1v9.6l3.3-3.3 1.4 1.4L12 17.4 6.3 11.7l1.4-1.4L11 13.6V4a1 1 0 0 1 1-1zM5 19h14v2H5z"/></svg>';
  controls.insertBefore(btn, btnFull);

  const badge = document.createElement('div');
  badge.className = 'rec-badge';
  badge.hidden = true;
  badge.textContent = '● REC';
  document.querySelector('.stage').appendChild(badge);

  const MIMES = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const pick = (window.MediaRecorder && MIMES.find(m => MediaRecorder.isTypeSupported(m))) || '';

  let rec = null, stream = null, chunks = [];

  btn.addEventListener('click', async () => {
    if (rec) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert(
        'Export vidéo indisponible dans ce contexte.\n\n' +
        'Ouvre la page via un serveur local, par exemple :\n' +
        '  python -m http.server 8000\n' +
        'puis va sur http://localhost:8000 et réessaie.'
      );
      return;
    }
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        systemAudio: 'include',
      });
    } catch (e) {
      return; // l'utilisateur a annulé le partage
    }

    rec = new MediaRecorder(
      stream,
      pick ? { mimeType: pick, videoBitsPerSecond: 8000000 } : undefined
    );
    chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = finish;

    // si l'utilisateur clique « Arrêter le partage » avant la fin
    stream.getVideoTracks()[0].addEventListener('ended', stopAll);

    badge.hidden = false;
    btn.classList.add('rec');
    P.seek(0);
    rec.start(300);
    setTimeout(() => P.play(), 700);
    P.onEnded(() => setTimeout(stopAll, 700));
  });

  function stopAll() {
    if (rec && rec.state !== 'inactive') rec.stop();
    if (stream) stream.getTracks().forEach(t => t.stop());
  }

  function finish() {
    badge.hidden = true;
    btn.classList.remove('rec');
    const type = (rec && rec.mimeType) || 'video/webm';
    const ext = type.includes('mp4') ? 'mp4' : 'webm';
    const blob = new Blob(chunks, { type });
    const slug = (P.title || 'video')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = slug + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    rec = null;
    stream = null;
    chunks = [];
  }
})();
