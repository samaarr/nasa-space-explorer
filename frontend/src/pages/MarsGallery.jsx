import { useEffect, useState } from "react";
import { api }          from "../services/nasaApi";
import Spinner          from "../components/Spinner";
import ErrorBanner      from "../components/ErrorBanner";


/**
 * MarsGallery — fetches Curiosity rover photos for a chosen date.
 * The backend route `/mars?date=YYYY-MM-DD` already uses the cache.
 */
export default function MarsGallery() {
  const todayISO   = new Date().toISOString().split('T')[0];

  const [date,    setDate]    = useState('2020-07-01');
  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  /* ---------- fetch whenever date changes ---------- */
  useEffect(() => {
    setLoading(true);
    setError(false);

    api.get(`/mars?date=${date}`)
       .then(res => setPhotos(res.data.photos))
       .catch(()  => setError(true))
       .finally(() => setLoading(false));
  }, [date]);

  /* ---------- UI states ---------- */
  if (loading) return <Spinner />;
  if (error)   return <ErrorBanner msg="Mars rover service unavailable" />;

  /* ---------- main render ---------- */
  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(to bottom, #000000, #2a1104, #4a1f05, #743009)',
        color: '#f5e9dc',
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-[#e77d11]">
        📸 Mars Rover Photos
      </h2>

      {/* date picker */}
      <div className="text-center mb-6">
        <label className="text-lg mr-2 text-[#fda600]">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={todayISO}
          className="p-2 rounded bg-[#2a1104] text-white border border-[#743009] focus:outline-none"
        />
        <p className="text-sm mt-2 text-[#c1440e]">
          Showing photos taken on {date}
        </p>
      </div>

      {/* photo grid */}
      {photos.length === 0 ? (
        <p className="text-center text-[#fda600]">
          No photos found for {date}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map(photo => (
            <div
              key={photo.id}
              className="bg-[#1c0e07] border border-[#451804] rounded-lg shadow-md p-2 hover:scale-105 transition-transform"
            >
              <img
                src={photo.img_src}
                alt={photo.camera.full_name}
                loading="lazy"
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm mt-2 text-center text-[#fda600]">
                {photo.camera.full_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
