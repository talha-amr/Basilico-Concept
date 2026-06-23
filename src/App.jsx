import { ReactLenis } from 'lenis/react';
import Navbar from './Navbar';
import HeroSection from './components/HeroSection';
import CinematicScroll from './components/CinematicScroll';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import './index.css';

function App() {
  return (
    <ReactLenis root>
      {/* Outer wrapper — hero is sticky inside this scroll container */}
      <div style={{ position: 'relative' }}>
        <Navbar />
        <HeroSection />

        {/* CinematicScroll has the card-panel class built in — slides over the hero */}
        <CinematicScroll />
        
        {/* Editoral storytelling section to pace the experience */}
        <AboutSection />
        
        {/* Awwwards-level Gallery Section */}
        <GallerySection />
      </div>
    </ReactLenis>
  );
}

export default App;
