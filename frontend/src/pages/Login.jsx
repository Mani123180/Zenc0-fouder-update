import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePreset, setActivePreset] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Exact demo credentials matching login.html lines 176-183
  const demoCredentials = {
    superadmin: {
      label: 'Super Admin',
      user: 'superadmin@zenschool.com',
      pass: 'SuperAdmin@123',
    },
    schooladmin_ssv: {
      label: 'School Admin',
      user: 'admin@ssvschool.com',
      pass: 'admin123',
    },
    principal: {
      label: 'Principal',
      user: 'principal@ssvschool.com',
      pass: 'principal123',
    },
    teacher: {
      label: 'Teacher',
      user: 'teacher@ssvschool.com',
      pass: 'teacher123',
    },
    student: {
      label: 'Student',
      user: 'student@ssvschool.com',
      pass: 'student123',
    },
    parent: {
      label: 'Parent',
      user: 'parent@ssvschool.com',
      pass: 'parent123',
    },
  };

  const handleFillDemo = async (key) => {
    const cred = demoCredentials[key];
    if (!cred) return;
    setActivePreset(key);
    setUsername(cred.user);
    setPassword(cred.pass);
    setError('');
    setSubmitting(true);
    const res = await login(cred.user, cred.pass);
    setSubmitting(false);
    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Invalid username/email or password.');
      return;
    }

    setError('');
    setSubmitting(true);
    const res = await login(username.trim(), password);
    setSubmitting(false);
    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.message || 'Invalid username/email or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Login Header matching login.html lines 138-142 */}
        <div className="login-header">
          <img src="/images/emblem.png" alt="ZenSchool Emblem" className="login-logo-img" />
          <h2>ZenSchool Platform Portal</h2>
          <p>Select role or enter credentials to sign in</p>
        </div>

        {/* Login Body matching login.html lines 143-170 */}
        <div className="login-body">
          {error && (
            <div className="error-msg" style={{ display: 'block' }}>
              {error}
            </div>
          )}

          {/* Quick Demo Presets matching login.html lines 146-156 */}
          <div
            className="demo-login-box"
            style={{
              background: 'rgba(30, 58, 138, 0.04)',
              border: '1px dashed rgba(30, 58, 138, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>
              Quick Demo Login Presets:
            </p>
            <div className="role-quick-links">
              {Object.entries(demoCredentials).map(([key, cred]) => (
                <button
                  key={key}
                  type="button"
                  className={`role-btn ${activePreset === key ? 'active' : ''}`}
                  onClick={() => handleFillDemo(key)}
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email / Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="e.g. superadmin@zenschool.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setActivePreset('');
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setActivePreset('');
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={submitting}
            >
              {submitting ? 'Verifying Credentials...' : 'Log In to Portal'}
            </button>

            <Link
              to="/"
              className="btn btn-outline"
              style={{
                width: '100%',
                display: 'block',
                textAlign: 'center',
                marginTop: '15px',
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '50px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            >
              Go Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
