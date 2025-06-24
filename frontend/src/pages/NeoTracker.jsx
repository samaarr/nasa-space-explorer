import { useEffect, useState } from 'react';
import { fetchNeoData } from '../services/nasaApi';
import Spinner from '../components/spinner';

export default function NeoTracker() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [selectedNEOs, setSelectedNEOs] = useState([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchNeoData(startDate);
        setSelectedNEOs(data.near_earth_objects[startDate] || []);
        setSelectedAsteroid(null);
      } catch (error) {
        console.error('NEO Fetch Failed:', error);
      }
      setLoading(false);
    };
    loadData();
  }, [startDate]);

  return (
    <div
      className="min-h-screen p-6 font-sans text-[#fdfeff]"
      style={{
        background: 'linear-gradient(to bottom, #0d1b2a, #000000)',
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center text-[#62aed0]">☄️ NEO Tracker</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Date Picker and NEO List */}
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-[#bcdcf3] font-medium">📅 Select Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={today}
            className="px-3 py-2 rounded text-black mb-4"
          />

          {loading ? (
            <Spinner />
          ) : selectedNEOs.length === 0 ? (
            <p className="text-red-400">No NEOs found.</p>
          ) : (
            <ul className="space-y-3">
              {selectedNEOs.map((neo) => (
                <li
                  key={neo.id}
                  onClick={() => setSelectedAsteroid(neo)}
                  className="bg-[#1d212c] p-3 rounded cursor-pointer border border-[#534f6a] hover:bg-[#2a2e3c] transition"
                >
                  <h3 className="font-bold text-[#fdfeff]">{neo.name}</h3>
                  <p className="text-sm text-[#bcdcf3]">
                    Diameter: {neo.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}–{neo.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      neo.is_potentially_hazardous_asteroid ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* NEO Detail */}
        <div className="w-full md:w-1/2">
          {selectedAsteroid ? (
            <div className="bg-[#10131a] p-4 rounded shadow text-sm space-y-4 border border-[#4980a7]">
              <h2 className="text-xl font-bold text-[#bcdcf3]">{selectedAsteroid.name}</h2>

              <div>
                <p className="font-semibold text-[#62aed0]">💠 Diameter (m)</p>
                <p>
                  {selectedAsteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} –{' '}
                  {selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#62aed0]">🚀 Speed (km/h)</p>
                <p>
                  {parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#62aed0]">🪐 Miss Distance (km)</p>
                <p>
                  {parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers).toFixed(0)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#62aed0]">🛰 Orbiting Body</p>
                <p>{selectedAsteroid.close_approach_data[0].orbiting_body}</p>
              </div>

              <div>
                <p className="font-semibold text-[#62aed0]">📏 Size Comparison (vs 120m Spire)</p>
                <div className="flex space-x-6 items-end mt-2">
                  <div className="h-[120px] w-12 bg-[#4980a7] text-white text-center text-xs flex items-end justify-center">
                    Spire
                  </div>
                  <div
                    className="w-12 bg-[#bcdcf3] text-black text-center text-xs flex items-end justify-center"
                    style={{
                      height: `${Math.min(selectedAsteroid.estimated_diameter.meters.estimated_diameter_max, 300)}px`,
                    }}
                  >
                    NEO
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[#bcdcf3] italic mt-4">Select a NEO to view its details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
