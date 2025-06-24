import "./orbitMini.css";

const dotColor = v =>
  v < 20_000 ? "#10b981"
  : v < 40_000 ? "#fbbf24"
  :              "#ef4444";

export default function OrbitMini({ neos = [] }) {
  if (!neos.length) return null;

  const maxMiss  = Math.max(...neos.map(n => +n.close_approach_data[0].miss_distance.kilometers));
  const maxSpeed = Math.max(...neos.map(n => +n.close_approach_data[0].relative_velocity.kilometers_per_hour));

  return (
    <div className="uni-bg">
      <div className="earth">🌍</div>

      {neos.map(n => {
        const miss  = +n.close_approach_data[0].miss_distance.kilometers;
        const speed = +n.close_approach_data[0].relative_velocity.kilometers_per_hour;

        const radius   = 40 + (miss / maxMiss) * 140;           // 40–180 px
        const duration = 18 - (speed / maxSpeed) * 8;           // 18→10 s

        return (
          <div
            key={n.id}
            className="ring"
            style={{
              width:  radius * 8,
              height: radius * 2,
              bottom: -radius,
              right:  -radius,
              animationDuration: `${duration}s`,
            }}
          >
            <div
              className="dot"
              style={{ background: dotColor(speed) }}
              title={`${n.name}\n${miss.toLocaleString()} km miss\n${speed.toLocaleString()} km/h`}
            />
          </div>
        );
      })}
    </div>
  );
}
