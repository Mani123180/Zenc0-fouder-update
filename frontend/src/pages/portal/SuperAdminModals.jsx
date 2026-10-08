import React, { useState, useEffect } from 'react';

// 1. Campus Overview Modal (viewSchoolDetails)
export function CampusOverviewModal({ isOpen, school, onClose, onEdit }) {
  if (!isOpen || !school) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">
            Campus Overview <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>({school.code})</span>
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: '4px' }}>
          {/* Wizard Header Strip */}
          <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
            <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
              </svg>
            </div>
            <div className="wizard-header-titles" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{school.name}</h4>
                <span className={`badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{school.status}</span>
              </div>
              <p>
                Affiliation: <strong>{school.board || 'State Board'}</strong> | Academic Year: <strong>{school.academicYear || '2026-2027'}</strong> | City: <strong>{school.city || '—'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Students</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>{school.studentsCount || school.studentCount || 0}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Teachers</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{school.teachersCount || school.teacherCount || 0}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Parents</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{school.parentsCount || Math.round((school.studentsCount || 500) * 0.95)}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>License Tier</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6366f1', marginTop: '6px' }}>{school.subscription || school.plan || 'Pro Plan'}</div>
            </div>
          </div>

          {/* Structured Review Grid */}
          <div className="review-grid" style={{ marginBottom: '22px' }}>
            <div className="review-card">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
                </svg>
                Campus & Contact Information
              </div>
              <div className="review-row"><span className="review-label">School Code:</span><span className="review-value"><span className="badge badge-info">{school.code}</span></span></div>
              <div className="review-row"><span className="review-label">Principal / Head:</span><span className="review-value">{school.principal || school.principalName || '—'}</span></div>
              <div className="review-row"><span className="review-label">Official Email:</span><span className="review-value">{school.email || '—'}</span></div>
              <div className="review-row"><span className="review-label">Contact Phone:</span><span className="review-value">{school.phone || '—'}</span></div>
              <div className="review-row"><span className="review-label">City Location:</span><span className="review-value">{school.city || '—'}</span></div>
            </div>

            <div className="review-card">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Campus Administrator Profile
              </div>
              <div className="review-row"><span className="review-label">Administrator:</span><span className="review-value"><strong>{school.adminName || school.admin || 'Unassigned'}</strong></span></div>
              <div className="review-row"><span className="review-label">Login ID / Email:</span><span className="review-value"><code style={{ color: '#2563eb' }}>{school.admin || school.email || '—'}</code></span></div>
              <div className="review-row"><span className="review-label">Partition ID:</span><span className="review-value"><span className="badge badge-info">{school.id || school.schoolId}</span></span></div>
              <div className="review-row"><span className="review-label">Account Status:</span><span className="review-value"><span className={`badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{school.status}</span></span></div>
              <div className="review-row"><span className="review-label">Onboarding Date:</span><span className="review-value">{school.createdDate || school.joinedDate || '2026-01-01'}</span></div>
            </div>

            <div className="review-card span-2">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Platform Subscription & Modules
              </div>
              <div className="review-row"><span className="review-label">Active License Tier:</span><span className="review-value"><strong>{school.subscription || school.plan || 'Pro Plan'}</strong></span></div>
              <div className="review-row"><span className="review-label">Modules Included:</span><span className="review-value">Student Info System (SIS), Attendance, Fees & Invoicing, Exam Results, SMS/WhatsApp Gateway</span></div>
              <div className="review-row"><span className="review-label">Sync Status:</span><span className="review-value"><span className="badge badge-success">Active & Synchronized</span></span></div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Partition ID: <code>{school.id || school.schoolId}</code></span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => { onClose(); onEdit(school); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit School Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Edit School Modal (editSchool)
export function EditSchoolModal({ isOpen, school, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    board: 'State Board',
    principal: '',
    email: '',
    phone: '',
    status: 'Active',
    subscription: 'Pro Plan',
  });

  useEffect(() => {
    if (school) {
      setForm({
        name: school.name || '',
        code: school.code || '',
        board: school.board || 'State Board',
        principal: school.principal || school.principalName || '',
        email: school.email || '',
        phone: school.phone || '',
        status: school.status || 'Active',
        subscription: school.subscription || school.plan || 'Pro Plan',
      });
    }
  }, [school]);

  if (!isOpen || !school) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...school, ...form });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">
            Edit Campus Details <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>({school.code})</span>
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Update Institutional Profile</h4>
                <p>Modify campus parameters, affiliation board, and licensing configuration.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>School Name <span className="req">*</span></label>
                <input type="text" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>School Code <span className="req">*</span></label>
                <input type="text" value={form.code} required onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Affiliation / Board <span className="req">*</span></label>
                <select value={form.board} required onChange={(e) => setForm({ ...form, board: e.target.value })}>
                  <option value="State Board">State Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Matriculation">Matriculation</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div className="wizard-field">
                <label>Principal / Head Name <span className="req">*</span></label>
                <input type="text" value={form.principal} required onChange={(e) => setForm({ ...form, principal: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Official Email <span className="req">*</span></label>
                <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Contact Phone <span className="req">*</span></label>
                <input type="text" value={form.phone} required onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Operational Status <span className="req">*</span></label>
                <select value={form.status} required onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Campus Changes ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. School Admin Profile Modal (viewSchoolAdmin / viewAdminProfile)
export function AdminProfileModal({ isOpen, admin, onClose }) {
  if (!isOpen || !admin) return null;

  const initial = (admin.name || 'A')[0].toUpperCase();

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Administrator Profile — {admin.name}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="wizard-form-box">
          <div className="wizard-header-strip">
            <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="wizard-header-titles">
              <h4>Campus Administrator Profile</h4>
              <p>Account identity, campus allocation, and security credentials status.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
              {initial}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary)' }}>{admin.name}</h4>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Role: <span className="badge badge-info">{admin.role || 'SCHOOL_ADMIN'}</span>
              </div>
            </div>
          </div>

          <div className="review-grid" style={{ gridTemplateColumns: '1fr', gap: '10px', marginBottom: '15px' }}>
            <div className="review-row"><span>Login Username:</span><code>{admin.username || '—'}</code></div>
            <div className="review-row"><span>Official Email:</span><strong>{admin.email}</strong></div>
            <div className="review-row"><span>Assigned Campus:</span><strong>{admin.schoolName || 'All Campuses'}</strong></div>
            <div className="review-row"><span>Campus ID:</span><span className="badge badge-info">{admin.schoolId || 'None'}</span></div>
            <div className="review-row"><span>Account Status:</span><span className={`badge ${admin.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{admin.status || 'Active'}</span></div>
            <div className="review-row"><span>Created Date:</span><span>{admin.createdDate || '2026-01-01'}</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// 4. Add Admin Modal (openAddAdminModal)
export function AddAdminModal({ isOpen, schools = [], onClose, onSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Admin@2026');
  const [schoolId, setSchoolId] = useState('');

  useEffect(() => {
    if (schools.length > 0 && !schoolId) {
      setSchoolId(schools[0].id || schools[0].schoolId);
    }
  }, [schools]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = schools.find((s) => (s.id || s.schoolId) === schoolId);
    const newAdmin = {
      id: 'USR0' + Math.floor(10 + Math.random() * 90),
      name,
      email,
      username,
      password,
      role: 'SCHOOL_ADMIN',
      schoolId,
      schoolName: target ? target.name : 'School Campus',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };
    onSave(newAdmin);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Add School Administrator</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Provision Administrator Account</h4>
                <p>Generate login credentials and associate them with an institutional campus.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Admin Full Name <span className="req">*</span></label>
                <input type="text" placeholder="e.g. K. Sundaram (Principal / IT Head)" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Official Email Address <span className="req">*</span></label>
                <input type="email" placeholder="e.g. admin@schoolname.edu" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Login Username <span className="req">*</span></label>
                <input type="text" placeholder="e.g. admin_sjm" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Initial Password <span className="req">*</span></label>
                <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Assign to Campus <span className="req">*</span></label>
                <select value={schoolId} required onChange={(e) => setSchoolId(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Create School Admin ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. Assign / Reassign Admin Modal (openAssignAdminModal)
export function AssignAdminModal({ isOpen, admins = [], schools = [], initialAdminId = null, onClose, onSave }) {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  useEffect(() => {
    if (initialAdminId) setSelectedAdmin(initialAdminId);
    else if (admins.length > 0) setSelectedAdmin(admins[0].id || admins[0].userId);

    if (schools.length > 0 && !selectedSchool) {
      setSelectedSchool(schools[0].id || schools[0].schoolId);
    }
  }, [initialAdminId, admins, schools]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedAdmin, selectedSchool);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Assign / Reassign Administrator</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Link Administrator to Campus</h4>
                <p>Assign administrative authority for a school to a registered user.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Select School Administrator <span className="req">*</span></label>
                <select value={selectedAdmin} required onChange={(e) => setSelectedAdmin(e.target.value)}>
                  {admins.map((a) => (
                    <option key={a.id || a.userId} value={a.id || a.userId}>
                      {a.name} ({a.email}) — Current: {a.schoolName || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="wizard-field span-2">
                <label>Select Target Campus <span className="req">*</span></label>
                <select value={selectedSchool} required onChange={(e) => setSelectedSchool(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Confirm Assignment ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 6. Create Invoice Modal (openCreateInvoiceModal)
export function CreateInvoiceModal({ isOpen, schools = [], onClose, onSave }) {
  const [schoolId, setSchoolId] = useState('');
  const [plan, setPlan] = useState('Pro Plan');
  const [amount, setAmount] = useState('₹35,000');
  const [due, setDue] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);

  useEffect(() => {
    if (schools.length > 0 && !schoolId) {
      setSchoolId(schools[0].id || schools[0].schoolId);
    }
  }, [schools]);

  if (!isOpen) return null;

  const handlePlanChange = (val) => {
    setPlan(val);
    setAmount(val.includes('Enterprise') ? '₹75,000' : (val.includes('Basic') ? '₹15,000' : '₹35,000'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = schools.find((s) => (s.id || s.schoolId) === schoolId);
    const newBill = {
      invoiceNo: 'INV-2026-00' + Math.floor(10 + Math.random() * 90),
      schoolId,
      school: target ? target.name : 'School Campus',
      plan,
      amount: amount.startsWith('₹') ? amount : '₹' + amount,
      dueDate: due,
      paymentDate: null,
      status: 'PENDING',
    };
    onSave(newBill);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Generate Campus Invoice</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Billing & Invoice Generation</h4>
                <p>Issue platform license subscription or customized service invoices.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Select Target Campus / School <span className="req">*</span></label>
                <select value={schoolId} required onChange={(e) => setSchoolId(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="wizard-field">
                <label>License Subscription Tier <span className="req">*</span></label>
                <select value={plan} required onChange={(e) => handlePlanChange(e.target.value)}>
                  <option value="Basic Plan">Basic Plan (₹15,000/yr)</option>
                  <option value="Pro Plan">Pro Plan (₹35,000/yr)</option>
                  <option value="Enterprise Plan">Enterprise Plan (₹75,000/yr)</option>
                </select>
              </div>
              <div className="wizard-field">
                <label>Invoice Amount (₹) <span className="req">*</span></label>
                <input type="text" value={amount} required onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="wizard-field span-2">
                <label>Payment Due Date <span className="req">*</span></label>
                <input type="date" value={due} required onChange={(e) => setDue(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Generate & Issue Invoice ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 7. General Feedback / Confirmation Modal (showFeedbackModal)
export function FeedbackModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'var(--color-success)', fontSize: '3rem', marginBottom: '15px' }}>✓</div>
          <p style={{ color: 'var(--color-text-dark)', marginBottom: '20px', whiteSpace: 'pre-line' }}>{message}</p>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
