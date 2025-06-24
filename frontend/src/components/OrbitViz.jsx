import "./orbitViz.css";

/* ---- helpers ---- */
const colour = v =>
  v < 20_000 ? "#10b981" : v < 40_000 ? "#fbbf24" : "#ef4444";

const hash = s => { let h=0; for (let c of s){h=(h<<5)-h+c.charCodeAt(0);} return Math.abs(h); };

export default function OrbitViz({ neos = [], highlightId = null, style = {} }) {
  console.log("🔄 OrbitViz render — neos:", neos.length, "highlight:", highlightId);

  if (!neos.length) return null;

  const maxMiss = Math.max(...neos.map(n => +n.close_approach_data[0].miss_distance.kilometers));
  const baseR   = km => 40 + (km / maxMiss) * 160;

  return (
    <div className="orbit-bg" style={style}>
      <div className="earth">🌍</div>

      {neos.map(n => {
        const miss  = +n.close_approach_data[0].miss_distance.kilometers;
        const speed = +n.close_approach_data[0].relative_velocity.kilometers_per_hour;

        const radius = baseR(miss) * 4;
        const period = 18 - Math.min(speed, 60_000) / 10_000;
        const offset = 180 + hash(n.id) % 90;

        /* one-liner debug for each asteroid */
        console.log(`  • ${n.name}  r=${radius.toFixed(1)}px  period=${period.toFixed(1)}s`);

        return (
          <div
            key={n.id}
            className="orbit"
            style={{
              width:  radius * 2,
              height: radius * 2,
              bottom: -radius,
              right:  -radius,
              animationDuration: `${period}s`,
              animationDelay: `-${(offset / 360) * period}s`,
            }}
          >
            <div
              className="dot"
              style={{
                background: colour(speed),
                boxShadow: n.id === highlightId ? "0 0 4px 2px #fff" : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
