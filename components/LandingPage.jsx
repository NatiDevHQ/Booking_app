import React, { useState, useEffect } from 'react';
import Grainient from './Grainient';
import './landing.css';

const LandingPage = ({ onEnter }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);
  
  return (
    <div className={`landing-container ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="vignette" />
      
      {/* Floating Header */}
      <header className="floating-header">
        <div className="logo-section">
          BOOKING.APP
        </div>
        
        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <a href="#" onClick={onEnter}>Sign In</a>
          <a href="#" onClick={onEnter} className="btn-cta">Create Account</a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger-btn mobile-only ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}>
        <nav className="mobile-nav-links" onClick={(e) => e.stopPropagation()}>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); onEnter(); }}>Sign In</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); onEnter(); }}>Create Account</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}>Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}>Documentation</a>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <Grainient 
          className="hero-bg" 
          color1="#001144" 
          color2="#0055ff" 
          color3="#000000"
          grainAmount={0.04}
          warpStrength={0.8}
          timeSpeed={0.4}
        />

        <div className="hero-content">
          <div className="new-badge font-mono tracking-widest">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2v20M2 12h20"></path>
            </svg>
            System v2.0 Live
          </div>
          
          <h1 className="animate-reveal tracking-tighter">
            Smart Booking<br/>
            Synchronized.
          </h1>

          <p className="hero-desc animate-reveal-delay">
            A high-performance architecture for managing appointments with precision. 
            Automate your schedule and monitor every interaction in real-time.
          </p>

          <div className="hero-buttons animate-reveal-delay-2">
            <button className="btn btn-primary tracking-widest" onClick={onEnter}>Launch App</button>
            <button className="btn btn-secondary tracking-widest">Documentation</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-title animate-reveal">
          <h2 className="tracking-tighter uppercase">Pure Function.</h2>
          <p className="font-mono tracking-widest text-zinc-500">EXACT ARCHITECTURE FOR BOOKING MANAGEMENT.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-reveal-delay">
            <h3 className="tracking-tight">Instant Control</h3>
            <p>BOOK APPOINTMENTS SECURELY WITH REAL-TIME AVAILABILITY. OUR SYSTEM ENSURES ZERO OVERLAP AND 100% RELIABILITY.</p>
          </div>
          <div className="feature-card animate-reveal-delay">
            <h3 className="tracking-tight">Dual Interface</h3>
            <p>TOGGLE BETWEEN GRID AND LIST ARCHITECTURES. OPTIMIZE HOW YOU VIEW AND MANAGE YOUR BOOKING DATA FLOW.</p>
          </div>
          <div className="feature-card animate-reveal-delay">
            <h3 className="tracking-tight">Admin Logic</h3>
            <p>A POWERFUL DASHBOARD FOR TOTAL CONTROL. APPROVE, PENDING, OR SEARCH ANY RECORD WITH NEURAL SPEED.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-title animate-reveal">
          <h2 className="tracking-tighter uppercase">Operational Flow.</h2>
          <p className="font-mono tracking-widest text-zinc-500">FROM INITIALIZATION TO APPROVED STATUS.</p>
        </div>

        <div className="steps-container">
          <div className="step animate-reveal-delay">
            <div className="step-number font-black">01</div>
            <div className="step-details">
              <h4 className="tracking-tight uppercase">IDENTIFICATION</h4>
              <p className="font-mono text-zinc-400">ESTABLISH YOUR IDENTITY THROUGH OUR SECURE AUTHENTICATION PROTOCOLS TO ACCESS THE SYSTEM.</p>
            </div>
          </div>
          <div className="step animate-reveal-delay">
            <div className="step-number font-black">02</div>
            <div className="step-details">
              <h4 className="tracking-tight uppercase">SELECTION</h4>
              <p className="font-mono text-zinc-400">CHOOSE YOUR PREFERRED DATE AND TIME PARAMETERS. OUR ENGINE VALIDATES AVAILABILITY INSTANTLY.</p>
            </div>
          </div>
          <div className="step animate-reveal-delay">
            <div className="step-number font-black">03</div>
            <div className="step-details">
              <h4 className="tracking-tight uppercase">SYNCHRONIZATION</h4>
              <p className="font-mono text-zinc-400">THE ADMIN REVIEWS THE REQUEST. ONCE APPROVED, THE BOOKING IS SYNCHRONIZED ACROSS THE GLOBAL DASHBOARD.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-glow" />
        <h2 className="animate-reveal">Ready to optimize<br/>your workflow?</h2>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onEnter}>Get Started Now</button>
          <button className="btn btn-secondary">Contact Support</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>BOOKING.APP</h2>
            <p>The next generation platform for creators to build, share, and scale their ideas with architectural precision.</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Solutions</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Updates</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BOOKING.APP ALL RIGHTS RESERVED</span>
          <span>DESIGNED FOR PERFORMANCE</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
