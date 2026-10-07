/**
 * Aperçu live — @remotion/player dans une page web.
 * C'est le « bac à sable » de révision : on scrube scène par scène, exactement
 * le même code que celui exporté par `npm run render`.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player, type PlayerRef } from '@remotion/player';
import { SCENES } from '../src/remotion/Root';
import { AcidTransactions } from '../src/remotion/Root';
import '../src/styles.css';

const OFFSETS: number[] = [];
SCENES.reduce((acc, s) => {
  OFFSETS.push(acc);
  return acc + s.duration;
}, 0);

type Deck = {
  id: string;
  label: string;
  sub: string;
  Comp: React.FC;
  duration: number;
  offset: number;
};

const DECKS: Deck[] = [
  {
    id: 'full',
    label: '▶︎  Vidéo complète',
    sub: '60,0 s · 3600 frames · 1080×1920 @60',
    Comp: AcidTransactions,
    duration: 3600,
    offset: 0,
  },
  ...SCENES.map((s, i) => ({
    id: s.id,
    label: s.label,
    sub: `${(s.duration / 60).toFixed(1)} s · ${s.duration} f · début ${(OFFSETS[i] / 60).toFixed(1)} s`,
    Comp: s.Comp as unknown as React.FC,
    duration: s.duration,
    offset: OFFSETS[i],
  })),
];

const App: React.FC = () => {
  const [active, setActive] = useState<Deck>(DECKS[0]);
  const player = useRef<PlayerRef>(null);

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
          ACID / transactions bancaires
          <br />
          Standard &amp; storyboard : motion-design-2026/
        </div>

        <div className="group">
          <div className="group-title">Pistes</div>
          {DECKS.map((d) => (
            <button
              key={d.id}
              className={`deck ${active.id === d.id ? 'active' : ''}`}
              onClick={() => setActive(d)}
            >
              {d.label}
              <small>{d.sub}</small>
            </button>
          ))}
        </div>

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
            Scène isolée : <code>{active.id}</code> — {active.sub}. Pour l'export d'une seule scène :
            <br />
            <code>npx remotion render src/index.ts {active.id}</code>
          </p>
          <p>
            Audio : clique sur ▶︎ pour autoriser la lecture des SFX (nappe, pop, whoosh, clacks).
          </p>
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
