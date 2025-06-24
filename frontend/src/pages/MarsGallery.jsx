import { useState, useEffect } from 'react';
import { fetchMarsPhotos } from '../services/nasaApi';

export default function MarsGallery() {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState('2020-07-01');

  useEffect(() => {
    fetchMarsPhotos(date).then(setPhotos);
  }, [date]);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(to bottom, #000000, #2a1104, #4a1f05, #743009)`,
        color: '#f5e9dc', // Soft off-white text
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-[#e77d11]">
        📸 Mars Rover Photos
      </h2>

      <div className="text-center mb-6">
        <label className="text-lg mr-2 text-[#fda600]">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded bg-[#2a1104] text-white border border-[#743009] focus:outline-none"
        />
        <p className="text-sm mt-2 text-[#c1440e]">Showing photos from Mars taken on {date}</p>
      </div>

      {photos.length === 0 ? (
        <p className="text-center text-[#fda600]">No photos found for {date}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#1c0e07] border border-[#451804] rounded-lg shadow-md p-2 hover:scale-105 transition-transform"
            >
              <img
                src={photo.img_src}
                alt={photo.camera.full_name}
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm mt-2 text-center text-[#fda600]">{photo.camera.full_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
