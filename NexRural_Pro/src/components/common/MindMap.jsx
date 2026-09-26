function splitTwoLines(text) {
  if (text.length <= 14) return [text];
  const mid = Math.floor(text.length / 2);
  let idx = text.indexOf(" ", mid);
  if (idx === -1) idx = text.lastIndexOf(" ", mid);
  if (idx === -1) return [text];
  return [text.slice(0, idx), text.slice(idx + 1)];
}

export default function MindMap({ center, branches }) {
  const cx = 200, cy = 200, r = 140;
  const n = branches.length;
  const centerLines = splitTwoLines(center);

  return (
    <svg viewBox="0 0 400 400" className="mindmap-svg" role="img" aria-label={`Mapa mental de ${center}`}>
      {branches.map((b, i) => {
        const angle = i * ((2 * Math.PI) / n) - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <g key={b}>
            <line x1={cx} y1={cy} x2={x} y2={y} className="mindmap-line" />
            <rect x={x - 68} y={y - 17} width="136" height="34" rx="17" className="mindmap-node" />
            <text x={x} y={y + 5} textAnchor="middle" className="mindmap-node-text">{b}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="64" className="mindmap-center" />
      <text x={cx} y={cy - (centerLines.length > 1 ? 4 : 5) + 5} textAnchor="middle" className="mindmap-center-text">
        {centerLines.map((line, i) => (
          <tspan key={line} x={cx} dy={i === 0 ? 0 : 16}>{line}</tspan>
        ))}
      </text>
    </svg>
  );
}
