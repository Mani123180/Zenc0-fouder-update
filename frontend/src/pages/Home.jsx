import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <span className="hero-tagline">Empowering Girls Today, Leading the World Tomorrow</span>
          <h1 className="hero-title">Shaping the Young Women Who Will Achieve Tomorrow!</h1>
          <p className="hero-desc">
            Sri Sankara Vidhyasala Girls High School provides a safe, nurturing, and high-quality educational environment
            for young women to achieve academic excellence and leadership.
          </p>
          <div className="hero-btns">
            <Link to="/admissions" className="btn btn-primary">Admissions 2026-27</Link>
            <Link to="/academics" className="btn btn-secondary">Explore Curriculum</Link>
          </div>
        </div>
      </section>

      {/* Principal's Welcome */}
      <section className="section section-bg">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '16px' }}>Leadership Message</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
              From the Principal's Desk
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px', lineHeight: 1.7 }}>
              Welcome to Sri Sankara Vidhyasala Girls High School. For five decades, our institution has been dedicated
              to fostering an environment where young women discover their voice, unleash their potential, and build the
              courage to lead.
            </p>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', lineHeight: 1.7 }}>
              We blend traditional cultural values with state-of-the-art modern scientific education, ensuring every
              student graduates not only with high academic achievements, but as a confident, compassionate citizen of
              the world.
            </p>
            <div>
              <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                Dr. Sunita Sharma, M.Sc., Ph.D.
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                Principal & Head of School
              </span>
            </div>
          </div>
          <div>
            <img
              src="/images/principal.png"
              alt="Principal Dr. Sunita Sharma"
              style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                maxHeight: '420px',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="badge badge-secondary" style={{ marginBottom: '12px' }}>Why Choose Us</span>
            <h2 className="section-title">The Sankara Advantage</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '650px', margin: '0 auto' }}>
              We create an ecosystem designed specifically for the intellectual, emotional, and leadership growth of girls.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔬</div>
              <h3 className="card-title">STEM & Innovation Labs</h3>
              <p className="card-desc">
                Dedicated physics, chemistry, biology, and robotics laboratories encouraging female participation in science and technology.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛡️</div>
              <h3 className="card-title">Safe & Supportive Campus</h3>
              <p className="card-desc">
                24/7 CCTV surveillance, female security personnel, medical infirmary, and a culture of warmth and mutual respect.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎨</div>
              <h3 className="card-title">Holistic Development</h3>
              <p className="card-desc">
                Classical dance, music, debate, karate, yoga, and leadership councils ensuring all-round character building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '60px 0' }}>
        <div className="container grid-4" style={{ textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-secondary)' }}>50+</div>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Years of Heritage</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-secondary)' }}>1200+</div>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Enrolled Students</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-secondary)' }}>100%</div>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Board Exam Pass Rate</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-secondary)' }}>18:1</div>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Student-Teacher Ratio</p>
          </div>
        </div>
      </section>

      {/* Campus Life Spotlight */}
      <section className="section section-bg">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img
              src="/images/south_indian_students.png"
              alt="Students Learning"
              style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '16px' }}>Campus Life</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
              Where Curiosities Bloom Into Capabilities
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px', lineHeight: 1.7 }}>
              Our students engage in active collaborative learning, science fairs, community outreach, and inter-school
              competitions that instill critical thinking, empathy, and resilience.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Link to="/student-life" className="btn btn-primary">Student Life Details</Link>
              <Link to="/contact" className="btn btn-outline">Schedule Campus Tour</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc, #edf2f7)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Join the Sankara Family Today</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '30px', fontSize: '1.05rem' }}>
            Admissions for the upcoming academic year 2026-27 are now open for Grades 6 through 12.
            Give your daughter the foundation she deserves.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Apply for Admission
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{ padding: '12px 32px' }}>
              Contact Admissions Cell
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
