import { useRef } from "react";
import HeroSection  from "../components/HeroSection";
import NeoTracker   from "./NeoTracker";
import EpicCarousel from "./EpicCarousel";
import MarsGallery  from "./MarsGallery";



/**
 * Home — landing page that stitches all three feature sections
 * together and lets <HeroSection/> scroll smoothly to each.
 */
export default function Home() {
  /* refs point to section roots */
  const neoRef  = useRef(null);
  const epicRef = useRef(null);
  const marsRef = useRef(null);

  /* callback passed to HeroSection buttons/links */
  const scrollToSection = section => {
    if (section === 'neo')  neoRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'epic') epicRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'mars') marsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="w-full scroll-smooth">
      {/* Hero (APOD) */}
      <HeroSection onScrollTo={scrollToSection} />

      {/* NEO Tracker */}
      <section ref={neoRef} id="neo">
        <NeoTracker />
      </section>

      {/* EPIC Carousel */}
      <section ref={epicRef} id="epic">
        <EpicCarousel />
      </section>

      {/* Mars Rover Gallery */}
      <section ref={marsRef} id="mars">
        <MarsGallery />
      </section>
    </main>
  );
}
