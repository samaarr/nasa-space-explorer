import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

/* ---------- helpers ------------------------------------------------ */
const speedColor = v =>
  v < 20_000 ? "#10b981"
  : v < 40_000 ? "#fbbf24"
  :              "#ef4444";

const hash = str => {                 // deterministic, small
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
};

/* ---------- component ---------------------------------------------- */
export default function DistancePlot({ neos, selectedId }) {
  if (!neos?.length) return null;

  /* transform NEOs to polar → cartesian */
  const data = neos.map(n => {
    const missKm  = +n.close_approach_data[0].miss_distance.kilometers;
    const speed   = +n.close_approach_data[0].relative_velocity.kilometers_per_hour;
    const diamMax = n.estimated_diameter.meters.estimated_diameter_max;

    const angle   = (hash(n.id) % 360) * (Math.PI / 180);   // 0–359°
    const r       = missKm;                                 // keep units
    const x       = r * Math.cos(angle);
    const y       = r * Math.sin(angle);

    return {
      id:   n.id,
      name: n.name,
      x,
      y,
      size: Math.min(diamMax / 10, 60),
      col:  speedColor(speed),
      speed,
      diam: Math.round(diamMax),
      miss: missKm,
    };
  });

  const earth = [{ id: "earth", x: 0, y: 0, size: 120, col: "#3b82f6", name: "Earth" }];
  const sel   = data.find(d => d.id === selectedId);

  /* find axis extents */
  const maxAbs = Math.max(...data.map(d => Math.max(Math.abs(d.x), Math.abs(d.y))), 1);

  return (
    <div className="bg-[#1d212c] p-4 rounded mt-8">
      <h3 className="mb-2">Radial view &nbsp;•&nbsp; Earth at centre</h3>

      {/* speed legend */}
      <Legend />

      <div className="min-h-[60vh]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <XAxis
              type="number"
              dataKey="x"
              tickFormatter={v => (v / 1_000_000).toFixed(1) + " M km"}
              domain={[-maxAbs * 1.05, maxAbs * 1.05]}
            />
            <YAxis
              type="number"
              dataKey="y"
              tickFormatter={v => (v / 1_000_000).toFixed(1) + " M km"}
              domain={[-maxAbs * 1.05, maxAbs * 1.05]}
            />
            <ZAxis dataKey="size" range={[20, 160]} />

            <Tooltip
              formatter={(v, n, p) => {
                if (n === "miss")  return [v.toLocaleString() + " km", "Miss dist"];
                if (n === "diam")  return [v + " m", "Diameter"];
                if (n === "speed") return [v.toLocaleString() + " km/h", "Speed"];
                return v;
              }}
              labelFormatter={() => ""}
            />

            {/* Earth */}
            <Scatter data={earth}>
              <Cell fill="#3b82f6" />
              <LabelList dataKey="name" position="right" fill="#ffffff" />
            </Scatter>

            {/* All NEOs */}
            <Scatter data={data}>
              {data.map(d => (
                <Cell key={d.id}
                  fill={d.col}
                  stroke={d.id === selectedId ? "#ffffff" : "none"}
                  strokeWidth={d.id === selectedId ? 2 : 0}
                />
              ))}
            </Scatter>

            {/* Selected label */}
            {sel && (
              <Scatter data={[sel]}>
                <Cell fill={sel.col} stroke="#ffffff" strokeWidth={2} />
                <LabelList dataKey="name" position="right" fill="#ffffff" />
              </Scatter>
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Circle radius ≈ diameter &nbsp;•&nbsp; colour ≈ approach speed
      </p>
    </div>
  );
}

/* ---------- speed gradient legend --------------------------------- */
function Legend() {
  return (
    <div className="flex items-center text-xs text-gray-300 mb-4">
      <span className="mr-2">Speed</span>
      <svg width="160" height="10">
        <defs>
          <linearGradient id="grad" x1="0" x2="1">
            <stop offset="0%"  stopColor="#10b981" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect width="160" height="10" fill="url(#grad)" />
      </svg>
      <span className="ml-2">slow &nbsp;→&nbsp; fast</span>
    </div>
  );
}
