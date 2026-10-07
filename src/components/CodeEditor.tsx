import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EASE, FONT } from '../tokens';

/* --------------------------------------------------------- tokenisation néon */
const KEYWORDS = [
  'await', 'async', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'new', 'try', 'catch', 'throw', 'export', 'import', 'from', 'class', 'extends',
  'UPDATE', 'SET', 'WHERE', 'SELECT', 'FROM', 'INSERT', 'INTO', 'VALUES', 'BEGIN', 'COMMIT',
  'ROLLBACK', 'TRANSACTION', 'TABLE', 'PRIMARY', 'KEY', 'NOT', 'NULL', 'CHECK', 'AND', 'OR',
  'SUM', 'INT', 'TEXT', 'DECIMAL',
];

type Tok = { t: string; c: string };

const tokenize = (line: string): Tok[] => {
  const out: Tok[] = [];
  const re =
    /(\/\/[^\n]*|--[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([(){}\[\];,.:=+\-*/<>!?&|]+)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [raw, comment, str, num, ident, punc] = m;
    if (comment) out.push({ t: raw, c: C.com });
    else if (str) out.push({ t: raw, c: C.str });
    else if (num) out.push({ t: raw, c: C.num });
    else if (ident) {
      if (KEYWORDS.includes(ident)) out.push({ t: raw, c: C.kw });
      else if (/^[A-Z]/.test(ident)) out.push({ t: raw, c: C.type });
      else {
        // identifiant suivi de « ( » → fonction
        const rest = line.slice(re.lastIndex);
        out.push({ t: raw, c: /^\s*\(/.test(rest) ? C.fn : C.textCode });
      }
    } else if (punc) out.push({ t: raw, c: C.punc });
    else out.push({ t: raw, c: C.textCode });
  }
  return out;
};

/**
 * CodeEditor — mock VS Code / Cursor.
 * • machine à écrire déterministe (cps configurable)
 * • focus sur la ligne clé : les autres lignes passent en opacité .35 + flou .5px (240 ms)
 * • caret qui clignote (step-end), numéros de ligne, minimap floutée, ligne active surlignée
 */
export const CodeEditor: React.FC<{
  code: string;
  at?: number;
  cps?: number;
  /** index (0-based) de la ligne clé */
  focusLine?: number;
  /** frame où le focus apparaît */
  focusAt?: number;
  accent?: string;
  fontSize?: number;
  showLineNumbers?: boolean;
  minimap?: boolean;
  width?: number;
  style?: React.CSSProperties;
  /** lignes annotées (pastille + texte) */
  notes?: { line: number; text: string; tone?: string }[];
}> = ({
  code,
  at = 0,
  cps = 24,
  focusLine,
  focusAt,
  accent = C.indigo500,
  fontSize = 32,
  showLineNumbers = true,
  minimap = true,
  width,
  style,
  notes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = code.split('\n');
  const framesPerChar = fps / cps;

  // caractères visibles depuis `at`
  const elapsed = Math.max(0, frame - at);
  let budget = elapsed <= 0 ? 0 : Math.floor(elapsed / framesPerChar);

  const focusProgress = interpolate(frame, [focusAt ?? 1e9, (focusAt ?? 1e9) + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  const focused = focusLine !== undefined && focusProgress > 0;

  return (
    <div
      className="mono"
      style={{
        position: 'relative',
        width,
        background: C.bgAlt,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 0,
        padding: '26px 0 30px',
        fontFamily: FONT.mono,
        fontSize,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const visibleChars = Math.max(0, Math.min(line.length, budget));
        budget -= line.length + 1; // + saut de ligne
        const typed = line.slice(0, visibleChars);
        const isFocus = focusLine === i;
        const dim = focused && !isFocus;
        const note = notes.find((n) => n.line === i);
        const caretHere = visibleChars > 0 && visibleChars < line.length && typed.length > 0;

        return (
          <div
            key={i}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 18,
              padding: '0 26px',
              opacity: dim ? 0.35 : 1,
              filter: dim ? 'blur(0.5px)' : 'none',
              background: isFocus
                ? `rgba(99,102,241,${0.10 * focusProgress})`
                : 'transparent',
              boxShadow: isFocus
                ? `inset 3px 0 0 0 rgba(99,102,241,${focusProgress}), inset 0 0 60px rgba(99,102,241,${0.10 * focusProgress})`
                : 'none',
              transition: 'none',
            }}
          >
            {showLineNumbers && (
              <span
                style={{
                  width: 42,
                  textAlign: 'right',
                  color: isFocus ? C.indigo400 : 'rgba(255,255,255,0.22)',
                  fontSize: fontSize * 0.82,
                  userSelect: 'none',
                }}
              >
                {i + 1}
              </span>
            )}
            <span style={{ whiteSpace: 'pre' }}>
              {tokenize(typed).map((tok, k) => (
                <span key={k} style={{ color: tok.c }}>
                  {tok.t}
                </span>
              ))}
              {caretHere && (
                <span
                  style={{
                    display: 'inline-block',
                    width: fontSize * 0.55,
                    height: fontSize * 1.12,
                    verticalAlign: '-0.2em',
                    background: accent,
                    boxShadow: `0 0 14px ${accent}`,
                    opacity: Math.floor(frame / 30) % 2 === 0 ? 1 : 0,
                  }}
                />
              )}
              {visibleChars === 0 && i === 0 && (
                <span
                  style={{
                    display: 'inline-block',
                    width: fontSize * 0.55,
                    height: fontSize * 1.12,
                    verticalAlign: '-0.2em',
                    background: accent,
                    opacity: Math.floor(frame / 30) % 2 === 0 ? 1 : 0,
                  }}
                />
              )}
            </span>
            {note && frame >= at + note.line * 4 && (
              <span
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  fontSize: fontSize * 0.72,
                  color: note.tone ?? C.textMuted,
                  borderLeft: `2px solid ${note.tone ?? C.textMuted}`,
                  paddingLeft: 14,
                  opacity: focusProgress > 0 ? 1 : 0.75,
                }}
              >
                {note.text}
              </span>
            )}
          </div>
        );
      })}

      {minimap && <Minimap lines={lines.length} accent={accent} />}
    </div>
  );
};

/** minimap floutée (repère visuel de l'éditeur, non fonctionnelle) */
const Minimap: React.FC<{ lines: number; accent: string }> = ({ lines, accent }) => (
  <div
    style={{
      position: 'absolute',
      top: 26,
      right: 18,
      width: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      filter: 'blur(1.2px)',
      opacity: 0.5,
    }}
  >
    {Array.from({ length: Math.min(lines, 12) }).map((_, i) => (
      <span
        key={i}
        style={{
          height: 5,
          borderRadius: 3,
          width: `${35 + ((i * 37) % 60)}%`,
          background: i % 3 === 0 ? `${accent}88` : 'rgba(255,255,255,0.16)',
        }}
      />
    ))}
  </div>
);
