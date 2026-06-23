import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps any children in a section card that slides up from below
 * when it enters the viewport — premium glide-in animation.
 */
const SlideUpCard = ({ children, className = '', style = {} }) => {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial state immediately so there's no flash of content
    gsap.set(el, { y: 100, opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
        });
      },
    });
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform, opacity', ...style }}
    >
      {children}
    </div>
  );
};

export default SlideUpCard;
