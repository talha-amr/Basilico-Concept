import { useState, useCallback } from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CinematicScroll from './components/CinematicScroll';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingProgress = useCallback((progress) => {
    setLoadingProgress(progress);
  }, []);

  const handleHeroLoaded = useCallback(() => {
    setHeroLoaded(true);
  }, []);

  const handleLoadingExitComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <>
      {showLoading && (
        <LoadingScreen
          progress={loadingProgress}
          isLoaded={heroLoaded}
          onExitComplete={handleLoadingExitComplete}
        />
      )}
      <ReactLenis root>
        {/* Outer wrapper — hero is sticky inside this scroll container */}
        <div style={{ position: 'relative' }}>
          <Navbar />
          <HeroSection
            onLoadingProgress={handleLoadingProgress}
            onLoaded={handleHeroLoaded}
          />

          {/* CinematicScroll has the card-panel class built in — slides over the hero */}
          <CinematicScroll />
          
          {/* Editoral storytelling section to pace the experience */}
          <AboutSection />
          
          {/* Awwwards-level Gallery Section */}
          <GallerySection />
          
          {/* Site Footer */}
          <Footer />
        </div>
      </ReactLenis>
    </>
  );
}

export default App;
