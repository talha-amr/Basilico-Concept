import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Using only ONE image
import mainImage from '../assets/bas-2.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    // 1. Slow, elegant reveal timeline for content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 65%', // Start animating when section is 35% into the viewport
        toggleActions: 'play none none reverse',
      },
    });

    // Animate text elements
    tl.fromTo(
      textContainerRef.current.children,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.4, stagger: 0.15, ease: 'power3.out' }
    );

    // Image reveal (opacity rising, scale settling to 1)
    tl.fromTo(
      imageWrapperRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      '-=1.2'
    );

    // 2. Image parallax (subtle vertical shift during scroll down)
    gsap.fromTo(
      imageRef.current,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        zIndex: 20,
        backgroundColor: '#060907', // Very subtle dark tone variation
        padding: '6vh', // GUARANTEED padding explicitly in styles, independent of Tailwind
      }}
    >
      {/* Maximum breathing room horizontally */}
      <div 
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          width: '100%'
        }}
      >
        
        {/* Asymmetrical flex layout guaranteed by inline styles */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '4rem',
            width: '100%'
          }}
        >
          
          {/* ----- LEFT: TEXT CONTENT ----- */}
          <div
            ref={textContainerRef}
            style={{
              width: '100%',
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 40%',
            }}
          >
            {/* Label */}
            <span
              style={{
                display: 'block',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
                color: '#c4a47c',
                letterSpacing: '0.45em',
                fontSize: '0.75rem',
                marginBottom: '2.5rem'
              }}
            >
              Our Story
            </span>

            {/* Micro divider */}
            <div
              style={{ 
                width: '3rem', 
                height: '1px', 
                backgroundColor: 'rgba(196, 164, 124, 0.4)',
                marginBottom: '2.5rem'
              }}
            />

            {/* Heading */}
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#EDEDED',
                fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                lineHeight: 1.1,
                marginBottom: '3rem',
                fontWeight: 400
              }}
            >
              Fine Dining,<br />Redefined
            </h2>

            {/* Paragraph */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                color: 'rgba(237, 237, 237, 0.75)',
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                lineHeight: 2.1,
                marginBottom: '3.5rem'
              }}
            >
              “Born from Sara’s culinary journey through Italy, Basilico is more than a restaurant — it’s a love story told through food. Each dish carries echoes of cobblestone streets, Tuscan kitchens, and the warmth of Italian hospitality. Trained at ICIF, Sara brings authentic European flavours to Lahore, blending tradition with her own creative soul.”
            </p>

            {/* Optional Small Quote */}
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(196, 164, 124, 0.9)',
                fontSize: 'clamp(1.1rem, 1.3vw, 1.25rem)',
                lineHeight: 1.6
              }}
            >
              “Cooking is memory, emotion, and craft — plated with intention.”
            </p>
          </div>

          {/* ----- RIGHT: IMAGE CONTENT ----- */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              flex: '1 1 45%', // Takes up the remaining right space
              marginTop: '8vh', // Offset vertically for editorial look
            }}
          >
            
            {/* Outline decorative box (perfectly aligned with image) */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                border: '1px solid rgba(196,164,124,0.25)',
                zIndex: 20,
                pointerEvents: 'none'
              }}
            />

            {/* Main Image Container — strictly 5/4 aspect ratio */}
            <div
              ref={imageWrapperRef}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                overflow: 'hidden',
                borderRadius: '2px',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
                aspectRatio: '5/4'
              }}
            >
              {/* Image itself scales slightly out of bounds for parallax */}
              <img
                ref={imageRef}
                src={mainImage}
                alt="Basilico Culinary Journey"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '115%', // Exceeds height by 15% for parallax range
                  top: '-7.5%',
                  objectFit: 'cover',
                  willChange: 'transform'
                }}
              />

              {/* Very subtle inner gradient to blend edge with bg */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(6, 9, 7, 0.6) 0%, transparent 35%)'
                }}
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
