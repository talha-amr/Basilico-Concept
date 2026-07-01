import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import logo from '../assets/logo.png';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  // Keep ref in sync with state for ScrollTrigger
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useGSAP(() => {
    // 1. Initial Load Animation — delayed to start after loading screen exits
    gsap.fromTo(navRef.current, 
      { yPercent: -100, opacity: 0 }, 
      { yPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 2.5 }
    );
    
    // Stagger links
    if (linksRef.current.length > 0) {
      gsap.fromTo(linksRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 2.8 }
      );
    }

    // 2. Hide when scrolling away from Top, Show when at Top
    ScrollTrigger.create({
      start: 'top -120', // Trigger when user scrolls 120px down from the absolute document top
      onEnter: () => {
        // Prevent hiding navbar if mobile menu is open
        if (!isOpenRef.current) {
          gsap.to(navRef.current, { 
            yPercent: -120, // Slide up fully out of view
            opacity: 0, 
            duration: 0.6, 
            ease: 'power3.inOut',
            overwrite: 'auto' // Prevents conflict with initial intro animation if user scrolls early
          });
        }
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, { 
          yPercent: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power3.out',
          overwrite: 'auto' 
        });
      }
    });
  }, { scope: navRef }); // Removed dependencies: [isOpen] to avoid re-triggering initial load delay

  useEffect(() => {
    if (isOpen) {
      gsap.to(mobileMenuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        pointerEvents: 'auto',
        overwrite: 'auto'
      });
      gsap.fromTo(mobileLinksRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15, overwrite: 'auto' }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        y: '-100%',
        opacity: 0,
        duration: 0.7,
        ease: 'power3.inOut',
        pointerEvents: 'none',
        overwrite: 'auto'
      });
    }
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    'Home', 'Menu', 'Gallery', 'About Us', 'Catering', 'Loyalty Card', 'Contact'
  ];

  return (
    <nav ref={navRef} className="navbar">
      <div className="container navbar-container">
        <a href="/" className="navbar-brand">
          <img src={logo} alt="Basilico By Sara" className="navbar-logo" />
        </a>
        <div className="navbar-links">
          {navLinks.map((link, index) => (
            <a 
              key={index} 
              href={`#${link.toLowerCase().replace(' ', '-')}`} 
              className="nav-link font-serif"
              ref={el => linksRef.current[index] = el}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      <div className="mobile-menu" ref={mobileMenuRef}>
        <div className="mobile-menu-links">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="mobile-nav-link font-serif"
              ref={el => mobileLinksRef.current[index] = el}
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
