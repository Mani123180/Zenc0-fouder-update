// ============================================================================
// ZenSchool Multi-School Platform Portal Engine
// Multi-Tenant Architecture, Strict RBAC & Data Isolation
// ============================================================================
// Global Safe String Escape Utility
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session Check & Validation
  let session = JSON.parse(localStorage.getItem('ssv_portal_user'));
  if (!session) {
    session = {
      role: 'SCHOOL_ADMIN',
      username: 'admin@ssvschool.com',
      name: 'School Administrator (SSV)',
      schoolId: 'SCHOOL002',
      schoolName: 'Sri Sankara Vidhyasala Girls High School'
    };
    localStorage.setItem('ssv_portal_user', JSON.stringify(session));
  }

  // Normalize role
  const roleAliases = {
    'superadmin': 'SUPER_ADMIN',
    'admin': 'SCHOOL_ADMIN',
    'principal': 'PRINCIPAL',
    'teacher': 'TEACHER',
    'student': 'STUDENT',
    'parent': 'PARENT'
  };
  const currentRole = roleAliases[session.role] || session.role;
  session.role = currentRole;

  // Display User Information & Context
  const roleDisplayNames = {
    SUPER_ADMIN: 'Super Administrator',
    SCHOOL_ADMIN: 'School Administrator',
    PRINCIPAL: 'Principal',
    TEACHER: 'Teacher',
    STUDENT: 'Student',
    PARENT: 'Parent'
  };

  const userName = session.name || session.username;
  const userRoleLabel = roleDisplayNames[currentRole] || currentRole;

  document.getElementById('user-display-name').textContent = userName;
  document.getElementById('user-display-role').textContent = userRoleLabel;
  document.getElementById('avatar-initials').textContent = (userName || 'User')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Header School Branding - Keep global multi-school brand clean in top bar
  const headerSchool = document.getElementById('header-school-name');
  const userDisplaySchool = document.getElementById('user-display-school');
  const schoolBadge = document.getElementById('school-context-badge');
  if (schoolBadge) schoolBadge.style.display = 'none';
  if (headerSchool) headerSchool.textContent = 'Multi-School Management';

  if (currentRole === 'SUPER_ADMIN') {
    if (userDisplaySchool) userDisplaySchool.textContent = 'Platform Central';
  } else {
    const schoolName = session.schoolName || 'Assigned School';
    if (userDisplaySchool) userDisplaySchool.textContent = schoolName;
  }

  // 2. Setup Portal Sidebar Menus based on Role
  const saIcons = {
    dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
    schools: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M14 7h1"></path><path d="M9 11h1"></path><path d="M14 11h1"></path><path d="M9 15h1"></path><path d="M14 15h1"></path><path d="M10 21v-4h4v4"></path></svg>`,
    admins: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    services: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    subscriptions: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
    billing: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
  };

  const schIcons = {
    users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    teachers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    students: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    parents: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"></path></svg>`,
    classes: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    subjects: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    announcements: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
    reports: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    messaging: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
  };

  const menuConfig = {
    SUPER_ADMIN: [
      { id: 'sa-dashboard', label: 'Dashboard', icon: saIcons.dashboard },
      { id: 'sa-schools', label: 'Schools', icon: saIcons.schools },
      { id: 'sa-admin-management', label: 'Admin Management', icon: saIcons.admins },
      { id: 'sa-services', label: 'Services', icon: saIcons.services },
      { id: 'sa-subscriptions', label: 'Subscription', icon: saIcons.subscriptions },
      { id: 'sa-billing', label: 'Bills / Billing', icon: saIcons.billing },
      { id: 'sa-settings', label: 'Settings', icon: saIcons.settings }
    ],
    SCHOOL_ADMIN: [
      { id: 'school-admin-users', label: 'User Management', icon: schIcons.users },
      { id: 'manage-teachers', label: 'Manage Teachers', icon: schIcons.teachers },
      { id: 'manage-students', label: 'Manage Students', icon: schIcons.students },
      { id: 'manage-parents', label: 'Manage Parents', icon: schIcons.parents },
      { id: 'manage-classes', label: 'Manage Classes', icon: schIcons.classes },
      { id: 'manage-subjects', label: 'Manage Subjects', icon: schIcons.subjects },
      { id: 'publish-announcements', label: 'Announcements', icon: schIcons.announcements },
      { id: 'view-reports', label: 'School Reports', icon: schIcons.reports },
      { id: 'secure-messaging', label: 'Secure Messaging', icon: schIcons.messaging }
    ],
    PRINCIPAL: [
      { id: 'attendance-reports', label: 'Attendance Reports', icon: '📋' },
      { id: 'academic-performance', label: 'Academic Performance', icon: '🏆' },
      { id: 'school-announcements', label: 'School Announcements', icon: '📢' },
      { id: 'communication-teachers', label: 'Communication with Teachers', icon: '✉️' },
      { id: 'school-reports', label: 'School Reports', icon: '📂' },
      { id: 'dashboard-analytics', label: 'Dashboard Analytics', icon: '📊' }
    ],
    TEACHER: [
      { id: 'my-classes', label: 'My Classes', icon: '📅' },
      { id: 'student-list', label: 'Student List', icon: '👥' },
      { id: 'attendance-management', label: 'Attendance Management', icon: '✓' },
      { id: 'assignments', label: 'Homework & Assignments', icon: '📝' },
      { id: 'study-materials', label: 'Study Materials', icon: '📁' },
      { id: 'announcements', label: 'Announcements', icon: '📢' },
      { id: 'secure-messaging', label: 'Secure Messaging', icon: '💬' },
      { id: 'timetable', label: 'Timetable', icon: '🕒' }
    ],
    STUDENT: [
      { id: 'view-dashboard', label: 'View Dashboard', icon: '📊' },
      { id: 'check-attendance', label: 'Check Attendance', icon: '📅' },
      { id: 'view-timetable', label: 'View Timetable', icon: '🕒' },
      { id: 'download-materials', label: 'Study Materials', icon: '⬇️' },
      { id: 'submit-assignments', label: 'Submit Homework & Assignments', icon: '📤' },
      { id: 'view-homework', label: 'View Homework', icon: '📖' },
      { id: 'receive-announcements', label: 'Announcements', icon: '📢' },
      { id: 'chat-teachers', label: 'Chat with Teachers', icon: '💬' },
      { id: 'track-exams', label: 'Track Upcoming Exams', icon: '📝' }
    ],
    PARENT: [
      { id: 'child-information', label: 'Child Information', icon: '👧' },
      { id: 'attendance-tracking', label: 'Attendance Tracking', icon: '📈' },
      { id: 'homework', label: 'Homework & Assignments', icon: '📖' },
      { id: 'exam-results', label: 'Exam Results', icon: '🏆' },
      { id: 'fee-reminders', label: 'Fee Reminders', icon: '💳' },
      { id: 'school-announcements', label: 'School Announcements', icon: '📢' },
      { id: 'messaging-teachers', label: 'Messaging with Teachers', icon: '💬' }
    ]
  };

  const menuContainer = document.getElementById('portal-menu');
  const userMenu = menuConfig[currentRole] || [];

  menuContainer.innerHTML = '';
  userMenu.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `menu-item ${index === 0 ? 'active' : ''}`;
    btn.innerHTML = item.icon ? `<span class="menu-icon">${item.icon}</span> <span>${item.label}</span>` : `<span>${item.label}</span>`;
    btn.onclick = () => activateTab(item.id, btn);
    menuContainer.appendChild(btn);
  });

  // Default content render
  if (userMenu.length > 0) {
    renderTabContent(userMenu[0].id);
  }

  // Mobile Menu Toggle for Portal Sidebar
  const menuToggle = document.querySelector('.menu-toggle');
  const portalSidebar = document.querySelector('.portal-sidebar');

  if (menuToggle && portalSidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      portalSidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });

    portalSidebar.addEventListener('click', (e) => {
      if (e.target.closest('.menu-item') || e.target.closest('.logout-btn')) {
        menuToggle.classList.remove('active');
        portalSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!portalSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        portalSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      }
    });
  }
});

function handleLogout() {
  localStorage.removeItem('ssv_portal_user');
  window.location.href = 'login.html';
}

// RBAC Authorization Guard
function activateTab(tabId, btnElement) {
  const session = JSON.parse(localStorage.getItem('ssv_portal_user'));
  const currentRole = session ? session.role : '';
  const unauthorizedBanner = document.getElementById('unauthorized-banner');

  // Enforce Route Protection
  const isSaTab = tabId.startsWith('sa-');
  if (isSaTab && currentRole !== 'SUPER_ADMIN') {
    if (unauthorizedBanner) {
      unauthorizedBanner.style.display = 'block';
      setTimeout(() => { unauthorizedBanner.style.display = 'none'; }, 5000);
    }
    return;
  }
  if (!isSaTab && currentRole === 'SUPER_ADMIN') {
    // Super admin visiting school level tab directly
  }

  if (unauthorizedBanner) unauthorizedBanner.style.display = 'none';

  document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderTabContent(tabId);
}

// ============================================================================
// Multi-Tenant Master Database & State Model
// ============================================================================

