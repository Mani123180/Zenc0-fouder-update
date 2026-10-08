import React from 'react';

export default function About() {
  return (
    <>
      {/* Banner Section */}
      <section className="hero" style={{ padding: '80px 0' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            About Our School
          </h1>
          <p className="hero-desc" style={{ marginBottom: 0 }}>
            Dedicated to high academic standards and holistic development for girls.
          </p>
        </div>
      </section>

      {/* About S.S.V. History Block */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Our History</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>About S.S.V.</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '14px', lineHeight: 1.7 }}>
              Founded in <strong>1910</strong>, <strong>Sri Sankara Vidya Sala (S.S.V.)</strong> has been a pioneer
              in providing quality education in and around Kodumudi. Established by visionary philanthropists{' '}
              <strong>K. S. Narayana Iyer</strong> and <strong>Mulanoor Muthusamy Gounder</strong>, the institution
              was created to bring secondary education to a region where no high school existed within a 40-kilometre radius.
            </p>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '14px', lineHeight: 1.7 }}>
              Over the years, S.S.V. has grown into a trusted educational institution through the generous support of
              donors and the dedicated service of its management. From its first High School to the establishment of the
              Girls High School, Higher Secondary School, and Nursery & Primary Schools, S.S.V. has continuously expanded
              its commitment to academic excellence and holistic student development.
            </p>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
              With more than a century of educational service, S.S.V. remains dedicated to nurturing knowledge,
              character, and values while preparing students to become responsible citizens and future leaders.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
              alt="Sri Sankara Vidya Sala Campus"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Our Vision & Mission</h2>
            <p style={{ color: 'var(--color-text-light)' }}>Guiding principles that drive our community forward.</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>☉</div>
              <h3 className="card-title">Our Vision</h3>
              <p className="card-desc">
                To be a leading center of educational excellence that inspires girls to lead, create, and succeed in a dynamic world.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>⚬</div>
              <h3 className="card-title">Our Mission</h3>
              <p className="card-desc">
                Empowering students through tailored learning modules, comprehensive support, state-of-the-art laboratory work, and value-based personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Core Values We Instill</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              Our curriculum and culture revolve around these core parameters of growth.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <h3 className="card-title" style={{ color: 'var(--color-primary)' }}>1. Integrity</h3>
              <p className="card-desc">
                Honesty, moral uprightness, and respect for oneself and others in all situations.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title" style={{ color: 'var(--color-primary)' }}>2. Self-Reliance</h3>
              <p className="card-desc">
                Fostering independence, critical thinking, problem-solving, and decisive leadership.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title" style={{ color: 'var(--color-primary)' }}>3. Compassion</h3>
              <p className="card-desc">
                Empathetic understanding, community service, and environmental stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline of Legacy */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Our Milestone Journey</h2>
            <p style={{ color: 'var(--color-text-light)' }}>Over a century of shaping history and educating local communities.</p>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-card">
                <div className="timeline-year">1910</div>
                <h4 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>The Foundation</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  Founded by philanthropists K. S. Narayana Iyer and Mulanoor Muthusamy Gounder to bring secondary education to the Kodumudi region.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-card">
                <div className="timeline-year">1995</div>
                <h4 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>Science Wing Expansion</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  Upgraded science laboratories and introduced technical computer science streams to encourage girls in STEM fields.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-card">
                <div className="timeline-year">2012</div>
                <h4 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>Digital Campus Initiative</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  Equipped all classrooms with smart projectors and digitized the student evaluation process for parents.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-card">
                <div className="timeline-year">2026</div>
                <h4 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>Looking to the Future</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  Expanding digital portals, self-defense classes, and advanced lab integrations for students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Safety Section */}
      <section className="section" id="safety">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop"
              alt="Modern clean classroom"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Campus Safety First</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              A Secure Environment for Learning
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', lineHeight: 1.7 }}>
              We prioritize safety to allow students to focus fully on their growth without worry. Our campus features comprehensive safety measures:
            </p>

            <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Secure Controlled Access</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Single checkpoint gate manned by trained female security personnel 24/7.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Comprehensive Surveillance</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Full CCTV coverage across corridors, laboratories, classrooms, and school buses.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Medical Care</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    On-campus healthcare center with a registered nurse present during school hours.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
