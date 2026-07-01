import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import pizzaImg   from "../assets/nepo-pizza.jpg";
import pastaImg   from "../assets/pasta.jpeg";
import chefImg    from "../assets/chef-spec.jpeg";
import dessertImg from "../assets/desert.jpeg";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: "pizza",
    image: pizzaImg,
    microlabel: "Signature",
    heading: "Neapolitan Pizza",
    subheading: "Born in Naples, perfected in our oven.",
  },
  {
    id: "pasta",
    image: pastaImg,
    microlabel: "Crafted",
    heading: "Handmade Pasta",
    subheading: "A thousand-year tradition, pulled fresh each morning.",
  },
  {
    id: "chef",
    image: chefImg,
    microlabel: "Curated",
    heading: "Chef Specials",
    subheading: "Seasonal artistry, composed with intention.",
  },
  {
    id: "dessert",
    image: dessertImg,
    microlabel: "Indulgent",
    heading: "House Desserts",
    subheading: "The sweetest punctuation to a perfect evening.",
  },
];

export default function CinematicScroll() {
  const containerRef = useRef(null);
  const trackRef     = useRef(null);
  const bgRefs       = useRef([]);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // --- DESKTOP (Horizontal Scroll) ---
      mm.add("(min-width: 769px)", () => {
        const track = trackRef.current;
        const bgs   = bgRefs.current;
        const scrollDist = (slides.length - 1) * window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1.6,
            start: "top top",
            end: `+=${scrollDist}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: (self) => {
              const newDist = (slides.length - 1) * window.innerWidth;
              self.end = self.start + newDist;
            },
          },
        });

        tl.to(track, {
          xPercent: -((slides.length - 1) * 25), // -75% for 4 slides
          ease: "none",
        });

        const validBgs = bgs.filter(Boolean);
        if (validBgs.length > 0) {
          gsap.fromTo(
            validBgs,
            { scale: 1.0 },
            {
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${scrollDist}`,
                scrub: 2.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // --- MOBILE (Vertical Parallax Fade) ---
      mm.add("(max-width: 768px)", () => {
        const bgs = bgRefs.current;
        const textContainers = gsap.utils.toArray('.cinematic-text-content');

        bgs.forEach((bg) => {
          if (!bg) return;
          // Simple parallax for each image
          gsap.fromTo(bg,
            { scale: 1.0, yPercent: 0 },
            {
              scale: 1.15,
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: bg.closest('.cinematic-slide'),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        });

        textContainers.forEach((text) => {
          gsap.fromTo(text, 
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: text.closest('.cinematic-slide'),
                start: "top 75%", // Trigger when slide hits 75% of viewport height
                toggleActions: "play none none reverse",
              }
            }
          );
        });
      });

    },
    { scope: containerRef }
  );

  return (
    /* card-panel: slides over the hero */
    <div
      className="card-panel"
      style={{ background: "#050806", width: "100%", position: "relative", zIndex: 10 }}
    >
      {/* Pinned viewport — GSAP pins this element on desktop */}
      <div
        ref={containerRef}
        className="cinematic-container"
      >
        {/* Film grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div
            className="cinematic-grain"
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
              opacity: 0.035,
            }}
          />
        </div>

        {/* Horizontal track on desktop, vertical on mobile */}
        <div
          ref={trackRef}
          className="cinematic-track"
          style={{ width: `${slides.length * 100}vw` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="cinematic-slide"
            >
              {/* Full-screen background image */}
              <img
                ref={(el) => (bgRefs.current[i] = el)}
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={i === 0 ? "high" : "low"}
                className="cinematic-bg-img"
                style={{
                  position: "absolute",
                  top: "-8%",
                  left: 0,
                  width: "100%",
                  height: "116%",   // 8% overshoot on each side for scale room
                  objectFit: "cover",
                  objectPosition: "center",
                  willChange: "transform",
                  transformOrigin: "center center",
                  display: "block",
                }}
              />

              {/* Gradient */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(5,8,6,0.90) 0%, rgba(5,8,6,0.50) 45%, rgba(5,8,6,0.08) 100%), " +
                    "linear-gradient(to top, rgba(5,8,6,0.80) 0%, transparent 50%)",
                  zIndex: 2,
                }}
              />

              {/* Text content wrapper */}
              <div className="container" style={{ position: 'absolute', bottom: '11vh', left: 0, right: 0, pointerEvents: 'none' }}>
                <div className="cinematic-text-content" style={{ pointerEvents: 'auto', position: 'relative', bottom: 'auto' }}>
                  {/* Micro-label */}
                  <span className="cinematic-label">
                    {slide.microlabel}
                  </span>

                  {/* Gold divider */}
                  <div className="cinematic-divider" />

                  {/* Heading */}
                  <h2 className="cinematic-heading">
                    {slide.heading}
                  </h2>

                  {/* Subheading */}
                  <p className="cinematic-subheading">
                    {slide.subheading}
                  </p>
                </div>
              </div>

              {/* Slide counter — bottom right */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "5vh",
                  right: "5vw",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    color: "#c4a47c",
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "1.6rem",
                    height: "1px",
                    background: "rgba(196,164,124,0.3)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    color: "rgba(237,237,237,0.22)",
                  }}
                >
                  0{slides.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
