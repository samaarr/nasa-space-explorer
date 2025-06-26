// src/pages/NeoTracker.jsx
import { useEffect, useMemo, useState } from "react";
import { api }          from "../services/nasaApi";
import LoadingOverlay   from "../components/LoadingOverlay";
import ErrorBanner      from "../components/ErrorBanner";
import NeoPolarChart    from "../components/NeoPolarChart";

const todayISO   = new Date().toISOString().slice(0, 10);
const oneWeekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);

export default function NeoTracker() {
  /* NEO list ---------------------------------------------------- */
  const [range,    setRange]    = useState({ start: oneWeekAgo, end: todayISO });
  const [neos,     setNeos]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState({ minSize: 0, maxMiss: 8e6, hazOnly: false });

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get(`/neo-range?start=${range.start}&end=${range.end}`)
       .then(r => setNeos(Object.values(r.data.near_earth_objects).flat()))
       .catch(() => setError(true))
       .finally(() => setLoading(false));
  }, [range]);

  const list = useMemo(() => neos.filter(n => {
    const diam = n.estimated_diameter.meters.estimated_diameter_max;
    const miss = +n.close_approach_data[0].miss_distance.kilometers;
    if (diam < filter.minSize) return false;
    if (miss > filter.maxMiss)   return false;
    if (filter.hazOnly && !n.is_potentially_hazardous_asteroid) return false;
    return true;
  }), [neos, filter]);

  /* early states */
  if (loading) return <LoadingOverlay />;
  if (error)   return <ErrorBanner msg="NEO API unavailable" />;

  /* helper: limit 2-month span */
  const addMonths = (dateStr, months) => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
  };
  const subMonths = (dateStr, months) => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() - months);
    return d.toISOString().slice(0, 10);
  };
  const maxEnd = addMonths(range.start, 2) < todayISO ? addMonths(range.start, 2) : todayISO;
  const minStart = subMonths(range.end, 2);

  /* main UI */
  return (
    <div
      className="
        min-h-screen
        text-white
        font-sans
        p-6
        /* background image */
        bg-[url('/starsbg.jpg')]
        bg-cover
        bg-center
        bg-fixed
      "
      tabIndex={0}
    >
      <h1 className="text-2xl font-bold mb-4">☄️ NEO Tracker</h1>

      {/* controls */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <DateInput label="Start" value={range.start} min={minStart} max={range.end}
                   onChange={v => setRange({ ...range, start: v })} />
        <DateInput label="End"   value={range.end}   min={range.start} max={maxEnd}
                   onChange={v => setRange({ ...range, end: v })} />
        <Num label="Min size (m)" val={filter.minSize}
             onC={v => setFilter({ ...filter, minSize: v })} />
        <Num label="Max miss (km)" val={filter.maxMiss}
             onC={v => setFilter({ ...filter, maxMiss: v })} />
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter.hazOnly}
            onChange={e => setFilter({ ...filter, hazOnly: e.target.checked })}
          />
          Hazardous only
        </label>
        <span className="ml-auto text-gray-300">
          {list.length}/{neos.length} matching
        </span>
      </div>

      {/* chart + detail */}
      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-[300px] flex justify-center">
          <NeoPolarChart
            data={list}
            earthImg="/earth.jpg"
            onSelect={setSelected}
            width={600}
            height={600}
          />
        </div>

        {selected && (
          <div className="flex-1 min-w-[260px] border border-gray-700 p-6 rounded-lg bg-black/60 backdrop-blur-sm text-sm leading-relaxed">
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p>
              <strong>Diameter:</strong> {selected.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}– {selected.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
            </p>
            <p>
              <strong>Miss Distance:</strong> {(+selected.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
            </p>
            <p>
              <strong>Speed:</strong> {(+selected.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h
            </p>
            <p>
              <strong>Status:</strong> {selected.is_potentially_hazardous_asteroid ? (
                <span className="text-red-400 font-semibold">⚠ Hazardous</span>
              ) : (
                <span className="text-green-400 font-semibold">✓ Safe</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* DateInput and Num subcomponents unchanged… */
function DateInput({ label, value, onChange, min, max }) {
  return (
    <label className="text-sm">
      {label}
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(e.target.value)}
        className="ml-1 px-1 text-black rounded"
      />
    </label>
  );
}
function Num({ label, val, onC }) {
  return (
    <label className="text-sm">
      {label}
      <input
        type="number"
        value={val}
        onChange={e => onC(+e.target.value)}
        className="ml-1 px-1 w-24 text-black rounded"
      />
    </label>
  );
}
