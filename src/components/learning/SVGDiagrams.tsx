type Props = { type: "cas9" | "grna" | "nhej" | "delivery"; color: string };

export default function SVGDiagrams({ type, color }: Props) {
  if (type === "cas9") return (
    <svg viewBox="0 0 500 220" className="lp-svg-diagram">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={color} />
        </marker>
      </defs>
      {/* DNA strands */}
      <text x="250" y="28" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace" letterSpacing="3">
        5′ — A · T · G · C · C · G · T · A · G · C — 3′
      </text>
      <text x="250" y="52" textAnchor="middle" fill="#ef9a9a" fontSize="13" fontFamily="monospace" letterSpacing="3">
        3′ — T · A · C · G · G · C · A · T · C · G — 5′
      </text>
      {/* gRNA arrow */}
      <path d="M250,60 L250,82" stroke={color} strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arr)" />
      <text x="265" y="74" fill={color} fontSize="10">gRNA</text>
      {/* Cas9 body */}
      <rect x="180" y="82" width="140" height="70" rx="14" fill="#0d1f35" stroke={color} strokeWidth="1.5" />
      <text x="250" y="112" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Cas9</text>
      <text x="250" y="130" textAnchor="middle" fill={color} fontSize="11">RuvC + HNH domains</text>
      {/* PAM label */}
      <rect x="336" y="44" width="50" height="22" rx="6" fill="#1a2a1a" stroke="#81c784" strokeWidth="1" />
      <text x="361" y="59" textAnchor="middle" fill="#81c784" fontSize="11" fontWeight="700">PAM</text>
      <path d="M336,55 L310,55" stroke="#81c784" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Cut lines */}
      <line x1="250" y1="152" x2="215" y2="185" stroke="#ffb74d" strokeWidth="2" strokeDasharray="5 3" />
      <line x1="250" y1="152" x2="285" y2="185" stroke="#ffb74d" strokeWidth="2" strokeDasharray="5 3" />
      <text x="215" y="202" textAnchor="middle" fill="#ffb74d" fontSize="11">✂ Strand 1</text>
      <text x="285" y="202" textAnchor="middle" fill="#ffb74d" fontSize="11">Strand 2 ✂</text>
    </svg>
  );

  if (type === "grna") return (
    <svg viewBox="0 0 500 190" className="lp-svg-diagram">
      <text x="110" y="28" textAnchor="middle" fill={color} fontSize="12" fontWeight="700">gRNA 1</text>
      <text x="390" y="28" textAnchor="middle" fill={color} fontSize="12" fontWeight="700">gRNA 2</text>
      <rect x="60" y="34" width="100" height="22" rx="6" fill={color} opacity="0.75" />
      <rect x="340" y="34" width="100" height="22" rx="6" fill={color} opacity="0.75" />
      {/* DNA strands */}
      <rect x="60" y="82" width="380" height="15" rx="4" fill="#152235" stroke={color} strokeWidth="1" opacity="0.6" />
      <rect x="60" y="102" width="380" height="15" rx="4" fill="#152235" stroke="#ef9a9a" strokeWidth="1" opacity="0.6" />
      {/* Cut lines */}
      <line x1="110" y1="56" x2="110" y2="125" stroke="#ffb74d" strokeWidth="2.5" strokeDasharray="5 3" />
      <line x1="390" y1="56" x2="390" y2="125" stroke="#ffb74d" strokeWidth="2.5" strokeDasharray="5 3" />
      <text x="110" y="140" textAnchor="middle" fill="#ffb74d" fontSize="11">✂ Cut 1</text>
      <text x="390" y="140" textAnchor="middle" fill="#ffb74d" fontSize="11">✂ Cut 2</text>
      {/* Deletion region */}
      <rect x="110" y="148" width="280" height="20" rx="5" fill="#b71c1c" opacity="0.45" />
      <text x="250" y="163" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">EXCISED SEGMENT</text>
      <path d="M60,175 Q60,185 70,185 L430,185 Q440,185 440,175" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="250" y="182" textAnchor="middle" fill={color} fontSize="10">Ends join → deletion complete</text>
    </svg>
  );

  if (type === "nhej") return (
    <svg viewBox="0 0 500 210" className="lp-svg-diagram">
      <text x="250" y="22" textAnchor="middle" fill="#90a4ae" fontSize="11" fontWeight="600" letterSpacing="1">BEFORE CUT</text>
      <rect x="60" y="30" width="380" height="14" rx="4" fill="#152235" stroke={color} strokeWidth="1.2" />
      <rect x="60" y="48" width="380" height="14" rx="4" fill="#152235" stroke="#ef9a9a" strokeWidth="1.2" />
      <text x="250" y="88" textAnchor="middle" fill="#ffb74d" fontSize="20">↓</text>
      <text x="250" y="108" textAnchor="middle" fill="#ffb74d" fontSize="10">Cas9 cuts both strands</text>
      <text x="250" y="128" textAnchor="middle" fill="#90a4ae" fontSize="11" fontWeight="600" letterSpacing="1">AFTER NHEJ REPAIR</text>
      <rect x="60" y="136" width="155" height="14" rx="4" fill="#152235" stroke="#ef9a9a" strokeWidth="1.2" />
      <text x="223" y="148" fill="#ef9a9a" fontSize="13" fontWeight="700">+2</text>
      <rect x="246" y="136" width="154" height="14" rx="4" fill="#152235" stroke="#ef9a9a" strokeWidth="1.2" />
      <text x="250" y="170" textAnchor="middle" fill="#ef9a9a" fontSize="11">Indel (+2 bp insertion)</text>
      <rect x="80" y="182" width="340" height="20" rx="6" fill="#0a1f0a" stroke="#81c784" strokeWidth="1" />
      <text x="250" y="196" textAnchor="middle" fill="#81c784" fontSize="11">→ Frameshift → Gene disrupted (knockout)</text>
    </svg>
  );

  if (type === "delivery") return (
    <svg viewBox="0 0 500 200" className="lp-svg-diagram">
      <defs>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#ce93d8" />
        </marker>
        <marker id="arr3" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#81c784" />
        </marker>
        <marker id="arr4" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#ffb74d" />
        </marker>
      </defs>
      {/* Cell outline */}
      <ellipse cx="250" cy="105" rx="195" ry="85" fill="#0a0f1e" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Nucleus */}
      <ellipse cx="250" cy="105" rx="75" ry="50" fill="#0d1f35" stroke={color} strokeWidth="1.5" />
      <text x="250" y="100" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">NUCLEUS</text>
      <text x="250" y="116" textAnchor="middle" fill={color} fontSize="10">DNA Target</text>
      {/* LNP */}
      <rect x="18" y="58" width="50" height="28" rx="8" fill="#1a0d2e" stroke="#ce93d8" strokeWidth="1.5" />
      <text x="43" y="70" textAnchor="middle" fill="#ce93d8" fontSize="9" fontWeight="700">LNP</text>
      <text x="43" y="81" textAnchor="middle" fill="#ce93d8" fontSize="8">mRNA</text>
      <path d="M68,72 L55,72" stroke="#ce93d8" strokeWidth="1.5" markerEnd="url(#arr2)" />
      {/* AAV */}
      <rect x="18" y="98" width="50" height="28" rx="8" fill="#0a1a0a" stroke="#81c784" strokeWidth="1.5" />
      <text x="43" y="110" textAnchor="middle" fill="#81c784" fontSize="9" fontWeight="700">AAV</text>
      <text x="43" y="121" textAnchor="middle" fill="#81c784" fontSize="8">DNA</text>
      <path d="M68,112 L55,112" stroke="#81c784" strokeWidth="1.5" markerEnd="url(#arr3)" />
      {/* Electroporation */}
      <rect x="18" y="138" width="50" height="28" rx="8" fill="#1a1a0a" stroke="#ffb74d" strokeWidth="1.5" />
      <text x="43" y="150" textAnchor="middle" fill="#ffb74d" fontSize="9" fontWeight="700">⚡ EP</text>
      <text x="43" y="161" textAnchor="middle" fill="#ffb74d" fontSize="8">RNP</text>
      <path d="M68,152 L55,152" stroke="#ffb74d" strokeWidth="1.5" markerEnd="url(#arr4)" />
      {/* Cas9 scissor inside nucleus */}
      <text x="250" y="132" textAnchor="middle" fill="#ffb74d" fontSize="16">✂</text>
      <text x="390" y="100" textAnchor="middle" fill="#90a4ae" fontSize="10">Membrane</text>
      <text x="390" y="115" textAnchor="middle" fill="#90a4ae" fontSize="10">barrier</text>
    </svg>
  );

  return null;
}