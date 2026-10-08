import React, { useState } from 'react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.submitInquiry(formData);
      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. Our school office will get in touch with you.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Banner Section */}
      <section className="hero" style={{ padding: '80px 0' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            Contact Us
          </h1>
          <p className="hero-desc" style={{ marginBottom: 0 }}>
            We welcome inquiries from parents, prospective students, and alumnae.
          </p>
        </div>
      </section>

      {/* Contacts and Message Form */}
      <section className="section section-bg">
        <div className="container grid-2">
          {/* Contact details */}
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>Get in Touch</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              School Office Details
            </h2>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
              Please find our primary contact lines below. You can drop by during standard visitor hours or send a message directly using the form.
            </p>

            <div className="feature-list" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>📍</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Mailing Address</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    SSV Aided Girls High School, Salaipudur, Kodumudi, Erode, Tamilnadu - 638151
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>📞</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Telephone Enquiries</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    General Desk: +91 4204 222 345<br />Admissions Office: +91 4204 222 346
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>✉</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Email Directory</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    General: info@ssvgirlsschool.edu<br />Office of the Registrar: admissions@ssvgirlsschool.edu
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>🕒</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>Office Hours</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    Monday to Friday: 8:00 AM – 3:30 PM<br />Saturday: 9:00 AM – 1:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
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
                Send a Direct Message
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
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Your Message *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="How can we assist you?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Campus Location</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              Located in a peaceful, secure academic zone, easily accessible by public and school transit systems.
            </p>
          </div>

          <div
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid rgba(30, 58, 138, 0.1)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '15px',
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Sri%20Sankara%20Vidhyasala%20Girls%20High%20School,%20Kodumudi&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Campus Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
