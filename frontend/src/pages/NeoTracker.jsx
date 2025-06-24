import { useEffect, useMemo, useState } from "react";
import { api }               from "../services/nasaApi";
import LoadingOverlay        from "../components/LoadingOverlay";
import ErrorBanner           from "../components/ErrorBanner";

/* ───── constants ───── */
const todayISO = new Date().toISOString().slice(0, 10);
const sixMonthsAgo = new Date(Date.now() - 183 * 864e5)
  .toISOString()
  .slice(0, 10);

export default function NeoTracker() {
  /* ---------- dates ---------- */
  const [start, setStart] = useState(sixMonthsAgo);
  const [end,   setEnd]   = useState(todayISO);

  /* ---------- data + ui ---------- */
  const [neos,      setNeos]      = useState([]);    // flat array
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(false);

  /* ---------- filters ---------- */
  const [filter, setFilter] = useState({
    minSize: 0,
    maxMiss: 8e6,            // 8 000 000 km
    hazardousOnly: false,
  });

  /* ---------- fetch whenever range changes ---------- */
  useEffect(() => {
    setLoading(true);
    setError(false);

    api
      .get(`/neo-range?start=${start}&end=${end}`)
      .then(res => {
        const flat = Object.values(res.data.near_earth_objects).flat();
        setNeos(flat);
        setSelected(null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [start, end]);

  /* ---------- derived list ---------- */
  const filteredNeos = useMemo(() => {
    return neos.filter(n => {
      const diam = n.estimated_diameter.meters.estimated_diameter_max;
      const miss = Number(n.close_approach_data[0].miss_distance.kilometers);

      if (diam < filter.minSize) return false;
      if (miss > filter.maxMiss) return false;
      if (filter.hazardousOnly && !n.is_potentially_hazardous_asteroid)
        return false;
      return true;
    });
  }, [neos, filter]);

  /* ---------- ui states ---------- */
  if (loading) return <LoadingOverlay />;
  if (error)   return <ErrorBanner msg="Near-Earth Object service unavailable" />;

  /* ---------- render ---------- */
  return (
    <div
      className="min-h-screen p-6 font-sans text-[#fdfeff]"
      style={{ background: "linear-gradient(to bottom, #0d1b2a, #000000)" }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center text-[#62aed0]">
        ☄️ NEO Tracker
      </h1>

      {/* Date range pickers */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block mb-1 text-sm">Start date</label>
          <input
            type="date"
            value={start}
            max={end}
            onChange={e => setStart(e.target.value)}
            className="px-3 py-1 rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">End date</label>
          <input
            type="date"
            value={end}
            min={start}
            max={todayISO}
            onChange={e => setEnd(e.target.value)}
            className="px-3 py-1 rounded text-black"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8 text-[#bcdcf3] text-sm">
        <div>
          <label>Min size (m)</label>
          <input
            type="number"
            className="ml-2 w-20 text-black px-1 py-0.5 rounded"
            value={filter.minSize}
            onChange={e => setFilter({ ...filter, minSize: +e.target.value })}
          />
        </div>
        <div>
          <label>Max miss dist (km)</label>
          <input
            type="number"
            className="ml-2 w-28 text-black px-1 py-0.5 rounded"
            value={filter.maxMiss}
            onChange={e => setFilter({ ...filter, maxMiss: +e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter.hazardousOnly}
            onChange={e => setFilter({ ...filter, hazardousOnly: e.target.checked })}
          />
          Hazardous only
        </label>
        <span className="ml-auto">{filteredNeos.length} of {neos.length} match</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* list */}
        <div className="w-full md:w-1/2 h-[70vh] overflow-y-auto pr-2">
          {filteredNeos.length === 0 ? (
            <p className="text-red-400">No NEOs match.</p>
          ) : (
            <ul className="space-y-3">
              {filteredNeos.map(neo => (
                <li
                  key={neo.id}
                  onClick={() => setSelected(neo)}
                  className="bg-[#1d212c] p-3 rounded cursor-pointer border border-[#534f6a] hover:bg-[#2a2e3c] transition"
                >
                  <h3 className="font-bold text-[#fdfeff]">{neo.name}</h3>
                  <p className="text-xs text-[#bcdcf3]">
                    Diameter {neo.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}–
                    {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m •
                    Miss {Number(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                  </p>
                  <p
                    className={`text-xs ${
                      neo.is_potentially_hazardous_asteroid ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {neo.is_potentially_hazardous_asteroid ? "Hazardous" : "Safe"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* detail */}
        <div className="w-full md:w-1/2">
          {selected ? (
            <DetailCard neo={selected} />
          ) : (
            <p className="text-[#bcdcf3] italic mt-4">
              Select a NEO to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----- Details component & helpers -------------------------------- */
function DetailCard({ neo }) {
  return (
    <div className="bg-[#10131a] p-4 rounded shadow text-sm space-y-4 border border-[#4980a7]">
      <h2 className="text-xl font-bold text-[#bcdcf3]">{neo.name}</h2>
      <InfoBlock title="💠 Diameter (m)">
        {neo.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}–{" "}
        {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}
      </InfoBlock>
      <InfoBlock title="🚀 Speed (km/h)">
        {parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)}
      </InfoBlock>
      <InfoBlock title="🪐 Miss Distance (km)">
        {parseFloat(neo.close_approach_data[0].miss_distance.kilometers).toFixed(0)}
      </InfoBlock>
      <InfoBlock title="🛰 Orbiting Body">
        {neo.close_approach_data[0].orbiting_body}
      </InfoBlock>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <p className="font-semibold text-[#62aed0]">{title}</p>
      <div>{children}</div>
    </div>
  );
}
