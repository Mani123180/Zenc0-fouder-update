import React, { useState, useEffect } from 'react';

export default function SubscriptionModal({ isOpen, onClose, defaultTab = 'subscription', planObj = null, schools = [], plans = [], onSave }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearDate = nextYear.toISOString().split('T')[0];

  // Subscription Form State
  const [subSchool, setSubSchool] = useState('');
  const [subPlan, setSubPlan] = useState('');
  const [subStatus, setSubStatus] = useState('ACTIVE');
  const [subStart, setSubStart] = useState(today);
  const [subEnd, setSubEnd] = useState(nextYearDate);
  const [subAmount, setSubAmount] = useState('₹35,000');

  // Plan Form State
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planStudents, setPlanStudents] = useState(2500);
  const [planFeatures, setPlanFeatures] = useState('');

  useEffect(() => {
    setActiveTab(defaultTab);
    if (planObj && planObj.maxStudents) {
      setActiveTab('plan');
      setPlanName(planObj.name || '');
      setPlanPrice(planObj.price || '');
      setPlanStudents(planObj.maxStudents || 2500);
      setPlanFeatures(planObj.features || '');
    } else if (planObj && planObj.schoolId) {
      setActiveTab('subscription');
      setSubSchool(planObj.schoolId);
      const matchedPlan = plans.find((p) => p.name === planObj.plan) || plans[0];
      if (matchedPlan) {
        setSubPlan(matchedPlan.name);
        setSubAmount(matchedPlan.price);
      }
      if (planObj.amount && planObj.amount !== 'Pending') {
        setSubAmount(planObj.amount);
      }
      if (planObj.startDate && planObj.startDate !== '—') {
        setSubStart(planObj.startDate);
      } else {
        setSubStart(today);
      }
      if (planObj.endDate && planObj.endDate !== '—') {
        setSubEnd(planObj.endDate);
      } else {
        setSubEnd(nextYearDate);
      }
      setSubStatus('ACTIVE');
    } else {
      setPlanName('');
      setPlanPrice('');
      setPlanStudents(2500);
      setPlanFeatures('');
      if (schools.length > 0 && !subSchool) {
        setSubSchool(schools[0].id || schools[0].schoolId);
      }
      if (plans.length > 0 && !subPlan) {
        setSubPlan(plans[0].name);
        setSubAmount(plans[0].price);
      }
    }
  }, [defaultTab, planObj, isOpen, schools, plans]);

  useEffect(() => {
    if (schools.length > 0 && !subSchool && !planObj) {
      setSubSchool(schools[0].id || schools[0].schoolId);
    }
    if (plans.length > 0 && !subPlan && !planObj) {
      setSubPlan(plans[0].name);
      setSubAmount(plans[0].price);
    }
  }, [schools, plans]);

  if (!isOpen) return null;

  const handleSubPlanChange = (val) => {
    setSubPlan(val);
    const found = plans.find((p) => p.name === val);
    if (found) {
      setSubAmount(found.price);
    }
  };

  const handleSaveSub = (e) => {
    e.preventDefault();
    const targetSchool = schools.find((s) => (s.id && s.id === subSchool) || (s.schoolId && s.schoolId === subSchool));
    const newSub = {
      id: (planObj && planObj.id) ? planObj.id : ('SUB-' + ((targetSchool && targetSchool.code) ? targetSchool.code.replace(/[^A-Z0-9]/gi, '').toUpperCase() : Math.floor(10 + Math.random() * 90)) + '-01'),
      schoolId: subSchool,
      school: targetSchool ? targetSchool.name : 'School Campus',
      plan: subPlan || (plans[0] ? plans[0].name : 'Pro Plan'),
      startDate: subStart,
      endDate: subEnd,
      amount: subAmount,
      status: subStatus,
    };
    onSave({ type: 'subscription', data: newSub });
    onClose();
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    const newPlan = {
      id: planObj ? planObj.id : 'PLAN-0' + (plans.length + 1),
      name: planName,
      price: planPrice,
      maxStudents: Number(planStudents),
      features: planFeatures,
    };
    onSave({ type: 'plan', data: newPlan, isEdit: !!planObj });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">
            {planObj ? `Configure Plan — ${planObj.name}` : 'Subscription Management'}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div id="modal-body">
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>SaaS Subscription & Plan Configurator</h4>
                <p>
                  {activeTab === 'plan'
                    ? 'Configure SaaS pricing packages, student capacity limits, and module features.'
                    : 'Enroll a school campus into an active subscription license and configure billing terms.'}
                </p>
              </div>
            </div>

            {/* PANE 1: Assign School Subscription */}
            {activeTab === 'subscription' && (
              <form onSubmit={handleSaveSub}>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>School Campus <span className="req">*</span></label>
                    <select value={subSchool} required onChange={(e) => setSubSchool(e.target.value)}>
                      <option value="">-- Choose School Campus --</option>
                      {schools.map((s) => (
                        <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                          {s.name} ({s.code || s.id || s.schoolId}) [{s.subscription || 'Pending Activation'}]
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Subscription Plan Tier <span className="req">*</span></label>
                    <select value={subPlan} required onChange={(e) => handleSubPlanChange(e.target.value)}>
                      {plans.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Initial License Status <span className="req">*</span></label>
                    <select value={subStatus} required onChange={(e) => setSubStatus(e.target.value)}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Start Validity Date <span className="req">*</span></label>
                    <input type="date" value={subStart} required onChange={(e) => setSubStart(e.target.value)} />
                  </div>
                  <div className="wizard-field">
                    <label>Expiry / End Date <span className="req">*</span></label>
                    <input type="date" value={subEnd} required onChange={(e) => setSubEnd(e.target.value)} />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Annual Subscription Fee (₹) <span className="req">*</span></label>
                    <input type="text" value={subAmount} required onChange={(e) => setSubAmount(e.target.value)} />
                    <span className="input-hint">Default pricing matches selected tier; customize if special institutional terms apply.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Activate & Save Subscription ✓</button>
                </div>
              </form>
            )}

            {/* PANE 2: Create / Edit Plan Tier */}
            {activeTab === 'plan' && (
              <form onSubmit={handleSavePlan}>
                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Plan Tier Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={planName}
                      placeholder="e.g. Ultra Campus Plan / Starter Plan"
                      required
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Annual Price (₹) <span className="req">*</span></label>
                    <input
                      type="text"
                      value={planPrice}
                      placeholder="e.g. ₹45,000/yr"
                      required
                      onChange={(e) => setPlanPrice(e.target.value)}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Max Students Limit <span className="req">*</span></label>
                    <input
                      type="number"
                      value={planStudents}
                      placeholder="e.g. 2500"
                      required
                      min="50"
                      onChange={(e) => setPlanStudents(e.target.value)}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Included Features & Modules <span className="req">*</span></label>
                    <textarea
                      rows="3"
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontFamily: 'inherit', fontSize: '0.9rem' }}
                      placeholder="e.g. Attendance, Online Fee Portal, SMS Gateway, Live GPS Tracking, Custom Mobile App"
                      required
                      value={planFeatures}
                      onChange={(e) => setPlanFeatures(e.target.value)}
                    ></textarea>
                    <span className="input-hint">List modules separated by commas (e.g. Attendance, Marks, Online Fee Portal).</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>
                    {planObj ? 'Save Plan Changes ✓' : 'Save Plan Tier ✓'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
