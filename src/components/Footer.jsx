import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo font-serif">BASILICO</h2>
            <p className="footer-tagline">
              The Art of Pasta, Redefined. <br />
              Experience authentic Italian flavors in the heart of Lahore.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">Explore</h3>
              <a href="#home" className="footer-link">Home</a>
              <a href="#menu" className="footer-link">Menu</a>
              <a href="#gallery" className="footer-link">Gallery</a>
              <a href="#about" className="footer-link">Our Story</a>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Contact</h3>
              <a href="#book" className="footer-link">Book a Table</a>
              <a href="mailto:hello@basilico.com" className="footer-link">hello@basilico.com</a>
              <p className="footer-text">123 Culinary Ave, Food District</p>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Social</h3>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-link">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-link">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Basilico By Sara. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
