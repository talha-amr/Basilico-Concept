import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import pastaFallback from '../assets/pasta.jpeg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function HeroSection({ onLoadingProgress, onLoaded }) {
  const container = useRef(null);
  const textureRef = useRef(null);
  const visualRef = useRef(null);
  const overlayRef = useRef(null);

  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const btn1Ref = useRef(null);
  const btn2Ref = useRef(null);
  const contentRef = useRef(null);

  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const transitionRef = useRef({ isTransitioning: false, progress: 0 });

  // Preload Image Sequence (120 frames)
  useEffect(() => {
    const totalFrames = 120;
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${frameNum}.webp`;

      img.onload = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / totalFrames) * 100);
        onLoadingProgress?.(percent);
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
          onLoaded?.();
        }
      };
      img.onerror = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / totalFrames) * 100);
        onLoadingProgress?.(percent);
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
          onLoaded?.();
        }
      };
      imagesRef.current.push(img);
    }
  }, []);

  // Canvas Drawing Loop (delta-time driven, constant speed, crossfade loopback)
  useEffect(() => {
    if (!imagesLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const validImages = imagesRef.current.filter(img => img && img.complete && img.naturalWidth > 0);
    if (validImages.length === 0) return;

    let lastTime = null;
    const cinematicFPS = 16;
    const crossfadeDurationMs = 1500;

    let playDirection = 1;

    const render = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const baseImg = validImages[0];

      // Lock dimensions to base frame to prevent jitter
      const scale = Math.max(canvas.width / baseImg.width, canvas.height / baseImg.height);
      const x = (canvas.width / 2) - (baseImg.width / 2) * scale;
      const y = (canvas.height / 2) - (baseImg.height / 2) * scale;
      const drawWidth = baseImg.width * scale;
      const drawHeight = baseImg.height * scale;

      // Ping-pong frame advance seamlessly
      const frameAdvance = (deltaTime * cinematicFPS) / 1000 * playDirection;
      frameRef.current += frameAdvance;

      if (frameRef.current >= validImages.length - 1) {
        frameRef.current = validImages.length - 1;
        playDirection = -1;
      } else if (frameRef.current <= 0) {
        frameRef.current = 0;
        playDirection = 1;
      }

      const currentFrameIndex = Math.floor(frameRef.current);
      const img = validImages[currentFrameIndex] || baseImg;

      ctx.globalAlpha = 1;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const reqId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
    };
  }, [imagesLoaded]);

  useGSAP(() => {
    // Extracted continuous slow zoom to run perfectly independently without sudden speed changes
    gsap.fromTo(visualRef.current, 
      { scale: 1.0 }, 
      { scale: 1.05, duration: 25, ease: 'sine.inOut', yoyo: true, repeat: -1 }
    );

    const tl = gsap.timeline();

    tl.set(visualRef.current, { opacity: 0, filter: 'blur(8px)' })
      .set(textureRef.current, { opacity: 0 })
      .set(headingRef.current, { y: 30, opacity: 0 })
      .set(subtextRef.current, { y: 20, opacity: 0 })
      .set([btn1Ref.current, btn2Ref.current], { y: 20, opacity: 0 });

    tl.to(textureRef.current, { opacity: 0.15, duration: 3, ease: 'power2.inOut' }, 0.2)
      .to(visualRef.current, { opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' }, 0.5)
      .to(headingRef.current, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.5)
      .to(subtextRef.current, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.7)
      .to([btn1Ref.current, btn2Ref.current], { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out' }, 1.9);

    // Scroll parallax
    gsap.to(container.current, {
      scale: 1.05,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(contentRef.current, {
      y: -80,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <main ref={container} className="hero-container">
      {/* Layer 1: Gradient Base */}
      <div className="hero-gradient"></div>

      {/* Layer 2: Texture Layer */}
      <div ref={textureRef} className="hero-texture" style={{ opacity: 0 }}></div>

      {/* Layer 3: Pasta Visual (Canvas Sequence) */}
      <div ref={visualRef} className="hero-visual" style={{ opacity: 0, filter: 'blur(8px)' }}>
        {imagesLoaded ? (
          <canvas ref={canvasRef}></canvas>
        ) : (
          <img src={pastaFallback} alt="Cinematic Pasta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Layer 4: Dark Overlay */}
      <div ref={overlayRef} className="hero-overlay"></div>

      {/* Centered Content */}
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div ref={contentRef} className="hero-content">
          <div className="hero-logo font-serif">BASILICO</div>
          <h1 ref={headingRef} className="hero-heading" style={{ opacity: 0 }}>Crafted with Elegance.</h1>
          <p ref={subtextRef} className="hero-subtext" style={{ opacity: 0 }}>
            A journey into profound taste and atmosphere. Discover the essence of Italian culinary tradition.
          </p>
          <div className="hero-actions">
            <a ref={btn1Ref} href="#" className="btn btn-primary font-serif" style={{ opacity: 0 }}>Book a Table</a>
            <a ref={btn2Ref} href="#" className="btn btn-secondary font-serif" style={{ opacity: 0 }}>Discover Menu</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HeroSection;
