import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import logo from './assets/logo.png';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);

  useGSAP(() => {
    // 1. Initial Load Animation
    gsap.fromTo(navRef.current, 
      { yPercent: -100, opacity: 0 }, 
      { yPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 1.8 }
    );
    
    // Stagger links
    if (linksRef.current.length > 0) {
      gsap.fromTo(linksRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 2 }
      );
    }

    // 2. Hide when scrolling away from Top, Show when at Top
    ScrollTrigger.create({
      start: 'top -120', // Trigger when user scrolls 120px down from the absolute document top
      onEnter: () => {
        gsap.to(navRef.current, { 
          yPercent: -120, // Slide up fully out of view
          opacity: 0, 
          duration: 0.6, 
          ease: 'power3.inOut',
          overwrite: 'auto' // Prevents conflict with initial intro animation if user scrolls early
        });
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
  }, { scope: navRef });

  const navLinks = [
    'Home', 'Menu', 'Gallery', 'About Us', 'Catering', 'Loyalty Card', 'Contact'
  ];

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar-container">
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
      </div>
    </nav>
  );
};

export default Navbar;
