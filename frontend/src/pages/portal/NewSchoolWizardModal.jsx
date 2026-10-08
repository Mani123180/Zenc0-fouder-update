import React, { useState, useEffect } from 'react';

const getInitialWizardData = () => {
  return {
    schoolName: '',
    schoolCode: '',
    board: 'State Board',
    academicYear: '2026-2027',
    city: '',
    address: '',
    phone: '',
    email: '',
    principal: '',
    adminName: '',
    adminEmail: '',
    adminUsername: '',
    adminPassword: 'Admin@12345',
  };
};

export default function NewSchoolWizardModal({ isOpen, onClose, onSchoolCreated }) {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState(getInitialWizardData);

  // Automatically reset to fresh Step 1 every time modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setWizardData(getInitialWizardData());
    }
  }, [isOpen]);

  const handleReset = () => {
    setStep(1);
    setWizardData(getInitialWizardData());
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const autoSuggestSchoolCode = (name) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      let acronym = words.map((w) => w[0].toUpperCase()).join('').substring(0, 4);
      if (words.length === 1 && words[0].length >= 3) {
        acronym = words[0].substring(0, 3).toUpperCase();
      }
      const city = wizardData.city.trim() || 'TN';
      const cityCode = city.substring(0, 3).toUpperCase();
      setWizardData((prev) => ({ ...prev, schoolName: name, schoolCode: `${acronym}-${cityCode}` }));
    } else {
      setWizardData((prev) => ({ ...prev, schoolName: name }));
    }
  };

  const regenerateWizPass = () => {
    const code = (wizardData.schoolCode || 'Zen').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    setWizardData((prev) => ({ ...prev, adminPassword: `${code || 'School'}@${rand}` }));
  };

  const handleNext = (e, currentStep) => {
    e.preventDefault();
    if (currentStep === 1) {
      const cleanWord = wizardData.schoolName.split(' ')[0] || 'User';
      const cleanCode = (wizardData.schoolCode || 'school').toLowerCase().replace(/[^a-z0-9]/g, '');
      setWizardData((prev) => ({
        ...prev,
        adminName: prev.adminName || `Admin ${cleanWord}`,
        adminEmail: prev.adminEmail || `admin@${cleanCode}.edu`,
        adminUsername: prev.adminUsername || `admin_${cleanCode.substring(0, 5)}`,
      }));
      setStep(2);
    } else if (currentStep === 2) {
      setStep(3);
    }
  };

  const handleFinalize = () => {
    const newSchool = {
      id: 'SCHOOL0' + Math.floor(10 + Math.random() * 90),
      name: wizardData.schoolName,
      code: wizardData.schoolCode,
      city: wizardData.city,
      phone: wizardData.phone,
      email: wizardData.email,
      principal: wizardData.principal,
      academicYear: wizardData.academicYear,
      admin: wizardData.adminEmail,
      adminName: wizardData.adminName,
      status: 'Active',
      studentsCount: 0,
      teachersCount: 0,
      parentsCount: 0,
      subscription: 'Pending Activation',
      createdDate: new Date().toISOString().split('T')[0],
      address: wizardData.address,
      board: wizardData.board,
      username: wizardData.adminUsername,
      password: wizardData.adminPassword,
    };

    onSchoolCreated(newSchool);
    handleReset();
    onClose();
  };

  const progressPercent = (step - 1) * 50;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Onboard New School Campus</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleReset}
              title="Reset form and start from Step 1"
              style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '4px' }}
            >
              ↻ Reset Form
            </button>
            <button className="modal-close" onClick={handleClose}>&times;</button>
          </div>
        </div>

        <div id="modal-body">
          {/* Wizard Progress Track */}
          <div className="wizard-stepper-wrap">
            <div className="wizard-progress-track">
              <div className="wizard-progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="wizard-steps">
              <div className={`wizard-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
                <div className="step-label">School Profile</div>
              </div>
              <div className={`wizard-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
                <div className="step-label">Admin Access</div>
              </div>
              <div className={`wizard-step ${step === 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Review & Launch</div>
              </div>
            </div>
          </div>

          {/* STEP 1: School Profile */}
          {step === 1 && (
            <form onSubmit={(e) => handleNext(e, 1)}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M14 7h1"></path><path d="M9 11h1"></path><path d="M14 11h1"></path><path d="M9 15h1"></path><path d="M14 15h1"></path>
                    </svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Step 1: School Identity & Campus Profile</h4>
                    <p>Configure the foundational details for the new multi-tenant school instance.</p>
                  </div>
                </div>

                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>School / Institution Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.schoolName}
                      placeholder="e.g. ABC Matriculation Higher Secondary School"
                      required
                      onChange={(e) => autoSuggestSchoolCode(e.target.value)}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>School Code (Unique ID) <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.schoolCode}
                      placeholder="e.g. ABC-CHE"
                      required
                      style={{ textTransform: 'uppercase' }}
                      onChange={(e) => setWizardData({ ...wizardData, schoolCode: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="wizard-field">
                    <label>Board / Affiliation <span className="req">*</span></label>
                    <select
                      value={wizardData.board}
                      required
                      onChange={(e) => setWizardData({ ...wizardData, board: e.target.value })}
                    >
                      <option value="State Board">State Board (Tamil Nadu)</option>
                      <option value="Matriculation">Matriculation</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="International">International / IGCSE</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Academic Year <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.academicYear}
                      required
                      onChange={(e) => setWizardData({ ...wizardData, academicYear: e.target.value })}
                    />
                  </div>

                  <div className="wizard-field">
                    <label>Official School Email <span className="req">*</span></label>
                    <input
                      type="email"
                      value={wizardData.email}
                      placeholder="contact@abcschool.edu.in"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, email: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Contact Phone <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.phone}
                      placeholder="+91 98765 43210"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, phone: e.target.value })}
                    />
                  </div>

                  <div className="wizard-field">
                    <label>Principal Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.principal}
                      placeholder="e.g. Dr. K. Ramanathan"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, principal: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>City / Campus Location <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.city}
                      placeholder="e.g. Chennai, Coimbatore, Salem"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, city: e.target.value })}
                    />
                  </div>

                  <div className="wizard-field span-2">
                    <label>Campus Physical Address</label>
                    <input
                      type="text"
                      value={wizardData.address}
                      placeholder="Street, Landmark, District, Pincode"
                      onChange={(e) => setWizardData({ ...wizardData, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="wizard-footer">
                <span className="step-count-text">Step 1 of 3: School Profile</span>
                <div className="wizard-footer-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Next: Admin Access →</button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Administrator Account */}
          {step === 2 && (
            <form onSubmit={(e) => handleNext(e, 2)}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Step 2: School Administrator Account</h4>
                    <p>Setup the primary login credentials for this campus administrator.</p>
                  </div>
                </div>

                <div className="wizard-callout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>This administrator will be added to <strong>Admin Management</strong> with full school-level master access for <strong>{wizardData.schoolName || 'this campus'}</strong>.</span>
                </div>

                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Administrator Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.adminName}
                      placeholder="e.g. Rajesh Kumar"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, adminName: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Admin Login Email <span className="req">*</span></label>
                    <input
                      type="email"
                      value={wizardData.adminEmail}
                      placeholder="e.g. admin@abcschool.com"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, adminEmail: e.target.value })}
                    />
                  </div>

                  <div className="wizard-field">
                    <label>Portal Username <span className="req">*</span></label>
                    <input
                      type="text"
                      value={wizardData.adminUsername}
                      placeholder="e.g. admin_abc"
                      required
                      onChange={(e) => setWizardData({ ...wizardData, adminUsername: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Temporary Password <span className="req">*</span></label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={wizardData.adminPassword}
                        required
                        style={{ fontFamily: 'monospace' }}
                        onChange={(e) => setWizardData({ ...wizardData, adminPassword: e.target.value })}
                      />
                      <button type="button" className="btn btn-outline btn-sm" onClick={regenerateWizPass} style={{ whiteSpace: 'nowrap', padding: '0 14px' }}>
                        Generate
                      </button>
                    </div>
                  </div>

                  <div className="wizard-field span-2">
                    <label>Campus Assignment</label>
                    <input
                      type="text"
                      value={`${wizardData.schoolName} (${wizardData.schoolCode})`}
                      disabled
                      style={{ background: '#f8fafc', color: '#64748b', fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              <div className="wizard-footer">
                <span className="step-count-text">Step 2 of 3: Admin Access</span>
                <div className="wizard-footer-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Next: Review Details →</button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Launch */}
          {step === 3 && (
            <div>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Step 3: Review Onboarding Information</h4>
                    <p>Verify campus details and administrator account before provisioning.</p>
                  </div>
                </div>

                <div className="review-grid">
                  <div className="review-card">
                    <div className="review-card-title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                      </svg>
                      Campus Details
                    </div>
                    <div className="review-row"><span className="review-label">School Name:</span><span className="review-value">{wizardData.schoolName}</span></div>
                    <div className="review-row"><span className="review-label">School Code:</span><span className="review-value"><span className="badge badge-info">{wizardData.schoolCode}</span></span></div>
                    <div className="review-row"><span className="review-label">Affiliation:</span><span className="review-value">{wizardData.board || 'State Board'}</span></div>
                    <div className="review-row"><span className="review-label">Academic Year:</span><span className="review-value">{wizardData.academicYear}</span></div>
                    <div className="review-row"><span className="review-label">Principal:</span><span className="review-value">{wizardData.principal}</span></div>
                    <div className="review-row"><span className="review-label">Campus Location:</span><span className="review-value">{wizardData.city || 'Tamil Nadu'}</span></div>
                  </div>

                  <div className="review-card">
                    <div className="review-card-title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
                      </svg>
                      Admin Master Account
                    </div>
                    <div className="review-row"><span className="review-label">Full Name:</span><span className="review-value">{wizardData.adminName}</span></div>
                    <div className="review-row"><span className="review-label">Login Email:</span><span className="review-value">{wizardData.adminEmail}</span></div>
                    <div className="review-row"><span className="review-label">Username:</span><span className="review-value"><code>{wizardData.adminUsername}</code></span></div>
                    <div className="review-row"><span className="review-label">Temporary Password:</span><span className="review-value"><code style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{wizardData.adminPassword}</code></span></div>
                    <div className="review-row"><span className="review-label">Role Assigned:</span><span className="review-value"><span className="badge badge-success">SCHOOL_ADMIN</span></span></div>
                  </div>

                  <div className="review-card span-2" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    <div className="review-card-title" style={{ color: 'var(--color-primary)' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      Subscription & Plan Status
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                      Campus will be registered with status <strong>Pending Activation</strong>. You can configure the subscription plan tier and payment terms from the <strong>Subscriptions</strong> tab using <em>+ New Subscription</em>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="wizard-footer">
                <span className="step-count-text">Step 3 of 3: Review Details</span>
                <div className="wizard-footer-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleReset} style={{ color: '#64748b' }}>↻ Reset Form</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setStep(2)}>← Back</button>
                  <button type="button" className="btn btn-primary btn-sm" style={{ padding: '9px 24px', fontWeight: 700 }} onClick={handleFinalize}>
                    Provision School & Launch ✓
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
