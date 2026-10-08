import React, { useState } from 'react';
import { api } from '../services/api';

export default function Admissions() {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    gradeInterest: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.submitInquiry({
        name: `${formData.parentName} (Parent of ${formData.studentName})`,
        email: formData.email || 'admissions@inquiry.com',
        phone: formData.phone || '',
        subject: `Admission Inquiry for ${formData.gradeInterest}`,
        message: `Parent: ${formData.parentName}, Student: ${formData.studentName}, Grade: ${formData.gradeInterest}`,
      });

      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your admission inquiry has been submitted. Our counseling team will contact you shortly.',
        });
        setFormData({ parentName: '', studentName: '', gradeInterest: '', email: '', phone: '' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Submission failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Banner Section */}
      <section className="hero" style={{ padding: '80px 0' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            Admissions 2026 - 2027
          </h1>
          <p className="hero-desc" style={{ marginBottom: 0 }}>
            Begin your daughter's journey toward academic excellence and confident leadership.
          </p>
        </div>
      </section>

      {/* Process & Form */}
      <section className="section section-bg">
        <div className="container grid-2">
          {/* Steps */}
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Enrollment Journey</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              The Admission Process
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', lineHeight: 1.7 }}>
              We aim to make our registration process as simple and clear as possible. Follow these simple phases:
            </p>

            <div className="timeline" style={{ maxWidth: '100%', padding: '10px 0' }}>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-secondary)',
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', marginBottom: '4px' }}>Online Inquiry</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    Submit basic details in the form on this page to express interest.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-secondary)',
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', marginBottom: '4px' }}>Interaction / Campus Visit</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    Visit the school, tour classrooms and laboratory spaces, and meet department counselors.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-secondary)',
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', marginBottom: '4px' }}>Form & Document Submission</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    Complete the detailed application form and submit relevant certificates for admission confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-bg-light)',
                padding: '40px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(30, 58, 138, 0.05)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-primary)',
                  fontSize: '1.6rem',
                  marginBottom: '20px',
                }}
              >
                Admission Inquiry Form
              </h3>

              {status.message && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: status.type === 'success' ? '#15803d' : '#b91c1c',
                    border: `1px solid ${status.type === 'success' ? '#86efac' : '#fca5a5'}`,
                  }}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter parent's full name"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Student Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter student's full name"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Contact Email & Phone</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Grade Level of Interest *</label>
                  <select
                    className="form-select"
                    required
                    value={formData.gradeInterest}
                    onChange={(e) => setFormData({ ...formData, gradeInterest: e.target.value })}
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11 - Science">Grade 11 - Science Stream</option>
                    <option value="Grade 11 - Commerce">Grade 11 - Commerce Stream</option>
                    <option value="Grade 11 - Humanities">Grade 11 - Humanities Stream</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Fees and Scholarships */}
      <section className="section" id="fees">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Fees & Scholarships</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              We keep quality education accessible through multiple financial assistance initiatives.
            </p>
          </div>

          <div className="grid-2">
            {/* Fees structure */}
            <div className="card" style={{ padding: '30px' }}>
              <h3 className="card-title" style={{ marginBottom: '20px' }}>Annual Fee Overview</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(30, 58, 138, 0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--color-primary)' }}>Grade Level</th>
                    <th style={{ padding: '12px 8px', color: 'var(--color-primary)', textAlign: 'right' }}>
                      Tuition Fee (Annual)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(30, 58, 138, 0.05)' }}>
                    <td style={{ padding: '12px 8px' }}>Grades 9 & 10</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600 }}>$2,400</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(30, 58, 138, 0.05)' }}>
                    <td style={{ padding: '12px 8px' }}>Grades 11 & 12 (Arts / Commerce)</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600 }}>$2,800</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 8px' }}>Grades 11 & 12 (Science Streams)</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600 }}>$3,200</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '15px' }}>
                * Excludes transportation, uniform packages, and specialized lab supplies.
              </p>
            </div>

            {/* Scholarships */}
            <div className="card" style={{ padding: '30px' }}>
              <h3 className="card-title" style={{ marginBottom: '20px' }}>Financial Aid & Awards</h3>
              <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-secondary)', fontSize: '1.2rem' }}>★</div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Merit-Based Scholarship</strong>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                      Up to 50% tuition waiver for students maintaining top 5% academic performance records in board examinations.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-secondary)', fontSize: '1.2rem' }}>★</div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Need-Based Grants</strong>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                      Special fee concessions to support deserving candidates from economically marginalized families.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
