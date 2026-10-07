import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { ScanStream } from '../../components/ScanStream';
import { Cursor } from '../../components/Cursor';
import { Arrow, Circle } from '../../components/Annotation';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';

/**
 * VUE 1/4 — LE SCAN COMPLET · 9 s (540 frames)
 * Beats : 0–120 (la table) · 120–240 (la tête de lecture) · 240–360 (compteur qui file)
 *         360–540 (trouvé : 1 000 000 lues pour 1 résultat)
 */
export const IndexVue1Scan: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 236, scale: 1.12, origin: '50% 56%' },
          { at: 300, scale: 1.12, origin: '50% 56%' },
          { at: 356, scale: 1.0, origin: '50% 50%' },
        ]}
      >
        <SceneHeader
          kicker="Sous le capot — sans index"
          at={4}
          accent={C.rose400}
          right={<StatusCodeBadge at={12} variant="error" label="1 048 576 LIGNES" size={26} />}
        />

        <div style={{ position: 'absolute', left: 120, top: 620, width: 840 }}>
          <ScanStream
            at={0}
            width={840}
            height={520}
            scanFrom={130}
            stopAt={372}
            match="a.dupont@mail.fr"
            accent={C.cyan400}
            seconds={4.21}
            total={1048576}
          />
        </div>

        {/* étiquette du flux */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 1260,
            fontFamily: FONT.mono,
            fontSize: 24,
            letterSpacing: '0.1em',
            color: C.textMuted,
            opacity: ip(frame, [16, 40], [0, 1]),
          }}
        >
          LECTURE SÉQUENTIELLE — LA BASE LIT CHAQUE LIGNE, UNE PAR UNE
        </div>

        <Circle cx={540} cy={900} rx={300} ry={70} at={392} color={C.rose400} rotate={-2} />
        <Arrow from={[300, 1230]} to={[470, 1080]} at={412} color={C.rose400} />

        <Cursor
          keys={[
            { at: 20, x: 880, y: 1250 },
            { at: 120, x: 700, y: 940 },
            { at: 210, x: 620, y: 1080 },
            { at: 330, x: 760, y: 880 },
          ]}
          enterAt={18}
          hideAt={400}
          size={34}
        />
      </Camera>

      <Caption text="La base lit chaque ligne. Une par une." at={40} until={232} size={64} style={{ top: 1490 }} />
      <Caption
        text="Un million de comparaisons, pour un seul résultat."
        at={244}
        until={368}
        size={60}
        emphasize={[1, 2]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Quatre secondes. À chaque requête."
        at={380}
        size={68}
        emphasize={[0, 1]}
        style={{ top: 1490 }}
      />

      {frame >= 380 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(60% 40% at 50% 62%, ${hexA(C.rose500, 0.14)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <SceneVo clip="index-vue1" />
      <SceneSfx scene="idx-vue1" />
    </Stage>
  );
};
