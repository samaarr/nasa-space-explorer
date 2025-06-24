import { useEffect, useState } from 'react';
import { fetchApod } from '../services/nasaApi';
import { FiInfo } from 'react-icons/fi';
import { FiChevronDown } from 'react-icons/fi';

console.log('🛠 HeroSection loaded');

export default function HeroSection({ onScrollTo }) {
  const [apod, setApod] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    console.log('🚀 HeroSection mounted');
    const today = new Date().toISOString().split('T')[0];
    fetchApod(today)
      .then((data) => {
        console.log('✅ APOD fetch success:', data);
        setApod(data);
      })
      .catch((err) => console.error('❌ APOD fetch failed:', err));
  }, []);

  if (!apod) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        Loading APOD...
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${apod.url})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Info Icon */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          aria-label="Show description"
        >
          <FiInfo size={22} />
        </button>
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        {!showInfo ? (
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-wide mb-4 drop-shadow-lg max-w-3xl transition-opacity duration-300">
            {apod.title}
          </h1>
        ) : (
          <p className="text-white/70 text-sm max-w-3xl leading-relaxed px-4 backdrop-blur-sm transition-opacity duration-300">
            {apod.explanation}
          </p>
        )}
      </div>

      {/* Bottom Center Explore Button */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => onScrollTo('neo')}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/30 transition-all duration-200"
        >
          Explore
        </button>
      </div>
    </div>
  );
}
