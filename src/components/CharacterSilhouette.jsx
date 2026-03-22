"use client";

// Each silhouette type is a unique SVG path representing a different character style
const silhouettes = {
  tsundere: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="38" rx="22" ry="24" />
      {/* Hair — side tails */}
      <ellipse cx="38" cy="44" rx="8" ry="18" transform="rotate(-10 38 44)" />
      <ellipse cx="82" cy="44" rx="8" ry="18" transform="rotate(10 82 44)" />
      {/* Neck */}
      <rect x="54" y="60" width="12" height="10" rx="4" />
      {/* Body — school uniform */}
      <path d="M35 70 Q60 65 85 70 L90 130 Q60 138 30 130 Z" />
      {/* Arms — crossed */}
      <path d="M35 78 Q18 90 22 105 Q30 100 38 95" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M85 78 Q102 90 98 105 Q90 100 82 95" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M30 100 Q50 108 70 100" strokeWidth="9" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Skirt */}
      <path d="M30 130 Q60 140 90 130 L96 170 Q60 178 24 170 Z" />
      {/* Legs */}
      <rect x="42" y="170" width="14" height="28" rx="6" />
      <rect x="64" y="170" width="14" height="28" rx="6" />
    </svg>
  ),
  yandere: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="36" rx="21" ry="23" />
      {/* Long straight hair */}
      <rect x="36" y="30" width="10" height="60" rx="5" />
      <rect x="74" y="30" width="10" height="60" rx="5" />
      <ellipse cx="60" cy="22" rx="22" ry="10" />
      {/* Neck */}
      <rect x="55" y="57" width="10" height="10" rx="3" />
      {/* Body */}
      <path d="M36 67 Q60 62 84 67 L88 128 Q60 135 32 128 Z" />
      {/* Arms — one reaching forward */}
      <path d="M36 75 Q20 88 16 108" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M84 75 Q100 85 104 100" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Skirt */}
      <path d="M32 128 Q60 138 88 128 L93 172 Q60 180 27 172 Z" />
      {/* Legs */}
      <rect x="42" y="172" width="13" height="26" rx="6" />
      <rect x="65" y="172" width="13" height="26" rx="6" />
    </svg>
  ),
  housewife: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="36" rx="20" ry="22" />
      {/* Hair bun */}
      <ellipse cx="60" cy="18" rx="14" ry="10" />
      <ellipse cx="60" cy="14" rx="9" ry="7" />
      {/* Neck */}
      <rect x="54" y="56" width="12" height="10" rx="4" />
      {/* Apron body */}
      <path d="M34 66 Q60 60 86 66 L90 132 Q60 140 30 132 Z" />
      {/* Apron overlay */}
      <path d="M46 70 Q60 66 74 70 L76 130 Q60 136 44 130 Z" opacity="0.4"/>
      {/* Arms — one holding something */}
      <path d="M34 74 Q16 86 14 106" strokeWidth="11" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M86 74 Q104 84 106 100" strokeWidth="11" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Skirt / dress */}
      <path d="M30 132 Q60 142 90 132 L96 175 Q60 183 24 175 Z" />
      {/* Legs */}
      <rect x="43" y="175" width="13" height="24" rx="6" />
      <rect x="64" y="175" width="13" height="24" rx="6" />
    </svg>
  ),
  heiress: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="35" rx="20" ry="22" />
      {/* Elegant updo hair */}
      <ellipse cx="60" cy="17" rx="18" ry="8" />
      <ellipse cx="60" cy="13" rx="11" ry="6" />
      <rect x="50" y="10" width="20" height="4" rx="2" />
      {/* Neck */}
      <rect x="55" y="55" width="10" height="10" rx="3" />
      {/* Elegant dress bodice */}
      <path d="M36 65 Q60 58 84 65 L87 125 Q60 132 33 125 Z" />
      {/* Arms — one raised slightly */}
      <path d="M36 73 Q20 82 18 98" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M84 73 Q100 80 102 94" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Ballgown skirt — wide */}
      <path d="M33 125 Q60 136 87 125 L100 178 Q60 188 20 178 Z" />
      {/* Legs */}
      <rect x="46" y="178" width="12" height="20" rx="5" />
      <rect x="62" y="178" width="12" height="20" rx="5" />
    </svg>
  ),
  widow: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="37" rx="20" ry="22" />
      {/* Veil / hair draped */}
      <path d="M38 28 Q60 18 82 28 Q86 55 80 75 Q60 80 40 75 Q34 55 38 28 Z" opacity="0.35"/>
      {/* Neck */}
      <rect x="54" y="57" width="12" height="10" rx="4" />
      {/* Elegant dark gown */}
      <path d="M35 67 Q60 61 85 67 L89 130 Q60 138 31 130 Z" />
      {/* Arms — composed, one slightly raised */}
      <path d="M35 75 Q18 86 16 104" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M85 75 Q102 83 104 98" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Long gown */}
      <path d="M31 130 Q60 140 89 130 L94 178 Q60 186 26 178 Z" />
      {/* Legs */}
      <rect x="44" y="178" width="13" height="20" rx="6" />
      <rect x="63" y="178" width="13" height="20" rx="6" />
    </svg>
  ),
  introvert: (
    <svg viewBox="0 0 120 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Head — slightly down */}
      <ellipse cx="60" cy="40" rx="20" ry="22" />
      {/* Hair — loose, covering face slightly */}
      <path d="M38 30 Q60 20 82 30 Q86 50 82 68 Q60 72 38 68 Q34 50 38 30 Z" opacity="0.5"/>
      <ellipse cx="44" cy="44" rx="8" ry="14" opacity="0.6"/>
      {/* Neck */}
      <rect x="54" y="60" width="12" height="10" rx="4" />
      {/* Casual oversized top */}
      <path d="M32 70 Q60 63 88 70 L91 128 Q60 136 29 128 Z" />
      {/* Arms — hugging a book */}
      <path d="M32 78 Q16 90 18 112" strokeWidth="11" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M88 78 Q104 88 102 110" strokeWidth="11" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Book */}
      <rect x="34" y="100" width="52" height="30" rx="3" opacity="0.6"/>
      {/* Skirt */}
      <path d="M29 128 Q60 138 91 128 L95 174 Q60 182 25 174 Z" />
      {/* Legs */}
      <rect x="42" y="174" width="13" height="24" rx="6" />
      <rect x="65" y="174" width="13" height="24" rx="6" />
    </svg>
  ),
};

export default function CharacterSilhouette({ silhouetteType, color, mood, moods }) {
  const moodData = moods?.[mood] ?? { glow: color, label: mood };
  const glowColor = moodData.glow;

  return (
    <div
      className="character-silhouette"
      style={{
        color: color,
        filter: `drop-shadow(0 0 18px ${glowColor}) drop-shadow(0 0 6px ${glowColor})`,
        transition: "filter 0.6s ease, color 0.6s ease",
        width: "100px",
        height: "160px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {silhouettes[silhouetteType] ?? silhouettes.introvert}
    </div>
  );
}
