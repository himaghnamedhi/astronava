import React from 'react';

interface VedicOrnamentalBorderProps {
  className?: string;
  side?: 'left' | 'right';
}

export const VedicOrnamentalBorder: React.FC<VedicOrnamentalBorderProps> = ({
  className = '',
  side = 'left',
}) => {
  // A vertical repeating sacred Vedic filigree pattern with lotus petals, golden scrolls, and traditional temple motifs
  return (
    <div
      className={`w-10 sm:w-12 h-full flex flex-col items-center justify-between pointer-events-none select-none overflow-hidden ${className}`}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : 'none' }}
    >
      <svg
        viewBox="0 0 48 1000"
        preserveAspectRatio="none"
        className="w-full h-full text-amber-600/75"
        fill="currentColor"
      >
        <defs>
          <pattern id={`vedic-gold-pattern-${side}`} width="48" height="100" patternUnits="userSpaceOnUse">
            {/* Outer golden vertical column borders */}
            <line x1="4" y1="0" x2="4" y2="100" stroke="#b4832c" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="8" y1="0" x2="8" y2="100" stroke="#d4af37" strokeWidth="1.2" />
            <line x1="42" y1="0" x2="42" y2="100" stroke="#b4832c" strokeWidth="0.8" />

            {/* Central ornate floral & diamond motif */}
            <path
              d="M24,10 C20,16 14,20 12,28 C10,36 16,42 24,50 C32,42 38,36 36,28 C34,20 28,16 24,10 Z"
              fill="none"
              stroke="#b4832c"
              strokeWidth="1.2"
            />
            {/* Center diamond bead */}
            <polygon points="24,24 28,28 24,32 20,28" fill="#b4832c" />
            <circle cx="24" cy="28" r="1.5" fill="#fef3c7" />

            {/* Intertwined swirling ribbons */}
            <path
              d="M12,28 C8,34 10,46 24,50 C38,54 40,66 36,72 C32,78 20,84 24,90"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.2"
            />
            <path
              d="M36,28 C40,34 38,46 24,50 C10,54 8,66 12,72 C16,78 28,84 24,90"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.2"
            />

            {/* Rosette beads */}
            <circle cx="24" cy="50" r="3" fill="#b4832c" />
            <circle cx="24" cy="50" r="1.2" fill="#fffbeb" />

            <circle cx="24" cy="90" r="2.5" fill="#b4832c" />
            <circle cx="24" cy="90" r="1" fill="#fffbeb" />

            {/* Lateral decorative curls */}
            <path d="M14,64 Q8,68 12,74" fill="none" stroke="#b4832c" strokeWidth="0.9" />
            <path d="M34,64 Q40,68 36,74" fill="none" stroke="#b4832c" strokeWidth="0.9" />
            <path d="M14,36 Q8,32 12,26" fill="none" stroke="#b4832c" strokeWidth="0.9" />
            <path d="M34,36 Q40,32 36,26" fill="none" stroke="#b4832c" strokeWidth="0.9" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="48" height="1000" fill={`url(#vedic-gold-pattern-${side})`} />
      </svg>
    </div>
  );
};
