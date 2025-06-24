import { useEffect, useMemo, useState } from "react";
import { api }            from "../services/nasaApi";
import LoadingOverlay     from "../components/LoadingOverlay";
import ErrorBanner        from "../components/ErrorBanner";
import NeoPolarChart      from "../components/NeoPolarChart";

const todayISO     = new Date().toISOString().slice(0, 10);
const oneWeekAgo   = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);

export default function NeoTracker() {
  const [range, setRange] = useState({ start: oneWeekAgo, end: todayISO });
  const [neos,  setNeos]  = useState([]);
  const [loading, setL]   = useState(true);
  const [error,   setE]   = useState(false);
  const [selected, setSel]= useState(null);

  const [filter, setFilter] = useState({ minSize: 0, maxMiss: 8e6, hazOnly: false });

  useEffect(() => {
    setL(true); setE(false);
    api.get(`/neo-range?start=${range.start}&end=${range.end}`)
       .then(r => setNeos(Object.values(r.data.near_earth_objects).flat()))
       .catch(() => setE(true))
       .finally(() => setL(false));
  }, [range]);

  const list = useMemo(() => neos.filter(n => {
    const diam = n.estimated_diameter.meters.estimated_diameter_max;
    const miss = +n.close_approach_data[0].miss_distance.kilometers;
    if (diam < filter.minSize) return false;
    if (miss > filter.maxMiss) return false;
    if (filter.hazOnly && !n.is_potentially_hazardous_asteroid) return false;
    return true;
  }), [neos, filter]);

  if (loading) return <LoadingOverlay />;
  if (error)   return <ErrorBanner msg="NEO API unavailable" />;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6">
      <h1 className="text-2xl font-bold mb-4">☄️ NEO Tracker</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <DateInput label="Start" value={range.start} max={range.end}
                   onChange={v=>setRange({...range,start:v})}/>
        <DateInput label="End"   value={range.end}   min={range.start} max={todayISO}
                   onChange={v=>setRange({...range,end:v})}/>
        <Num label="Min size (m)" val={filter.minSize}
             onC={v=>setFilter({...filter,minSize:v})}/>
        <Num label="Max miss (km)" val={filter.maxMiss}
             onC={v=>setFilter({...filter,maxMiss:v})}/>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={filter.hazOnly}
                 onChange={e=>setFilter({...filter,hazOnly:e.target.checked})}/>
          Hazardous
        </label>
        <span className="ml-auto text-gray-400">
          {list.length}/{neos.length} match
        </span>
      </div>

      {/* Chart + detail */}
      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-[300px] flex justify-center items-center">
          {/* chart is 460×460 but responsive wrapper works too */}
          <NeoPolarChart data={list} onSelect={setSel} width={460} height={460} />
        </div>

        {selected && (
          <div className="flex-1 min-w-[260px] border border-gray-700 p-6 rounded-lg bg-[#22252d] text-sm leading-relaxed">
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p><strong>Diameter:</strong>&nbsp;
               {selected.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}–
               {selected.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}&nbsp;m
            </p>
            <p><strong>Miss&nbsp;Distance:</strong>&nbsp;
               {(+selected.close_approach_data[0].miss_distance.kilometers).toLocaleString()}&nbsp;km
            </p>
            <p><strong>Speed:</strong>&nbsp;
               {(+selected.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()}&nbsp;km/h
            </p>
            <p><strong>Status:</strong>&nbsp;
               {selected.is_potentially_hazardous_asteroid
                 ? <span className="text-red-400 font-semibold">⚠ Hazardous</span>
                 : <span className="text-green-400 font-semibold">✓ Safe</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* tiny inputs --------------------------------------------------- */
function DateInput({ label, value, onChange, min, max }) {
  return (
    <label className="text-sm">
      {label}
      <input type="date" value={value} min={min} max={max}
             onChange={e=>onChange(e.target.value)}
             className="ml-1 px-1 text-black rounded"/>
    </label>
  );
}
function Num({ label, val, onC }) {
  return (
    <label className="text-sm">
      {label}
      <input type="number" value={val}
             onChange={e=>onC(+e.target.value)}
             className="ml-1 px-1 w-24 text-black rounded"/>
    </label>
  );
}
