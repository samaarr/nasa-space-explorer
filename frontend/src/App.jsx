// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MarsGallery from './pages/MarsGallery';
import NeoTracker from './pages/NeoTracker';
import FloatingWatermark from './components/FloatingWatermark';
import EpicCarousel from './pages/EpicCarousel';





console.log('✅ App.jsx loaded');

export default function App() {
  return (
    
    <BrowserRouter>
    <Navbar />
    

      <div className="relative min-h-screen font-grotesk bg-background text-textMain dark:bg-darkBg dark:text-darkText">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mars" element={<MarsGallery />} />
          <Route path="/neo" element={<NeoTracker />} />
          <Route path="/epic" element={<EpicCarousel />} />
        </Routes>
        <FloatingWatermark />
        
      </div>
    </BrowserRouter>
  );
}
