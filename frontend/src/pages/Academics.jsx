import React from 'react';
import { Link } from 'react-router-dom';

export default function Academics() {
  return (
    <>
      {/* Banner Section */}
      <section className="hero" style={{ padding: '80px 0' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            Academic Programs
          </h1>
          <p className="hero-desc" style={{ marginBottom: 0 }}>
            Fostering depth of knowledge, scientific inquiry, and analytical skills.
          </p>
        </div>
      </section>

      {/* High School Overview */}
      <section className="section section-bg">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Curriculum Path</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              Curriculum Streams (High School)
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', lineHeight: 1.7 }}>
              We offer three main specialized academic streams structured to prepare students for college admissions and professional career pathways.
            </p>

            <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>⚛</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                    Science Stream
                  </strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Core subjects include Physics, Chemistry, Biology, Mathematics, and Computer Science. Prepares girls for engineering, medical, and software careers.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>⚖</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                    Commerce Stream
                  </strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Core subjects include Accountancy, Business Studies, Economics, and Applied Mathematics. Prepares students for finance, marketing, and entrepreneurship.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>🎨</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                    Humanities & Arts Stream
                  </strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Core subjects include History, Political Science, Psychology, Sociology, and English Literature. Focuses on critical thinking, writing, and social systems.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
              alt="Students writing in notebooks"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* STEM & Lab Focus */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop"
              alt="High School Laboratory Desk"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Practical Learning</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              Modern Laboratory Infrastructure
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', lineHeight: 1.7 }}>
              To inspire girls in technological and scientific careers, we emphasize hands-on experimentation. Our labs are fully equipped with state-of-the-art instruments:
            </p>

            <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Chemistry & Physics Labs</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Equipped with advanced measurement devices, safety showers, and individual project workspace units.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Robotics & Coding Hub</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Equipped with microcontrollers, 3D printers, and high-performance workstations for software design and computational modeling.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Biology Lab</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    High-resolution microscopes, botanical specimens, and anatomical charts.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counseling Section */}
      <section className="section section-bg">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Future Preparation</span>
          <h2 className="section-title" style={{ marginBottom: '20px' }}>
            University Guidance & Career Counseling
          </h2>
          <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7, marginBottom: '24px' }}>
            We guide students beyond secondary school. Our dedicated counselor assists students with college selections,
            competitive exam preparation, profile building, and scholarship application pathways. Annual counseling sessions
            feature female leaders sharing their professional journeys.
          </p>
          <Link to="/contact" className="btn btn-primary">Book a Counseling Session</Link>
        </div>
      </section>
    </>
  );
}
