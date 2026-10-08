import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuperAdminView from './portal/SuperAdminView';
import SchoolAdminView from './portal/SchoolAdminView';
import AcademicRolesView from './portal/AcademicRolesView';

// Exact SVG icons matching js/portal.js lines 80-100
const saIcons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>
    </svg>
  ),
  schools: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M14 7h1"></path><path d="M9 11h1"></path><path d="M14 11h1"></path><path d="M9 15h1"></path><path d="M14 15h1"></path><path d="M10 21v-4h4v4"></path>
    </svg>
  ),
  admins: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  services: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  subscriptions: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  billing: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),

  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
};

const schIcons = {
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  principal: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
  teachers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  students: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
  parents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"></path></svg>,
  classes: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  subjects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  announcements: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  reports: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  messaging: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
};

export default function Portal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentRole = user ? user.role.toLowerCase() : 'superadmin';

  // Exact Role Menus Configuration matching js/portal.js lines 102-161
  const menuConfig = {
    superadmin: [
      { id: 'sa-dashboard', label: 'Dashboard', icon: saIcons.dashboard },
      { id: 'sa-schools', label: 'Schools', icon: saIcons.schools },
      { id: 'sa-admin-management', label: 'Admin Management', icon: saIcons.admins },
      { id: 'sa-services', label: 'Services', icon: saIcons.services },
      { id: 'sa-subscriptions', label: 'Subscription', icon: saIcons.subscriptions },
      { id: 'sa-billing', label: 'Bills / Billing', icon: saIcons.billing },

      { id: 'sa-settings', label: 'Settings', icon: saIcons.settings },
    ],
    schooladmin: [
      { id: 'school-admin-users', label: 'User Management', icon: schIcons.users },
      { id: 'manage-principal', label: 'Manage Principal', icon: schIcons.principal },
      { id: 'manage-teachers', label: 'Manage Teachers', icon: schIcons.teachers },
      { id: 'manage-students', label: 'Manage Students', icon: schIcons.students },
      { id: 'manage-parents', label: 'Manage Parents', icon: schIcons.parents },
      { id: 'manage-classes', label: 'Manage Classes', icon: schIcons.classes },
      { id: 'manage-subjects', label: 'Manage Subjects', icon: schIcons.subjects },
      { id: 'publish-announcements', label: 'Announcements', icon: schIcons.announcements },
      { id: 'view-reports', label: 'School Reports', icon: schIcons.reports },
      { id: 'secure-messaging', label: 'Secure Messaging', icon: schIcons.messaging },
    ],
    principal: [
      { id: 'attendance-reports', label: 'Attendance Reports', icon: schIcons.reports },
      { id: 'academic-performance', label: 'Academic Performance', icon: saIcons.dashboard },
      { id: 'school-announcements', label: 'School Announcements', icon: schIcons.announcements },
      { id: 'communication-teachers', label: 'Communication with Teachers', icon: schIcons.messaging },
      { id: 'school-reports', label: 'School Reports', icon: schIcons.reports },
      { id: 'dashboard-analytics', label: 'Dashboard Analytics', icon: saIcons.dashboard },
    ],
    teacher: [
      { id: 'my-classes', label: 'My Classes', icon: schIcons.classes },
      { id: 'student-list', label: 'Student List', icon: schIcons.students },
      { id: 'attendance-management', label: 'Attendance Management', icon: schIcons.users },
      { id: 'assignments', label: 'Homework & Assignments', icon: schIcons.subjects },
      { id: 'study-materials', label: 'Study Materials', icon: schIcons.subjects },
      { id: 'announcements', label: 'Announcements', icon: schIcons.announcements },
      { id: 'secure-messaging', label: 'Secure Messaging', icon: schIcons.messaging },
      { id: 'timetable', label: 'Timetable', icon: saIcons.dashboard },
    ],
    student: [
      { id: 'view-dashboard', label: 'View Dashboard', icon: saIcons.dashboard },
      { id: 'check-attendance', label: 'Check Attendance', icon: schIcons.reports },
      { id: 'view-timetable', label: 'View Timetable', icon: saIcons.dashboard },
      { id: 'download-materials', label: 'Study Materials', icon: schIcons.subjects },
      { id: 'submit-assignments', label: 'Submit Homework & Assignments', icon: schIcons.subjects },
      { id: 'view-homework', label: 'View Homework', icon: schIcons.subjects },
      { id: 'receive-announcements', label: 'Announcements', icon: schIcons.announcements },
      { id: 'chat-teachers', label: 'Chat with Teachers', icon: schIcons.messaging },
      { id: 'track-exams', label: 'Track Upcoming Exams', icon: schIcons.reports },
    ],
    parent: [
      { id: 'child-information', label: 'Child Information', icon: schIcons.students },
      { id: 'attendance-tracking', label: 'Attendance Tracking', icon: schIcons.reports },
      { id: 'homework', label: 'Homework & Assignments', icon: schIcons.subjects },
      { id: 'exam-results', label: 'Exam Results', icon: schIcons.reports },
      { id: 'fee-reminders', label: 'Fee Reminders', icon: saIcons.billing },
      { id: 'school-announcements', label: 'School Announcements', icon: schIcons.announcements },
      { id: 'messaging-teachers', label: 'Messaging with Teachers', icon: schIcons.messaging },
    ],
  };

  const currentMenu = menuConfig[currentRole] || menuConfig.superadmin;
  const [activeTab, setActiveTab] = useState(currentMenu[0]?.id || 'sa-dashboard');

  useEffect(() => {
    const newMenu = menuConfig[currentRole] || menuConfig.superadmin;
    setActiveTab(newMenu[0]?.id || 'sa-dashboard');
  }, [currentRole]);

  const getRoleDisplayName = () => {
    if (currentRole === 'superadmin') return 'Super Administrator';
    if (currentRole === 'schooladmin') return 'School Administrator';
    if (currentRole === 'principal') return 'Principal';
    if (currentRole === 'teacher') return 'Faculty Teacher';
    if (currentRole === 'student') return 'Student';
    if (currentRole === 'parent') return 'Parent / Guardian';
    return user?.role || 'User';
  };

  const getSchoolDisplayName = () => {
    if (currentRole === 'superadmin') return 'Platform Central Multi-Tenant';
    return user?.schoolName || 'Sri Sankara Vidhyasala Girls High School';
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (currentRole === 'superadmin' ? 'S' : 'U');

  return (
    <>
      {/* Clean Portal Header matching portal.html lines 1315-1332 */}
      <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '1px solid rgba(30, 58, 138, 0.1)' }}>
        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' }}>
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <img src="/images/emblem.png" alt="ZenSchool Emblem" style={{ height: '48px', width: 'auto', borderRadius: 0 }} />
            <div className="logo-text">
              ZenSchool Platform
              <span className="logo-sub" id="header-school-name">Multi-School Management</span>
            </div>
          </Link>

        </div>
      </header>

      {/* Main Portal Section */}
      <div className="portal-section" style={{ minHeight: 'calc(100vh - 70px)', padding: '30px 0' }}>
        <div className="container portal-layout">
          {/* Sidebar matching portal.html lines 1337-1350 */}
          <aside className="portal-sidebar">
            <div className="user-badge">
              <div className="user-avatar" id="avatar-initials">
                {userInitial}
              </div>
              <div className="user-info">
                <h3 id="user-display-name">{user?.name || (currentRole === 'superadmin' ? 'ZenSchool Super Admin' : 'User')}</h3>
                <span id="user-display-role">{getRoleDisplayName()}</span>
                <div id="user-display-school" style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '2px' }}>
                  {getSchoolDisplayName()}
                </div>
              </div>
            </div>

            <div className="sidebar-menu" id="portal-menu">
              {currentMenu.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button
              className="btn logout-btn"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{ width: '100%', borderRadius: '50px', fontWeight: 600 }}
            >
              Sign Out
            </button>
          </aside>

          {/* Main Panel matching portal.html lines 1353-1366 */}
          <main className="portal-main">
            {currentRole === 'superadmin' && <SuperAdminView activeTab={activeTab} />}
            {currentRole === 'schooladmin' && <SchoolAdminView activeTab={activeTab} />}
            {['principal', 'teacher', 'student', 'parent'].includes(currentRole) && (
              <AcademicRolesView role={currentRole} user={user} activeTab={activeTab} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
