import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="/images/emblem.png"
            alt="Sri Sankara Vidhyasala Emblem"
            style={{ height: '55px', width: 'auto', borderRadius: 0 }}
          />
          <div className="logo-text">
            Sri Sankara Vidhyasala
            <span className="logo-sub">Girls High School, Kodumudi</span>
          </div>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            About Us
          </NavLink>
          <NavLink to="/academics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Academics
          </NavLink>
          <NavLink to="/student-life" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Student Life
          </NavLink>
          <NavLink to="/admissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Admissions
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Contact Us
          </NavLink>

          {user ? (
            <NavLink to="/portal" className="nav-link mobile-portal-login" onClick={closeMenu}>
              ERP Portal ({user.role})
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-link mobile-portal-login" onClick={closeMenu}>
              Portal Login
            </NavLink>
          )}
        </nav>

        <div className="nav-cta">
          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to="/portal"
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                ERP Portal
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-outline"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.85rem' }}
            >
              Portal Login
            </Link>
          )}
        </div>

        <button
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
