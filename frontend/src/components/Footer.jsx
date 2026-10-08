import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo footer-logo">
            <img
              src="/images/emblem.png"
              alt="Sri Sankara Vidhyasala Emblem"
              style={{
                height: '45px',
                width: 'auto',
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-white)',
                padding: '2px',
              }}
            />
            <div className="logo-text" style={{ color: 'var(--color-bg-white)' }}>
              Sri Sankara Vidhyasala
              <span className="logo-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
                GIRLS HIGH SCHOOL, KODUMUDI
              </span>
            </div>
          </Link>
          <p className="footer-desc">
            Enabling academic excellence, critical inquiry, and female leadership since 1976.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/student-life">Student Life</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/admissions">Scholarships</Link></li>
            <li><Link to="/about">Campus Safety</Link></li>
            <li><Link to="/login">ERP Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact Office</h4>
          <ul className="footer-contact">
            <li>
              <span className="footer-contact-icon">📍</span>
              <span>SSV Aided Girls High School, Salaipudur, Kodumudi, Erode, Tamilnadu - 638151</span>
            </li>
            <li>
              <span className="footer-contact-icon">📞</span>
              <span>+91 4204 222 345</span>
            </li>
            <li>
              <span className="footer-contact-icon">✉️</span>
              <span>admissions@srisankaragirls.edu.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 Sri Sankara Vidhyasala Girls High School. All rights reserved.</p>
        <p>Designed & Powered by ZenSchool Multi-Campus Platform</p>
      </div>
    </footer>
  );
}
