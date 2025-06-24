import { useEffect, useRef, useState } from 'react';
import { fetchEpicRangeImages } from '../services/nasaApi';
import Spinner from '../components/spinner';

export default function EpicCarousel() {
  const [images, setImages] = useState([]);
  const [date, setDate] = useState('2024-05-01');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      setImages([]);
      const loaded = await fetchEpicRangeImages(date, 'natural');
      setImages(loaded);
      setActiveIndex(0);
    };
    loadImages();
  }, [date]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && activeIndex < images.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images, activeIndex]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-hidden flex flex-col p-6"
      tabIndex={0}
    >
             

      <div className="flex flex-1 w-full max-w-screen-xl mx-auto">
        {/* Left: 1/3 Info Panel */}
        <div className="w-full md:w-1/3 pr-4">
          <div className="mb-6">
            <label className="text-lg block mb-2">Select Date:</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 rounded text-black w-full"
            />
            <p className="mt-2 text-sm text-gray-400">
              Showing Earth photos from: {date} ± 1 day
            </p>
          </div>

          {images.length > 0 && (
            <div className="text-sm space-y-2 mt-6">
              <p className="text-md font-semibold break-words">{images[activeIndex].caption}</p>
              <p className="text-gray-400">
                📍 Lat: {images[activeIndex].centroid_coordinates.lat}, Lon: {images[activeIndex].centroid_coordinates.lon}
              </p>
              <p className="text-gray-500">
                🕓 {images[activeIndex].date}<br />
                🧭 ID: {images[activeIndex].identifier}
              </p>
              <p className="mt-4 text-blue-400">Use ← / → arrow keys to scroll through images</p>
            </div>
          )}
        </div>

        {/* Right: 2/3 Image Panel */}
        <div className="w-full md:w-2/3 relative flex items-center justify-center">
          {images.length === 0 ? (
            <Spinner />
          ) : (
            <div className="relative w-full">
              <img
                src={images[activeIndex].image}
                alt={images[activeIndex].caption}
                className="w-full max-h-[80vh] object-contain rounded shadow-md transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-800 rounded-b overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(activeIndex + 1) / images.length * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
