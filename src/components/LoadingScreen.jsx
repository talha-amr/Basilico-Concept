import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ progress, isLoaded, onExitComplete }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const barTrackRef = useRef(null);
  const barFillRef = useRef(null);
  const percentRef = useRef(null);
  const taglineRef = useRef(null);
  const ornamentLeftRef = useRef(null);
  const ornamentRightRef = useRef(null);
  const centerRef = useRef(null);
  const curtainTopRef = useRef(null);
  const curtainBottomRef = useRef(null);
  const [displayPercent, setDisplayPercent] = useState(0);
  const hasExited = useRef(false);

  // Intro animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(logoRef.current,
      { y: 30, opacity: 0, letterSpacing: '0.2em' },
      { y: 0, opacity: 1, letterSpacing: '0.6em', duration: 1.4, ease: 'power3.out' }
    )
    .fromTo([ornamentLeftRef.current, ornamentRightRef.current],
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.5, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
      '-=0.6'
    )
    .fromTo(taglineRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 0.6, duration: 1, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(barTrackRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(percentRef.current,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.5 },
      '-=0.3'
    );
  }, []);

  // Animate progress bar fill
  useEffect(() => {
    if (barFillRef.current) {
      gsap.to(barFillRef.current, {
        scaleX: progress / 100,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    // Animate percentage counter
    gsap.to({ val: displayPercent }, {
      val: Math.round(progress),
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: function () {
        setDisplayPercent(Math.round(this.targets()[0].val));
      }
    });
  }, [progress]);

  // Exit animation when loaded
  useEffect(() => {
    if (!isLoaded || hasExited.current) return;
    hasExited.current = true;

    const exitTl = gsap.timeline({
      onComplete: () => onExitComplete?.(),
    });

    exitTl
      .to([percentRef.current, barTrackRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
      })
      .to(taglineRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
      }, '-=0.15')
      .to([ornamentLeftRef.current, ornamentRightRef.current], {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.15')
      .to(logoRef.current, {
        scale: 1.15,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.6,
        ease: 'power3.in',
      }, '-=0.1')
      // Hide center content entirely before curtains open
      .set(centerRef.current, { display: 'none' })
      // Cinematic curtain split — starts only after content is gone
      .to(curtainTopRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
      })
      .to(curtainBottomRef.current, {
        yPercent: 100,
        duration: 1,
        ease: 'power4.inOut',
      }, '<')
      // Final cleanup
      .set(containerRef.current, { pointerEvents: 'none' })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
  }, [isLoaded, onExitComplete]);

  // ── All styles inline to avoid Tailwind v4 conflicts ──

  const screenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const curtainBase = {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '50.1%',
    background: '#050806',
    zIndex: 2,
    willChange: 'transform',
  };

  const grainStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
    opacity: 0.04,
  };

  const centerStyle = {
    position: 'relative',
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  };

  const logoStyle = {
    fontFamily: "'Cinzel', serif",
    fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
    fontWeight: 400,
    letterSpacing: '0.6em',
    color: '#EDEDED',
    textTransform: 'uppercase',
    marginBottom: '0.6rem',
    textIndent: '0.6em',
    opacity: 0,
  };

  const ornamentStyle = {
    width: '80px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c4a47c, transparent)',
    marginBottom: '1rem',
    transformOrigin: 'center',
  };

  const taglineStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
    fontWeight: 300,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#EDEDED',
    marginBottom: '2.5rem',
    opacity: 0,
  };

  const barWrapperStyle = {
    width: 'clamp(180px, 22vw, 280px)',
    marginBottom: '1.2rem',
  };

  const barTrackStyle = {
    width: '100%',
    height: '1px',
    background: 'rgba(237, 237, 237, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    transformOrigin: 'center',
    opacity: 0,
  };

  const barFillStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #c4a47c, #dfc9a7)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    willChange: 'transform',
  };

  const percentStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 300,
    letterSpacing: '0.25em',
    color: '#c4a47c',
    fontVariantNumeric: 'tabular-nums',
    opacity: 0,
  };

  return (
    <div ref={containerRef} style={screenStyle}>
      {/* Top curtain */}
      <div ref={curtainTopRef} style={{ ...curtainBase, top: 0 }} />
      {/* Bottom curtain */}
      <div ref={curtainBottomRef} style={{ ...curtainBase, bottom: 0, top: 'auto' }} />

      {/* Grain texture */}
      <div style={grainStyle} aria-hidden="true" />

      {/* Center content */}
      <div ref={centerRef} style={centerStyle}>
        <div ref={ornamentLeftRef} style={ornamentStyle} />

        <div ref={logoRef} style={logoStyle}>
          BASILICO
        </div>

        <div ref={ornamentRightRef} style={ornamentStyle} />

        <p ref={taglineRef} style={taglineStyle}>
          The Art of Italian Cuisine
        </p>

        <div style={barWrapperStyle}>
          <div ref={barTrackRef} style={barTrackStyle}>
            <div ref={barFillRef} style={barFillStyle} />
          </div>
        </div>

        <span ref={percentRef} style={percentStyle}>
          {displayPercent}%
        </span>
      </div>
    </div>
  );
}