const defaultDemoData = {
  schools: [
    {
      id: 'SCHOOL002',
      name: 'Sri Sankara Vidhyasala Girls High School',
      code: 'SSV-KOD',
      city: 'Kodumudi',
      phone: '+91 98456 12301',
      email: 'info@ssvgirlsschool.edu',
      principal: 'Dr. Savithri Raman',
      academicYear: '2026-2027',
      admin: 'admin@ssvschool.com',
      adminName: 'Mrs. Savithri Raman',
      status: 'Active',
      studentsCount: 482,
      teachersCount: 34,
      parentsCount: 460,
      subscription: 'Enterprise Plan',
      createdDate: '2026-02-15'
    },
    {
      id: 'SCHOOL001',
      name: 'ABC Matriculation School',
      code: 'ABC-CHE',
      city: 'Chennai',
      phone: '+91 94433 11223',
      email: 'contact@abcschool.com',
      principal: 'Dr. K. Ramanathan',
      academicYear: '2026-2027',
      admin: 'admin@abcschool.com',
      adminName: 'Admin Rajesh',
      status: 'Active',
      studentsCount: 520,
      teachersCount: 28,
      parentsCount: 480,
      subscription: 'Pro Plan',
      createdDate: '2026-01-10'
    },
    {
      id: 'SCHOOL003',
      name: 'St. Marys Academy',
      code: 'STM-ERD',
      city: 'Erode',
      phone: '+91 97890 45678',
      email: 'office@stmarys.edu',
      principal: 'Fr. Thomas Varghese',
      academicYear: '2026-2027',
      admin: 'admin@stmarys.com',
      adminName: 'Admin Joseph',
      status: 'Active',
      studentsCount: 650,
      teachersCount: 42,
      parentsCount: 620,
      subscription: 'Pro Plan',
      createdDate: '2026-03-01'
    },
    {
      id: 'SCHOOL005',
      name: 'Oxford International Academy',
      code: 'OXF-CHN',
      city: 'Chennai',
      phone: '+91 91234 56789',
      email: 'admin@oxford.edu',
      principal: 'Mr. David Paul',
      academicYear: '2026-2027',
      admin: 'admin@oxford.edu',
      adminName: 'Admin Vikram',
      status: 'Inactive',
      studentsCount: 320,
      teachersCount: 22,
      parentsCount: 310,
      subscription: 'Basic Plan',
      createdDate: '2025-08-12'
    },
    {
      id: 'SCHOOL004',
      name: 'Delhi Public World School',
      code: 'DPW-CBE',
      city: 'Coimbatore',
      phone: '+91 94888 23456',
      email: 'contact@dpwschool.edu',
      principal: 'Mrs. Anitha Sharma',
      academicYear: '2026-2027',
      admin: 'admin@dpwschool.edu',
      adminName: 'Admin Anitha',
      status: 'Active',
      studentsCount: 710,
      teachersCount: 45,
      parentsCount: 680,
      subscription: 'Enterprise Plan',
      createdDate: '2026-02-01'
    }
  ],

  users: [
    { id: 'USR001', name: 'ZenSchool Super Admin', email: 'superadmin@zenschool.com', phone: '+91 98401 11001', username: 'superadmin', password: 'SuperAdmin@123', role: 'SUPER_ADMIN', schoolId: null, schoolName: 'Platform Central', status: 'Active', createdDate: '2025-01-01' },
    { id: 'USR003', name: 'School Administrator (SSV)', email: 'admin@ssvschool.com', phone: '+91 98401 22002', username: 'admin_ssv', password: 'admin123', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
    { id: 'USR002', name: 'Admin Rajesh (ABC School)', email: 'admin@abcschool.com', phone: '+91 98401 33003', username: 'admin_abc', password: 'ABC@12345', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', createdDate: '2026-01-10' },
    { id: 'USR004', name: 'Admin Joseph (St. Marys)', email: 'admin@stmarys.com', phone: '+91 98401 44004', username: 'admin_stm', password: 'STM@12345', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', createdDate: '2026-03-01' },
    { id: 'USR005', name: 'Admin Vikram (Oxford)', email: 'admin@oxford.edu', phone: '+91 98401 55005', username: 'admin_oxf', password: 'OXF@12345', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL005', schoolName: 'Oxford International Academy', status: 'Inactive', createdDate: '2025-08-12' },
    { id: 'USR006', name: 'Dr. Savithri Raman', email: 'principal@ssvschool.com', phone: '+91 98401 66006', username: 'principal', password: 'principal123', role: 'PRINCIPAL', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
    { id: 'USR007', name: 'Mrs. Priya Krishnan', email: 'teacher@ssvschool.com', phone: '+91 98401 77007', username: 'teacher', password: 'teacher123', role: 'TEACHER', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
    { id: 'USR008', name: 'Aishwarya Kumar', email: 'student@ssvschool.com', phone: '+91 98401 88008', username: 'student', password: 'student123', role: 'STUDENT', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
    { id: 'USR009', name: 'Ramesh Kumar', email: 'parent@ssvschool.com', phone: '+91 98401 99009', username: 'parent', password: 'parent123', role: 'PARENT', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15', studentName: 'Aishwarya Kumar', studentRoll: 'S101', relationship: 'Father' }
  ],

  teachers: [
    { id: 'T01', name: 'Mrs. Priya Krishnan', subject: 'Mathematics', class: 'Grade 10-A', schoolId: 'SCHOOL002', status: 'Active' },
    { id: 'T02', name: 'Dr. Anandhi Rajan', subject: 'Physics', class: 'Grade 11-B', schoolId: 'SCHOOL002', status: 'Active' },
    { id: 'T03', name: 'Mrs. Selvi Murugan', subject: 'Chemistry', class: 'Grade 9-A', schoolId: 'SCHOOL002', status: 'Active' }
  ],

  students: [
    {
      roll: 'S101',
      name: 'Aishwarya Kumar',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '96%',
      performance: 'Outstanding',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 98, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 92, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 86, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 94, grade: 'A+' },
        { subject: 'English', max: 100, scored: 90, grade: 'A+' }
      ]
    },
    {
      roll: 'S102',
      name: 'Kavitha Selvam',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '92%',
      performance: 'Very Good',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 88, grade: 'A' },
        { subject: 'Physics', max: 100, scored: 84, grade: 'A' },
        { subject: 'Chemistry', max: 100, scored: 90, grade: 'A+' },
        { subject: 'Tamil', max: 100, scored: 85, grade: 'A' },
        { subject: 'English', max: 100, scored: 82, grade: 'A' }
      ]
    },
    {
      roll: 'S103',
      name: 'Sandhya Ramesh',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '88%',
      performance: 'Good',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 74, grade: 'B' },
        { subject: 'Physics', max: 100, scored: 78, grade: 'B' },
        { subject: 'Chemistry', max: 100, scored: 'AB', grade: 'AB' },
        { subject: 'Tamil', max: 100, scored: 80, grade: 'A' },
        { subject: 'English', max: 100, scored: 76, grade: 'B' }
      ]
    },
    {
      roll: 'S104',
      name: 'Deepa Venkatesh',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '94%',
      performance: 'Outstanding',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 95, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 91, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 89, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 92, grade: 'A+' },
        { subject: 'English', max: 100, scored: 88, grade: 'A' }
      ]
    },
    {
      roll: 'S105',
      name: 'Meena Natarajan',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '90%',
      performance: 'Very Good',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 82, grade: 'A' },
        { subject: 'Physics', max: 100, scored: 85, grade: 'A' },
        { subject: 'Chemistry', max: 100, scored: 80, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 'AB', grade: 'AB' },
        { subject: 'English', max: 100, scored: 86, grade: 'A' }
      ]
    },
    {
      roll: 'S106',
      name: 'Priyadarshini Sundaram',
      class: 'Grade 11-B',
      schoolId: 'SCHOOL002',
      attendance: '95%',
      performance: 'Outstanding',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 96, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 94, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 90, grade: 'A+' }
      ]
    }
  ],

  classes: [
    { name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', strength: 38, room: 'A-102', schoolId: 'SCHOOL002' },
    { name: 'Grade 11-B', teacher: 'Dr. Anandhi Rajan', strength: 40, room: 'B-204', schoolId: 'SCHOOL002' }
  ],

  classTimetables: [
    { className: 'Grade 10-A', day: 'Monday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Wednesday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Friday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Tuesday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Thursday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Monday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Tuesday', period: 3, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' }
  ],

  subjects: [
    { code: 'MAT-10', name: 'Advanced Mathematics', grade: 'Grade 10', teacher: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { code: 'PHY-11', name: 'Fundamentals of Physics', grade: 'Grade 11', teacher: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' }
  ],

  assignments: [
    { id: 'HW01', title: 'Algebra Equations Exercise', due: '2026-07-28', grade: 'Grade 10-A', subject: 'Mathematics', instructions: 'Solve exercises 3.1 to 3.4 in trigonometry notebook.', assignedBy: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002', assignedDate: '2026-07-20' },
    { id: 'HW02', title: 'Newtonian Laws Essay', due: '2026-07-30', grade: 'Grade 11-B', subject: 'Physics', instructions: 'Read chapter on kinetic energy laws and write 500 words essay.', assignedBy: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002', assignedDate: '2026-07-22' }
  ],

  announcements: [
    { date: '2026-07-25', title: 'District Level Volleyball League', target: 'Sports Team', category: 'Sports', content: 'Girls playing in division level volleyball league report to court by 3:30 PM.', schoolId: 'SCHOOL002' },
    { date: '2026-07-20', title: 'Independence Day Celebrations', target: 'All', category: 'General', content: 'Flag hoisting ceremony starts at 8:00 AM on August 15. Standard uniform mandatory.', schoolId: 'SCHOOL002' }
  ],

  messages: [
    { sender: 'Mrs. Priya Krishnan', contactId: 'c1', text: 'Welcome to the school academic year dashboard. Please check syllabus targets.', time: '10:30 AM', schoolId: 'SCHOOL002' },
    { sender: 'Dr. Anandhi Rajan', contactId: 'c2', text: 'Grade 11 Physics laboratory sessions and equipment checks have been completed.', time: '11:15 AM', schoolId: 'SCHOOL002' },
    { sender: 'Dr. Savithri Raman', contactId: 'c3', text: 'Good day! Please ensure all daily attendance logs are submitted before 11:00 AM.', time: '09:00 AM', schoolId: 'SCHOOL002' },
    { sender: 'School Admin Desk', contactId: 'c4', text: 'Central Administrative Desk is open for parent inquiries and student transport updates.', time: '08:45 AM', schoolId: 'SCHOOL002' },
    { sender: 'Mrs. Selvi Murugan', contactId: 'c5', text: 'Chemistry test results for Grade 9-A have been evaluated and recorded.', time: '12:10 PM', schoolId: 'SCHOOL002' },
    { sender: 'Ramesh Kumar', contactId: 'c6', text: 'Hello, could you please confirm the schedule for the upcoming secondary board mock examinations?', time: '01:20 PM', schoolId: 'SCHOOL002' }
  ],

  services: [
    { id: 'SRV-01', name: 'Student Management', category: 'Academic', status: 'Active', cost: '₹2,500/mo', description: 'Student admission, roll list, profiles & gradebook tracking.' },
    { id: 'SRV-02', name: 'Teacher Management', category: 'Staff', status: 'Active', cost: '₹2,000/mo', description: 'Staff directory, subject allocations and teaching schedules.' },
    { id: 'SRV-03', name: 'Attendance & SMS Alerts', category: 'Communication', status: 'Available', cost: '₹2,500/mo', description: 'Real-time daily attendance tracking with automated parent SMS notifications.' },
    { id: 'SRV-04', name: 'Online Fee Payment Gateway', category: 'Finance', status: 'Active', cost: '₹5,000/mo', description: 'Integrated UPI, Netbanking and Cards payment processing for school dues.' },
    { id: 'SRV-05', name: 'Digital Library & E-Books', category: 'Academic', status: 'Available', cost: '₹3,500/mo', description: 'Central repository of e-books, study materials and digital syllabus.' },
    { id: 'SRV-06', name: 'GPS Bus Tracking System', category: 'Transport', status: 'Active', cost: '₹4,000/mo', description: 'Live school bus location monitoring for parent security.' },
    { id: 'SRV-07', name: 'Homework & Assignments', category: 'Academic', status: 'Active', cost: '₹2,000/mo', description: 'Online homework publishing, student submission and evaluation.' },
    { id: 'SRV-08', name: 'Secure Communication', category: 'Communication', status: 'Active', cost: '₹1,500/mo', description: 'Direct messaging between teachers, parents, and administrative desk.' }
  ],

  plans: [
    { id: 'PLAN-01', name: 'Basic Plan', maxStudents: 500, price: '₹15,000/yr', features: 'Attendance, Marks, Notices & Student Records' },
    { id: 'PLAN-02', name: 'Pro Plan', maxStudents: 1500, price: '₹35,000/yr', features: 'Basic + Online Fee Portal, SMS Gateway, Assignments' },
    { id: 'PLAN-03', name: 'Enterprise Plan', maxStudents: 5000, price: '₹75,000/yr', features: 'Pro + Custom Mobile App, GPS Tracking, Dedicated Support' }
  ],

  subscriptions: [
    { id: 'SUB-02', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', startDate: '2026-02-15', endDate: '2027-02-14', status: 'ACTIVE', amount: '₹75,000' },
    { id: 'SUB-01', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', startDate: '2026-01-10', endDate: '2027-01-09', status: 'ACTIVE', amount: '₹35,000' },
    { id: 'SUB-03', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', startDate: '2026-03-01', endDate: '2027-02-28', status: 'ACTIVE', amount: '₹35,000' },
    { id: 'SUB-04', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', startDate: '2025-08-12', endDate: '2026-06-30', status: 'EXPIRED', amount: '₹15,000' }
  ],

  bills: [
    { invoiceNo: 'INV-2026-001', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', amount: '₹75,000', dueDate: '2026-02-20', paymentDate: '2026-02-16', status: 'PAID' },
    { invoiceNo: 'INV-2026-002', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', amount: '₹35,000', dueDate: '2026-01-15', paymentDate: '2026-01-12', status: 'PAID' },
    { invoiceNo: 'INV-2026-003', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', amount: '₹35,000', dueDate: '2026-03-10', paymentDate: '2026-03-05', status: 'PAID' },
    { invoiceNo: 'INV-2026-005', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', amount: '₹15,000', dueDate: '2026-06-15', paymentDate: null, status: 'OVERDUE' }
  ],

  activities: [
    { id: 'ACT-1', type: 'sub_activated', text: 'Enterprise Subscription activated for Sri Sankara Vidhyasala Girls High School', time: '1 day ago' },
    { id: 'ACT-2', type: 'payment_received', text: 'Payment received: ₹75,000 (Invoice INV-2026-001) from Sri Sankara Vidhyasala', time: '1 day ago' }
  ]
};

defaultDemoData.version = 'v10_sa_clean_enterprise';

function getSaActivityIcon(type) {
  switch (type) {
    case 'sub_activated':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`;
    case 'payment_received':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
    case 'school_registered':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>`;
    case 'school_activated':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    case 'school_deactivated':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    default:
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

// Initialize / Sync LocalStorage safely without overwriting user changes
let demoData = null;
try {
  const storedData = JSON.parse(localStorage.getItem('ssv_demo_data'));
  if (storedData && storedData.version === defaultDemoData.version) {
    demoData = storedData;
  } else if (storedData) {
    demoData = Object.assign({}, defaultDemoData, storedData);
    if (!demoData.classTimetables || demoData.classTimetables.length === 0) {
      demoData.classTimetables = defaultDemoData.classTimetables;
    }
    // Clean old emojis in activities if any
    if (demoData.activities) {
      demoData.activities.forEach(a => { delete a.icon; });
    }
    demoData.version = defaultDemoData.version;
    if (!demoData.schools || !Array.isArray(demoData.schools) || demoData.schools.length < 5) {
      demoData.schools = defaultDemoData.schools.slice();
    }
    localStorage.setItem('ssv_demo_data', JSON.stringify(demoData));
  } else {
    demoData = defaultDemoData;
    localStorage.setItem('ssv_demo_data', JSON.stringify(demoData));
  }
} catch (e) {
  demoData = defaultDemoData;
  localStorage.setItem('ssv_demo_data', JSON.stringify(demoData));
}

if (!demoData || !demoData.schools || !Array.isArray(demoData.schools) || demoData.schools.length === 0) {
  demoData = Object.assign({}, defaultDemoData);
  localStorage.setItem('ssv_demo_data', JSON.stringify(demoData));
}

function updateLocalStorageData() {
  localStorage.setItem('ssv_demo_data', JSON.stringify(demoData));
}

// Data Isolation Helper: Filters collections by schoolId for school-level accounts
function getSchoolData(key) {
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentRole = session.role;
  const list = demoData[key] || [];

  if (currentRole === 'SUPER_ADMIN') {
    return list;
  }

  // School-level user: strictly isolate by session.schoolId or fallback
  const targetSchoolId = session.schoolId || 'SCHOOL002';
  return list.filter(item => !item.schoolId || item.schoolId === targetSchoolId);
}

// ============================================================================
// Main Tab Content Renderer
// ============================================================================

function renderTabContent(tabId) {
  const contentPane = document.getElementById('portal-content');
  const titlePane = document.getElementById('section-title');
  const actionsPane = document.getElementById('section-actions');

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentRole = session.role;

  actionsPane.innerHTML = '';
  contentPane.innerHTML = '';

  // Tab Titles
  const tabTitles = {
    'sa-dashboard': 'Super Admin Dashboard',
    'sa-schools': 'Schools Management',
    'sa-admin-management': 'Admin Management',
    'sa-services': 'Platform Services',
    'sa-subscriptions': 'Subscriptions Management',
    'sa-billing': 'Bills & Billing Management',
    'sa-reports': 'Platform Analytics & Reports',
    'sa-settings': 'Platform Settings',
    'school-admin-users': 'School User Management',
    'manage-teachers': 'Manage Teachers',
    'manage-students': 'Manage Students',
    'manage-parents': 'Manage Parents',
    'manage-classes': 'Manage Classes',
    'manage-subjects': 'Manage Subjects',
    'publish-announcements': 'School Announcements',
    'view-reports': 'Academic & Enrollment Reports',
    'secure-messaging': 'Secure Messaging'
  };

  titlePane.textContent = tabTitles[tabId] || tabId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  switch (tabId) {

    // ========================================================================
    // 1. SUPER ADMIN: DASHBOARD
    // ========================================================================
    case 'sa-dashboard': {
      const schools = demoData.schools || [];
      const users = demoData.users || [];
      const subs = demoData.subscriptions || [];
      const bills = demoData.bills || [];

      const totalSchools = schools.length;
      const activeSchools = schools.filter(s => s.status === 'Active').length;
      const inactiveSchools = schools.filter(s => s.status === 'Inactive').length;
      const totalSchoolAdmins = users.filter(u => u.role === 'SCHOOL_ADMIN').length;

      // Aggregates across schools
      const totalStudents = schools.reduce((sum, s) => sum + (s.studentsCount || 0), 0);
      const totalTeachers = schools.reduce((sum, s) => sum + (s.teachersCount || 0), 0);
      const totalParents = schools.reduce((sum, s) => sum + (s.parentsCount || 0), 0);
      const totalStaff = totalTeachers + totalSchoolAdmins + schools.length; // teachers + admins + principals

      const activeSubs = subs.filter(s => s.status === 'ACTIVE').length;
      const expiringSubs = subs.filter(s => s.status === 'EXPIRED' || s.status === 'PENDING').length;
      const pendingBills = bills.filter(b => b.status === 'PENDING' || b.status === 'OVERDUE').length;

      const totalRevenue = bills
        .filter(b => b.status === 'PAID')
        .reduce((sum, b) => sum + parseInt(b.amount.replace(/[^0-9]/g, '') || 0), 0);

      actionsPane.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openOnboardingWizard()">+ Onboard New School</button>`;

      contentPane.innerHTML = `
        <!-- Top 12 Summary SaaS Cards -->
        <div class="grid-4" style="margin-bottom: 25px;">
          <!-- 1. Total Schools -->
          <div class="portal-card" style="border-left-color: #2563eb;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Schools</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#1e3a8a; margin: 4px 0;">${totalSchools}</p>
            <span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Platform Multi-Tenant</span>
          </div>

          <!-- 2. Active Schools -->
          <div class="portal-card" style="border-left-color: #10b981;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Active Schools</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#047857; margin: 4px 0;">${activeSchools}</p>
            <span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Operational</span>
          </div>

          <!-- 3. InActive Schools -->
          <div class="portal-card" style="border-left-color: #ef4444;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">InActive Schools</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#b91c1c; margin: 4px 0;">${inactiveSchools}</p>
            <span style="font-size:0.75rem; color:#dc2626; font-weight:600;">Suspended / Expired</span>
          </div>

          <!-- 4. Total School Admins -->
          <div class="portal-card" style="border-left-color: #f59e0b;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total School Admins</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#b45309; margin: 4px 0;">${totalSchoolAdmins}</p>
            <span style="font-size:0.75rem; color:var(--color-text-light);">Assigned Admins</span>
          </div>

          <!-- 5. Active Subscriptions -->
          <div class="portal-card" style="border-left-color: #10b981;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Active Subscriptions</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#059669; margin: 4px 0;">${activeSubs}</p>
            <span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Paid SaaS Tier</span>
          </div>

          <!-- 6. Expiring / Expired -->
          <div class="portal-card" style="border-left-color: #f97316;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Expiring / Expired</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#c2410c; margin: 4px 0;">${expiringSubs}</p>
            <span style="font-size:0.75rem; color:#ea580c; font-weight:600;">Action Required</span>
          </div>

          <!-- 7. Pending Bills -->
          <div class="portal-card" style="border-left-color: #ef4444;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Pending Bills</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#dc2626; margin: 4px 0;">${pendingBills}</p>
            <span style="font-size:0.75rem; color:#dc2626; font-weight:600;">Invoices Unpaid</span>
          </div>

          <!-- 8. Total Revenue -->
          <div class="portal-card" style="border-left-color: #059669;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Revenue</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#047857; margin: 4px 0;">₹${totalRevenue.toLocaleString()}/-</p>
            <span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Lifetime Collections</span>
          </div>

          <!-- 9. Total Students -->
          <div class="portal-card" style="border-left-color: #3b82f6;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Students</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#1d4ed8; margin: 4px 0;">${totalStudents.toLocaleString()}</p>
            <span style="font-size:0.75rem; color:var(--color-text-light);">Across All Campuses</span>
          </div>

          <!-- 10. Total Teachers -->
          <div class="portal-card" style="border-left-color: #8b5cf6;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Teachers</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#6d28d9; margin: 4px 0;">${totalTeachers}</p>
            <span style="font-size:0.75rem; color:var(--color-text-light);">Faculty Members</span>
          </div>

          <!-- 11. Total Parents -->
          <div class="portal-card" style="border-left-color: #ec4899;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Parents</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#be185d; margin: 4px 0;">${totalParents.toLocaleString()}</p>
            <span style="font-size:0.75rem; color:var(--color-text-light);">Registered Portals</span>
          </div>

          <!-- 12. Total Staff -->
          <div class="portal-card" style="border-left-color: #6366f1;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--color-text-light); font-weight:700;">Total Staff</div>
            <p style="font-size: 1.8rem; font-weight:700; color:#4338ca; margin: 4px 0;">${totalStaff}</p>
            <span style="font-size:0.75rem; color:var(--color-text-light);">Admins & Teachers</span>
          </div>
        </div>

        <!-- Recent Activities -->
        <div style="margin-top: 35px;">
          <h3 style="color:var(--color-primary); font-size:1.25rem; margin-bottom:12px;">Recent Platform Activities</h3>
          <div class="activity-timeline">
            ${(demoData.activities || []).map(act => `
              <div class="activity-item">
                <span class="activity-icon-badge" style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:rgba(30,58,138,0.06); flex-shrink:0;">${getSaActivityIcon(act.type)}</span>
                <div>
                  <strong>${act.text}</strong>
                </div>
                <span class="activity-time">${act.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 2. SUPER ADMIN: SCHOOLS
    // ========================================================================
    case 'sa-schools': {
      if (!demoData) demoData = Object.assign({}, defaultDemoData);
      if (!demoData.schools || !Array.isArray(demoData.schools) || demoData.schools.length === 0) {
        demoData.schools = (defaultDemoData.schools || []).slice();
      }
      const allSchools = demoData.schools;
      const activeCount = allSchools.filter(s => s.status === 'Active').length;
      const inactiveCount = allSchools.filter(s => s.status === 'Inactive').length;

      actionsPane.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="openOnboardingWizard()" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add School (Wizard)
        </button>
      `;
      contentPane.innerHTML = `
        <!-- Modern SaaS Schools Toolbar -->
        <div class="sa-schools-toolbar">
          <div class="sa-filter-segment">
            <button type="button" class="sa-filter-tab active" onclick="filterSaSchoolsView('All', this)">
              <span>All Schools</span>
              <span class="sa-tab-badge" id="badge-all-schools">${allSchools.length}</span>
            </button>
            <button type="button" class="sa-filter-tab" onclick="filterSaSchoolsView('Active', this)">
              <span>Active</span>
              <span class="sa-tab-badge badge-green" id="badge-active-schools">${activeCount}</span>
            </button>
            <button type="button" class="sa-filter-tab" onclick="filterSaSchoolsView('Inactive', this)">
              <span>Inactive</span>
              <span class="sa-tab-badge badge-rose" id="badge-inactive-schools">${inactiveCount}</span>
            </button>
          </div>

          <div class="sa-toolbar-right">
            <div class="sa-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="sa-search-input" placeholder="Search schools by name, code, city, admin..." oninput="filterSaSchoolsSearch(this.value)">
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="openOnboardingWizard()" style="display:inline-flex; align-items:center; gap:6px; padding: 9px 16px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              + Add School
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>School Code</th>
                <th>Admin</th>
                <th>Students</th>
                <th>Teachers</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style="text-align: center; min-width: 280px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allSchools.map(s => `
                <tr class="sa-school-row" data-status="${s.status}">
                  <td data-label="School Name" class="school-meta-line"><strong>${escapeHtml(s.name)}</strong><br><small>${escapeHtml(s.city || '')}</small></td>
                  <td data-label="School Code"><span class="badge badge-info">${escapeHtml(s.code || '')}</span></td>
                  <td data-label="Admin" class="school-meta-line">${escapeHtml(s.adminName || s.admin || 'Unassigned')}<br><small>${escapeHtml(s.admin || '')}</small></td>
                  <td data-label="Students">${s.studentsCount || 0}</td>
                  <td data-label="Teachers">${s.teachersCount || 0}</td>
                  <td data-label="Subscription"><span class="badge badge-info">${escapeHtml(s.subscription || 'Basic Plan')}</span></td>
                  <td data-label="Status"><span class="badge ${s.status === 'Active' ? 'badge-success' : (s.status === 'Pending' ? 'badge-warning' : 'badge-danger')}">${s.status}</span></td>
                  <td data-label="Created Date">${s.createdDate || '2026-01-01'}</td>
                  <td data-label="Actions" style="text-align: center;">
                    <div class="sa-actions-cell">
                      <button type="button" class="sa-tbl-action view" title="View Campus Details" onclick="viewSchoolDetails('${s.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span>View</span>
                      </button>
                      <button type="button" class="sa-tbl-action edit" title="Edit School Information" onclick="editSchool('${s.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span>Edit</span>
                      </button>
                      <button type="button" class="sa-tbl-action admin" title="View Campus Administrator" onclick="viewSchoolAdmin('${s.admin || s.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>View Admin</span>
                      </button>
                      ${s.status === 'Active' ? `
                        <button type="button" class="sa-tbl-action danger" title="Deactivate School" onclick="toggleSchoolStatus('${s.id}', 'Inactive')">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                          <span>Deactivate</span>
                        </button>
                      ` : `
                        <button type="button" class="sa-tbl-action success" title="Activate School" onclick="toggleSchoolStatus('${s.id}', 'Active')">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span>Activate</span>
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 3. SUPER ADMIN: ADMIN MANAGEMENT
    // ========================================================================
    case 'sa-admin-management': {
      const admins = (demoData.users || []).filter(u => u.role === 'SCHOOL_ADMIN');
      const activeAdmins = admins.filter(a => a.status === 'Active').length;
      const inactiveAdmins = admins.filter(a => a.status !== 'Active').length;

      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="filterSaAdminsView('All', this)">
              All Admins <span class="sa-tab-badge">${admins.length}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSaAdminsView('Active', this)">
              Active <span class="sa-tab-badge badge-green">${activeAdmins}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSaAdminsView('Inactive', this)">
              Inactive <span class="sa-tab-badge badge-rose">${inactiveAdmins}</span>
            </button>
          </div>
          <div class="sa-toolbar-right">
            <div class="sa-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="sa-search-input" placeholder="Search admins by name, email, campus..." oninput="filterPortalTable(this.value)">
            </div>
            <button class="btn btn-outline btn-sm" onclick="openAssignAdminModal()">Assign Admin</button>
            <button class="btn btn-primary btn-sm" onclick="openAddAdminModal()">+ Add Admin</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:180px;">Admin Profile</th>
                <th style="min-width:180px;">Official Email</th>
                <th style="min-width:180px;">Assigned School</th>
                <th style="min-width:90px; text-align:center;">Status</th>
                <th style="min-width:110px;">Created Date</th>
                <th style="min-width:260px; text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${admins.map(a => `
                <tr class="sa-admin-row" data-status="${a.status}">
                  <td data-label="Admin Profile">
                    <div class="school-meta-line">
                      <strong>${escapeHtml(a.name)}</strong>
                      <small>Username: <code>${escapeHtml(a.username)}</code></small>
                    </div>
                  </td>
                  <td data-label="Official Email">${escapeHtml(a.email)}</td>
                  <td data-label="Assigned School">
                    <div class="school-meta-line">
                      <strong>${escapeHtml(a.schoolName || 'Unassigned')}</strong>
                      <small>${escapeHtml(a.schoolId || '')}</small>
                    </div>
                  </td>
                  <td data-label="Status" style="text-align:center;">
                    <span class="badge ${a.status === 'Active' ? 'badge-success' : 'badge-warning'}">${a.status}</span>
                  </td>
                  <td data-label="Created Date">${a.createdDate || '2026-01-01'}</td>
                  <td data-label="Actions" style="text-align:center;">
                    <div class="sa-actions-cell">
                      <button class="sa-tbl-action view" onclick="viewAdminProfile('${a.id}')" title="View Profile">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </button>
                      <button class="sa-tbl-action edit" onclick="openAssignAdminModal('${a.id}')" title="Reassign Campus">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                        Reassign
                      </button>
                      ${a.status === 'Active' ? `
                        <button class="sa-tbl-action danger" onclick="toggleAdminStatus('${a.id}', 'Inactive')" title="Deactivate Account">
                          Deactivate
                        </button>
                      ` : `
                        <button class="sa-tbl-action success" onclick="toggleAdminStatus('${a.id}', 'Active')" title="Activate Account">
                          Activate
                        </button>
                      `}
                      <button class="sa-tbl-action admin" onclick="resetAdminPassword('${a.id}')" title="Reset Password">
                        Reset
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 4. SUPER ADMIN: SERVICES
    // ========================================================================
    case 'sa-services': {
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="filterServicesView('All', this)">Available Services <span class="sa-tab-badge">${(demoData.services || []).length}</span></button>
            <button class="sa-filter-tab" onclick="filterServicesView('Active', this)">Active Services</button>
            <button class="sa-filter-tab" onclick="filterServicesView('Inactive', this)">Inactive</button>
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-outline btn-sm" onclick="openAssignServiceModal()">Assign Service to School</button>
            <button class="btn btn-primary btn-sm" onclick="openAddServiceModal()">+ Create Service</button>
          </div>
        </div>
        <div class="grid-2">
          ${(demoData.services || []).map(srv => `
            <div class="portal-card sa-service-card" data-status="${srv.status}">
              <div class="portal-card-header">
                <span class="portal-card-title">${escapeHtml(srv.name)}</span>
                <span class="badge badge-info">${escapeHtml(srv.category)}</span>
              </div>
              <p style="font-size:0.9rem; color:var(--color-text-dark); margin:8px 0;">${escapeHtml(srv.description)}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                <span style="font-weight:700; color:var(--color-primary); font-size:1.1rem;">${escapeHtml(srv.cost)}</span>
                <span class="badge ${srv.status === 'Active' ? 'badge-success' : 'badge-warning'}">${srv.status}</span>
              </div>
              <div class="sa-actions-cell" style="margin-top:14px;">
                <button class="sa-tbl-action edit" onclick="openEditServiceModal('${srv.id}')">Edit Service</button>
                <button class="sa-tbl-action ${srv.status === 'Active' ? 'danger' : 'success'}" onclick="toggleServiceStatus('${srv.id}')">${srv.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                <button class="sa-tbl-action admin" onclick="openAssignServiceModal('${srv.id}')">Assign to School</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    // ========================================================================
    // 5. SUPER ADMIN: SUBSCRIPTION
    // ========================================================================
    case 'sa-subscriptions': {
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="switchSubView('subs', 'All', this)">All Subscriptions <span class="sa-tab-badge">${(demoData.subscriptions || []).length}</span></button>
            <button class="sa-filter-tab" onclick="switchSubView('plans', null, this)">Subscription Plans</button>
            <button class="sa-filter-tab" onclick="switchSubView('subs', 'ACTIVE', this)">Active <span class="sa-tab-badge badge-green">${(demoData.subscriptions || []).filter(s => s.status === 'ACTIVE').length}</span></button>
            <button class="sa-filter-tab" onclick="switchSubView('subs', 'EXPIRED', this)">Expired <span class="sa-tab-badge badge-rose">${(demoData.subscriptions || []).filter(s => s.status === 'EXPIRED').length}</span></button>
            <button class="sa-filter-tab" onclick="switchSubView('subs', 'PENDING', this)">Pending</button>
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-primary btn-sm" onclick="openCreatePlanModal('subscription')">+ New Plan</button>
          </div>
        </div>

        <!-- Plans View -->
        <div id="sub-plans-pane" style="display:none; margin-bottom:25px;">
          <div class="grid-3">
            ${(demoData.plans || []).map(p => `
              <div class="portal-card" style="border-left-color:var(--color-primary);">
                <div class="portal-card-header">
                  <span class="portal-card-title">${escapeHtml(p.name)}</span>
                  <span class="badge badge-info">Up to ${p.maxStudents} Students</span>
                </div>
                <p style="font-size:2rem; font-weight:700; color:var(--color-primary); margin:8px 0;">${escapeHtml(p.price)}</p>
                <p style="font-size:0.85rem; color:var(--color-text-dark);">${escapeHtml(p.features)}</p>
                <button class="btn btn-outline btn-sm" style="margin-top:14px; width:100%;" onclick="openCreatePlanModal('${p.id}')">Configure Plan</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Subscriptions Table -->
        <div id="sub-table-pane" class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:120px;">Subscription ID</th>
                <th style="min-width:180px;">School Campus</th>
                <th style="min-width:140px;">Plan Tier</th>
                <th style="min-width:100px;">Start Date</th>
                <th style="min-width:100px;">End Date</th>
                <th style="min-width:100px;">Amount</th>
                <th style="min-width:90px; text-align:center;">Status</th>
                <th style="min-width:130px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${(demoData.subscriptions || []).map(sub => `
                <tr class="sa-sub-row" data-status="${sub.status}">
                  <td data-label="Subscription ID"><code>${escapeHtml(sub.id)}</code></td>
                  <td data-label="School">
                    <div class="school-meta-line">
                      <strong>${escapeHtml(sub.school)}</strong>
                      <small>${escapeHtml(sub.schoolId || '')}</small>
                    </div>
                  </td>
                  <td data-label="Plan"><span class="badge badge-info">${escapeHtml(sub.plan)}</span></td>
                  <td data-label="Start Date">${sub.startDate}</td>
                  <td data-label="End Date">${sub.endDate}</td>
                  <td data-label="Amount"><strong>${escapeHtml(sub.amount)}</strong></td>
                  <td data-label="Status" style="text-align:center;">
                    <span class="badge ${sub.status === 'ACTIVE' ? 'badge-success' : (sub.status === 'EXPIRED' ? 'badge-danger' : 'badge-warning')}">${sub.status}</span>
                  </td>
                  <td data-label="Action" style="text-align:center;">
                    <div class="sa-actions-cell">
                      <button class="sa-tbl-action edit" onclick="renewSubscription('${sub.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Renew / Edit
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 6. SUPER ADMIN: BILLS / BILLING
    // ========================================================================
    case 'sa-billing': {
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="filterSaBillsView('All', this)">All Bills <span class="sa-tab-badge">${(demoData.bills || []).length}</span></button>
            <button class="sa-filter-tab" onclick="filterSaBillsView('PAID', this)">Paid <span class="sa-tab-badge badge-green">${(demoData.bills || []).filter(b => b.status === 'PAID').length}</span></button>
            <button class="sa-filter-tab" onclick="filterSaBillsView('PENDING', this)">Pending <span class="sa-tab-badge">${(demoData.bills || []).filter(b => b.status === 'PENDING').length}</span></button>
            <button class="sa-filter-tab" onclick="filterSaBillsView('OVERDUE', this)">Overdue <span class="sa-tab-badge badge-rose">${(demoData.bills || []).filter(b => b.status === 'OVERDUE').length}</span></button>
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-primary btn-sm" onclick="openCreateInvoiceModal()">+ Create Invoice</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:110px;">Invoice ID</th>
                <th style="min-width:180px;">School Campus</th>
                <th style="min-width:130px;">Plan Tier</th>
                <th style="min-width:100px;">Amount</th>
                <th style="min-width:100px;">Due Date</th>
                <th style="min-width:100px;">Payment Date</th>
                <th style="min-width:90px; text-align:center;">Status</th>
                <th style="min-width:160px; text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(demoData.bills || []).map(b => `
                <tr class="sa-bill-row" data-status="${b.status}">
                  <td data-label="Invoice ID"><strong>${escapeHtml(b.invoiceNo)}</strong></td>
                  <td data-label="School"><strong>${escapeHtml(b.school)}</strong></td>
                  <td data-label="Plan"><span class="badge badge-info">${escapeHtml(b.plan)}</span></td>
                  <td data-label="Amount"><strong>${escapeHtml(b.amount)}</strong></td>
                  <td data-label="Due Date">${b.dueDate}</td>
                  <td data-label="Payment Date">${b.paymentDate || '—'}</td>
                  <td data-label="Status" style="text-align:center;">
                    <span class="badge ${b.status === 'PAID' ? 'badge-success' : (b.status === 'PENDING' ? 'badge-warning' : 'badge-danger')}">${b.status}</span>
                  </td>
                  <td data-label="Actions" style="text-align:center;">
                    <div class="sa-actions-cell">
                      <button class="sa-tbl-action view" onclick="viewInvoicePDF('${b.invoiceNo}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Invoice
                      </button>
                      ${b.status !== 'PAID' ? `
                        <button class="sa-tbl-action success" onclick="markBillPaid('${b.invoiceNo}')">
                          Mark Paid
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 7. SUPER ADMIN: REPORTS
    // ========================================================================
    case 'sa-reports': {
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="renderReportType('School', this)">School Reports</button>
            <button class="sa-filter-tab" onclick="renderReportType('User', this)">User Reports</button>
            <button class="sa-filter-tab" onclick="renderReportType('Subscription', this)">Subscription Reports</button>
            <button class="sa-filter-tab" onclick="renderReportType('Billing', this)">Billing Reports</button>
          </div>
        </div>

        <div style="background:var(--color-bg-light); padding:16px; border-radius:var(--radius-sm); margin-bottom:20px; display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <div style="flex:1; min-width:180px;">
            <label style="font-size:0.8rem; font-weight:600; color:var(--color-primary); display:block; margin-bottom:4px;">Filter by School</label>
            <select id="report-filter-school" class="form-control" style="padding:8px;" onchange="applyReportFilters()">
              <option value="All">All Schools</option>
              ${(demoData.schools || []).map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('')}
            </select>
          </div>
          <div style="flex:1; min-width:160px;">
            <label style="font-size:0.8rem; font-weight:600; color:var(--color-primary); display:block; margin-bottom:4px;">Status</label>
            <select id="report-filter-status" class="form-control" style="padding:8px;" onchange="applyReportFilters()">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style="flex:1; min-width:160px;">
            <label style="font-size:0.8rem; font-weight:600; color:var(--color-primary); display:block; margin-bottom:4px;">Subscription Tier</label>
            <select id="report-filter-sub" class="form-control" style="padding:8px;" onchange="applyReportFilters()">
              <option value="All">All Plans</option>
              <option value="Basic">Basic Plan</option>
              <option value="Pro">Pro Plan</option>
              <option value="Enterprise">Enterprise Plan</option>
            </select>
          </div>
        </div>

        <div id="report-output-pane" class="grid-2">
          <div class="portal-card" style="border-left-color:var(--color-primary);">
            <div class="portal-card-title">School Enrollment Trends</div>
            <p style="font-size:2rem; font-weight:700; color:var(--color-primary); margin:8px 0;">1,972 Total Students</p>
            <p style="font-size:0.88rem; color:var(--color-text-dark);">Active growth rate across Tamil Nadu school clusters (+18.4% YoY).</p>
          </div>
          <div class="portal-card" style="border-left-color:var(--color-success);">
            <div class="portal-card-title">Platform Uptime & Service Health</div>
            <p style="font-size:2rem; font-weight:700; color:var(--color-success); margin:8px 0;">99.98% Available</p>
            <p style="font-size:0.88rem; color:var(--color-text-dark);">Zero unplanned downtime reported across all 5 school database partitions.</p>
          </div>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 8. SUPER ADMIN: SETTINGS
    // ========================================================================
    case 'sa-settings': {
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 20px;">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="switchSettingsSection('platform', this)">⚙️ Platform Settings</button>
            <button class="sa-filter-tab" onclick="switchSettingsSection('roles', this)">🛡️ Roles & Permissions</button>
            <button class="sa-filter-tab" onclick="switchSettingsSection('notifications', this)">🔔 Notifications</button>
            <button class="sa-filter-tab" onclick="switchSettingsSection('security', this)">🔒 Security</button>
            <button class="sa-filter-tab" onclick="switchSettingsSection('profile', this)">👤 Profile</button>
          </div>
        </div>

        <div id="settings-content-pane" style="max-width:760px; margin-top:15px;">
          <div class="wizard-form-box" style="background:var(--color-bg-white); border-radius:var(--radius-md); padding:24px; box-shadow:var(--shadow-sm); border:1px solid #e2e8f0;">
            <div class="wizard-header-strip">
              <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <div class="wizard-header-titles">
                <h4>ZenSchool Platform Configuration</h4>
                <p>Global multi-campus parameters, institutional branding, contact endpoints, and server state.</p>
              </div>
            </div>
            <form onsubmit="savePlatformSettings(event)">
              <div class="wizard-grid-2">
                <div class="wizard-field">
                  <label>Platform Name <span class="req">*</span></label>
                  <input type="text" value="ZenSchool Multi-School Platform" required>
                </div>
                <div class="wizard-field">
                  <label>Super Admin Contact Email <span class="req">*</span></label>
                  <input type="email" value="superadmin@zenschool.com" required>
                </div>
                <div class="wizard-field">
                  <label>Default Currency <span class="req">*</span></label>
                  <input type="text" value="INR (₹)" required>
                </div>
                <div class="wizard-field">
                  <label>Platform Maintenance Mode <span class="req">*</span></label>
                  <select>
                    <option value="Disabled">Disabled (Platform Online)</option>
                    <option value="Enabled">Enabled (Maintenance Mode)</option>
                  </select>
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
                <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 24px;">Save Platform Settings ✓</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 9. SCHOOL ADMIN: USER MANAGEMENT (Principals, Teachers, Students, Parents)
    // ========================================================================
    case 'school-admin-users': {
      const mySchoolId = session.schoolId || 'SCHOOL002';
      const myUsers = (demoData.users || []).filter(u => u.schoolId === mySchoolId);
      const adminUsers = myUsers.filter(u => u.role === 'SCHOOL_ADMIN' || u.role === 'PRINCIPAL');
      const teacherUsers = myUsers.filter(u => u.role === 'TEACHER');
      const studentUsers = myUsers.filter(u => u.role === 'STUDENT');
      const parentUsers = myUsers.filter(u => u.role === 'PARENT');

      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="filterSchoolUsers('ALL', this)">
              All Users <span class="sa-tab-badge">${myUsers.length}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSchoolUsers('ADMIN', this)">
              Admins <span class="sa-tab-badge badge-indigo">${adminUsers.length}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSchoolUsers('TEACHER', this)">
              Teachers <span class="sa-tab-badge badge-teal">${teacherUsers.length}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSchoolUsers('STUDENT', this)">
              Students <span class="sa-tab-badge badge-amber">${studentUsers.length}</span>
            </button>
            <button class="sa-filter-tab" onclick="filterSchoolUsers('PARENT', this)">
              Parents <span class="sa-tab-badge badge-purple">${parentUsers.length}</span>
            </button>
          </div>
          <div class="sa-toolbar-right">
            <div class="sa-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="sa-search-input" id="school-user-search-input" placeholder="Search by name, role, email..." oninput="filterSchoolUsersSearch(this.value)">
            </div>
            <button class="btn btn-primary btn-sm" onclick="openAddSchoolUserModal()">+ Add New User</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="sa-schools-table" id="school-users-table">
            <thead>
              <tr>
                <th style="min-width:180px;">Full Name</th>
                <th style="min-width:110px;">Role</th>
                <th style="min-width:140px;">Phone Number</th>
                <th style="min-width:190px;">Email / Username</th>
                <th style="min-width:90px; text-align:center;">Status</th>
                <th style="min-width:110px;">Created Date</th>
                <th style="min-width:140px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${myUsers.map(u => {
                let roleBadgeClass = 'badge-info';
                if (u.role === 'SCHOOL_ADMIN') roleBadgeClass = 'badge-primary';
                else if (u.role === 'PRINCIPAL') roleBadgeClass = 'badge-indigo';
                else if (u.role === 'TEACHER') roleBadgeClass = 'badge-success';
                else if (u.role === 'STUDENT') roleBadgeClass = 'badge-warning';
                else if (u.role === 'PARENT') roleBadgeClass = 'badge-purple';

                return `
                <tr class="school-user-row" data-role="${escapeHtml(u.role)}">
                  <td data-label="Full Name"><strong>${escapeHtml(u.name)}</strong></td>
                  <td data-label="Role"><span class="badge ${roleBadgeClass}">${escapeHtml(u.role)}</span></td>
                  <td data-label="Phone Number"><span style="font-weight:600; color:var(--color-text-dark);">${escapeHtml(u.phone || '+91 98401 23456')}</span></td>
                  <td data-label="Email / Username">${escapeHtml(u.email || u.username)}</td>
                  <td data-label="Status" style="text-align:center;"><span class="badge badge-success">${escapeHtml(u.status || 'Active')}</span></td>
                  <td data-label="Created Date">${escapeHtml(u.createdDate || '2026-02-15')}</td>
                  <td data-label="Actions" style="text-align:right;">
                    <div class="sa-actions-cell" style="justify-content: flex-end;">
                      <button class="sa-tbl-action admin" onclick="resetUserPassword('${u.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    // ========================================================================
    // 10. SCHOOL-LEVEL MODULES (ISOLATED BY schoolId)
    // ========================================================================
    case 'manage-teachers': {
      const teachers = getSchoolData('teachers');
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-search-wrap" style="min-width:280px; max-width:440px; flex:1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="sa-search-input" placeholder="Search faculty by name, ID, or subject..." oninput="filterPortalTable(this.value)">
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-primary btn-sm" onclick="openTeacherForm()">+ Add Teacher</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:90px;">Faculty ID</th>
                <th style="min-width:180px;">Faculty Name</th>
                <th style="min-width:160px;">Primary Subject</th>
                <th style="min-width:130px;">Assigned Class</th>
                <th style="min-width:90px; text-align:center;">Status</th>
                <th style="min-width:120px; text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.length > 0 ? teachers.map(t => `
                <tr>
                  <td data-label="Faculty ID"><code>${escapeHtml(t.id)}</code></td>
                  <td data-label="Faculty Name"><strong>${escapeHtml(t.name)}</strong></td>
                  <td data-label="Primary Subject">${escapeHtml(t.subject)}</td>
                  <td data-label="Assigned Class"><span class="badge badge-info">${escapeHtml(t.class)}</span></td>
                  <td data-label="Status" style="text-align:center;"><span class="badge badge-success">${t.status}</span></td>
                  <td data-label="Actions" style="text-align:center;">
                    <div class="sa-actions-cell">
                      <button class="sa-tbl-action edit" onclick="openTeacherForm('${t.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="6" style="text-align:center;">No teachers found for this school.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'manage-students': {
      const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
      const currentRole = session.role;
      let students = getSchoolData('students');

      if (currentRole === 'TEACHER') {
        const teachers = getSchoolData('teachers');
        const sName = (session.name || '').trim().toLowerCase();
        const sUser = (session.username || '').trim().toLowerCase();

        const myTeacherRecord = teachers.find(t => {
          const tName = t.name.trim().toLowerCase();
          return tName === sName || sName.includes(tName) || tName.includes(sName) || (t.email && t.email.trim().toLowerCase() === sUser);
        });

        const assignedClass = myTeacherRecord ? myTeacherRecord.class : 'Grade 10-A';
        students = students.filter(s => s.class === assignedClass);
      }

      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-search-wrap" style="min-width:280px; max-width:440px; flex:1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="sa-search-input" placeholder="Search students by name, roll, or class..." oninput="filterPortalTable(this.value)">
          </div>
          <div class="sa-toolbar-right">
            ${(currentRole === 'TEACHER') ? '' : `<button class="btn btn-primary btn-sm" onclick="openStudentForm()">+ Add Student</button>`}
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:100px;">Roll No</th>
                <th style="min-width:180px;">Student Name</th>
                <th style="min-width:110px;">Class</th>
                <th style="min-width:100px;">Attendance</th>
                <th style="min-width:130px; text-align:center;">Performance</th>
                <th style="min-width:160px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${students.length > 0 ? students.map(s => `
                <tr>
                  <td data-label="Roll No"><code>${escapeHtml(s.roll)}</code></td>
                  <td data-label="Student Name"><strong>${escapeHtml(s.name)}</strong></td>
                  <td data-label="Class"><span class="badge badge-info">${escapeHtml(s.class)}</span></td>
                  <td data-label="Attendance"><strong>${escapeHtml(s.attendance)}</strong></td>
                  <td data-label="Performance" style="text-align:center;"><span class="badge ${s.performance === 'Outstanding' || s.performance === 'Very Good' ? 'badge-success' : 'badge-warning'}">${s.performance || 'Good'}</span></td>
                  <td data-label="Action" style="text-align:center;">
                    <div class="sa-actions-cell">
                      ${currentRole === 'TEACHER' ? '' : `
                        <button class="sa-tbl-action edit" onclick="openStudentForm('${s.roll}')">
                          Edit
                        </button>
                      `}
                      <button class="sa-tbl-action view" onclick="openMarksForm('${s.roll}')">
                        Marks
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="6" style="text-align:center;">No students registered for this class.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'manage-parents': {
      const parents = (demoData.users || []).filter(u => u.role === 'PARENT' && (currentRole === 'SUPER_ADMIN' || !u.schoolId || u.schoolId === session.schoolId));
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div style="font-size:0.88rem; color:var(--color-text-light); flex:1; min-width:280px;">
            Link student profiles to parent contact details and manage parent portal credentials.
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-primary btn-sm" onclick="openLinkParentModal()">+ Link Parent</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:180px;">Parent Name</th>
                <th style="min-width:120px;">Relationship</th>
                <th style="min-width:140px;">Phone Number</th>
                <th style="min-width:180px;">Contact Email</th>
                <th style="min-width:170px;">Linked Ward (Student)</th>
                <th style="min-width:100px; text-align:center;">Portal Access</th>
                <th style="min-width:130px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${parents.length > 0 ? parents.map(p => `
                <tr>
                  <td data-label="Parent Name"><strong>${escapeHtml(p.name)}</strong></td>
                  <td data-label="Relationship"><span class="badge badge-purple">${escapeHtml(p.relationship || 'Guardian')}</span></td>
                  <td data-label="Phone Number"><span style="font-weight:600; color:var(--color-text-dark);">${escapeHtml(p.phone || '+91 98401 99009')}</span></td>
                  <td data-label="Contact Email">${escapeHtml(p.email)}</td>
                  <td data-label="Linked Ward">
                    <div><strong>${escapeHtml(p.studentName || 'Aishwarya Kumar')}</strong></div>
                    <div style="font-size:0.75rem; color:var(--color-text-light);">Roll: ${escapeHtml(p.studentRoll || 'S101')}</div>
                  </td>
                  <td data-label="Portal Access" style="text-align:center;"><span class="badge badge-success">Approved</span></td>
                  <td data-label="Actions" style="text-align:right;">
                    <div class="sa-actions-cell" style="justify-content: flex-end;">
                      <button class="sa-tbl-action admin" onclick="resetUserPassword('${p.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="7" style="text-align:center; padding:25px; color:#64748b;">No parent accounts linked yet. Click "+ Link Parent" above to create one.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'manage-classes': {
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = renderManageClassesView();
      break;
    }

    case 'manage-subjects': {
      const subjects = getSchoolData('subjects');
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div style="font-size:0.88rem; color:var(--color-text-light); flex:1; min-width:280px;">
            Manage official courses, syllabus codes, and lead faculty instructors.
          </div>
          <div class="sa-toolbar-right">
            <button class="btn btn-primary btn-sm" onclick="openSubjectForm()">+ Add Subject</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr>
                <th style="min-width:100px;">Course Code</th>
                <th style="min-width:180px;">Subject Title</th>
                <th style="min-width:120px;">Grade Level</th>
                <th style="min-width:180px;">Lead Faculty</th>
                <th style="min-width:110px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.length > 0 ? subjects.map(s => `
                <tr>
                  <td data-label="Course Code"><code>${escapeHtml(s.code)}</code></td>
                  <td data-label="Subject Title"><strong>${escapeHtml(s.name)}</strong></td>
                  <td data-label="Grade Level"><span class="badge badge-info">${escapeHtml(s.grade)}</span></td>
                  <td data-label="Lead Faculty">${escapeHtml(s.teacher)}</td>
                  <td data-label="Action" style="text-align:center;">
                    <div class="sa-actions-cell">
                      <button class="sa-tbl-action edit" onclick="openSubjectForm('${s.code}')">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align:center;">No subjects created for this school yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'publish-announcements':
    case 'school-announcements':
    case 'announcements': {
      const notices = getSchoolData('announcements');
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active" onclick="filterAnnouncements('All', this)">All Notices</button>
            <button class="sa-filter-tab" onclick="filterAnnouncements('Academic', this)">Academic</button>
            <button class="sa-filter-tab" onclick="filterAnnouncements('Sports', this)">Sports</button>
            <button class="sa-filter-tab" onclick="filterAnnouncements('General', this)">General</button>
          </div>
          <div class="sa-toolbar-right">
            ${currentRole !== 'PARENT' ? `<button class="btn btn-primary btn-sm" onclick="openAnnouncementForm()">+ Post Announcement</button>` : ''}
          </div>
        </div>
        <div id="announcement-list">
          ${notices.length > 0 ? notices.map(a => `
            <div class="portal-card announcement-card" data-category="${a.category || 'General'}">
              <div class="portal-card-header">
                <span class="portal-card-title">${escapeHtml(a.title)}</span>
                <div>
                  <span class="badge badge-info" style="margin-right: 6px;">${escapeHtml(a.category || 'Notice')}</span>
                  <span class="badge badge-warning">${escapeHtml(a.date)}</span>
                </div>
              </div>
              <p>${escapeHtml(a.content)}</p>
              <p style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 10px;">Target Audience: <strong>${escapeHtml(a.target)}</strong></p>
            </div>
          `).join('') : `<p>No announcements posted for this school.</p>`}
        </div>
      `;
      break;
    }

    case 'view-reports':
    case 'school-reports': {
      contentPane.innerHTML = `
        <div class="grid-2">
          <div class="portal-card" style="border-left-color: var(--color-secondary);">
            <div class="portal-card-title">Enrollment Statistics 2026-27</div>
            <p style="font-size: 2rem; font-weight:700; margin: 10px 0; color: var(--color-primary);">482 Students</p>
            <p>Total applications processed: 110 (+15% YoY)</p>
          </div>
          <div class="portal-card" style="border-left-color: var(--color-success);">
            <div class="portal-card-title">Average Daily Attendance</div>
            <p style="font-size: 2rem; font-weight:700; margin: 10px 0; color: var(--color-success);">94.8%</p>
            <p>Target: 95.0% | Peak attendance: Monday</p>
          </div>
        </div>
      `;
      break;
    }

    // PRINCIPAL & TEACHER & STUDENT TABS (PRESERVED)
    case 'attendance-reports':
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 16px;">
          <div class="sa-filter-segment">
            <span style="font-weight:700; color:var(--color-primary); font-size:0.92rem; padding: 6px 12px; display:inline-flex; align-items:center; gap:6px;">
              📊 Daily Attendance Overview &mdash; Today (${new Date().toLocaleDateString()})
            </span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead>
              <tr><th>Class / Section</th><th>Total Students</th><th>Present</th><th>Absent</th><th>Attendance Rate</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Grade 10-A</strong></td><td>38</td><td><span style="color:#16a34a; font-weight:700;">36</span></td><td><span style="color:#dc2626; font-weight:700;">2</span></td><td><span class="badge badge-success">94.7%</span></td></tr>
              <tr><td><strong>Grade 11-B</strong></td><td>40</td><td><span style="color:#16a34a; font-weight:700;">39</span></td><td><span style="color:#dc2626; font-weight:700;">1</span></td><td><span class="badge badge-success">97.5%</span></td></tr>
            </tbody>
          </table>
        </div>
      `;
      break;

    case 'academic-performance':
      contentPane.innerHTML = `
        <div class="portal-card">
          <div class="portal-card-title">Secondary Board Exam Preparation</div>
          <p>Mock exams result average: <strong>89.4% passing rate</strong> with 32 students in Grade 10 achieving distinctions.</p>
        </div>
      `;
      break;

    case 'communication-teachers':
    case 'chat-teachers':
    case 'messaging-teachers':
    case 'secure-messaging':
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = renderMessagingView();
      setTimeout(() => {
        const chatBox = document.getElementById('secure-chat-box');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 50);
      break;

    case 'dashboard-analytics':
      contentPane.innerHTML = `
        <h3>Key Performance Indicators</h3>
        <div class="grid-3" style="margin-top: 20px;">
          <div class="portal-card"><h4>Total Teachers</h4><p style="font-size: 1.8rem; font-weight:700; color: var(--color-primary);">34 Professional Staff</p></div>
          <div class="portal-card"><h4>STEM Stream Ratio</h4><p style="font-size: 1.8rem; font-weight:700; color: var(--color-secondary);">68% of Students</p></div>
          <div class="portal-card"><h4>Parent App Active</h4><p style="font-size: 1.8rem; font-weight:700; color: var(--color-success);">91.5% Active</p></div>
        </div>
      `;
      break;

    case 'my-classes':
      contentPane.innerHTML = `
        <div class="portal-card">
          <div class="portal-card-header">
            <span class="portal-card-title">Grade 10-A (Mathematics)</span>
            <span class="badge badge-success">Active</span>
          </div>
          <p>Class representative: <strong>Aishwarya Kumar</strong></p>
          <p>Class Room: A-102 | Timetable: Mon, Wed, Fri (9:30 AM - 10:30 AM)</p>
        </div>
      `;
      break;

    case 'student-list': {
      const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
      const currentRole = session.role;
      let students = getSchoolData('students');

      if (currentRole === 'TEACHER') {
        const teachers = getSchoolData('teachers');
        const sName = (session.name || '').trim().toLowerCase();
        const sUser = (session.username || '').trim().toLowerCase();

        const myTeacherRecord = teachers.find(t => {
          const tName = t.name.trim().toLowerCase();
          return tName === sName || sName.includes(tName) || tName.includes(sName) || (t.email && t.email.trim().toLowerCase() === sUser);
        });

        const assignedClass = myTeacherRecord ? myTeacherRecord.class : 'Grade 10-A';
        students = students.filter(s => s.class === assignedClass);
      }

      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 16px;">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active">
              Assigned: ${students[0] ? students[0].class : 'Your Class'}
              <span class="sa-filter-count">${students.length}</span>
            </button>
          </div>
          <div class="sa-toolbar-right">
            <div class="sa-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="sa-search-input" placeholder="Filter class students..." oninput="filterTableRows('class-students-table', this.value)">
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table" id="class-students-table">
            <thead>
              <tr><th>Roll No</th><th>Student Name</th><th>Assigned Grade</th><th>Midterm Rating</th><th style="text-align: right;">Marks Entry</th></tr>
            </thead>
            <tbody>
              ${students.length > 0 ? students.map(s => `
                <tr>
                  <td><strong>${s.roll}</strong></td>
                  <td>${s.name}</td>
                  <td>${s.class}</td>
                  <td><span class="badge badge-success">${s.performance || 'Outstanding'}</span></td>
                  <td class="sa-actions-cell" style="justify-content: flex-end;">
                    <button class="sa-tbl-action edit" onclick="openMarksForm('${s.roll}')">Enter Marks</button>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align:center;">No students assigned to your class.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'attendance-management':
      actionsPane.innerHTML = `<button class="btn btn-primary btn-sm" onclick="submitAttendanceLogs()">Submit Attendance</button>`;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 16px;">
          <div class="sa-filter-segment">
            <span style="font-weight:700; color:var(--color-primary); font-size:0.92rem; padding: 6px 12px; display:inline-flex; align-items:center; gap:6px;">
              Roll Call & Attendance Logging
            </span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead><tr><th>Student Name</th><th>Roll Number</th><th style="text-align:center;">Present</th><th style="text-align:center;">Absent</th></tr></thead>
            <tbody>
              <tr><td><strong>Aishwarya Kumar</strong></td><td>S101</td><td style="text-align:center;"><input type="radio" name="att-1" checked></td><td style="text-align:center;"><input type="radio" name="att-1"></td></tr>
              <tr><td><strong>Kavitha Selvam</strong></td><td>S102</td><td style="text-align:center;"><input type="radio" name="att-2" checked></td><td style="text-align:center;"><input type="radio" name="att-2"></td></tr>
            </tbody>
          </table>
        </div>
      `;
      break;

    case 'assignments': {
      const myAssignments = getSchoolData('assignments');
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 16px;">
          <div class="sa-filter-segment">
            <button class="sa-filter-tab active">
              All Assignments
              <span class="sa-filter-count">${myAssignments.length}</span>
            </button>
          </div>
          <div class="sa-toolbar-right">
            <div class="sa-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="sa-search-input" placeholder="Search homework..." oninput="filterTableRows('assignments-table', this.value)">
            </div>
            <button class="btn btn-primary btn-sm" onclick="openHomeworkForm()">
              + Give Homework
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table" id="assignments-table">
            <thead><tr><th>ID</th><th>Title</th><th>Class</th><th>Due Date</th><th style="text-align: right;">Actions</th></tr></thead>
            <tbody>
              ${myAssignments.map(hw => `
                <tr>
                  <td><strong>${hw.id}</strong></td>
                  <td>${hw.title}</td>
                  <td>${hw.grade}</td>
                  <td><span class="badge badge-warning">${hw.due}</span></td>
                  <td class="sa-actions-cell" style="justify-content: flex-end;">
                    <button class="sa-tbl-action danger" onclick="deleteHomework('${hw.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'study-materials':
    case 'download-materials':
      contentPane.innerHTML = `
        <div class="portal-card">
          <div class="portal-card-header"><strong>Trigonometry Practice Sheet.pdf</strong><span class="badge badge-info">PDF</span></div>
          <p>Class resource uploaded by Mrs. Priya Krishnan.</p>
          <button class="btn btn-outline btn-sm" onclick="showFeedbackModal('Download', 'Downloading file...')">Download File</button>
        </div>
      `;
      break;

    case 'timetable':
    case 'view-timetable':
      actionsPane.innerHTML = ``;
      contentPane.innerHTML = renderTeacherTimetable();
      break;

    case 'view-dashboard':
      contentPane.innerHTML = `
        <div class="grid-2">
          <div class="portal-card" style="border-left-color: var(--color-secondary);">
            <h4>My Attendance Rate</h4>
            <p style="font-size: 2rem; font-weight:700; color: var(--color-primary); margin: 10px 0;">96.2%</p>
            <p>Exceeds standard requirement.</p>
          </div>
          <div class="portal-card" style="border-left-color: var(--color-success);">
            <h4>Pending Assignments</h4>
            <p style="font-size: 2rem; font-weight:700; color: var(--color-success); margin: 10px 0;">2 Tasks</p>
            <p>Next due: Algebra Exercise</p>
          </div>
        </div>
      `;
      break;

    case 'check-attendance':
    case 'attendance-tracking':
      contentPane.innerHTML = `
        <div class="portal-card">
          <div class="portal-card-title">Attendance Tracking Logs</div>
          <p>Total school days: 90 | Present days: 86.5 | Absent days: 3.5</p>
        </div>
      `;
      break;

    case 'submit-assignments':
      contentPane.innerHTML = `
        <div class="wizard-form-box" style="max-width: 680px; margin: 0 auto; background: var(--color-bg-white); border-radius: var(--radius-md); padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid #e2e8f0;">
          <div class="wizard-header-strip">
            <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="wizard-header-titles">
              <h4>Submit Student Assignment</h4>
              <p>Upload completed exercise solutions, homework docs, or project files for grading.</p>
            </div>
          </div>
          <form onsubmit="showFeedbackModal('Assignment Submitted', 'Your assignment solution file has been uploaded successfully!'); return false;">
            <div class="wizard-grid-2">
              <div class="wizard-field span-2">
                <label>Select Assignment / Subject <span class="req">*</span></label>
                <select required>
                  <option value="Algebra Equations Exercise">Mathematics — Algebra Equations Exercise (Due: 2026-07-28)</option>
                  <option value="Newton Laws Lab Report">Physics — Newton Laws Experiment Report (Due: 2026-07-30)</option>
                  <option value="English Essay">English — Modern Poetry Analytical Essay (Due: 2026-08-02)</option>
                </select>
              </div>
              <div class="wizard-field span-2">
                <label>Upload Document / Solution File <span class="req">*</span></label>
                <input type="file" required style="padding: 10px; border: 2px dashed #cbd5e1; background: #f8fafc; border-radius: 8px;">
                <small style="color: #64748b; font-size: 0.78rem; margin-top: 4px;">Accepted formats: PDF, DOCX, JPG, PNG (Max size: 15MB)</small>
              </div>
              <div class="wizard-field span-2">
                <label>Student Notes / Comments (Optional)</label>
                <textarea rows="3" placeholder="Provide any additional comments or context for your instructor..."></textarea>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
              <button type="submit" class="btn btn-primary btn-sm" style="padding:9px 24px;">Upload & Submit Assignment ✓</button>
            </div>
          </form>
        </div>
      `;
      break;

    case 'view-homework':
    case 'homework':
      contentPane.innerHTML = `
        <div class="portal-card">
          <h4>Algebra Equations Exercise</h4>
          <p>Due: 2026-07-28 | Subject: Mathematics</p>
          <p>Solve exercises 3.1 to 3.4 in notebook.</p>
        </div>
      `;
      break;

    case 'receive-announcements':
      contentPane.innerHTML = `
        <div class="portal-card">
          <h4>Independence Day Celebrations</h4>
          <p>Flag hoisting ceremony starts at 8:00 AM on August 15.</p>
        </div>
      `;
      break;

    case 'track-exams':
      contentPane.innerHTML = `
        <div class="sa-schools-header-bar" style="margin-bottom: 16px;">
          <div class="sa-filter-segment">
            <span style="font-weight:700; color:var(--color-primary); font-size:0.92rem; padding: 6px 12px; display:inline-flex; align-items:center; gap:6px;">
              📝 Upcoming Examinations Schedule
            </span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="sa-schools-table">
            <thead><tr><th>Subject</th><th>Exam Date</th><th>Max Marks</th><th>Pass Marks</th><th>Status</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Mathematics (Paper-I)</strong></td>
                <td>2026-09-10</td>
                <td>100</td>
                <td>35</td>
                <td><span class="badge badge-success">Scheduled</span></td>
              </tr>
              <tr>
                <td><strong>Science & Experiments</strong></td>
                <td>2026-09-12</td>
                <td>100</td>
                <td>35</td>
                <td><span class="badge badge-success">Scheduled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      break;

    case 'child-information':
      contentPane.innerHTML = `
        <div class="portal-card">
          <div class="portal-card-title">Student Profile Summary</div>
          <p><strong>Name:</strong> Aishwarya Kumar</p>
          <p><strong>Class:</strong> Grade 10-A (Roll No: S101)</p>
          <p><strong>Emergency Contact:</strong> Ramesh Kumar (+91 98456 12301)</p>
        </div>
      `;
      break;

    case 'exam-results':
      contentPane.innerHTML = `
        <div class="portal-card">
          <h4>Exam Results — Aishwarya Kumar (96.5% Distinction)</h4>
          <p>Mathematics: 98/100 (A+) | Physics: 92/100 (A+) | Chemistry: 86/100 (A)</p>
        </div>
      `;
      break;

    case 'fee-reminders':
      contentPane.innerHTML = `
        <div class="portal-card" style="border-left-color: var(--color-secondary);">
          <div class="portal-card-header"><strong>Term-II School Fee</strong><span class="badge badge-warning">Due: 2026-08-10</span></div>
          <p>Total Due: <strong>₹12,500/-</strong></p>
          <button class="btn btn-primary btn-sm" onclick="showFeedbackModal('Fee Payment', 'Receipt generated for ₹12,500/-.')">Pay Securely Online</button>
        </div>
      `;
      break;

    default:
      contentPane.innerHTML = `<p>Section loaded: ${tabId}</p>`;
      break;
  }
}

// ============================================================================
// Multi-Step Onboarding Wizard (SUPER ADMIN -> Schools -> Add School)
// Step 1: School Info
// Step 2: School Admin
// Step 3: Subscription
// Step 4: Review
// ============================================================================

let wizardData = {
  step: 1,
  schoolName: '',
  schoolCode: '',
  board: 'State Board',
  city: '',
  address: '',
  phone: '',
  email: '',
  principal: '',
  academicYear: '2026-2027',
  adminName: '',
  adminEmail: '',
  adminUsername: '',
  adminPassword: '',
  plan: 'Pro Plan',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
};

function openOnboardingWizard() {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
  wizardData = {
    step: 1,
    schoolName: '',
    schoolCode: '',
    board: 'State Board',
    city: '',
    address: '',
    phone: '',
    email: '',
    principal: '',
    academicYear: '2026-2027',
    adminName: '',
    adminEmail: '',
    adminUsername: '',
    adminPassword: '',
    plan: 'Pro Plan',
    startDate: today,
    endDate: nextYear
  };
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  renderWizardStep();
}

function selectWizardPlan(planName) {
  wizardData.plan = planName;
  document.querySelectorAll('.plan-card-option').forEach(el => el.classList.remove('selected'));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('selected');
  } else {
    renderWizardStep();
  }
}

function autoSuggestSchoolCode(name) {
  const codeInput = document.getElementById('wiz-code');
  if (!codeInput) return;
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length > 0 && !codeInput.dataset.userEdited) {
    let acronym = words.map(w => w[0].toUpperCase()).join('').substring(0, 4);
    if (words.length === 1 && words[0].length >= 3) {
      acronym = words[0].substring(0, 3).toUpperCase();
    }
    const city = document.getElementById('wiz-city')?.value.trim() || 'TN';
    const cityCode = city.substring(0, 3).toUpperCase();
    codeInput.value = `${acronym}-${cityCode}`;
  }
}

function regenerateWizPass() {
  const code = (wizardData.schoolCode || 'Zen').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const passInput = document.getElementById('wiz-admin-pass');
  if (passInput) {
    passInput.value = `${code || 'School'}@${rand}`;
  }
}

function handleStartDateChange(val) {
  if (!val) return;
  const start = new Date(val);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  const endStr = end.toISOString().split('T')[0];
  const endInput = document.getElementById('wiz-end-date');
  if (endInput) endInput.value = endStr;
  wizardData.startDate = val;
  wizardData.endDate = endStr;
}

function renderWizardStep() {
  const modal = document.getElementById('portal-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');

  title.textContent = 'Onboard New School Campus';

  const progressPercent = (wizardData.step - 1) * 33.33;

  let stepHtml = `
    <div class="wizard-stepper-wrap">
      <div class="wizard-progress-track">
        <div class="wizard-progress-bar" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="wizard-steps">
        <div class="wizard-step ${wizardData.step === 1 ? 'active' : (wizardData.step > 1 ? 'completed' : '')}">
          <div class="step-circle">${wizardData.step > 1 ? '✓' : '1'}</div>
          <div class="step-label">School Profile</div>
        </div>
        <div class="wizard-step ${wizardData.step === 2 ? 'active' : (wizardData.step > 2 ? 'completed' : '')}">
          <div class="step-circle">${wizardData.step > 2 ? '✓' : '2'}</div>
          <div class="step-label">Admin Access</div>
        </div>
        <div class="wizard-step ${wizardData.step === 3 ? 'active' : (wizardData.step > 3 ? 'completed' : '')}">
          <div class="step-circle">${wizardData.step > 3 ? '✓' : '3'}</div>
          <div class="step-label">Plan & Billing</div>
        </div>
        <div class="wizard-step ${wizardData.step === 4 ? 'active' : ''}">
          <div class="step-circle">4</div>
          <div class="step-label">Review & Launch</div>
        </div>
      </div>
    </div>
  `;

  if (wizardData.step === 1) {
    stepHtml += `
      <form onsubmit="handleWizardNext(event, 1)">
        <div class="wizard-form-box">
          <div class="wizard-header-strip">
            <div class="wizard-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M14 7h1"></path><path d="M9 11h1"></path><path d="M14 11h1"></path><path d="M9 15h1"></path><path d="M14 15h1"></path></svg>
            </div>
            <div class="wizard-header-titles">
              <h4>Step 1: School Identity & Campus Profile</h4>
              <p>Configure the foundational details for the new multi-tenant school instance.</p>
            </div>
          </div>

          <div class="wizard-grid-2">
            <div class="wizard-field">
              <label>School / Institution Name <span class="req">*</span></label>
              <input type="text" id="wiz-name" value="${wizardData.schoolName}" placeholder="e.g. ABC Matriculation Higher Secondary School" required oninput="autoSuggestSchoolCode(this.value)">
            </div>
            <div class="wizard-field">
              <label>School Code (Unique ID) <span class="req">*</span></label>
              <input type="text" id="wiz-code" value="${wizardData.schoolCode}" placeholder="e.g. ABC-CHE" required onchange="this.dataset.userEdited='true'" style="text-transform:uppercase;">
            </div>

            <div class="wizard-field">
              <label>Board / Affiliation <span class="req">*</span></label>
              <select id="wiz-board" required>
                <option value="State Board" ${wizardData.board === 'State Board' ? 'selected' : ''}>State Board (Tamil Nadu)</option>
                <option value="Matriculation" ${wizardData.board === 'Matriculation' ? 'selected' : ''}>Matriculation</option>
                <option value="CBSE" ${wizardData.board === 'CBSE' ? 'selected' : ''}>CBSE</option>
                <option value="ICSE" ${wizardData.board === 'ICSE' ? 'selected' : ''}>ICSE</option>
                <option value="International" ${wizardData.board === 'International' ? 'selected' : ''}>International / IGCSE</option>
              </select>
            </div>
            <div class="wizard-field">
              <label>Academic Year <span class="req">*</span></label>
              <input type="text" id="wiz-year" value="${wizardData.academicYear || '2026-2027'}" required>
            </div>

            <div class="wizard-field">
              <label>Official School Email <span class="req">*</span></label>
              <input type="email" id="wiz-email" value="${wizardData.email}" placeholder="contact@abcschool.edu.in" required>
            </div>
            <div class="wizard-field">
              <label>Contact Phone <span class="req">*</span></label>
              <input type="text" id="wiz-phone" value="${wizardData.phone}" placeholder="+91 98765 43210" required>
            </div>

            <div class="wizard-field">
              <label>Principal Full Name <span class="req">*</span></label>
              <input type="text" id="wiz-principal" value="${wizardData.principal}" placeholder="e.g. Dr. K. Ramanathan" required>
            </div>
            <div class="wizard-field">
              <label>City / Campus Location <span class="req">*</span></label>
              <input type="text" id="wiz-city" value="${wizardData.city}" placeholder="e.g. Chennai, Coimbatore, Salem" required>
            </div>

            <div class="wizard-field span-2">
              <label>Campus Physical Address</label>
              <input type="text" id="wiz-address" value="${wizardData.address}" placeholder="Street, Landmark, District, Pincode">
            </div>
          </div>
        </div>

        <div class="wizard-footer">
          <span class="step-count-text">Step 1 of 4: School Profile</span>
          <div class="wizard-footer-actions">
            <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" style="padding: 8px 22px;">Next: Admin Access →</button>
          </div>
        </div>
      </form>
    `;
  } else if (wizardData.step === 2) {
    stepHtml += `
      <form onsubmit="handleWizardNext(event, 2)">
        <div class="wizard-form-box">
          <div class="wizard-header-strip">
            <div class="wizard-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="wizard-header-titles">
              <h4>Step 2: School Administrator Account</h4>
              <p>Setup the primary login credentials for this campus administrator.</p>
            </div>
          </div>

          <div class="wizard-callout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>This administrator will have school-level master access to manage faculty, student rosters, sections, and billing for <strong>${wizardData.schoolName || 'this campus'}</strong>.</span>
          </div>

          <div class="wizard-grid-2">
            <div class="wizard-field">
              <label>Administrator Full Name <span class="req">*</span></label>
              <input type="text" id="wiz-admin-name" value="${wizardData.adminName || ''}" placeholder="e.g. Rajesh Kumar" required>
            </div>
            <div class="wizard-field">
              <label>Admin Login Email <span class="req">*</span></label>
              <input type="email" id="wiz-admin-email" value="${wizardData.adminEmail || ''}" placeholder="e.g. admin@abcschool.com" required>
            </div>

            <div class="wizard-field">
              <label>Portal Username <span class="req">*</span></label>
              <input type="text" id="wiz-admin-user" value="${wizardData.adminUsername || ''}" placeholder="e.g. admin_abc" required>
            </div>
            <div class="wizard-field">
              <label>Temporary Password <span class="req">*</span></label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="wiz-admin-pass" value="${wizardData.adminPassword || 'Admin@12345'}" required style="font-family: monospace;">
                <button type="button" class="btn btn-outline btn-sm" onclick="regenerateWizPass()" style="white-space: nowrap; padding: 0 14px;">Generate</button>
              </div>
            </div>

            <div class="wizard-field span-2">
              <label>Campus Assignment</label>
              <input type="text" value="${wizardData.schoolName} (${wizardData.schoolCode})" disabled style="background:#f8fafc; color:#64748b; font-weight:600;">
            </div>
          </div>
        </div>

        <div class="wizard-footer">
          <span class="step-count-text">Step 2 of 4: Admin Access</span>
          <div class="wizard-footer-actions">
            <button type="button" class="btn btn-outline btn-sm" onclick="wizardData.step=1; renderWizardStep();">← Back</button>
            <button type="submit" class="btn btn-primary btn-sm" style="padding: 8px 22px;">Next: Plan & Billing →</button>
          </div>
        </div>
      </form>
    `;
  } else if (wizardData.step === 3) {
    stepHtml += `
      <form onsubmit="handleWizardNext(event, 3)">
        <div class="wizard-form-box">
          <div class="wizard-header-strip">
            <div class="wizard-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div class="wizard-header-titles">
              <h4>Step 3: SaaS Subscription Plan & License</h4>
              <p>Select the subscription tier and define license dates for this school.</p>
            </div>
          </div>

          <div class="plan-cards-selector">
            <div class="plan-card-option ${wizardData.plan === 'Basic Plan' ? 'selected' : ''}" onclick="selectWizardPlan('Basic Plan')">
              <div>
                <div class="plan-name">Basic Plan</div>
                <div class="plan-students">Up to 500 Students</div>
                <div class="plan-price">₹15,000<span style="font-size:0.75rem; font-weight:normal; color:#64748b;">/yr</span></div>
                <div class="plan-features">Daily Attendance, Mark Sheets, Notices, Student Roster</div>
              </div>
            </div>
            <div class="plan-card-option ${wizardData.plan === 'Pro Plan' ? 'selected' : ''}" onclick="selectWizardPlan('Pro Plan')">
              <span class="pop-badge">Popular</span>
              <div>
                <div class="plan-name">Pro Plan</div>
                <div class="plan-students">Up to 1,500 Students</div>
                <div class="plan-price">₹35,000<span style="font-size:0.75rem; font-weight:normal; color:#64748b;">/yr</span></div>
                <div class="plan-features">Basic + Online Fee Portal, SMS Gateway, Assignments, Live Timetable</div>
              </div>
            </div>
            <div class="plan-card-option ${wizardData.plan === 'Enterprise Plan' ? 'selected' : ''}" onclick="selectWizardPlan('Enterprise Plan')">
              <div>
                <div class="plan-name">Enterprise Plan</div>
                <div class="plan-students">Up to 5,000 Students</div>
                <div class="plan-price">₹75,000<span style="font-size:0.75rem; font-weight:normal; color:#64748b;">/yr</span></div>
                <div class="plan-features">Pro + Mobile App integration, GPS Bus Tracking, 24/7 Dedicated Support</div>
              </div>
            </div>
          </div>

          <div class="wizard-grid-2">
            <div class="wizard-field">
              <label>License Start Date <span class="req">*</span></label>
              <input type="date" id="wiz-start-date" value="${wizardData.startDate}" required onchange="handleStartDateChange(this.value)">
            </div>
            <div class="wizard-field">
              <label>Renewal / End Date <span class="req">*</span></label>
              <input type="date" id="wiz-end-date" value="${wizardData.endDate}" required>
            </div>
          </div>
        </div>

        <div class="wizard-footer">
          <span class="step-count-text">Step 3 of 4: Plan & Billing</span>
          <div class="wizard-footer-actions">
            <button type="button" class="btn btn-outline btn-sm" onclick="wizardData.step=2; renderWizardStep();">← Back</button>
            <button type="submit" class="btn btn-primary btn-sm" style="padding: 8px 22px;">Next: Review Details →</button>
          </div>
        </div>
      </form>
    `;
  } else if (wizardData.step === 4) {
    const planCosts = { 'Basic Plan': '₹15,000/yr', 'Pro Plan': '₹35,000/yr', 'Enterprise Plan': '₹75,000/yr' };
    stepHtml += `
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Step 4: Review Onboarding Information</h4>
            <p>Verify all campus details and administrator credentials before deployment.</p>
          </div>
        </div>

        <div class="review-grid">
          <div class="review-card">
            <div class="review-card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
              Campus Details
            </div>
            <div class="review-row"><span class="review-label">School Name:</span><span class="review-value">${wizardData.schoolName}</span></div>
            <div class="review-row"><span class="review-label">School Code:</span><span class="review-value"><span class="badge badge-info">${wizardData.schoolCode}</span></span></div>
            <div class="review-row"><span class="review-label">Affiliation:</span><span class="review-value">${wizardData.board || 'State Board'}</span></div>
            <div class="review-row"><span class="review-label">Academic Year:</span><span class="review-value">${wizardData.academicYear}</span></div>
            <div class="review-row"><span class="review-label">Principal:</span><span class="review-value">${wizardData.principal}</span></div>
            <div class="review-row"><span class="review-label">Campus Location:</span><span class="review-value">${wizardData.city || 'Tamil Nadu'}</span></div>
          </div>

          <div class="review-card">
            <div class="review-card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              Admin Master Account
            </div>
            <div class="review-row"><span class="review-label">Full Name:</span><span class="review-value">${wizardData.adminName}</span></div>
            <div class="review-row"><span class="review-label">Login Email:</span><span class="review-value">${wizardData.adminEmail}</span></div>
            <div class="review-row"><span class="review-label">Username:</span><span class="review-value"><code>${wizardData.adminUsername}</code></span></div>
            <div class="review-row"><span class="review-label">Temporary Password:</span><span class="review-value"><code style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:4px; font-weight:700;">${wizardData.adminPassword}</code></span></div>
            <div class="review-row"><span class="review-label">Role Assigned:</span><span class="review-value"><span class="badge badge-success">SCHOOL_ADMIN</span></span></div>
          </div>

          <div class="review-card span-2">
            <div class="review-card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Selected Plan & Validity
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 6px;">
              <div>
                <span style="font-size:0.75rem; color:#64748b; display:block;">Tier</span>
                <strong style="color:var(--color-primary); font-size:1.1rem;">${wizardData.plan}</strong>
              </div>
              <div>
                <span style="font-size:0.75rem; color:#64748b; display:block;">Pricing</span>
                <strong style="color:#047857; font-size:1.1rem;">${planCosts[wizardData.plan] || '₹35,000/yr'}</strong>
              </div>
              <div>
                <span style="font-size:0.75rem; color:#64748b; display:block;">Subscription Term</span>
                <strong style="color:#334155; font-size:0.92rem;">${wizardData.startDate} to ${wizardData.endDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wizard-footer">
        <span class="step-count-text">Step 4 of 4: Review Details</span>
        <div class="wizard-footer-actions">
          <button type="button" class="btn btn-outline btn-sm" onclick="wizardData.step=3; renderWizardStep();">← Back</button>
          <button type="button" class="btn btn-primary btn-sm" style="padding: 9px 24px; font-weight:700;" onclick="finalizeSchoolCreation()">Provision School & Activate ✓</button>
        </div>
      </div>
    `;
  }

  body.innerHTML = stepHtml;
  modal.style.display = 'flex';
}

function handleWizardNext(event, currentStep) {
  event.preventDefault();
  if (currentStep === 1) {
    wizardData.schoolName = document.getElementById('wiz-name').value.trim();
    wizardData.schoolCode = document.getElementById('wiz-code').value.trim().toUpperCase();
    wizardData.board = document.getElementById('wiz-board').value;
    wizardData.academicYear = document.getElementById('wiz-year').value.trim();
    wizardData.email = document.getElementById('wiz-email').value.trim();
    wizardData.phone = document.getElementById('wiz-phone').value.trim();
    wizardData.principal = document.getElementById('wiz-principal').value.trim();
    wizardData.city = document.getElementById('wiz-city').value.trim();
    wizardData.address = document.getElementById('wiz-address').value.trim();

    // Auto-populate Step 2 admin fields if they were never customized
    const cleanWord = wizardData.schoolName.split(' ')[0] || 'User';
    const cleanCode = wizardData.schoolCode.toLowerCase() || 'school';
    if (!wizardData.adminName) wizardData.adminName = `Admin ${cleanWord}`;
    if (!wizardData.adminEmail) wizardData.adminEmail = `admin@${cleanCode}.edu`;
    if (!wizardData.adminUsername) wizardData.adminUsername = `admin_${cleanCode}`;
    if (!wizardData.adminPassword) wizardData.adminPassword = `${wizardData.schoolCode || 'School'}@12345`;

    wizardData.step = 2;
  } else if (currentStep === 2) {
    wizardData.adminName = document.getElementById('wiz-admin-name').value.trim();
    wizardData.adminEmail = document.getElementById('wiz-admin-email').value.trim();
    wizardData.adminUsername = document.getElementById('wiz-admin-user').value.trim();
    wizardData.adminPassword = document.getElementById('wiz-admin-pass').value.trim();
    wizardData.step = 3;
  } else if (currentStep === 3) {
    wizardData.startDate = document.getElementById('wiz-start-date').value;
    wizardData.endDate = document.getElementById('wiz-end-date').value;
    wizardData.step = 4;
  }
  renderWizardStep();
}

function finalizeSchoolCreation() {
  const newSchoolId = 'SCHOOL00' + ((demoData.schools || []).length + 1);

  // 1. Create the school
  const newSchool = {
    id: newSchoolId,
    name: wizardData.schoolName,
    code: wizardData.schoolCode,
    city: wizardData.city || (wizardData.address.split(',').pop().trim()) || 'Tamil Nadu',
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
    subscription: wizardData.plan,
    createdDate: new Date().toISOString().split('T')[0]
  };
  demoData.schools.unshift(newSchool);

  // 2. Create School Admin user
  const newUserId = 'USR0' + ((demoData.users || []).length + 1);
  const newAdminUser = {
    id: newUserId,
    name: wizardData.adminName,
    email: wizardData.adminEmail,
    username: wizardData.adminUsername,
    password: wizardData.adminPassword,
    role: 'SCHOOL_ADMIN',
    schoolId: newSchoolId,
    schoolName: wizardData.schoolName,
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0]
  };
  demoData.users.unshift(newAdminUser);

  // 3. Create selected subscription
  const planPrices = { 'Basic Plan': '₹15,000', 'Pro Plan': '₹35,000', 'Enterprise Plan': '₹75,000' };
  const newSubId = 'SUB-0' + ((demoData.subscriptions || []).length + 1);
  demoData.subscriptions.unshift({
    id: newSubId,
    schoolId: newSchoolId,
    school: wizardData.schoolName,
    plan: wizardData.plan,
    startDate: wizardData.startDate,
    endDate: wizardData.endDate,
    status: 'ACTIVE',
    amount: planPrices[wizardData.plan] || '₹35,000'
  });

  // 4. Create initial bill
  const newInvNo = 'INV-2026-00' + ((demoData.bills || []).length + 1);
  demoData.bills.unshift({
    invoiceNo: newInvNo,
    schoolId: newSchoolId,
    school: wizardData.schoolName,
    plan: wizardData.plan,
    amount: planPrices[wizardData.plan] || '₹35,000',
    dueDate: wizardData.startDate,
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'PAID'
  });

  // 5. Log activity without emoji
  demoData.activities.unshift({
    id: 'ACT-' + Date.now(),
    type: 'school_registered',
    text: `New school onboarded: ${wizardData.schoolName} (${wizardData.schoolCode})`,
    time: 'Just now'
  });

  updateLocalStorageData();

  // 6. Show Success modal with generated credentials
  const modal = document.getElementById('portal-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'School Created Successfully!';
  body.innerHTML = `
    <div style="text-align: center; padding: 25px 20px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);">✓</div>
      <h3 style="color:var(--color-primary); font-size: 1.45rem; margin-bottom: 6px;">${wizardData.schoolName} is Provisioned & Active</h3>
      <p style="color:#64748b; font-size: 0.9rem; margin-bottom: 24px;">Multi-tenant partition created and School Administrator credentials generated successfully.</p>
      
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; text-align: left; max-width: 520px; margin: 0 auto 24px auto;">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #e2e8f0;">
          <span style="color:#64748b; font-size:0.85rem;">Campus Partition ID</span>
          <span class="badge badge-info">${newSchoolId}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#64748b; font-size:0.85rem;">Admin Name</span>
          <strong style="color:#1e293b; font-size:0.88rem;">${wizardData.adminName}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#64748b; font-size:0.85rem;">Login ID / Email</span>
          <code style="color:#2563eb; font-size:0.88rem;">${wizardData.adminEmail}</code>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#64748b; font-size:0.85rem;">Username</span>
          <code style="color:#1e293b; font-size:0.88rem;">${wizardData.adminUsername}</code>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748b; font-size:0.85rem;">Temporary Password</span>
          <code style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:4px; font-weight:700;">${wizardData.adminPassword}</code>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-outline btn-sm" onclick="closeModal();">Close</button>
        <button class="btn btn-primary btn-sm" style="padding:8px 24px;" onclick="closeModal(); renderTabContent('sa-schools');">View in Schools List →</button>
      </div>
    </div>
  `;
}

// ============================================================================
// Super Admin Action Modals & Helpers
// ============================================================================

function viewSchoolDetails(schoolId) {
  const school = (demoData.schools || []).find(s => s.id === schoolId);
  if (!school) return;

  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');

  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerHTML = `Campus Overview <span style="font-size:0.75rem; color:#64748b; font-weight:normal; margin-left:8px;">(${escapeHtml(school.code)})</span>`;
  body.innerHTML = `
    <div style="padding: 4px;">
      <!-- Wizard Header Strip -->
      <div class="wizard-header-strip" style="margin-bottom: 20px;">
        <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
        </div>
        <div class="wizard-header-titles" style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>${escapeHtml(school.name)}</h4>
            <span class="badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}">${school.status}</span>
          </div>
          <p>Affiliation: <strong>${escapeHtml(school.board || 'State Board')}</strong> | Academic Year: <strong>${escapeHtml(school.academicYear || '2026-2027')}</strong> | City: <strong>${escapeHtml(school.city || '—')}</strong></p>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; text-align: center;">
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Students</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary); margin-top: 2px;">${school.studentsCount || 0}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; text-align: center;">
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Teachers</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #0284c7; margin-top: 2px;">${school.teachersCount || 0}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; text-align: center;">
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Parents</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #10b981; margin-top: 2px;">${school.parentsCount || 0}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; text-align: center;">
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">License Tier</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #6366f1; margin-top: 6px;">${escapeHtml(school.subscription || 'Pro Plan')}</div>
        </div>
      </div>

      <!-- Structured Wizard-style Review Grid -->
      <div class="review-grid" style="margin-bottom: 22px;">
        <div class="review-card">
          <div class="review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
            Campus & Contact Information
          </div>
          <div class="review-row"><span class="review-label">School Code:</span><span class="review-value"><span class="badge badge-info">${escapeHtml(school.code)}</span></span></div>
          <div class="review-row"><span class="review-label">Principal / Head:</span><span class="review-value">${escapeHtml(school.principal || '—')}</span></div>
          <div class="review-row"><span class="review-label">Official Email:</span><span class="review-value">${escapeHtml(school.email || '—')}</span></div>
          <div class="review-row"><span class="review-label">Contact Phone:</span><span class="review-value">${escapeHtml(school.phone || '—')}</span></div>
          <div class="review-row"><span class="review-label">City Location:</span><span class="review-value">${escapeHtml(school.city || '—')}</span></div>
        </div>

        <div class="review-card">
          <div class="review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Campus Administrator Profile
          </div>
          <div class="review-row"><span class="review-label">Administrator:</span><span class="review-value"><strong>${escapeHtml(school.adminName || school.admin)}</strong></span></div>
          <div class="review-row"><span class="review-label">Login ID / Email:</span><span class="review-value"><code style="color:#2563eb;">${escapeHtml(school.admin || '—')}</code></span></div>
          <div class="review-row"><span class="review-label">Partition ID:</span><span class="review-value"><span class="badge badge-info">${escapeHtml(school.id)}</span></span></div>
          <div class="review-row"><span class="review-label">Account Status:</span><span class="review-value"><span class="badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}">${school.status}</span></span></div>
          <div class="review-row"><span class="review-label">Onboarding Date:</span><span class="review-value">${escapeHtml(school.createdDate || '2026-01-01')}</span></div>
        </div>

        <div class="review-card span-2">
          <div class="review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Platform Subscription & Modules
          </div>
          <div class="review-row"><span class="review-label">Active License Tier:</span><span class="review-value"><strong>${escapeHtml(school.subscription || 'Pro Plan')}</strong></span></div>
          <div class="review-row"><span class="review-label">Modules Included:</span><span class="review-value">Student Info System (SIS), Attendance, Fees & Invoicing, Exam Results, SMS/WhatsApp Gateway</span></div>
          <div class="review-row"><span class="review-label">Sync Status:</span><span class="review-value"><span class="badge badge-success">Active & Synchronized</span></span></div>
        </div>
      </div>

      <!-- Action Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:16px; border-top:1px solid #e2e8f0;">
        <span style="font-size:0.8rem; color:#64748b;">Partition ID: <code>${escapeHtml(school.id)}</code></span>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
          <button type="button" class="btn btn-primary btn-sm" onclick="editSchool('${school.id}')" style="display:inline-flex; align-items:center; gap:6px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit School Details
          </button>
        </div>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function editSchool(schoolId) {
  const school = (demoData.schools || []).find(s => s.id === schoolId);
  if (!school) return;

  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');

  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerHTML = `Edit Campus Details <span style="font-size:0.75rem; color:#64748b; font-weight:normal; margin-left:8px;">(${escapeHtml(school.code)})</span>`;
  body.innerHTML = `
    <form onsubmit="saveEditedSchool(event, '${school.id}')">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Update Institutional Profile</h4>
            <p>Modify campus parameters, affiliation board, and licensing configuration.</p>
          </div>
        </div>

        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>School Name <span class="req">*</span></label>
            <input type="text" id="edit-sch-name" value="${escapeHtml(school.name)}" required>
          </div>
          <div class="wizard-field">
            <label>School Code <span class="req">*</span></label>
            <input type="text" id="edit-sch-code" value="${escapeHtml(school.code)}" required>
          </div>
          <div class="wizard-field">
            <label>Affiliation / Board <span class="req">*</span></label>
            <select id="edit-sch-board">
              <option value="State Board" ${school.board === 'State Board' ? 'selected' : ''}>State Board</option>
              <option value="CBSE" ${school.board === 'CBSE' ? 'selected' : ''}>CBSE</option>
              <option value="ICSE" ${school.board === 'ICSE' ? 'selected' : ''}>ICSE</option>
              <option value="Matriculation" ${school.board === 'Matriculation' ? 'selected' : ''}>Matriculation</option>
              <option value="International" ${school.board === 'International' ? 'selected' : ''}>International / IGCSE</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>City / Location <span class="req">*</span></label>
            <input type="text" id="edit-sch-city" value="${escapeHtml(school.city || '')}" required>
          </div>
          <div class="wizard-field">
            <label>Principal Name <span class="req">*</span></label>
            <input type="text" id="edit-sch-principal" value="${escapeHtml(school.principal || '')}" required>
          </div>
          <div class="wizard-field">
            <label>Official Email <span class="req">*</span></label>
            <input type="email" id="edit-sch-email" value="${escapeHtml(school.email || '')}">
          </div>
          <div class="wizard-field">
            <label>Contact Phone <span class="req">*</span></label>
            <input type="text" id="edit-sch-phone" value="${escapeHtml(school.phone || '')}">
          </div>
          <div class="wizard-field">
            <label>Subscription Tier <span class="req">*</span></label>
            <select id="edit-sch-plan" required>
              <option value="Basic Plan" ${school.subscription === 'Basic Plan' ? 'selected' : ''}>Basic Plan (₹15,000/yr)</option>
              <option value="Pro Plan" ${school.subscription === 'Pro Plan' ? 'selected' : ''}>Pro Plan (₹35,000/yr)</option>
              <option value="Enterprise Plan" ${school.subscription === 'Enterprise Plan' ? 'selected' : ''}>Enterprise Plan (₹75,000/yr)</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Campus Status <span class="req">*</span></label>
            <select id="edit-sch-status" required>
              <option value="Active" ${school.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${school.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div class="wizard-field span-2">
            <label>Enrolled Students Count <span class="req">*</span></label>
            <input type="number" id="edit-sch-students" value="${school.studentsCount || 0}" required>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save Changes ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveEditedSchool(event, schoolId) {
  event.preventDefault();
  const school = (demoData.schools || []).find(s => s.id === schoolId);
  if (!school) return;

  school.name = document.getElementById('edit-sch-name').value;
  school.code = document.getElementById('edit-sch-code').value;
  school.board = document.getElementById('edit-sch-board').value;
  school.city = document.getElementById('edit-sch-city').value;
  school.principal = document.getElementById('edit-sch-principal').value;
  school.email = document.getElementById('edit-sch-email').value;
  school.phone = document.getElementById('edit-sch-phone').value;
  school.subscription = document.getElementById('edit-sch-plan').value;
  school.status = document.getElementById('edit-sch-status').value;
  school.studentsCount = parseInt(document.getElementById('edit-sch-students').value) || 0;

  updateLocalStorageData();
  closeModal();
  renderTabContent('sa-schools');
  showFeedbackModal('School Updated', `Campus details for "${school.name}" were updated successfully.`);
}

function viewSchoolAdmin(adminQuery) {
  const admin = (demoData.users || []).find(u => u.id === adminQuery || u.email === adminQuery || u.username === adminQuery || u.schoolId === adminQuery);
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  if (!admin) {
    const school = (demoData.schools || []).find(s => s.admin === adminQuery || s.id === adminQuery);
    const adminName = school ? (school.adminName || school.admin) : adminQuery;
    const adminEmail = school ? school.admin : adminQuery;
    title.textContent = 'School Administrator Profile';
    body.innerHTML = `
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Campus Administrator Profile</h4>
            <p>Account identity and contact details for campus administration.</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px; padding:16px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
          <div style="width:52px; height:52px; border-radius:50%; background:#e0e7ff; color:#3730a3; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:700;">
            ${(adminName || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h4 style="margin:0; font-size:1.15rem; color:var(--color-primary);">${escapeHtml(adminName)}</h4>
            <div style="font-size:0.82rem; color:#64748b; margin-top:3px;">Campus Administrator</div>
          </div>
        </div>
        <div class="review-grid" style="grid-template-columns:1fr; gap:10px;">
          <div class="review-row"><span>Login ID / Email:</span><strong>${escapeHtml(adminEmail)}</strong></div>
          <div class="review-row"><span>Assigned School:</span><strong>${school ? escapeHtml(school.name) : 'Multi-Campus'}</strong></div>
          <div class="review-row"><span>Account Status:</span><span class="badge badge-success">Active</span></div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
      </div>
    `;
    modal.style.display = 'flex';
    return;
  }

  title.textContent = `Administrator Profile — ${admin.name}`;
  body.innerHTML = `
    <div class="wizard-form-box">
      <div class="wizard-header-strip">
        <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="wizard-header-titles">
          <h4>Campus Administrator Profile</h4>
          <p>Account identity, campus allocation, and security credentials status.</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px; padding:16px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="width:52px; height:52px; border-radius:50%; background:#e0e7ff; color:#3730a3; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:700;">
          ${(admin.name || 'A')[0].toUpperCase()}
        </div>
        <div>
          <h4 style="margin:0; font-size:1.15rem; color:var(--color-primary);">${escapeHtml(admin.name)}</h4>
          <div style="font-size:0.82rem; color:#64748b; margin-top:3px;">Role: <span class="badge badge-info">${admin.role}</span></div>
        </div>
      </div>
      <div class="review-grid" style="grid-template-columns:1fr; gap:10px; margin-bottom:15px;">
        <div class="review-row"><span>Login Username:</span><code>${escapeHtml(admin.username || '—')}</code></div>
        <div class="review-row"><span>Official Email:</span><strong>${escapeHtml(admin.email)}</strong></div>
        <div class="review-row"><span>Assigned Campus:</span><strong>${escapeHtml(admin.schoolName || 'All Campuses')}</strong></div>
        <div class="review-row"><span>Campus ID:</span><span class="badge badge-info">${escapeHtml(admin.schoolId || 'None')}</span></div>
        <div class="review-row"><span>Account Status:</span><span class="badge ${admin.status === 'Active' ? 'badge-success' : 'badge-danger'}">${admin.status}</span></div>
        <div class="review-row"><span>Created On:</span><span>${admin.createdDate || '2026-01-01'}</span></div>
      </div>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
    </div>
  `;
  modal.style.display = 'flex';
}

function viewAdminProfile(adminId) {
  viewSchoolAdmin(adminId);
}

function toggleSchoolStatus(schoolId, newStatus) {
  const idx = demoData.schools.findIndex(s => s.id === schoolId);
  if (idx > -1) {
    const schoolName = demoData.schools[idx].name;
    demoData.schools[idx].status = newStatus;
    demoData.activities.unshift({
      id: 'ACT-' + Date.now(),
      type: newStatus === 'Active' ? 'school_activated' : 'school_deactivated',
      text: `School ${newStatus === 'Active' ? 'activated' : 'deactivated'}: ${schoolName}`,
      time: 'Just now'
    });
    updateLocalStorageData();
    const activeTab = document.querySelector('.menu-item.active')?.innerText.toLowerCase() || '';
    if (activeTab.includes('dashboard')) renderTabContent('sa-dashboard');
    else renderTabContent('sa-schools');
    showFeedbackModal(`School ${newStatus}`, `"${schoolName}" is now marked as ${newStatus}.`);
  }
}

let saSchoolFilterState = {
  status: 'All',
  query: ''
};

function filterSaSchoolsView(status, btnElement) {
  saSchoolFilterState.status = status;
  if (btnElement) {
    document.querySelectorAll('.sa-filter-segment .sa-filter-tab').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  applySaSchoolFiltering();
}

function filterSaSchoolsSearch(val) {
  saSchoolFilterState.query = (val || '').toLowerCase().trim();
  applySaSchoolFiltering();
}

function applySaSchoolFiltering() {
  const rows = document.querySelectorAll('.sa-school-row');
  rows.forEach(r => {
    const s = r.getAttribute('data-status') || '';
    const text = r.innerText.toLowerCase();
    const matchStatus = (saSchoolFilterState.status === 'All' || s === saSchoolFilterState.status);
    const matchQuery = (!saSchoolFilterState.query || text.includes(saSchoolFilterState.query));
    r.style.display = (matchStatus && matchQuery) ? '' : 'none';
  });
}

function filterSaAdminsView(status, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const rows = document.querySelectorAll('.sa-admin-row');
  rows.forEach(r => {
    const s = r.getAttribute('data-status') || '';
    r.style.display = (status === 'All' || s === status) ? '' : 'none';
  });
}

function filterServicesView(status, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const cards = document.querySelectorAll('.sa-service-card');
  cards.forEach(c => {
    const s = c.getAttribute('data-status') || '';
    c.style.display = (status === 'All' || s === status) ? 'block' : 'none';
  });
}

function switchSubView(view, filterStatus, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const plansPane = document.getElementById('sub-plans-pane');
  const tablePane = document.getElementById('sub-table-pane');

  if (view === 'plans') {
    if (plansPane) plansPane.style.display = 'block';
    if (tablePane) tablePane.style.display = 'none';
  } else {
    if (plansPane) plansPane.style.display = 'none';
    if (tablePane) tablePane.style.display = 'block';
    if (filterStatus) {
      document.querySelectorAll('.sa-sub-row').forEach(r => {
        const s = r.getAttribute('data-status');
        r.style.display = (filterStatus === 'All' || s === filterStatus) ? '' : 'none';
      });
    }
  }
}

function renewSubscription(subId) {
  const sub = (demoData.subscriptions || []).find(s => s.id === subId);
  if (!sub) return;

  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = `Renew Subscription — ${sub.school}`;
  body.innerHTML = `
    <form onsubmit="saveRenewedSubscription(event, '${sub.id}')">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Renew Campus License & Subscription</h4>
            <p>Update subscription tier, validity dates, status, and renewal pricing.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>School Campus Name</label>
            <input type="text" value="${escapeHtml(sub.school)}" disabled style="background:#f1f5f9; color:#64748b; font-weight:600;">
          </div>
          <div class="wizard-field">
            <label>Subscription Plan Tier <span class="req">*</span></label>
            <select id="renew-sub-plan" required onchange="updateRenewPlanAmount(this.value)">
              <option value="Basic Plan" ${sub.plan === 'Basic Plan' ? 'selected' : ''}>Basic Plan (₹15,000/yr)</option>
              <option value="Pro Plan" ${sub.plan === 'Pro Plan' ? 'selected' : ''}>Pro Plan (₹35,000/yr)</option>
              <option value="Enterprise Plan" ${sub.plan === 'Enterprise Plan' ? 'selected' : ''}>Enterprise Plan (₹75,000/yr)</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>License Status <span class="req">*</span></label>
            <select id="renew-sub-status" required>
              <option value="ACTIVE" ${sub.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
              <option value="EXPIRED" ${sub.status === 'EXPIRED' ? 'selected' : ''}>EXPIRED</option>
              <option value="PENDING" ${sub.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Start Validity Date <span class="req">*</span></label>
            <input type="date" id="renew-sub-start" value="${sub.startDate}" required>
          </div>
          <div class="wizard-field">
            <label>Expiry / End Date <span class="req">*</span></label>
            <input type="date" id="renew-sub-end" value="${sub.endDate}" required>
          </div>
          <div class="wizard-field span-2">
            <label>Renewal Amount (₹) <span class="req">*</span></label>
            <input type="text" id="renew-sub-amount" value="${sub.amount}" required>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save & Renew Subscription ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function updateRenewPlanAmount(planName) {
  const planPrices = { 'Basic Plan': '₹15,000', 'Pro Plan': '₹35,000', 'Enterprise Plan': '₹75,000' };
  const amtInput = document.getElementById('renew-sub-amount');
  if (amtInput && planPrices[planName]) {
    amtInput.value = planPrices[planName];
  }
}

function saveRenewedSubscription(event, subId) {
  event.preventDefault();
  const sub = (demoData.subscriptions || []).find(s => s.id === subId);
  if (!sub) return;

  const plan = document.getElementById('renew-sub-plan').value;
  const status = document.getElementById('renew-sub-status').value;
  const startDate = document.getElementById('renew-sub-start').value;
  const endDate = document.getElementById('renew-sub-end').value;
  const amount = document.getElementById('renew-sub-amount').value;

  sub.plan = plan;
  sub.status = status;
  sub.startDate = startDate;
  sub.endDate = endDate;
  sub.amount = amount;

  const school = (demoData.schools || []).find(sch => sch.id === sub.schoolId || sch.name === sub.school);
  if (school) {
    school.subscription = plan;
  }

  demoData.activities.unshift({
    id: 'ACT-' + Date.now(),
    type: 'sub_activated',
    text: `Subscription updated for ${sub.school}: ${plan} (${status})`,
    time: 'Just now'
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('sa-subscriptions');
  showFeedbackModal('Subscription Updated', `Subscription for ${sub.school} updated to ${plan} (${status}).`);
}

function togglePlanModalTab(tab) {
  const paneSub = document.getElementById('modal-pane-sub');
  const panePlan = document.getElementById('modal-pane-plan');
  const btnSub = document.getElementById('tab-btn-sub');
  const btnPlan = document.getElementById('tab-btn-plan');
  const headerSubtitle = document.getElementById('modal-header-subtitle');

  if (tab === 'plan') {
    if (paneSub) paneSub.style.display = 'none';
    if (panePlan) panePlan.style.display = 'block';
    if (btnSub) btnSub.classList.remove('active');
    if (btnPlan) btnPlan.classList.add('active');
    if (headerSubtitle) headerSubtitle.textContent = 'Configure SaaS pricing packages, student capacity limits, and module features.';
  } else {
    if (paneSub) paneSub.style.display = 'block';
    if (panePlan) panePlan.style.display = 'none';
    if (btnSub) btnSub.classList.add('active');
    if (btnPlan) btnPlan.classList.remove('active');
    if (headerSubtitle) headerSubtitle.textContent = 'Enroll a school campus into an active subscription license and configure billing terms.';
  }
}

function openCreatePlanModal(defaultTab = 'subscription', planId = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const schools = demoData.schools || [];
  const plans = demoData.plans || [];

  let planObj = null;
  if (planId) {
    planObj = plans.find(p => p.id === planId);
    defaultTab = 'plan';
  }

  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearDate = nextYear.toISOString().split('T')[0];

  title.textContent = planObj ? `Configure Plan — ${planObj.name}` : 'Subscription Management';
  body.innerHTML = `
    <!-- Top Modal Tab Switcher -->
    <div style="display:flex; gap:10px; margin-bottom:16px; background:#f1f5f9; padding:4px; border-radius:8px;">
      <button type="button" id="tab-btn-sub" class="sa-filter-tab ${defaultTab === 'subscription' ? 'active' : ''}" style="flex:1; text-align:center; padding:8px 12px; font-weight:600;" onclick="togglePlanModalTab('subscription')">
        🏢 Assign Campus Subscription
      </button>
      <button type="button" id="tab-btn-plan" class="sa-filter-tab ${defaultTab === 'plan' ? 'active' : ''}" style="flex:1; text-align:center; padding:8px 12px; font-weight:600;" onclick="togglePlanModalTab('plan')">
        📦 ${planObj ? 'Edit Plan Tier' : 'Define Plan Tier'}
      </button>
    </div>

    <div class="wizard-form-box">
      <div class="wizard-header-strip">
        <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        </div>
        <div class="wizard-header-titles">
          <h4>SaaS Subscription & Plan Configurator</h4>
          <p id="modal-header-subtitle">${defaultTab === 'plan' ? 'Configure SaaS pricing packages, student capacity limits, and module features.' : 'Enroll a school campus into an active subscription license and configure billing terms.'}</p>
        </div>
      </div>

      <!-- PANE 1: Assign School Subscription -->
      <div id="modal-pane-sub" style="display:${defaultTab === 'subscription' ? 'block' : 'none'};">
        <form onsubmit="saveNewSubscription(event)">
          <div class="wizard-grid-2">
            <div class="wizard-field span-2">
              <label>School Campus <span class="req">*</span></label>
              <select id="new-sub-school" required>
                <option value="">-- Choose School Campus --</option>
                ${schools.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${s.id})</option>`).join('')}
              </select>
            </div>
            <div class="wizard-field">
              <label>Subscription Plan Tier <span class="req">*</span></label>
              <select id="new-sub-plan" required onchange="onNewSubPlanChange(this.value)">
                ${plans.map((p, idx) => `<option value="${escapeHtml(p.name)}" data-price="${escapeHtml(p.price)}" ${idx === 0 ? 'selected' : ''}>${escapeHtml(p.name)} (${escapeHtml(p.price)})</option>`).join('')}
              </select>
            </div>
            <div class="wizard-field">
              <label>Initial License Status <span class="req">*</span></label>
              <select id="new-sub-status" required>
                <option value="ACTIVE" selected>ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
            <div class="wizard-field">
              <label>Start Validity Date <span class="req">*</span></label>
              <input type="date" id="new-sub-start" value="${today}" required>
            </div>
            <div class="wizard-field">
              <label>Expiry / End Date <span class="req">*</span></label>
              <input type="date" id="new-sub-end" value="${nextYearDate}" required>
            </div>
            <div class="wizard-field span-2">
              <label>Annual Subscription Fee (₹) <span class="req">*</span></label>
              <input type="text" id="new-sub-amount" value="${plans[0] ? plans[0].price : '₹15,000'}" required>
              <span class="input-hint">Default pricing matches selected tier; customize if special institutional terms apply.</span>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
            <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 24px;">Activate & Save Subscription ✓</button>
          </div>
        </form>
      </div>

      <!-- PANE 2: Create / Edit Plan Tier -->
      <div id="modal-pane-plan" style="display:${defaultTab === 'plan' ? 'block' : 'none'};">
        <form onsubmit="saveSubscriptionPlan(event, ${planObj ? `'${planObj.id}'` : 'null'})">
          <div class="wizard-grid-2">
            <div class="wizard-field">
              <label>Plan Tier Name <span class="req">*</span></label>
              <input type="text" id="plan-name" value="${escapeHtml(planObj ? planObj.name : '')}" placeholder="e.g. Ultra Campus Plan / Starter Plan" required>
            </div>
            <div class="wizard-field">
              <label>Annual Price (₹) <span class="req">*</span></label>
              <input type="text" id="plan-price" value="${escapeHtml(planObj ? planObj.price : '')}" placeholder="e.g. ₹45,000/yr" required>
            </div>
            <div class="wizard-field span-2">
              <label>Max Students Limit <span class="req">*</span></label>
              <input type="number" id="plan-students" value="${planObj ? planObj.maxStudents : 2500}" placeholder="e.g. 2500" required min="50">
            </div>
            <div class="wizard-field span-2">
              <label>Included Features & Modules <span class="req">*</span></label>
              <textarea id="plan-features" rows="3" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:10px; font-family:inherit; font-size:0.9rem;" placeholder="e.g. Attendance, Online Fee Portal, SMS Gateway, Live GPS Tracking, Custom Mobile App" required>${escapeHtml(planObj ? planObj.features : '')}</textarea>
              <span class="input-hint">List modules separated by commas (e.g. Attendance, Marks, Online Fee Portal).</span>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
            <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 24px;">${planObj ? 'Save Plan Changes ✓' : 'Save Plan Tier ✓'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function onNewSubPlanChange(planName) {
  const plans = demoData.plans || [];
  const found = plans.find(p => p.name === planName);
  const amtInput = document.getElementById('new-sub-amount');
  if (amtInput && found) {
    amtInput.value = found.price;
  }
}

function saveNewSubscription(event) {
  event.preventDefault();
  const schoolId = document.getElementById('new-sub-school').value;
  const plan = document.getElementById('new-sub-plan').value;
  const status = document.getElementById('new-sub-status').value;
  const startDate = document.getElementById('new-sub-start').value;
  const endDate = document.getElementById('new-sub-end').value;
  const amount = document.getElementById('new-sub-amount').value;

  const school = (demoData.schools || []).find(s => s.id === schoolId);
  const schoolName = school ? school.name : 'School Campus';

  const newId = 'SUB-0' + ((demoData.subscriptions || []).length + 1);

  demoData.subscriptions.unshift({
    id: newId,
    schoolId,
    school: schoolName,
    plan,
    startDate,
    endDate,
    status,
    amount
  });

  if (school) {
    school.subscription = plan;
  }

  demoData.activities.unshift({
    id: 'ACT-' + Date.now(),
    type: 'sub_activated',
    text: `New ${plan} subscription activated for ${schoolName}`,
    time: 'Just now'
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('sa-subscriptions');
  showFeedbackModal('Subscription Activated', `New subscription ${newId} (${plan}) activated for ${schoolName}.`);
}

function openCreateSubscriptionModal() {
  openCreatePlanModal('subscription');
}

function filterSaBillsView(status, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  document.querySelectorAll('.sa-bill-row').forEach(r => {
    const s = r.getAttribute('data-status');
    r.style.display = (status === 'All' || s === status) ? '' : 'none';
  });
}

function renderReportType(type, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const pane = document.getElementById('report-output-pane');
  if (!pane) return;
  pane.innerHTML = `
    <div class="portal-card" style="border-left-color: var(--color-primary);">
      <div class="portal-card-title">${type} Metrics Compilation</div>
      <p style="font-size:2rem; font-weight:700; color:var(--color-primary); margin:8px 0;">99.4% Platform Health</p>
      <p style="font-size:0.88rem; color:var(--color-text-dark);">Report parameters generated for ${type.toLowerCase()} records across school nodes.</p>
    </div>
    <div class="portal-card" style="border-left-color: var(--color-success);">
      <div class="portal-card-title">${type} Growth Analysis</div>
      <p style="font-size:2rem; font-weight:700; color:var(--color-success); margin:8px 0;">+21.5% YoY Growth</p>
      <p style="font-size:0.88rem; color:var(--color-text-dark);">Performance benchmark meeting ZenSchool quarterly platform targets.</p>
    </div>
  `;
}

function applyReportFilters() {
  const schoolVal = document.getElementById('report-filter-school')?.value;
  showFeedbackModal('Report Filtered', `Analytics updated for: ${schoolVal === 'All' ? 'All Campuses' : schoolVal}.`);
}

function switchSettingsSection(section, btnElement) {
  if (btnElement) {
    const parent = btnElement.closest('.sa-filter-segment') || btnElement.closest('.announcement-categories');
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    else document.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const pane = document.getElementById('settings-content-pane');
  if (!pane) return;
  pane.innerHTML = `
    <div class="wizard-form-box" style="background:var(--color-bg-white); border-radius:var(--radius-md); padding:24px; box-shadow:var(--shadow-sm); border:1px solid #e2e8f0;">
      <div class="wizard-header-strip">
        <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
        <div class="wizard-header-titles">
          <h4>ZenSchool ${section.toUpperCase()} Policy Settings</h4>
          <p>Configure institutional standards, policy enforcement flags, and security controls.</p>
        </div>
      </div>
      <form onsubmit="savePlatformSettings(event)">
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Policy Header / Description <span class="req">*</span></label>
            <input type="text" value="Standard ${section} enterprise policy configuration" required>
          </div>
          <div class="wizard-field">
            <label>Enforcement Status <span class="req">*</span></label>
            <select>
              <option value="Active">Enforced Across All Campuses</option>
              <option value="Disabled">Optional per Campus</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Audit Logging</label>
            <select>
              <option value="Enabled">Full Activity Logging</option>
              <option value="Minimal">Basic Logging</option>
            </select>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
          <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 24px;">Update ${section} Settings ✓</button>
        </div>
      </form>
    </div>
  `;
}

function savePlatformSettings(event) {
  event.preventDefault();
  showFeedbackModal('Settings Saved', 'ZenSchool Platform configuration updated successfully.');
}

function openAddAdminModal() {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'Add School Administrator';
  body.innerHTML = `
    <form onsubmit="saveNewSchoolAdmin(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Provision Administrator Account</h4>
            <p>Generate login credentials and associate them with an institutional campus.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Admin Full Name <span class="req">*</span></label>
            <input type="text" id="new-adm-name" placeholder="e.g. K. Sundaram (Principal / IT Head)" required>
          </div>
          <div class="wizard-field">
            <label>Official Email Address <span class="req">*</span></label>
            <input type="email" id="new-adm-email" placeholder="e.g. admin@schoolname.edu" required>
          </div>
          <div class="wizard-field">
            <label>Login Username <span class="req">*</span></label>
            <input type="text" id="new-adm-user" placeholder="e.g. admin_sjm" required>
          </div>
          <div class="wizard-field">
            <label>Initial Password <span class="req">*</span></label>
            <input type="text" id="new-adm-pass" value="Admin@2026" required>
          </div>
          <div class="wizard-field">
            <label>Assign to Campus <span class="req">*</span></label>
            <select id="new-adm-school" required>
              ${(demoData.schools || []).map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Create School Admin ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveNewSchoolAdmin(event) {
  event.preventDefault();
  const name = document.getElementById('new-adm-name').value;
  const email = document.getElementById('new-adm-email').value;
  const username = document.getElementById('new-adm-user').value;
  const password = document.getElementById('new-adm-pass').value;
  const schoolId = document.getElementById('new-adm-school').value;

  const school = (demoData.schools || []).find(s => s.id === schoolId);
  const schoolName = school ? school.name : 'School';

  const newAdminId = 'USR0' + ((demoData.users || []).length + 1);
  demoData.users.unshift({
    id: newAdminId,
    name,
    email,
    username,
    password,
    role: 'SCHOOL_ADMIN',
    schoolId,
    schoolName,
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0]
  });

  if (school) {
    school.admin = email;
    school.adminName = name;
  }

  updateLocalStorageData();
  closeModal();
  renderTabContent('sa-admin-management');
  showFeedbackModal('Admin Created', `Admin ${name} created and assigned to ${schoolName}.`);
}

function openAssignAdminModal(adminId = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const admins = (demoData.users || []).filter(u => u.role === 'SCHOOL_ADMIN');

  title.textContent = 'Assign / Reassign Administrator';
  body.innerHTML = `
    <form onsubmit="handleAssignAdmin(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Link Administrator to Campus</h4>
            <p>Assign administrative authority for a school to a registered user.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Select School Administrator <span class="req">*</span></label>
            <select id="assign-admin-select" required>
              ${admins.map(a => `<option value="${a.id}" ${a.id === adminId ? 'selected' : ''}>${a.name} (${a.email}) — Current: ${a.schoolName || 'Unassigned'}</option>`).join('')}
            </select>
          </div>
          <div class="wizard-field span-2">
            <label>Select Target Campus <span class="req">*</span></label>
            <select id="assign-school-select" required>
              ${(demoData.schools || []).map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Confirm Assignment ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function handleAssignAdmin(event) {
  event.preventDefault();
  const adminId = document.getElementById('assign-admin-select').value;
  const schoolId = document.getElementById('assign-school-select').value;

  const admin = demoData.users.find(u => u.id === adminId);
  const school = demoData.schools.find(s => s.id === schoolId);

  if (admin && school) {
    admin.schoolId = schoolId;
    admin.schoolName = school.name;
    school.admin = admin.email;
    school.adminName = admin.name;

    updateLocalStorageData();
    closeModal();
    renderTabContent('sa-admin-management');
    showFeedbackModal('Admin Reassigned', `${admin.name} is now the assigned School Admin for ${school.name}.`);
  }
}

function resetAdminPassword(adminId) {
  const admin = demoData.users.find(u => u.id === adminId);
  if (!admin) return;
  const newPass = 'Zen@' + Math.floor(10000 + Math.random() * 90000);
  admin.password = newPass;
  updateLocalStorageData();
  showFeedbackModal('Password Reset', `Temporary password for ${admin.name} (${admin.email}):\n\n${newPass}`);
}

function toggleAdminStatus(adminId, newStatus) {
  const admin = demoData.users.find(u => u.id === adminId);
  if (admin) {
    admin.status = newStatus;
    updateLocalStorageData();
    renderTabContent('sa-admin-management');
  }
}

function openAddSchoolUserModal() {
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'Add Campus User Account';
  body.innerHTML = `
    <form onsubmit="saveSchoolUser(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Provision Campus User</h4>
            <p>Create credentials for Principal, Teacher, Student, or Parent on this campus.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field">
            <label>Full Name <span class="req">*</span></label>
            <input type="text" id="sch-user-name" placeholder="e.g. Mrs. Kavitha S. / Ramesh Kumar" required>
          </div>
          <div class="wizard-field">
            <label>Phone Number <span class="req">*</span></label>
            <input type="tel" id="sch-user-phone" placeholder="e.g. +91 98401 23456" required>
          </div>
          <div class="wizard-field">
            <label>Assigned Role <span class="req">*</span></label>
            <select id="sch-user-role" required>
              <option value="PRINCIPAL">Principal</option>
              <option value="TEACHER" selected>Teacher</option>
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Login Email / User ID <span class="req">*</span></label>
            <input type="email" id="sch-user-email" placeholder="e.g. user@school.edu" required>
          </div>
          <div class="wizard-field span-2">
            <label>Initial Temporary Password <span class="req">*</span></label>
            <input type="text" id="sch-user-pass" value="Welcome@123" required>
            <span class="input-hint">User will be prompted to update this password upon initial authentication.</span>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Create User Account ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveSchoolUser(event) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const name = document.getElementById('sch-user-name').value;
  const phone = document.getElementById('sch-user-phone').value;
  const role = document.getElementById('sch-user-role').value;
  const email = document.getElementById('sch-user-email').value;
  const password = document.getElementById('sch-user-pass').value;

  const newId = 'USR' + Math.floor(100 + Math.random() * 900);
  demoData.users.unshift({
    id: newId,
    name,
    email,
    phone: phone || '+91 98401 23456',
    username: email.split('@')[0],
    password,
    role,
    schoolId: session.schoolId || 'SCHOOL002',
    schoolName: session.schoolName || 'School',
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0]
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('school-admin-users');
  showFeedbackModal('User Created', `User account created for ${name} (${role})\nPhone: ${phone}\nLogin: ${email}`);
}

function openLinkParentModal() {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const students = getSchoolData('students');

  title.textContent = 'Link Parent Account';
  body.innerHTML = `
    <form onsubmit="saveLinkedParent(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(147, 51, 234, 0.1); color: #7e22ce;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Link Student & Parent Account</h4>
            <p>Connect parent or legal guardian details to student profile for mobile & portal access.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field">
            <label>Parent / Guardian Full Name <span class="req">*</span></label>
            <input type="text" id="parent-name" placeholder="e.g. Mr. Natarajan S. / Mrs. Uma" required>
          </div>
          <div class="wizard-field">
            <label>Relationship to Ward <span class="req">*</span></label>
            <select id="parent-relation" required>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Legal Guardian</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Contact Phone Number <span class="req">*</span></label>
            <input type="tel" id="parent-phone" placeholder="e.g. +91 98401 23456" required>
          </div>
          <div class="wizard-field">
            <label>Email Address (User Login) <span class="req">*</span></label>
            <input type="email" id="parent-email" placeholder="e.g. parent.name@gmail.com" required>
          </div>
          <div class="wizard-field span-2">
            <label>Select Ward / Student <span class="req">*</span></label>
            <select id="parent-student" required>
              <option value="">-- Choose Enrolled Student --</option>
              ${students.map(s => `<option value="${escapeHtml(s.roll)}">${escapeHtml(s.name)} (${escapeHtml(s.roll)} - ${escapeHtml(s.class)})</option>`).join('')}
            </select>
          </div>
          <div class="wizard-field span-2">
            <label>Initial Temporary Password <span class="req">*</span></label>
            <input type="text" id="parent-pass" value="Parent@123" required>
            <span class="input-hint">Parent can use these credentials to log into the mobile app & web portal.</span>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save & Link Parent ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveLinkedParent(event) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const name = document.getElementById('parent-name').value;
  const relationship = document.getElementById('parent-relation').value;
  const phone = document.getElementById('parent-phone').value;
  const email = document.getElementById('parent-email').value;
  const studentRoll = document.getElementById('parent-student').value;
  const password = document.getElementById('parent-pass').value;

  const students = getSchoolData('students');
  const matchedStudent = students.find(s => s.roll === studentRoll);
  const studentName = matchedStudent ? matchedStudent.name : 'Student';

  const newId = 'USR' + Math.floor(100 + Math.random() * 900);
  demoData.users.unshift({
    id: newId,
    name,
    email,
    phone: phone || '+91 98401 23456',
    username: email.split('@')[0],
    password,
    role: 'PARENT',
    relationship,
    studentName,
    studentRoll,
    schoolId: session.schoolId || 'SCHOOL002',
    schoolName: session.schoolName || 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0]
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-parents');
  showFeedbackModal('Parent Account Linked', `Parent ${name} (${relationship}) successfully linked to student ${studentName} (${studentRoll}).\nLogin Phone: ${phone}\nLogin Email: ${email}`);
}

let currentSchoolUserRoleFilter = 'ALL';

function filterSchoolUsers(category, btnElement) {
  currentSchoolUserRoleFilter = category;
  if (btnElement) {
    const parent = btnElement.closest('.sa-filter-segment') || btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  applySchoolUserFilters();
}

function filterSchoolUsersSearch(val) {
  applySchoolUserFilters();
}

function applySchoolUserFilters() {
  const searchInput = document.getElementById('school-user-search-input');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const rows = document.querySelectorAll('.school-user-row');

  rows.forEach(r => {
    const role = r.getAttribute('data-role') || '';
    let matchesRole = false;
    if (currentSchoolUserRoleFilter === 'ALL') {
      matchesRole = true;
    } else if (currentSchoolUserRoleFilter === 'ADMIN') {
      matchesRole = (role === 'SCHOOL_ADMIN' || role === 'PRINCIPAL');
    } else if (currentSchoolUserRoleFilter === 'TEACHER') {
      matchesRole = (role === 'TEACHER');
    } else if (currentSchoolUserRoleFilter === 'STUDENT') {
      matchesRole = (role === 'STUDENT');
    } else if (currentSchoolUserRoleFilter === 'PARENT') {
      matchesRole = (role === 'PARENT');
    }

    const text = (r.textContent || '').toLowerCase();
    const matchesSearch = !query || text.includes(query);

    r.style.display = (matchesRole && matchesSearch) ? '' : 'none';
  });
}

function resetUserPassword(userId) {
  const user = demoData.users.find(u => u.id === userId);
  if (!user) return;
  const newPass = 'User@' + Math.floor(1000 + Math.random() * 9000);
  user.password = newPass;
  updateLocalStorageData();
  showFeedbackModal('Password Reset', `Temporary password for ${user.name} (${user.email || user.username}):\n\n${newPass}`);
}

function openCreateInvoiceModal() {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'Generate Campus Invoice';
  body.innerHTML = `
    <form onsubmit="saveNewInvoice(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Billing & Invoice Generation</h4>
            <p>Issue platform license subscription or customized service invoices.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Select Target Campus / School <span class="req">*</span></label>
            <select id="bill-school" required>
              ${(demoData.schools || []).map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
            </select>
          </div>
          <div class="wizard-field">
            <label>License Subscription Tier <span class="req">*</span></label>
            <select id="bill-plan" required onchange="document.getElementById('bill-amount').value = this.value.includes('Enterprise') ? '₹75,000' : (this.value.includes('Basic') ? '₹15,000' : '₹35,000');">
              <option value="Basic Plan">Basic Plan (₹15,000/yr)</option>
              <option value="Pro Plan" selected>Pro Plan (₹35,000/yr)</option>
              <option value="Enterprise Plan">Enterprise Plan (₹75,000/yr)</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Invoice Amount (₹) <span class="req">*</span></label>
            <input type="text" id="bill-amount" value="₹35,000" required>
          </div>
          <div class="wizard-field span-2">
            <label>Payment Due Date <span class="req">*</span></label>
            <input type="date" id="bill-due" value="${new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]}" required>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Generate & Issue Invoice ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveNewInvoice(event) {
  event.preventDefault();
  const schoolId = document.getElementById('bill-school').value;
  const plan = document.getElementById('bill-plan').value;
  const amount = document.getElementById('bill-amount').value;
  const dueDate = document.getElementById('bill-due').value;

  const school = demoData.schools.find(s => s.id === schoolId);
  const schoolName = school ? school.name : 'School';
  const invNo = 'INV-2026-00' + ((demoData.bills || []).length + 1);

  demoData.bills.unshift({
    invoiceNo: invNo,
    schoolId,
    school: schoolName,
    plan,
    amount: amount.startsWith('₹') ? amount : '₹' + amount,
    dueDate,
    paymentDate: null,
    status: 'PENDING'
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('sa-billing');
  showFeedbackModal('Invoice Generated', `Invoice ${invNo} for ${schoolName} created.`);
}

function markBillPaid(invNo) {
  const bill = demoData.bills.find(b => b.invoiceNo === invNo);
  if (bill) {
    bill.status = 'PAID';
    bill.paymentDate = new Date().toISOString().split('T')[0];
    demoData.activities.unshift({
      id: 'ACT-' + Date.now(),
      type: 'payment_received',
      text: `Payment received: ${bill.amount} (${invNo}) from ${bill.school}`,
      time: 'Just now'
    });
    updateLocalStorageData();
    renderTabContent('sa-billing');
    showFeedbackModal('Payment Recorded', `Invoice ${invNo} marked as PAID.`);
  }
}

function viewInvoicePDF(invNo) {
  showFeedbackModal('Invoice Download', `Generating invoice ${invNo} PDF receipt for download...`);
}

function closeModal() {
  const modal = document.getElementById('portal-modal');
  if (modal) modal.style.display = 'none';
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.remove('wizard-modal-lg');
}

function showFeedbackModal(titleText, bodyText) {
  const modal = document.getElementById('portal-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  title.textContent = titleText;
  body.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="color: var(--color-success); font-size: 3rem; margin-bottom: 15px;">✓</div>
      <p style="color: var(--color-text-dark); margin-bottom: 20px; white-space:pre-line;">${bodyText}</p>
      <button class="btn btn-primary btn-sm" onclick="closeModal()">Close</button>
    </div>
  `;
  modal.style.display = 'flex';
}

function filterPortalTable(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('table tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

function filterAnnouncements(category, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) parent.querySelectorAll('.sa-filter-tab, .role-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  const cards = document.querySelectorAll('.announcement-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    card.style.display = (category === 'All' || cat === category) ? 'block' : 'none';
  });
}

// School forms (teacher, student, class, subject, etc.)
function openTeacherForm(teacherId = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  let name = '', subject = '', tclass = '';
  if (teacherId) {
    const t = (demoData.teachers || []).find(tech => tech.id === teacherId);
    if (t) { name = t.name; subject = t.subject; tclass = t.class; }
  }

  title.textContent = teacherId ? 'Edit Faculty Member' : 'Register Faculty Member';
  body.innerHTML = `
    <form onsubmit="saveTeacher(event, ${teacherId ? `'${teacherId}'` : 'null'})">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>${teacherId ? 'Update Faculty Record' : 'Register New Faculty'}</h4>
            <p>Maintain teacher identity, primary subject mastery, and classroom assignment.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Teacher Full Name <span class="req">*</span></label>
            <input type="text" id="t-name" value="${escapeHtml(name)}" placeholder="e.g. Mrs. Priya Krishnan" required>
          </div>
          <div class="wizard-field">
            <label>Primary Teaching Subject <span class="req">*</span></label>
            <input type="text" id="t-sub" value="${escapeHtml(subject)}" placeholder="e.g. Mathematics / Physics" required>
          </div>
          <div class="wizard-field">
            <label>Assigned Classroom / Section <span class="req">*</span></label>
            <input type="text" id="t-class" value="${escapeHtml(tclass)}" placeholder="e.g. Grade 10-A" required>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">${teacherId ? 'Update Faculty Record ✓' : 'Add Faculty Member ✓'}</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveTeacher(event, teacherId) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const name = document.getElementById('t-name').value;
  const subject = document.getElementById('t-sub').value;
  const tclass = document.getElementById('t-class').value;

  if (teacherId) {
    const idx = demoData.teachers.findIndex(t => t.id === teacherId);
    if (idx > -1) {
      demoData.teachers[idx].name = name;
      demoData.teachers[idx].subject = subject;
      demoData.teachers[idx].class = tclass;
    }
  } else {
    const nextId = 'T0' + (demoData.teachers.length + 1);
    demoData.teachers.push({ id: nextId, name, subject, class: tclass, schoolId: session.schoolId || 'SCHOOL002', status: 'Active' });
  }

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-teachers');
}
   
function openStudentForm(studentRoll = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  let name = '', sclass = '';
  if (studentRoll) {
    const s = (demoData.students || []).find(st => st.roll === studentRoll);
    if (s) { name = s.name; sclass = s.class; }
  }

  title.textContent = studentRoll ? 'Edit Student Record' : 'Enroll New Student';
  body.innerHTML = `
    <form onsubmit="saveStudent(event, ${studentRoll ? `'${studentRoll}'` : 'null'})">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>${studentRoll ? 'Update Student Record' : 'Student Enrollment Profile'}</h4>
            <p>Maintain academic registration, class section allocation, and student status.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Student Full Name <span class="req">*</span></label>
            <input type="text" id="s-name" value="${escapeHtml(name)}" placeholder="e.g. Aishwarya Kumar" required>
          </div>
          <div class="wizard-field">
            <label>Grade / Class Section <span class="req">*</span></label>
            <input type="text" id="s-class" value="${escapeHtml(sclass)}" placeholder="e.g. Grade 10-A" required>
          </div>
          <div class="wizard-field">
            <label>Roll / Admission No.</label>
            <input type="text" value="${studentRoll ? studentRoll : 'Auto-generated upon save'}" disabled style="background:#f1f5f9; color:#64748b;">
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">${studentRoll ? 'Update Student Record ✓' : 'Enroll Student ✓'}</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveStudent(event, studentRoll) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const name = document.getElementById('s-name').value;
  const sclass = document.getElementById('s-class').value;

  if (studentRoll) {
    const idx = demoData.students.findIndex(s => s.roll === studentRoll);
    if (idx > -1) {
      demoData.students[idx].name = name;
      demoData.students[idx].class = sclass;
    }
  } else {
    const nextRoll = 'S' + (demoData.students.length + 101);
    demoData.students.push({ roll: nextRoll, name, class: sclass, schoolId: session.schoolId || 'SCHOOL002', attendance: '100%', performance: 'Outstanding' });
  }

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-students');
}

function openClassForm(className = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  let name = '', teacher = '', strength = 35, room = '';
  if (className) {
    const c = (demoData.classes || []).find(cls => cls.name === className);
    if (c) { name = c.name; teacher = c.teacher; strength = c.strength; room = c.room; }
  }

  title.textContent = className ? 'Edit Class Section' : 'Create Class Section';
  body.innerHTML = `
    <form onsubmit="saveClass(event, ${className ? `'${className}'` : 'null'})">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>${className ? 'Update Classroom Section' : 'Add Class Section'}</h4>
            <p>Assign section name, class teacher in charge, and physical room number.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field">
            <label>Class / Section Name <span class="req">*</span></label>
            <input type="text" id="c-name" value="${escapeHtml(name)}" placeholder="e.g. Grade 10-A" required ${className ? 'disabled style="background:#f1f5f9; color:#64748b;"' : ''}>
          </div>
          <div class="wizard-field">
            <label>Assigned Class Teacher <span class="req">*</span></label>
            <input type="text" id="c-teacher" value="${escapeHtml(teacher)}" placeholder="e.g. Mrs. Priya Krishnan" required>
          </div>
          <div class="wizard-field">
            <label>Physical Room No. <span class="req">*</span></label>
            <input type="text" id="c-room" value="${escapeHtml(room)}" placeholder="e.g. Room 204" required>
          </div>
          <div class="wizard-field">
            <label>Maximum Student Capacity <span class="req">*</span></label>
            <input type="number" id="c-strength" value="${strength}" min="1" max="100" required>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save Class Section ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveClass(event, className) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const teacher = document.getElementById('c-teacher').value;
  const room = document.getElementById('c-room').value;
  const strength = parseInt(document.getElementById('c-strength').value);

  if (className) {
    const idx = demoData.classes.findIndex(c => c.name === className);
    if (idx > -1) {
      demoData.classes[idx].teacher = teacher;
      demoData.classes[idx].room = room;
      demoData.classes[idx].strength = strength;
    }
  } else {
    const name = document.getElementById('c-name').value;
    demoData.classes.push({ name, teacher, room, strength, schoolId: session.schoolId || 'SCHOOL002' });
  }

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-classes');
}

function openSubjectForm(subjectCode = null) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  let code = '', name = '', grade = '', teacher = '';
  if (subjectCode) {
    const s = (demoData.subjects || []).find(sub => sub.code === subjectCode);
    if (s) { code = s.code; name = s.name; grade = s.grade; teacher = s.teacher; }
  }

  title.textContent = subjectCode ? 'Edit Curriculum Subject' : 'Add Curriculum Subject';
  body.innerHTML = `
    <form onsubmit="saveSubject(event, ${subjectCode ? `'${subjectCode}'` : 'null'})">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>${subjectCode ? 'Update Subject Syllabus' : 'Register Subject Curriculum'}</h4>
            <p>Setup subject code, official course title, standard grade, and lead instructor.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field">
            <label>Subject Code <span class="req">*</span></label>
            <input type="text" id="sub-code" value="${escapeHtml(code)}" placeholder="e.g. MAT101" required ${subjectCode ? 'disabled style="background:#f1f5f9; color:#64748b;"' : ''}>
          </div>
          <div class="wizard-field">
            <label>Subject Title <span class="req">*</span></label>
            <input type="text" id="sub-name" value="${escapeHtml(name)}" placeholder="e.g. Advanced Mathematics" required>
          </div>
          <div class="wizard-field">
            <label>Target Grade / Standard <span class="req">*</span></label>
            <input type="text" id="sub-grade" value="${escapeHtml(grade)}" placeholder="e.g. Grade 10" required>
          </div>
          <div class="wizard-field">
            <label>Lead Instructor / Faculty <span class="req">*</span></label>
            <input type="text" id="sub-teacher" value="${escapeHtml(teacher)}" placeholder="e.g. Mrs. Priya Krishnan" required>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save Subject Setup ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveSubject(event, subjectCode) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const name = document.getElementById('sub-name').value;
  const grade = document.getElementById('sub-grade').value;
  const teacher = document.getElementById('sub-teacher').value;

  if (subjectCode) {
    const idx = demoData.subjects.findIndex(s => s.code === subjectCode);
    if (idx > -1) {
      demoData.subjects[idx].name = name;
      demoData.subjects[idx].grade = grade;
      demoData.subjects[idx].teacher = teacher;
    }
  } else {
    const code = document.getElementById('sub-code').value;
    demoData.subjects.push({ code, name, grade, teacher, schoolId: session.schoolId || 'SCHOOL002' });
  }

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-subjects');
}

function openAnnouncementForm() {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'Post Campus Announcement';
  body.innerHTML = `
    <form onsubmit="saveAnnouncement(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Broadcast Circular / Notice</h4>
            <p>Publish an official notice to students, teachers, or parents across this campus.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Notice Headline / Title <span class="req">*</span></label>
            <input type="text" id="ann-title" placeholder="e.g. Annual Sports Meet 2026 - Schedule Released" required>
          </div>
          <div class="wizard-field">
            <label>Target Audience <span class="req">*</span></label>
            <select id="ann-target" required>
              <option value="All">All Campus Stakeholders</option>
              <option value="Students">Students Only</option>
              <option value="Teachers">Faculty & Staff</option>
              <option value="Parents">Parents Only</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Notice Category</label>
            <select id="ann-cat">
              <option value="General">General Campus Notice</option>
              <option value="Academic">Academic / Examinations</option>
              <option value="Events">Sports & Cultural Events</option>
              <option value="Holidays">Official Holidays</option>
            </select>
          </div>
          <div class="wizard-field span-2">
            <label>Detailed Announcement Notice <span class="req">*</span></label>
            <textarea id="ann-content" rows="4" placeholder="Enter the complete circular information text..." required></textarea>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Publish Announcement ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveAnnouncement(event) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const title = document.getElementById('ann-title').value;
  const target = document.getElementById('ann-target').value;
  const catEl = document.getElementById('ann-cat');
  const category = catEl ? catEl.value : 'General';
  const content = document.getElementById('ann-content').value;

  demoData.announcements.unshift({
    date: new Date().toISOString().split('T')[0],
    title,
    target,
    content,
    category,
    schoolId: session.schoolId || 'SCHOOL002'
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('publish-announcements');
  showFeedbackModal('Notice Published', `"${title}" has been published to ${target}.`);
}

function openHomeworkForm() {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = 'Give New Homework Assignment';
  body.innerHTML = `
    <form onsubmit="saveHomework(event)">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Assign Homework & Tasks</h4>
            <p>Publish homework assignment, instructions, and target submission deadline.</p>
          </div>
        </div>
        <div class="wizard-grid-2">
          <div class="wizard-field span-2">
            <label>Assignment Headline / Topic <span class="req">*</span></label>
            <input type="text" id="hw-title" placeholder="e.g. Chapter 4 Trigonometry Problem Set (Q1 - Q15)" required>
          </div>
          <div class="wizard-field">
            <label>Target Classroom / Section <span class="req">*</span></label>
            <input type="text" id="hw-grade" value="Grade 10-A" required>
          </div>
          <div class="wizard-field">
            <label>Submission Due Date <span class="req">*</span></label>
            <input type="date" id="hw-due" value="${new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}" required>
          </div>
          <div class="wizard-field span-2">
            <label>Instructions & Resource Guidelines <span class="req">*</span></label>
            <textarea id="hw-notes" rows="4" placeholder="Detail the step-by-step instructions or chapters to study..." required></textarea>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Post Homework Assignment ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveHomework(event) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const title = document.getElementById('hw-title').value;
  const grade = document.getElementById('hw-grade').value;
  const due = document.getElementById('hw-due').value;
  const instructions = document.getElementById('hw-notes').value;

  demoData.assignments.unshift({
    id: 'HW0' + (demoData.assignments.length + 1),
    title,
    grade,
    due,
    instructions,
    schoolId: session.schoolId || 'SCHOOL002',
    subject: 'General'
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('assignments');
}

function deleteHomework(hwId) {
  if (confirm('Delete this homework assignment?')) {
    demoData.assignments = demoData.assignments.filter(h => h.id !== hwId);
    updateLocalStorageData();
    renderTabContent('assignments');
  }
}

function openMarksForm(studentRoll) {
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const student = (demoData.students || []).find(s => s.roll === studentRoll);
  if (!student) return;

  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];

  title.textContent = `Academic Marks — ${student.name} (${student.roll})`;

  let formFieldsHtml = subjects.map((sub, index) => {
    const existing = student.marks ? student.marks.find(m => m.subject === sub) : null;
    const val = existing ? existing.scored : '';

    return `
      <div class="wizard-field" style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin:0; font-weight:700; color:var(--color-primary); font-size:0.88rem;">📚 ${sub}</label>
          <span style="font-size:0.75rem; color:#64748b; font-weight:600; background:#e2e8f0; padding:2px 8px; border-radius:10px;">Max: 100</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="text" id="m-val-${index}" placeholder="0-100 or AB" value="${val !== undefined ? val : ''}" style="flex:1;">
          <button type="button" class="btn btn-outline btn-sm" onclick="setAbsentInput('m-val-${index}')" style="white-space:nowrap; padding:7px 12px; font-size:0.78rem; border-color:#ef4444; color:#ef4444; font-weight:600;">
            Mark AB
          </button>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <form onsubmit="saveMarks(event, '${student.roll}')">
      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Academic Evaluation & Marks Entry</h4>
            <p>Record exam marks or assign Absent (AB) designation for official evaluation.</p>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: space-between;">
          <div><span style="color:#64748b; font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Student Name</span><strong style="color:var(--color-primary); font-size:1rem;">${escapeHtml(student.name)}</strong></div>
          <div><span style="color:#64748b; font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Roll Number</span><code style="font-size:0.95rem; color:#334155; font-weight:700;">${escapeHtml(student.roll)}</code></div>
          <div><span style="color:#64748b; font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Standard Class</span><span class="badge badge-info">${escapeHtml(student.class)}</span></div>
          <div><span style="color:#64748b; font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Current Standing</span><span class="badge badge-success">${escapeHtml(student.performance || 'Good')}</span></div>
        </div>

        <p style="font-size:0.82rem; color:var(--color-text-light); margin-bottom:14px;">
          💡 Enter score (0-100) for each subject or click <strong>Mark AB</strong> if student was absent.
        </p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 10px;">
          ${formFieldsHtml}
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save All Subject Marks ✓</button>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function setAbsentInput(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.value = 'AB';
}

function saveMarks(event, roll) {
  event.preventDefault();
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const studentIdx = (demoData.students || []).findIndex(s => s.roll === roll);
  if (studentIdx === -1) return;

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];
  const newMarks = [];
  let totalScore = 0;
  let validCount = 0;
  let hasFail = false;

  subjects.forEach((sub, index) => {
    const inputEl = document.getElementById(`m-val-${index}`);
    const rawVal = inputEl ? inputEl.value.trim() : '';

    if (rawVal.toUpperCase() === 'AB' || rawVal.toUpperCase() === 'ABSENT') {
      newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
      hasFail = true;
    } else if (rawVal !== '') {
      const num = parseInt(rawVal) || 0;
      let grade = 'F';
      if (num >= 90) grade = 'A+';
      else if (num >= 80) grade = 'A';
      else if (num >= 70) grade = 'B';
      else if (num >= 60) grade = 'C';
      else if (num >= 50) grade = 'D';

      if (num < 50) hasFail = true;

      newMarks.push({ subject: sub, max: 100, scored: num, grade: grade });
      totalScore += num;
      validCount++;
    } else {
      newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
      hasFail = true;
    }
  });

  demoData.students[studentIdx].marks = newMarks;
  
  if (validCount > 0) {
    const avg = totalScore / validCount;
    if (avg >= 90 && !hasFail) demoData.students[studentIdx].performance = 'Outstanding';
    else if (avg >= 75 && !hasFail) demoData.students[studentIdx].performance = 'Very Good';
    else if (avg >= 50) demoData.students[studentIdx].performance = 'Good';
    else demoData.students[studentIdx].performance = 'Needs Improvement';
  } else {
    demoData.students[studentIdx].performance = 'Absent';
  }

  updateLocalStorageData();
  closeModal();

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  if (session.role === 'TEACHER') {
    renderTabContent('student-list');
  } else {
    renderTabContent('manage-students');
  }

  showFeedbackModal('Marks Saved Successfully', `Updated Subject Marks & AB status for ${demoData.students[studentIdx].name} (${roll}).`);
}

let activeChatContactId = 'c1';

function getChatContacts() {
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentName = (session.name || session.username || '').toLowerCase();

  const allContacts = [
    { id: 'c1', name: 'Mrs. Priya Krishnan', role: 'Mathematics Faculty', status: 'Online', avatar: 'PK', color: '#2563eb' },
    { id: 'c2', name: 'Dr. Anandhi Rajan', role: 'Physics Dept Lead', status: 'Online', avatar: 'AR', color: '#7c3aed' },
    { id: 'c3', name: 'Dr. Savithri Raman', role: 'Campus Principal', status: 'Online', avatar: 'SR', color: '#059669' },
    { id: 'c4', name: 'School Admin Desk', role: 'Campus Central Office', status: 'Online', avatar: 'AD', color: '#d97706' },
    { id: 'c5', name: 'Mrs. Selvi Murugan', role: 'Chemistry Teacher', status: 'Online', avatar: 'SM', color: '#dc2626' },
    { id: 'c6', name: 'Ramesh Kumar', role: 'Parent (Grade 10-A)', status: 'Online', avatar: 'RK', color: '#4f46e5' }
  ];

  const filtered = allContacts.filter(c => !currentName || !c.name.toLowerCase().includes(currentName));
  return filtered.length > 0 ? filtered : allContacts;
}

function renderMessagingView() {
  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentUserName = session.name || session.username || 'User';

  const contacts = getChatContacts();
  let activeContact = contacts.find(c => c.id === activeChatContactId) || contacts[0];
  if (activeContact) activeChatContactId = activeContact.id;

  const allMessages = getSchoolData('messages');
  // Messages for this conversation thread
  const contactMessages = allMessages.filter(m => 
    m.contactId === activeChatContactId || 
    (activeContact && (m.sender === activeContact.name || m.recipient === activeContact.name))
  );

  return `
    <div class="messaging-layout">
      <!-- Contacts Sidebar -->
      <div class="messaging-sidebar">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #e2e8f0;">
          <h4 style="margin:0; font-size:0.95rem; color:var(--color-primary); font-weight:700;">Direct Contacts</h4>
          <span class="badge badge-success" style="font-size:0.72rem;">● Active</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;" id="chat-contacts-list">
          ${contacts.map(c => {
            const isActive = (c.id === activeChatContactId);
            return `
              <button class="contact-item-btn ${isActive ? 'active' : ''}" onclick="selectChatRecipient('${c.id}')">
                <div style="width:36px; height:36px; border-radius:50%; background:${c.color}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; flex-shrink:0; position:relative;">
                  ${c.avatar}
                  <span style="position:absolute; bottom:0; right:0; width:9px; height:9px; border-radius:50%; background:#10b981; border:2px solid #fff;"></span>
                </div>
                <div style="flex:1; min-width:0; text-align:left;">
                  <div style="font-weight:600; font-size:0.86rem; color:var(--color-text-dark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(c.name)}</div>
                  <div style="font-size:0.72rem; color:var(--color-text-light); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(c.role)}</div>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Active Conversation Panel -->
      <div style="display:flex; flex-direction:column; min-width:0;">
        <!-- Chat Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; margin-bottom:12px; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; border-radius:50%; background:${activeContact ? activeContact.color : '#2563eb'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.95rem;">
              ${activeContact ? activeContact.avatar : 'PK'}
            </div>
            <div>
              <div style="font-weight:700; font-size:0.98rem; color:var(--color-text-dark);">${escapeHtml(activeContact ? activeContact.name : 'Faculty Member')}</div>
              <div style="font-size:0.75rem; color:#10b981; display:flex; align-items:center; gap:5px; font-weight:600;">
                <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10b981;"></span> Online • ${escapeHtml(activeContact ? activeContact.role : 'Sri Sankara Vidhyasala')}
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <span class="badge badge-info" style="font-size:0.75rem;">🔒 End-to-End Encrypted</span>
          </div>
        </div>

        <!-- Scrollable Real-Time Chat Stream -->
        <div id="secure-chat-box" style="background:#f8fafc; border-radius:var(--radius-sm); height:330px; padding:16px; overflow-y:auto; border:1px solid #e2e8f0; display:flex; flex-direction:column;">
          ${contactMessages.length > 0 ? contactMessages.map(m => {
            const isOutgoing = (m.sender === currentUserName || m.isSelf === true);
            if (isOutgoing) {
              return `
                <div class="chat-bubble outgoing">
                  <div>${escapeHtml(m.text)}</div>
                  <div class="chat-meta">
                    <span>${escapeHtml(m.time)}</span>
                    <span style="font-weight:bold;">✓✓</span>
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="chat-bubble incoming">
                  <div style="font-size:0.74rem; font-weight:700; color:var(--color-primary); margin-bottom:3px;">${escapeHtml(m.sender)}</div>
                  <div>${escapeHtml(m.text)}</div>
                  <div class="chat-meta">
                    <span>${escapeHtml(m.time)}</span>
                  </div>
                </div>
              `;
            }
          }).join('') : `
            <div style="text-align:center; margin:auto; color:#94a3b8; font-size:0.88rem;">
              <div style="font-size:2rem; margin-bottom:6px;">💬</div>
              No previous messages with <strong>${escapeHtml(activeContact ? activeContact.name : 'this contact')}</strong>.<br>Send a message below to start chatting in real time.
            </div>
          `}
        </div>

        <!-- Chat Input Form -->
        <form onsubmit="sendSecureMessage(event); return false;" style="display:flex; gap:10px; margin-top:12px; align-items:center;">
          <input type="text" id="secure-msg-input" class="form-control" style="flex:1; padding:10px 14px; font-size:0.9rem; border-radius:var(--radius-sm); border:1px solid #cbd5e1;" placeholder="Write a real-time message to ${escapeHtml(activeContact ? activeContact.name : 'contact')}..." autocomplete="off" required>
          <button type="submit" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px; padding:10px 20px; font-weight:600;">
            <span>Send</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  `;
}

function selectChatRecipient(contactId) {
  activeChatContactId = contactId;
  const contentPane = document.getElementById('portal-content');
  if (contentPane) {
    contentPane.innerHTML = renderMessagingView();
    const chatBox = document.getElementById('secure-chat-box');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    const input = document.getElementById('secure-msg-input');
    if (input) input.focus();
  }
}

function sendSecureMessage(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('secure-msg-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';
  input.focus();

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentUserName = session.name || session.username || 'User';
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const contacts = getChatContacts();
  const activeContact = contacts.find(c => c.id === activeChatContactId) || contacts[0];

  // 1. Append Outgoing bubble directly into chat box
  const chatBox = document.getElementById('secure-chat-box');
  if (chatBox) {
    if (chatBox.querySelector('div[style*="text-align:center"]')) {
      chatBox.innerHTML = '';
    }

    const outEl = document.createElement('div');
    outEl.className = 'chat-bubble outgoing';
    outEl.innerHTML = `
      <div>${escapeHtml(text)}</div>
      <div class="chat-meta">
        <span>${escapeHtml(timeNow)}</span>
        <span style="font-weight:bold;">✓✓</span>
      </div>
    `;
    chatBox.appendChild(outEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // 2. Persist outgoing message in demoData
  demoData.messages.push({
    sender: currentUserName,
    recipient: activeContact ? activeContact.name : 'Recipient',
    contactId: activeChatContactId,
    isSelf: true,
    text: text,
    time: timeNow,
    schoolId: session.schoolId || 'SCHOOL002'
  });
  updateLocalStorageData();

  // 3. Real-Time simulated response from recipient
  if (activeContact) {
    setTimeout(() => {
      const box = document.getElementById('secure-chat-box');
      if (!box) return;
      const indicator = document.createElement('div');
      indicator.id = 'active-typing-indicator';
      indicator.className = 'typing-indicator';
      indicator.innerHTML = `<span style="font-size:0.75rem; color:#64748b; font-weight:600; margin-right:4px;">${escapeHtml(activeContact.name)} is typing</span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
      box.appendChild(indicator);
      box.scrollTop = box.scrollHeight;
    }, 600);

    setTimeout(() => {
      const box = document.getElementById('secure-chat-box');
      const ind = document.getElementById('active-typing-indicator');
      if (ind) ind.remove();
      if (!box) return;

      const responses = [
        `Understood, thank you for the update! I have recorded this in the campus register.`,
        `Received your message. I am currently reviewing the details and will proceed accordingly.`,
        `Noted with thanks! All required student files and reports have been verified.`,
        `Thank you for reaching out. I will coordinate with the respective teachers right away.`,
        `Confirmed! I have cross-checked the data and updated the academic schedule.`
      ];
      const replyText = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const inEl = document.createElement('div');
      inEl.className = 'chat-bubble incoming';
      inEl.innerHTML = `
        <div style="font-size:0.74rem; font-weight:700; color:var(--color-primary); margin-bottom:3px;">${escapeHtml(activeContact.name)}</div>
        <div>${escapeHtml(replyText)}</div>
        <div class="chat-meta">
          <span>${escapeHtml(replyTime)}</span>
        </div>
      `;
      box.appendChild(inEl);
      box.scrollTop = box.scrollHeight;

      demoData.messages.push({
        sender: activeContact.name,
        recipient: currentUserName,
        contactId: activeChatContactId,
        isSelf: false,
        text: replyText,
        time: replyTime,
        schoolId: session.schoolId || 'SCHOOL002'
      });
      updateLocalStorageData();
    }, 1700);
  }
}

function submitAttendanceLogs() {
  showFeedbackModal('Attendance Recorded', 'Daily attendance recorded successfully.');
}

// ============================================================================
// Manage Classes Timetable Engine & Teacher Timetable Sync
// ============================================================================

let currentSelectedClass = 'Grade 10-A';

function renderManageClassesView(selectedClassName = null) {
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const mySchoolId = session.schoolId || 'SCHOOL002';
  const classes = getSchoolData('classes');

  if (selectedClassName) {
    currentSelectedClass = selectedClassName;
  } else if (!currentSelectedClass || !classes.some(c => c.name === currentSelectedClass)) {
    currentSelectedClass = classes[0] ? classes[0].name : 'Grade 10-A';
  }

  const selectedClassObj = classes.find(c => c.name === currentSelectedClass) || classes[0] || {
    name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', room: 'A-102', strength: 38
  };

  const allTimetables = demoData.classTimetables || [];
  const classSlots = allTimetables.filter(t => t.className === selectedClassObj.name && (!t.schoolId || t.schoolId === mySchoolId));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:15 - 11:15' },
    { period: 3, time: '11:30 - 12:30' },
    { period: 4, time: '01:30 - 02:30' },
    { period: 5, time: '02:45 - 03:45' }
  ];

  return `
    <div class="sa-schools-header-bar">
      <div style="font-size:0.88rem; color:var(--color-text-light); flex:1; min-width:280px;">
        Select any classroom card to view teacher assignments and edit weekly period timetables.
      </div>
      <div class="sa-toolbar-right">
        <button class="btn btn-primary btn-sm" onclick="openClassForm()">+ Add New Class</button>
      </div>
    </div>

    <!-- Class Cards Selection Grid -->
    <div class="grid-3" style="margin-bottom: 25px;">
      ${classes.map(c => {
        const isSelected = (c.name === selectedClassObj.name);
        return `
          <div class="portal-card" style="border-left-color: ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${isSelected ? 'rgba(30,58,138,0.05)' : 'var(--color-bg-white)'}; cursor: pointer; transition: all 0.2s;" onclick="selectClassTab('${c.name}')">
            <div class="portal-card-header">
              <span class="portal-card-title" style="color: var(--color-primary);">${c.name}</span>
              <span class="badge ${isSelected ? 'badge-info' : 'badge-success'}">Room ${c.room}</span>
            </div>
            <p style="margin: 4px 0;">Class Teacher: <strong>${c.teacher}</strong></p>
            <p style="margin: 4px 0;">Strength: <strong>${c.strength} Students</strong></p>
            <div style="margin-top: 12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; font-weight:700; color:${isSelected ? 'var(--color-primary)' : 'var(--color-text-light)'};">${isSelected ? 'Currently Selected' : 'Click to View Timetable'}</span>
              <button class="sa-tbl-action edit" style="padding:3px 8px; font-size:0.75rem;" onclick="event.stopPropagation(); openClassForm('${c.name}')">Edit Class</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Selected Class Timetable Container -->
    <div style="background:var(--color-bg-white); border-radius:var(--radius-md); padding:20px; border:2px solid rgba(30,58,138,0.12); box-shadow:var(--shadow-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:15px; border-bottom:1px solid rgba(0,0,0,0.08); padding-bottom:12px;">
        <div>
          <h3 style="color:var(--color-primary); margin:0 0 4px 0;">Timetable & Work Assignments — ${selectedClassObj.name}</h3>
          <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.9rem; color:var(--color-text-dark);">
            <span><strong>Class Teacher:</strong> ${selectedClassObj.teacher}</span>
            <span><strong>Room No:</strong> ${selectedClassObj.room}</span>
            <span><strong>Strength:</strong> ${selectedClassObj.strength} Students</span>
          </div>
        </div>
        <small style="color:var(--color-text-light);">Click any Period slot below to assign/edit Subject & Teacher</small>
      </div>

      <div class="table-responsive">
        <table style="width:100%; border-collapse:collapse; text-align:center;">
          <thead>
            <tr style="background:var(--color-bg-light); border-bottom:2px solid rgba(30,58,138,0.15);">
              <th style="padding:10px; min-width:120px; text-align:left;">Time / Period</th>
              ${days.map(d => `<th style="padding:10px; min-width:110px;">${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${periods.map(p => `
              <tr style="border-bottom:1px solid rgba(0,0,0,0.06);">
                <td data-label="Period" style="padding:10px; text-align:left; font-weight:700; color:var(--color-primary); background:rgba(30,58,138,0.02);">
                  <div>Period ${p.period}</div>
                  <div style="font-size:0.72rem; font-weight:normal; color:var(--color-text-light);">${p.time}</div>
                </td>
                ${days.map(day => {
                  const slot = classSlots.find(s => s.day === day && s.period === p.period);
                  if (slot) {
                    return `
                      <td data-label="${day} Period ${p.period}" style="padding:6px;">
                        <div style="background:rgba(37,99,235,0.08); border-left:3px solid var(--color-primary); padding:8px 6px; border-radius:4px; text-align:left; cursor:pointer;" onclick="openAssignWorkModal('${selectedClassObj.name}', '${day}', ${p.period})" title="Click to Edit Work Assignment">
                          <div style="font-weight:700; color:var(--color-primary); font-size:0.82rem;">${slot.subject}</div>
                          <div style="font-size:0.75rem; color:#475569;">👩‍🏫 ${slot.teacherName}</div>
                        </div>
                      </td>
                    `;
                  } else {
                    return `
                      <td data-label="${day} Period ${p.period}" style="padding:6px;">
                        <div style="background:rgba(0,0,0,0.02); border:1px dashed rgba(0,0,0,0.12); padding:8px 6px; border-radius:4px; text-align:center; color:#64748b; font-size:0.75rem; cursor:pointer;" onclick="openAssignWorkModal('${selectedClassObj.name}', '${day}', ${p.period})" title="Click to Assign Work">
                          <span style="color:var(--color-primary); font-weight:600;">+ Assign Work</span>
                        </div>
                      </td>
                    `;
                  }
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function selectClassTab(className) {
  currentSelectedClass = className;
  renderTabContent('manage-classes');
}

function openAssignWorkModal(className, day, period) {
  const modal = document.getElementById('portal-modal');
  const modalBox = document.querySelector('.modal-content');
  if (modalBox) modalBox.classList.add('wizard-modal-lg');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const mySchoolId = session.schoolId || 'SCHOOL002';
  const teachers = getSchoolData('teachers');

  const existingSlot = (demoData.classTimetables || []).find(
    t => t.className === className && t.day === day && parseInt(t.period) === parseInt(period) && (!t.schoolId || t.schoolId === mySchoolId)
  );

  const existingSubject = existingSlot ? existingSlot.subject : '';
  const existingTeacher = existingSlot ? existingSlot.teacherName : (teachers[0] ? teachers[0].name : '');

  title.textContent = `Assign Period Work — ${className}`;

  body.innerHTML = `
    <form onsubmit="saveClassWorkAssignment(event)">
      <input type="hidden" id="work-class" value="${className}">
      <input type="hidden" id="work-day" value="${day}">
      <input type="hidden" id="work-period" value="${period}">

      <div class="wizard-form-box">
        <div class="wizard-header-strip">
          <div class="wizard-header-icon" style="background: rgba(30, 58, 138, 0.08); color: var(--color-primary);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="wizard-header-titles">
            <h4>Assign Timetable Period & Faculty</h4>
            <p>Schedule subject class and designated teacher for the timetable schedule.</p>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.88rem; align-items: center;">
          <span>Class Standard: <strong style="color:var(--color-primary);">${escapeHtml(className)}</strong></span>
          <span style="color:#cbd5e1;">|</span>
          <span>Day: <strong>${escapeHtml(day)}</strong></span>
          <span style="color:#cbd5e1;">|</span>
          <span>Time Slot: <span class="badge badge-info">Period ${period}</span></span>
        </div>

        <div class="wizard-grid-2">
          <div class="wizard-field">
            <label>Subject Course Name <span class="req">*</span></label>
            <input type="text" id="work-subject" value="${escapeHtml(existingSubject)}" placeholder="e.g. Mathematics, Physics, Chemistry, English" required>
          </div>
          <div class="wizard-field">
            <label>Designated Faculty Instructor <span class="req">*</span></label>
            <select id="work-teacher" required>
              ${teachers.map(t => `<option value="${escapeHtml(t.name)}" ${t.name === existingTeacher ? 'selected' : ''}>${escapeHtml(t.name)} (${escapeHtml(t.subject)})</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0;">
        ${existingSlot ? `<button type="button" class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#dc2626;" onclick="clearClassWorkAssignment('${className}', '${day}', ${period})">Clear Slot</button>` : '<span></span>'}
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" style="padding:8px 22px;">Save Assignment ✓</button>
        </div>
      </div>
    </form>
  `;
  modal.style.display = 'flex';
}

function saveClassWorkAssignment(event) {
  event.preventDefault();
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const mySchoolId = session.schoolId || 'SCHOOL002';

  const className = document.getElementById('work-class').value;
  const day = document.getElementById('work-day').value;
  const period = parseInt(document.getElementById('work-period').value);
  const subject = document.getElementById('work-subject').value;
  const teacherName = document.getElementById('work-teacher').value;

  if (!demoData.classTimetables) {
    demoData.classTimetables = [];
  }

  // Filter out existing slot if any
  demoData.classTimetables = demoData.classTimetables.filter(
    t => !(t.className === className && t.day === day && parseInt(t.period) === period && (!t.schoolId || t.schoolId === mySchoolId))
  );

  demoData.classTimetables.push({
    className,
    day,
    period,
    subject,
    teacherName,
    schoolId: mySchoolId
  });

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-classes');
  showFeedbackModal('Work Assigned & Live Synced', `Assigned ${subject} (${teacherName}) to ${className} for ${day} Period ${period}. Work is now live visible in Teacher Timetable.`);
}

function clearClassWorkAssignment(className, day, period) {
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const mySchoolId = session.schoolId || 'SCHOOL002';

  if (!demoData.classTimetables) return;

  demoData.classTimetables = demoData.classTimetables.filter(
    t => !(t.className === className && t.day === day && parseInt(t.period) === parseInt(period) && (!t.schoolId || t.schoolId === mySchoolId))
  );

  updateLocalStorageData();
  closeModal();
  renderTabContent('manage-classes');
  showFeedbackModal('Slot Cleared', `Cleared Period ${period} (${day}) assignment for ${className}.`);
}

function renderTeacherTimetable(targetTeacherName = null) {
  try {
    const stored = JSON.parse(localStorage.getItem('ssv_demo_data'));
    if (stored) demoData = stored;
  } catch (e) {}

  const session = JSON.parse(localStorage.getItem('ssv_portal_user')) || {};
  const currentRole = session.role;
  const mySchoolId = session.schoolId || 'SCHOOL002';
  const teachers = getSchoolData('teachers');

  let activeTeacherName = targetTeacherName;
  if (!activeTeacherName) {
    if (currentRole === 'TEACHER') {
      const sName = (session.name || '').trim().toLowerCase();
      const sUser = (session.username || '').trim().toLowerCase();

      const matchedTeacher = teachers.find(t => {
        const tName = t.name.trim().toLowerCase();
        return tName === sName || sName.includes(tName) || tName.includes(sName) || (t.email && t.email.trim().toLowerCase() === sUser);
      });

      activeTeacherName = matchedTeacher ? matchedTeacher.name : (session.name || 'Mrs. Priya Krishnan');
    } else {
      activeTeacherName = teachers[0] ? teachers[0].name : 'Mrs. Priya Krishnan';
    }
  }

  const teacherObj = teachers.find(t => t.name.trim().toLowerCase() === activeTeacherName.trim().toLowerCase()) || teachers[0];
  const teacherDisplayName = teacherObj ? teacherObj.name : activeTeacherName;

  const allTimetables = demoData.classTimetables || [];
  const teacherSlots = allTimetables.filter(t => 
    t.teacherName && t.teacherName.trim().toLowerCase() === teacherDisplayName.trim().toLowerCase() && 
    (!t.schoolId || t.schoolId === mySchoolId)
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:15 - 11:15' },
    { period: 3, time: '11:30 - 12:30' },
    { period: 4, time: '01:30 - 02:30' },
    { period: 5, time: '02:45 - 03:45' }
  ];

  let selectTeacherHtml = '';
  if (currentRole !== 'TEACHER' && teachers.length > 0) {
    selectTeacherHtml = `
      <div style="margin-bottom: 15px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; background:var(--color-bg-light); padding:10px 14px; border-radius:var(--radius-sm);">
        <label style="font-weight:700; color:var(--color-primary);">Select Faculty Teacher:</label>
        <select class="form-control" style="max-width:280px; padding:6px 12px;" onchange="renderTabContentWithTeacherName(this.value)">
          ${teachers.map(t => `<option value="${t.name}" ${t.name.trim().toLowerCase() === teacherDisplayName.trim().toLowerCase() ? 'selected' : ''}>${t.name} (${t.subject})</option>`).join('')}
        </select>
      </div>
    `;
  }

  return `
    ${selectTeacherHtml}
    
    <div class="portal-card" style="margin-bottom: 20px; border-left-color: var(--color-primary); padding: 15px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="color:var(--color-primary); margin:0 0 4px 0;">👩‍🏫 Weekly Timetable — ${teacherDisplayName}</h3>
          <p style="margin:0; font-size:0.88rem; color:var(--color-text-light);">Primary Subject: <strong>${teacherObj ? teacherObj.subject : 'General'}</strong> | Assigned Class: <strong>${teacherObj ? teacherObj.class : 'Grade 10-A'}</strong></p>
        </div>
        <span class="badge badge-info" style="font-size:0.85rem;">Total Assigned Classes: ${teacherSlots.length} Periods</span>
      </div>
    </div>

    <div class="table-responsive">
      <table style="width:100%; border-collapse:collapse; text-align:center;">
        <thead>
          <tr style="background:var(--color-bg-light); border-bottom:2px solid rgba(30,58,138,0.15);">
            <th style="padding:10px; min-width:120px; text-align:left;">Time / Period</th>
            ${days.map(d => `<th style="padding:10px; min-width:110px;">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${periods.map(p => `
            <tr style="border-bottom:1px solid rgba(0,0,0,0.06);">
              <td data-label="Period" style="padding:10px; text-align:left; font-weight:700; color:var(--color-primary); background:rgba(30,58,138,0.02);">
                <div>Period ${p.period}</div>
                <div style="font-size:0.72rem; font-weight:normal; color:var(--color-text-light);">${p.time}</div>
              </td>
              ${days.map(day => {
                const slot = teacherSlots.find(s => s.day === day && parseInt(s.period) === p.period);
                if (slot) {
                  return `
                    <td data-label="${day} Period ${p.period}" style="padding:6px;">
                      <div style="background:#dcfce7; border-left:3px solid #10b981; padding:8px 6px; border-radius:4px; text-align:left;">
                        <div style="font-weight:700; color:#047857; font-size:0.82rem;">${slot.className}</div>
                        <div style="font-size:0.75rem; color:#065f46;">📖 ${slot.subject}</div>
                      </div>
                    </td>
                  `;
                } else {
                  return `
                    <td data-label="${day} Period ${p.period}" style="padding:6px;">
                      <div style="background:rgba(0,0,0,0.02); border:1px dashed rgba(0,0,0,0.08); padding:8px 6px; border-radius:4px; text-align:center; color:#94a3b8; font-size:0.75rem;">
                        <em>Free Period</em>
                      </div>
                    </td>
                  `;
                }
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderTabContentWithTeacherName(teacherName) {
  const contentPane = document.getElementById('portal-content');
  if (contentPane) {
    contentPane.innerHTML = renderTeacherTimetable(teacherName);
  }
}

