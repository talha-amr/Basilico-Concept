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
      const track = trackRef.current;
      const bgs   = bgRefs.current;

      // Pre-compute scroll distance once — avoids recalculating in every scrub callback
      const scrollDist = (slides.length - 1) * window.innerWidth;

      /* ── Main horizontal scroll: pin + drive xPercent ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.6,
          start: "top top",
          end: `+=${scrollDist}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Refresh recomputes scrollDist when viewport resizes
          onRefresh: (self) => {
            const newDist = (slides.length - 1) * window.innerWidth;
            self.end = self.start + newDist;
          },
        },
      });

      /* Move track left so all 4 slides are visible in sequence */
      tl.to(track, {
        xPercent: -((slides.length - 1) * 25), // -75% for 4 slides
        ease: "none",
      });

      /* ── SINGLE shared bg-zoom tween for ALL bgs ──
         Previously: 4 separate ScrollTrigger instances = 4 scroll listeners.
         Now: one gsap.to([all bgs]) = 1 listener for identical animation. */
      const validBgs = bgs.filter(Boolean);
      if (validBgs.length > 0) {
        gsap.fromTo(
          validBgs,
          { scale: 1.0 },
          {
            scale: 1.08,          // reduced from 1.1 → less GPU texture memory
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
    },
    { scope: containerRef }
  );

  return (
    /* card-panel: slides over the hero */
    <div
      className="card-panel"
      style={{ background: "#050806", width: "100%", position: "relative", zIndex: 10 }}
    >
      {/* Pinned viewport — GSAP pins this element */}
      <div
        ref={containerRef}
        style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
      >
        {/* Film grain overlay — pointer-events:none, no mixBlendMode to avoid
            forcing a compositing stencil on every scroll frame */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            opacity: 0.035,
            // Removed mixBlendMode: 'overlay' — it forces a full composite stencil
            // on every scroll frame, wasting GPU bandwidth
          }}
        />

        {/* Horizontal track — 400vw wide flex row */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: `${slides.length * 100}vw`,
            height: "100vh",
            willChange: "transform",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                flexShrink: 0,
                overflow: "hidden",
                // contain: strict tells the browser this slide is paint-isolated.
                // Slides that are off-screen skip layout, style, and paint entirely.
                contain: "strict",
              }}
            >
              {/* Full-screen background image — using <img> instead of background-image
                  so the browser can more efficiently promote to GPU layer.
                  Slide 0 is eager + high priority (above fold), rest are lazy. */}
              <img
                ref={(el) => (bgRefs.current[i] = el)}
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={i === 0 ? "high" : "low"}
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

              {/* Gradient: left-heavy for text, bottom for depth */}
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

              {/* Text content — bottom-left */}
              <div
                style={{
                  position: "absolute",
                  bottom: "11vh",
                  left: "7vw",
                  zIndex: 3,
                  maxWidth: "500px",
                }}
              >
                {/* Micro-label */}
                <span
                  style={{
                    display: "block",
                    fontSize: "0.6rem",
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    color: "#c4a47c",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    marginBottom: "0.85rem",
                    opacity: 0.85,
                  }}
                >
                  {slide.microlabel}
                </span>

                {/* Gold divider */}
                <div
                  style={{
                    width: "2rem",
                    height: "1px",
                    background: "#c4a47c",
                    marginBottom: "1rem",
                    opacity: 0.6,
                  }}
                />

                {/* Heading */}
                <h2
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(2rem, 3.8vw, 3.8rem)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    letterSpacing: "0.04em",
                    color: "#EDEDED",
                    marginBottom: "1rem",
                    textShadow: "0 4px 30px rgba(5,8,6,0.7)",
                  }}
                >
                  {slide.heading}
                </h2>

                {/* Subheading */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.82rem, 1.05vw, 0.98rem)",
                    fontWeight: 300,
                    lineHeight: 1.8,
                    letterSpacing: "0.03em",
                    color: "rgba(237,237,237,0.65)",
                  }}
                >
                  {slide.subheading}
                </p>
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
