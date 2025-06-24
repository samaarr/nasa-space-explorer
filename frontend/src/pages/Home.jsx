import { useRef } from 'react';
import HeroSection from '../components/HeroSection';
import NeoTracker from './NeoTracker';
import MarsGallery from './MarsGallery';
import EpicCarousel from './EpicCarousel';



export default function Home() {
  const neoRef = useRef();
  const marsRef = useRef();
  const epicRef = useRef();

  const scrollToSection = (section) => {
    if (section === 'neo') neoRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'epic') epicRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'mars') marsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <HeroSection onScrollTo={scrollToSection} />
      
      <div ref={neoRef} id="neo" className="min-h-screen bg-white">
        <NeoTracker />
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => onScrollTo('neo')}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/30 transition-all duration-200"
        >
          Explore
        </button>
      </div>
      </div>
      <div ref={epicRef} id="epic" className="min-h-screen bg-white">
        <EpicCarousel />
      </div>

      <div ref={marsRef} id="mars" className="min-h-screen bg-gray-50">
        <MarsGallery />
      </div>
    </div>
  );
}
