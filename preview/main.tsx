/**
 * Aperçu live — @remotion/player dans une page web.
 * Le bac à sable de révision : on scrube vidéo ou scène, exactement le même code
 * que celui exporté par `npm run render`.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player, type PlayerRef } from '@remotion/player';
import { VIDEOS } from '../src/remotion/Root';
import '../src/styles.css';

type Deck = {
  id: string;
  label: string;
  sub: string;
  Comp: React.FC;
  duration: number;
  group: string;
};

const DECKS: Deck[] = VIDEOS.flatMap((v) => {
  const offsets: number[] = [];
  v.scenes.reduce((acc, s) => {
    offsets.push(acc);
    return acc + s.duration;
  }, 0);
  return [
    {
      id: v.compositionId,
      label: `▶︎  ${v.title}`,
      sub: '60,0 s · 3600 frames · 1080×1920 @60',
      Comp: v.Component as React.FC,
      duration: 3600,
      group: v.title,
    },
    ...v.scenes.map((s, i) => ({
      id: s.id,
      label: `${i + 1}. ${s.label.replace(/^\d+ · /, '')}`,
      sub: `${(s.duration / 60).toFixed(1)} s · début ${(offsets[i] / 60).toFixed(1)} s`,
      Comp: s.Comp as unknown as React.FC,
      duration: s.duration,
      group: v.title,
    })),
  ];
});

const App: React.FC = () => {
  const [activeId, setActiveId] = useState(DECKS[0].id);
  const active = useMemo(() => DECKS.find((d) => d.id === activeId) ?? DECKS[0], [activeId]);
  const player = useRef<PlayerRef>(null);
  const groups = Array.from(new Set(DECKS.map((d) => d.group)));

  // API exposée pour le test de fumée (scripts/smoke.mjs)
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__motion = {
      seekTo: (f: number) => player.current?.seekTo(f),
      player,
      decks: DECKS.map((d) => ({ id: d.id, duration: d.duration })),
    };
  }, []);

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">Motion Design 2026</div>
        <div className="sub">
          {VIDEOS.length} vidéos · {DECKS.length - VIDEOS.length} scènes
          <br />
          Standard : motion-design-2026/
        </div>

        {groups.map((g) => (
          <div className="group" key={g}>
            <div className="group-title">{g}</div>
            {DECKS.filter((d) => d.group === g).map((d) => (
              <button
                key={d.id}
                className={`deck ${active.id === d.id ? 'active' : ''}`}
                onClick={() => setActiveId(d.id)}
              >
                {d.label}
                <small>{d.sub}</small>
              </button>
            ))}
          </div>
        ))}

        <div className="group">
          <div className="group-title">Repères du standard</div>
          <div>
            <span className="pill">cut ≤ 2,5 s</span>
            <span className="pill">zoom 1,12 / 1,28</span>
            <span className="pill">pan ≤ 220 px</span>
            <span className="pill">SFX par action</span>
            <span className="pill">caption y 78 %</span>
            <span className="pill">safe 25–72 %</span>
          </div>
        </div>
      </aside>

      <main className="stage">
        <div className="phone">
          <Player
            key={active.id}
            ref={player}
            component={active.Comp}
            durationInFrames={active.duration}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={60}
            controls
            loop
            showVolumeControls={false}
            numberOfSharedAudioTags={24}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="meta">
          <p>
            Ce lecteur rend <strong>exactement</strong> les mêmes composants que l'export final
            (<code>npm run render</code>) : mêmes tokens, mêmes easings, mêmes SFX.
          </p>
          <p>
            Scène isolée : <code>{active.id}</code> — {active.sub}.
            <br />
            Export d'une scène : <code>npx remotion render src/index.ts {active.id}</code>
          </p>
          <p>Audio : clique sur ▶︎ pour autoriser les SFX (nappe, pop, whoosh, clacks).</p>
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
