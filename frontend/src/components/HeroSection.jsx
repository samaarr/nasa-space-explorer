import { useEffect, useState } from "react";
import { api }            from "../services/nasaApi";
import Spinner            from "./Spinner";
import ErrorBanner        from "./ErrorBanner";

/* --- Info icon with subtle glow ---------------------------------- */

const InfoIcon = ({ onEnter, onLeave }) => (
  <button
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    className="
      group                                  {/* ← needed for group-hover */}
      absolute top-20 right-8 z-10
      p-1
      flex items-center justify-center
      h-8 w-8 rounded-full
      backdrop-blur-md bg-white/30
      text-white/90 hover:text-white
      focus:outline-none
    "
    title="Show description"
  >
    {/* pulsating ring */}
    <span
      className="
        absolute inset-0 rounded-full
        bg-white/100 opacity-0
        group-hover:opacity-100           {/* appears only on hover */}
        animate-pulse-slow               {/* slow glow */}
        pointer-events-none
      "
    />
    <span className="text-base font-semibold relative">i</span>
  </button>
);



export default function HeroSection({ onScrollTo }) {
  /* ─ state ─ */
  const [apod,    setApod]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  /* ─ fetch APOD on mount ─ */
  useEffect(() => {
    api.get("/apod")
       .then(r => setApod(r.data))
       .catch(() => setError(true))
       .finally(() => setLoading(false));
  }, []);

  /* ─ early states ─ */
  if (loading) return <Spinner className="mx-auto my-20" />;
  if (error)   return <ErrorBanner msg="APOD unavailable" />;

  /* ─ main render ─ */
  return (
    <section className="relative w-full h-screen text-white">
      {/* background image */}
      <img
        src={apod.url}
        alt={apod.title}
        className="object-cover w-full h-full"
      />

      {/* overlay container */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        {/* title (visible by default, hidden on hover) */}
        {!showInfo && (
          <h1
            className="
              text-4xl md:text-6xl font-bold text-center
              drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]
            "
          >
            {apod.title}
          </h1>
        )}

        {/* description (shown on icon hover) */}
        
        {showInfo && (
          
          <div
            className="
              max-w-3xl text-sm md:text-base leading-relaxed text-center
              drop-shadow-[0_1px_4px_rgba(0,0,0,1)]
            "
          >
            {apod.explanation}
          </div>
        )}
      </div>

      {/* info icon */}
      
      <InfoIcon

        onEnter={() => setShowInfo(true)}
        onLeave={() => setShowInfo(false)}
      />

      {/* optional CTA to next section */}
      {onScrollTo && (
        <button
          onClick={() => onScrollTo("neo")}
          className="
            absolute bottom-8 left-1/2 -translate-x-1/2
            text-sm px-4 py-2 rounded
            bg-white/20 hover:bg-white/30 backdrop-blur-md
          "
        >
          Explore ↓
        </button>
      )}
    </section>
  );
}
