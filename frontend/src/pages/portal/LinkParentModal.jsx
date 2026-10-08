import React, { useState } from 'react';
import { api } from '../../services/api';

export default function LinkParentModal({ isOpen, onClose, students, onParentLinked }) {
  const [studentId, setStudentId] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStudentSelect = (id) => {
    setStudentId(id);
    const selected = students.find((s) => s.studentId === id);
    if (selected) {
      setParentName(selected.parentName || '');
      setParentPhone(selected.parentPhone || '');
      setParentEmail(selected.parentEmail || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !parentName || !parentPhone) {
      setError('Please select a student and provide parent name and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.linkParent({
        studentId,
        parentName,
        parentPhone,
        parentEmail,
      });

      if (res.success) {
        onParentLinked(res.data);
        onClose();
        setStudentId('');
        setParentName('');
        setParentPhone('');
        setParentEmail('');
      } else {
        setError(res.message || 'Failed to link parent');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>Link Parent to Ward</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Select Ward / Student *</label>
            <select
              className="form-control"
              required
              value={studentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.name} ({s.rollNo} - {s.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Parent / Guardian Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. S. Krishnan"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Parent Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98408 99001"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Parent Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="krishnan.s@gmail.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Linking...' : 'Link Parent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
