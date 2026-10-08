import React from 'react';
import { Link } from 'react-router-dom';

export default function StudentLife() {
  return (
    <>
      {/* Banner Section */}
      <section className="hero" style={{ padding: '80px 0' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            Student Life
          </h1>
          <p className="hero-desc" style={{ marginBottom: 0 }}>
            Fostering athletic excellence, creative hobbies, and leadership potential.
          </p>
        </div>
      </section>

      {/* Student Leadership */}
      <section className="section section-bg">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Agency & Leadership</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              The Student Prefect Council
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '14px', lineHeight: 1.7 }}>
              At SSV Girls School, leadership roles are not just extracurriculars—they are practical foundations for life.
              Every position, from School Prefect to House Captain and Club President, is held by our girls. This develops
              authentic public speaking, organization, and project management skills.
            </p>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
              The council coordinates school events, leads community clean-ups, and represents the student body in advisory
              panel meetings with administrators.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
              alt="Group of students meeting"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Sports & Self Defense */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop"
              alt="Girls sports team on track"
              style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Physical Vitality</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              Athletics & Self-Defense Programs
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', lineHeight: 1.7 }}>
              Physical strength and resilience build mental confidence. Our school features fully structured athletic programs:
            </p>

            <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Empowerment Self-Defense</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Compulsory training module for all grade levels, teaching situational awareness, boundary setting, and tactical martial arts techniques.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Competitive Sports Teams</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Basketball, Volleyball, Badminton, and Gymnastics teams representing the school in state and regional championships.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✔</span>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Yoga & Mental Wellness</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Weekly mindfulness and yoga sessions to support emotional health and academic focus.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs & Guilds */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Clubs & Creative Societies</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              A diverse list of avenues to explore personal interests, arts, and hobbies.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <h3 className="card-title">Coding & Robotics Club</h3>
              <p className="card-desc">
                Working on microcontroller coding, electronic sensor assemblies, and designing competitive robotics models.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Oratory & Debating Guild</h3>
              <p className="card-desc">
                Developing public speaking capabilities, structured debating styles, and researching global geopolitical issues.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Music, Dance & Fine Arts</h3>
              <p className="card-desc">
                Cultivating creativity in painting, classical and modern music, instrumental classes, and regional dance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
