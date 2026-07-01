import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import img1 from '../assets/gal-1.jpg';
import img2 from '../assets/gal-2.jpg';
import img3 from '../assets/bas-3.jpeg';
import img4 from '../assets/gal-4.jpeg';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const [btnHover, setBtnHover] = useState(false);

  useGSAP(() => {
    // Reveal animation for gallery images
    const wrappers = gsap.utils.toArray('.gallery-wrapper');

    wrappers.forEach((wrapper) => {
      // Clip-reveal: animate from clip + y, avoid opacity which re-triggers compositing
      gsap.fromTo(wrapper,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 88%',
            // once-forward play only: avoids expensive reverse repaints on scroll up
            toggleActions: 'play none none none',
          }
        }
      );

      // Parallax on each image — scrub: 1.5 smooths per-frame jank
      const img = wrapper.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.08, yPercent: -5 },   // reduced from 1.15 → less GPU layer memory
          {
            scale: 1.02,
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,               // number (not true) → interpolated buffer, not every-frame
            }
          }
        );
      }
    });

    // Header fade up
    gsap.fromTo('.gallery-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-header',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Orb float — deferred to rAF so they don't block initial paint
    requestAnimationFrame(() => {
      gsap.to('.gallery-orb-1', {
        yPercent: -15,
        xPercent: 5,
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('.gallery-orb-2', {
        yPercent: 12,
        xPercent: -7,
        duration: 11,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });
      gsap.to('.gallery-orb-3', {
        yPercent: -8,
        xPercent: 4,
        duration: 13,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 3,
      });
    });

    // CTA button reveal
    gsap.fromTo('.gallery-cta',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-cta',
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="gallery-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#060907',
        padding: '16vh 0',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      <style>{`
        .gallery-row {
          display: flex;
          gap: 4vw;
          align-items: center;
        }
        .gallery-row-bottom {
          display: flex;
          gap: 6vw;
          align-items: flex-start;
          margin-top: -10vh;
        }
        .gallery-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75vw;
          padding: 1.1vw 3.2vw;
          font-size: 0.75vw;
          text-transform: uppercase;
          letter-spacing: 0.25vw;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          cursor: pointer;
          border: 0.1vw solid rgba(14, 32, 21, 0.9);
          background: rgba(14, 32, 21, 0.55);
          color: #EDEDED;
          border-radius: 0.1vw;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          box-shadow: 0 0 2vw rgba(14, 32, 21, 0.4), inset 0 0 1.5vw rgba(14, 32, 21, 0.2);
        }
        .gallery-view-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(14, 32, 21, 0.9) 0%, rgba(6, 20, 12, 0.95) 100%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .gallery-view-btn:hover::before {
          opacity: 1;
        }
        .btn-text, .btn-arrow {
          position: relative;
          z-index: 2;
        }
        .btn-arrow svg {
          width: 1vw;
          height: 1vw;
          transition: transform 0.4s ease;
        }
        .gallery-view-btn:hover .btn-arrow svg {
          transform: translateX(0.3vw);
        }
        @media (max-width: 768px) {
          .gallery-row { flex-direction: column; gap: 4vh; }
          .gallery-row-bottom { flex-direction: column; gap: 4vh; margin-top: 4vh !important; }
          .gallery-img-1 { flex: 0 0 100% !important; width: 100%; aspect-ratio: 4/3 !important; }
          .gallery-img-2 { flex: 0 0 100% !important; width: 100%; margin-top: 0 !important; }
          .gallery-img-3 { flex: 0 0 100% !important; width: 100%; margin-left: 0 !important; aspect-ratio: 4/3 !important; }
          .gallery-img-4 { flex: 0 0 100% !important; width: 100%; margin-top: 0 !important; margin-right: 0 !important; }
          .gallery-section { padding: 10vh 6vw !important; }
          .gallery-view-btn {
            gap: 0.75rem;
            padding: 1.1rem 3.2rem;
            font-size: 0.78rem;
            letter-spacing: 0.25rem;
            border-width: 1px;
            border-radius: 1px;
            box-shadow: 0 0 30px rgba(14, 32, 21, 0.4), inset 0 0 20px rgba(14, 32, 21, 0.2);
          }
          .btn-arrow svg {
            width: 1rem;
            height: 1rem;
          }
          .gallery-view-btn:hover .btn-arrow svg {
            transform: translateX(0.3rem);
          }
        }
      `}</style>

      {/* ── Ambient Green Background Orbs ── */}
      {/* Top-left large orb */}
      <div
        className="gallery-orb-1"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-12%',
          width: '55vw',
          height: '55vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 32, 21, 0.7) 0%, rgba(10, 24, 15, 0.35) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          // No filter: blur — avoids expensive compositing layer on large element
        }}
      />
      {/* Bottom-right orb */}
      <div
        className="gallery-orb-2"
        style={{
          position: 'absolute',
          bottom: '-8%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 32, 21, 0.6) 0%, rgba(8, 18, 12, 0.3) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Center subtle mid-green glow */}
      <div
        className="gallery-orb-3"
        style={{
          position: 'absolute',
          top: '35%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          maxWidth: '500px',
          maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 32, 21, 0.35) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Top edge subtle green line hint */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(14, 32, 21, 0.8) 30%, rgba(20, 50, 30, 0.6) 50%, rgba(14, 32, 21, 0.8) 70%, transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div
          className="gallery-header"
          style={{ marginBottom: '14vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <span className="gallery-label">
            A Feast for the Eyes
          </span>
          <div className="gallery-divider" />
          <h2 className="gallery-heading" style={{ color: '#EDEDED', textShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            The Culinary Canvas
          </h2>
        </div>

        {/* Gallery Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5vh' }}>

          {/* Top Row */}
          <div className="gallery-row">
            <div
              className="gallery-wrapper gallery-img-1"
              style={{
                flex: '0 0 65%',
                aspectRatio: '16/10',
                overflow: 'hidden',
                borderRadius: '2px',
                position: 'relative',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              }}
            >
              <img src={img1} alt="Signature Dish" loading="lazy" decoding="async" style={{ width: '100%', height: '120%', objectFit: 'cover', position: 'absolute', top: '-10%', left: 0, willChange: 'transform' }} />
              {/* Green tint overlay on image */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,10,0.45) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />
            </div>

            <div
              className="gallery-wrapper gallery-img-2"
              style={{
                flex: '1',
                aspectRatio: '3/4',
                overflow: 'hidden',
                borderRadius: '2px',
                marginTop: '15vh',
                position: 'relative',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              }}
            >
              <img src={img2} alt="Atmosphere" loading="lazy" decoding="async" style={{ width: '100%', height: '120%', objectFit: 'cover', position: 'absolute', top: '-10%', left: 0, willChange: 'transform' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,10,0.45) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="gallery-row-bottom">
            <div
              className="gallery-wrapper gallery-img-3"
              style={{
                flex: '0 0 35%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: '2px',
                marginLeft: '5%',
                position: 'relative',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              }}
            >
              <img src={img3} alt="Ingredients" loading="lazy" decoding="async" style={{ width: '100%', height: '120%', objectFit: 'cover', position: 'absolute', top: '-10%', left: 0, willChange: 'transform' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,10,0.45) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />
            </div>

            <div
              className="gallery-wrapper gallery-img-4"
              style={{
                flex: '1',
                marginRight: '2%',
                marginTop: '25vh',
                aspectRatio: '16/9',
                overflow: 'hidden',
                borderRadius: '2px',
                position: 'relative',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              }}
            >
              <img src={img4} alt="Plating" loading="lazy" decoding="async" style={{ width: '100%', height: '120%', objectFit: 'cover', position: 'absolute', top: '-10%', left: 0, willChange: 'transform' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,10,0.45) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />
            </div>
          </div>

        </div>

        {/* ── View Gallery CTA ── */}
        <div
          className="gallery-cta"
          style={{ display: 'flex', justifyContent: 'center', marginTop: '12vh' }}
        >
          <a
            href="#gallery"
            className="gallery-view-btn"
          >
            <span className="btn-text">View Full Gallery</span>
            <span className="btn-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
