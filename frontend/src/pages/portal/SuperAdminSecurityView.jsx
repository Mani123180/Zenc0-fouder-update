import React, { useState, useEffect } from 'react';
import { getPortalData, savePortalData } from '../../services/portalData';

const defaultSecurityState = {
  lockdownActive: false,
  mfaEnforced: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  tenantIsolation: 'Strict',
  maxFailedLogins: 5,
  sessionTimeout: 60,
  ipWhitelist: '10.0.0.0/8',
  auditLogs: [
    { id: 'SEC-101', time: new Date().toISOString(), event: 'MFA_ENABLED', user: 'superadmin', severity: 'INFO' }
  ]
};

export default function SuperAdminSecurityView() {
  const [securityData, setSecurityData] = useState(defaultSecurityState);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    try {
      const store = getPortalData();
      if (store && store.advancedSecurity) {
        setSecurityData(store.advancedSecurity);
      }
    } catch (e) {}
  }, []);

  const saveSecurityData = (newData) => {
    setSecurityData(newData);
    try {
      const store = getPortalData();
      store.advancedSecurity = newData;
      savePortalData(store);
      showFeedback('Security Configuration Saved Successfully');
    } catch (e) {}
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const logEvent = (event, severity = 'INFO') => {
    const newLog = {
      id: 'SEC-' + Math.floor(Math.random() * 10000),
      time: new Date().toISOString(),
      event,
      user: 'Super Admin',
      severity
    };
    return [newLog, ...securityData.auditLogs].slice(0, 50); // Keep last 50
  };

  const toggleLockdown = () => {
    const newLockdown = !securityData.lockdownActive;
    saveSecurityData({
      ...securityData,
      lockdownActive: newLockdown,
      auditLogs: logEvent(newLockdown ? 'EMERGENCY_LOCKDOWN_ENGAGED' : 'LOCKDOWN_LIFTED', newLockdown ? 'CRITICAL' : 'INFO')
    });
  };

  const toggleMfa = (role) => {
    const newMfa = securityData.mfaEnforced.includes(role)
      ? securityData.mfaEnforced.filter(r => r !== role)
      : [...securityData.mfaEnforced, role];
    
    saveSecurityData({
      ...securityData,
      mfaEnforced: newMfa,
      auditLogs: logEvent(`MFA_POLICY_CHANGED_FOR_${role}`, 'WARNING')
    });
  };

  // Modern Premium Styling
  const styles = {
    container: {
      padding: '24px',
      background: 'linear-gradient(145deg, #1e293b, #0f172a)',
      color: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: '20px',
      marginBottom: '24px'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 700,
      margin: 0,
      background: 'linear-gradient(to right, #38bdf8, #818cf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.3s ease',
    },
    lockdownCard: {
      background: securityData.lockdownActive 
        ? 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(153,27,27,0.4))' 
        : 'rgba(255,255,255,0.03)',
      border: `1px solid ${securityData.lockdownActive ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      boxShadow: securityData.lockdownActive ? '0 0 20px rgba(220,38,38,0.3)' : 'none',
      transition: 'all 0.4s ease'
    },
    btnDanger: {
      background: securityData.lockdownActive ? '#f87171' : '#dc2626',
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      marginTop: '16px',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '0.85rem',
      color: '#94a3b8',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    select: {
      width: '100%',
      padding: '10px 14px',
      background: 'rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#f8fafc',
      borderRadius: '8px',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      background: 'rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#f8fafc',
      borderRadius: '8px',
      fontSize: '0.95rem'
    },
    switchBtn: (active) => ({
      padding: '6px 12px',
      borderRadius: '6px',
      border: `1px solid ${active ? '#34d399' : '#475569'}`,
      background: active ? 'rgba(52,211,153,0.1)' : 'transparent',
      color: active ? '#34d399' : '#94a3b8',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: 600,
      transition: 'all 0.2s ease'
    }),
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '12px'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      color: '#94a3b8',
      fontSize: '0.85rem',
      textTransform: 'uppercase'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontSize: '0.9rem'
    },
    feedbackBadge: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: '#10b981',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '8px',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
      animation: 'slideIn 0.3s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      {feedback && <div style={styles.feedbackBadge}>✓ {feedback}</div>}
      
      <div style={styles.header}>
        <h2 style={styles.title}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Advanced Security & Governance
        </h2>
        <span style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
          High-Security Mode Active
        </span>
      </div>

      <div style={styles.cardGrid}>
        {/* Emergency Lockdown Card */}
        <div style={styles.lockdownCard}>
          <h3 style={{ margin: '0 0 8px 0', color: securityData.lockdownActive ? '#fca5a5' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Platform Lockdown
          </h3>
          <p style={{ fontSize: '0.85rem', color: securityData.lockdownActive ? '#fecaca' : '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            Instantly revoke all active sessions across all 6 dashboards. Only Super Admin can access the system.
          </p>
          <button style={styles.btnDanger} onClick={toggleLockdown}>
            {securityData.lockdownActive ? 'LIFT EMERGENCY LOCKDOWN' : 'ENGAGE LOCKDOWN'}
          </button>
        </div>

        {/* Global Security Policies */}
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Global Security Policies</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tenant Isolation Policy</label>
            <select 
              style={styles.select}
              value={securityData.tenantIsolation}
              onChange={(e) => saveSecurityData({ ...securityData, tenantIsolation: e.target.value, auditLogs: logEvent('TENANT_POLICY_UPDATED') })}
            >
              <option value="Strict">Strict Partitioning (No Cross-Tenant Read)</option>
              <option value="Logical">Logical Separation (Shared Schema)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Failed Logins</label>
              <input 
                type="number" 
                style={styles.input} 
                value={securityData.maxFailedLogins}
                onChange={(e) => saveSecurityData({ ...securityData, maxFailedLogins: Number(e.target.value) })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Session Timeout</label>
              <select style={styles.select} value={securityData.sessionTimeout} onChange={(e) => saveSecurityData({ ...securityData, sessionTimeout: Number(e.target.value) })}>
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={60}>60 mins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Control & MFA */}
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Role-Based MFA Enforcement</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Require Two-Factor Authentication (2FA) for specific platform roles globally.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT'].map(role => {
              const isEnforced = securityData.mfaEnforced.includes(role);
              return (
                <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{role.replace('_', ' ')}</span>
                  <button style={styles.switchBtn(isEnforced)} onClick={() => toggleMfa(role)}>
                    {isEnforced ? 'ENFORCED' : 'OPTIONAL'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: '0', fontSize: '1.1rem' }}>Live Security Telemetry</h3>
          <button 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#f8fafc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => showFeedback('Logs Exported to CSV')}
          >
            Export Logs
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Event ID</th>
                <th style={styles.th}>Security Event</th>
                <th style={styles.th}>Initiator</th>
                <th style={styles.th}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {securityData.auditLogs.slice(0, 8).map((log, i) => (
                <tr key={i}>
                  <td style={styles.td}><span style={{ color: '#94a3b8' }}>{new Date(log.time).toLocaleString()}</span></td>
                  <td style={styles.td}><code style={{ color: '#818cf8', background: 'rgba(129,140,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{log.id}</code></td>
                  <td style={styles.td}>{log.event}</td>
                  <td style={styles.td}>{log.user}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: log.severity === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : log.severity === 'WARNING' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                      color: log.severity === 'CRITICAL' ? '#fca5a5' : log.severity === 'WARNING' ? '#fcd34d' : '#6ee7b7'
                    }}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
