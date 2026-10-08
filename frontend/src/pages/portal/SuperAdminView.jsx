import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getPortalData, savePortalData } from '../../services/portalData';
import NewSchoolWizardModal from './NewSchoolWizardModal';
import SubscriptionModal from './SubscriptionModal';
import {
  CampusOverviewModal,
  EditSchoolModal,
  AdminProfileModal,
  AddAdminModal,
  AssignAdminModal,
  CreateInvoiceModal,
  FeedbackModal,
} from './SuperAdminModals';
import SuperAdminSecurityView from './SuperAdminSecurityView';

// Default Demo Data matching js/portal.js lines 245-522
const defaultSchools = [
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
    createdDate: '2026-02-15',
    board: 'State Board (Tamil Nadu)',
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
    createdDate: '2026-01-10',
    board: 'Matriculation',
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
    createdDate: '2026-03-01',
    board: 'ICSE',
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
    createdDate: '2025-08-12',
    board: 'CBSE',
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
    createdDate: '2026-02-01',
    board: 'CBSE',
  },
];

const defaultUsers = [
  { id: 'USR001', name: 'ZenSchool Super Admin', email: 'superadmin@zenschool.com', phone: '+91 98401 11001', username: 'superadmin', role: 'SUPER_ADMIN', schoolId: null, schoolName: 'Platform Central', status: 'Active', createdDate: '2025-01-01' },
  { id: 'USR003', name: 'School Administrator (SSV)', email: 'admin@ssvschool.com', phone: '+91 98401 22002', username: 'admin_ssv', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
  { id: 'USR002', name: 'Admin Rajesh (ABC School)', email: 'admin@abcschool.com', phone: '+91 98401 33003', username: 'admin_abc', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', createdDate: '2026-01-10' },
  { id: 'USR004', name: 'Admin Joseph (St. Marys)', email: 'admin@stmarys.com', phone: '+91 98401 44004', username: 'admin_stm', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', createdDate: '2026-03-01' },
  { id: 'USR005', name: 'Admin Vikram (Oxford)', email: 'admin@oxford.edu', phone: '+91 98401 55005', username: 'admin_oxf', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL005', schoolName: 'Oxford International Academy', status: 'Inactive', createdDate: '2025-08-12' },
];

const defaultServices = [
  { id: 'SRV-01', name: 'Student Management', category: 'Academic', status: 'Active', cost: '₹2,500/mo', description: 'Student admission, roll list, profiles & gradebook tracking.' },
  { id: 'SRV-02', name: 'Teacher Management', category: 'Staff', status: 'Active', cost: '₹2,000/mo', description: 'Staff directory, subject allocations and teaching schedules.' },
  { id: 'SRV-03', name: 'Attendance & SMS Alerts', category: 'Communication', status: 'Available', cost: '₹2,500/mo', description: 'Real-time daily attendance tracking with automated parent SMS notifications.' },
  { id: 'SRV-04', name: 'Online Fee Payment Gateway', category: 'Finance', status: 'Active', cost: '₹5,000/mo', description: 'Integrated UPI, Netbanking and Cards payment processing for school dues.' },
  { id: 'SRV-05', name: 'Digital Library & E-Books', category: 'Academic', status: 'Available', cost: '₹3,500/mo', description: 'Central repository of e-books, study materials and digital syllabus.' },
  { id: 'SRV-06', name: 'GPS Bus Tracking System', category: 'Transport', status: 'Active', cost: '₹4,000/mo', description: 'Live school bus location monitoring for parent security.' },
  { id: 'SRV-07', name: 'Homework & Assignments', category: 'Academic', status: 'Active', cost: '₹2,000/mo', description: 'Online homework publishing, student submission and evaluation.' },
  { id: 'SRV-08', name: 'Secure Communication', category: 'Communication', status: 'Active', cost: '₹1,500/mo', description: 'Direct messaging between teachers, parents, and administrative desk.' },
];

const defaultPlans = [
  { id: 'PLAN-01', name: 'Basic Plan', maxStudents: 500, price: '₹15,000/yr', features: 'Attendance, Marks, Notices & Student Records' },
  { id: 'PLAN-02', name: 'Pro Plan', maxStudents: 1500, price: '₹35,000/yr', features: 'Basic + Online Fee Portal, SMS Gateway, Assignments' },
  { id: 'PLAN-03', name: 'Enterprise Plan', maxStudents: 5000, price: '₹75,000/yr', features: 'Pro + Custom Mobile App, GPS Tracking, Dedicated Support' },
];

const defaultSubscriptions = [
  { id: 'SUB-02', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', startDate: '2026-02-15', endDate: '2027-02-14', status: 'ACTIVE', amount: '₹75,000' },
  { id: 'SUB-01', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', startDate: '2026-01-10', endDate: '2027-01-09', status: 'ACTIVE', amount: '₹35,000' },
  { id: 'SUB-03', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', startDate: '2026-03-01', endDate: '2027-02-28', status: 'ACTIVE', amount: '₹35,000' },
  { id: 'SUB-04', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', startDate: '2025-08-12', endDate: '2026-06-30', status: 'EXPIRED', amount: '₹15,000' },
];

const defaultBills = [
  { invoiceNo: 'INV-2026-001', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', amount: '₹75,000', dueDate: '2026-02-20', paymentDate: '2026-02-16', status: 'PAID' },
  { invoiceNo: 'INV-2026-002', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', amount: '₹35,000', dueDate: '2026-01-15', paymentDate: '2026-01-12', status: 'PAID' },
  { invoiceNo: 'INV-2026-003', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', amount: '₹35,000', dueDate: '2026-03-10', paymentDate: '2026-03-05', status: 'PAID' },
  { invoiceNo: 'INV-2026-005', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', amount: '₹15,000', dueDate: '2026-06-15', paymentDate: null, status: 'OVERDUE' },
];

const defaultActivities = [
  { id: 'ACT-1', type: 'sub_activated', text: 'Enterprise Subscription activated for Sri Sankara Vidhyasala Girls High School', time: '1 day ago' },
  { id: 'ACT-2', type: 'payment_received', text: 'Payment received: ₹75,000 (Invoice INV-2026-001) from Sri Sankara Vidhyasala', time: '1 day ago' },
  { id: 'ACT-3', type: 'school_registered', text: 'New School Campus Registered: Delhi Public World School (DPW-CBE)', time: '3 days ago' },
  { id: 'ACT-4', type: 'school_activated', text: 'Campus status switched to Active for ABC Matriculation School', time: '5 days ago' },
];


export default function SuperAdminView({ activeTab = 'sa-dashboard' }) {
  // Main Data States with initial demo defaults merged with local portal storage
  const [schools, setSchools] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.schools && store.schools.length > 0) {
        const storedIds = new Set(store.schools.map((s) => s.id));
        const remainingDefaults = defaultSchools.filter((s) => !storedIds.has(s.id));
        return [...store.schools, ...remainingDefaults];
      }
    } catch (e) {}
    return defaultSchools;
  });

  const [users, setUsers] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.users && store.users.length > 0) {
        const storedAdmins = store.users.filter((u) => u.role === 'SCHOOL_ADMIN' || u.role === 'SUPER_ADMIN');
        if (storedAdmins.length > 0) {
          const storedIds = new Set(storedAdmins.map((u) => u.id));
          const remainingDefaults = defaultUsers.filter((u) => !storedIds.has(u.id));
          return [...storedAdmins, ...remainingDefaults];
        }
      }
    } catch (e) {}
    return defaultUsers;
  });

  const [services, setServices] = useState(defaultServices);
  const [plans, setPlans] = useState(defaultPlans);

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.subscriptions && store.subscriptions.length > 0) {
        const storedIds = new Set(store.subscriptions.map((s) => s.id));
        const remainingDefaults = defaultSubscriptions.filter((s) => !storedIds.has(s.id));
        return [...store.subscriptions, ...remainingDefaults];
      }
    } catch (e) {}
    return defaultSubscriptions;
  });

  const [bills, setBills] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.bills && store.bills.length > 0) {
        const storedIds = new Set(store.bills.map((b) => b.invoiceNo));
        const remainingDefaults = defaultBills.filter((b) => !storedIds.has(b.invoiceNo));
        return [...store.bills, ...remainingDefaults];
      }
    } catch (e) {}
    return defaultBills;
  });

  const [activities, setActivities] = useState(defaultActivities);

  // Filters & Search States
  const [schoolFilter, setSchoolFilter] = useState('All');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('All');
  const [adminSearch, setAdminSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [subViewType, setSubViewType] = useState('subs'); // 'subs' or 'plans'
  const [subStatusFilter, setSubStatusFilter] = useState('All');
  const [billFilter, setBillFilter] = useState('All');
  const [settingsSection, setSettingsSection] = useState('platform');

  // Modals States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isAssignAdminOpen, setIsAssignAdminOpen] = useState(false);
  const [assignInitialAdminId, setAssignInitialAdminId] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalTab, setSubModalTab] = useState('subscription');
  const [selectedPlanObj, setSelectedPlanObj] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, title: '', message: '' });



  // Sync data from backend if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schRes, plnRes, subRes, bilRes, usrRes] = await Promise.all([
          api.getSchools().catch(() => ({ success: false })),
          api.getPlans().catch(() => ({ success: false })),
          api.getSubscriptions().catch(() => ({ success: false })),
          api.getBills().catch(() => ({ success: false })),
          api.getUsers({ role: 'schooladmin' }).catch(() => ({ success: false })),
        ]);
        if (schRes.success && schRes.data && schRes.data.length > 0) {
          // Normalize school fields
          const mapped = schRes.data.map((s) => ({
            id: s.schoolId || s._id,
            name: s.name,
            code: s.code || `SCH-${s.schoolId}`,
            city: s.city || 'Tamil Nadu',
            phone: s.phone || '+91 94400 00000',
            email: s.email || 'contact@school.edu',
            principal: s.principalName || s.principal || 'Principal',
            academicYear: s.academicYear || '2026-2027',
            admin: s.email || 'admin@school.edu',
            adminName: s.principalName || 'Admin',
            status: s.status || 'Active',
            studentsCount: s.studentCount || s.studentsCount || 450,
            teachersCount: s.teacherCount || s.teachersCount || 25,
            parentsCount: s.parentsCount || 420,
            subscription: s.plan || 'Pro Plan',
            createdDate: s.joinedDate || s.createdAt?.split('T')[0] || '2026-01-15',
            board: s.board || 'State Board',
          }));
          setSchools((prev) => {
            const apiIds = new Set(mapped.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mapped];
          });
        }
        if (plnRes.success && plnRes.data && plnRes.data.length > 0) {
          setPlans(plnRes.data.map((p) => ({
            id: p.planId || p._id,
            name: p.name,
            maxStudents: p.maxStudents || 1500,
            price: p.price.startsWith('₹') ? p.price : `₹${p.price}/yr`,
            features: Array.isArray(p.features) ? p.features.join(', ') : p.features,
          })));
        }
        if (subRes.success && subRes.data && subRes.data.length > 0) {
          const mappedSubs = subRes.data.map((sub) => ({
            id: sub.subscriptionId || sub._id,
            schoolId: sub.schoolId,
            school: sub.schoolName || 'School Campus',
            plan: sub.planName || 'Pro Plan',
            startDate: sub.startDate ? sub.startDate.split('T')[0] : '2026-01-01',
            endDate: sub.endDate ? sub.endDate.split('T')[0] : '2027-01-01',
            amount: typeof sub.amount === 'number' ? `₹${sub.amount.toLocaleString()}` : sub.amount,
            status: sub.status ? sub.status.toUpperCase() : 'ACTIVE',
          }));
          setSubscriptions((prev) => {
            const apiIds = new Set(mappedSubs.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mappedSubs];
          });
        }
        if (bilRes.success && bilRes.data && bilRes.data.length > 0) {
          const mappedBills = bilRes.data.map((b) => ({
            invoiceNo: b.invoiceNo || b.billId,
            schoolId: b.schoolId,
            school: b.schoolName || 'School Campus',
            plan: b.planName || 'Pro Plan',
            amount: typeof b.amount === 'number' ? `₹${b.amount.toLocaleString()}` : b.amount,
            dueDate: b.dueDate ? b.dueDate.split('T')[0] : '2026-03-31',
            paymentDate: b.paymentDate ? b.paymentDate.split('T')[0] : null,
            status: b.status ? b.status.toUpperCase() : 'PENDING',
          }));
          setBills((prev) => {
            const apiIds = new Set(mappedBills.map((b) => b.invoiceNo));
            const localOnly = prev.filter((p) => !apiIds.has(p.invoiceNo));
            return [...localOnly, ...mappedBills];
          });
        }
        if (usrRes.success && usrRes.data && usrRes.data.length > 0) {
          const mappedUsers = usrRes.data.map((u) => ({
            id: u.userId || u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            username: u.username,
            role: 'SCHOOL_ADMIN',
            schoolId: u.schoolId,
            schoolName: u.schoolName,
            status: u.status || 'Active',
            createdDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-01-15',
          }));
          setUsers((prev) => {
            const apiIds = new Set(mappedUsers.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mappedUsers];
          });
        }
      } catch (err) {
        console.warn('API sync notice:', err);
      }
    };
    fetchData();
  }, []);

  const showFeedback = (title, message) => {
    setFeedback({ isOpen: true, title, message });
  };

  // Activity icon matching getSaActivityIcon
  const renderActivityIcon = (type) => {
    switch (type) {
      case 'sub_activated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        );
      case 'payment_received':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'school_registered':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          </svg>
        );
      case 'school_activated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'school_deactivated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
    }
  };

  // Aggregates for 12 Dashboard cards
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.status === 'Active').length;
  const inactiveSchools = schools.filter((s) => s.status !== 'Active').length;
  const schoolAdmins = users.filter((u) => u.role === 'SCHOOL_ADMIN');
  const totalSchoolAdmins = schoolAdmins.length;
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'Active').length;
  const expiringSubs = subscriptions.filter((s) => s.status === 'EXPIRED' || s.status === 'PENDING').length;
  const pendingBills = bills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE').length;
  const totalRevenue = bills
    .filter((b) => b.status === 'PAID')
    .reduce((sum, b) => {
      const raw = typeof b.amount === 'string' ? b.amount.replace(/[^0-9]/g, '') : b.amount;
      return sum + (parseInt(raw) || 0);
    }, 0);
  const totalStudents = schools.reduce((sum, s) => sum + (s.studentsCount || 0), 0);
  const totalTeachers = schools.reduce((sum, s) => sum + (s.teachersCount || 0), 0);
  const totalParents = schools.reduce((sum, s) => sum + (s.parentsCount || 0), 0);
  const totalStaff = totalTeachers + totalSchoolAdmins + schools.length;

  // Toggle school active/inactive
  const handleToggleSchool = (id, newStatus) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const target = schools.find((s) => s.id === id);
    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now(),
        type: newStatus === 'Active' ? 'school_activated' : 'school_deactivated',
        text: `Campus status changed to ${newStatus} for ${target ? target.name : id}`,
        time: 'Just now',
      },
      ...prev,
    ]);
    showFeedback('Status Updated', `School status updated to ${newStatus}.`);
  };

  // Toggle admin active/inactive
  const handleToggleAdmin = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    showFeedback('Admin Status Updated', `Administrator status set to ${newStatus}.`);
  };

  // Reset admin password
  const handleResetAdminPassword = (adminId) => {
    const admin = users.find((u) => u.id === adminId);
    if (!admin) return;
    const newPass = 'Zen@' + Math.floor(10000 + Math.random() * 90000);
    showFeedback('Password Reset', `Temporary password for ${admin.name} (${admin.email}):\n\n${newPass}`);
  };

  // Assign admin to school
  const handleAssignAdmin = (adminId, schoolId) => {
    const admin = users.find((u) => (u.id || u.userId) === adminId);
    const school = schools.find((s) => (s.id || s.schoolId) === schoolId);
    if (admin && school) {
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u.userId) === adminId
            ? { ...u, schoolId, schoolName: school.name }
            : u
        )
      );
      setSchools((prev) =>
        prev.map((s) =>
          (s.id || s.schoolId) === schoolId
            ? { ...s, admin: admin.email, adminName: admin.name }
            : s
        )
      );
      showFeedback('Admin Reassigned', `${admin.name} is now the assigned School Admin for ${school.name}.`);
    }
  };

  // Add new school admin
  const handleAddAdmin = (newAdmin) => {
    setUsers((prev) => [newAdmin, ...prev]);
    if (newAdmin.schoolId) {
      setSchools((prev) =>
        prev.map((s) =>
          (s.id || s.schoolId) === newAdmin.schoolId
            ? { ...s, admin: newAdmin.email, adminName: newAdmin.name }
            : s
        )
      );
    }
    showFeedback('Admin Created', `Admin ${newAdmin.name} created and assigned.`);
  };

  // Toggle service status
  const handleToggleService = (id) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id
          ? { ...srv, status: srv.status === 'Active' ? 'Inactive' : 'Active' }
          : srv
      )
    );
  };

  // Mark bill paid
  const handleMarkBillPaid = (invoiceNo) => {
    const bill = bills.find((b) => b.invoiceNo === invoiceNo);
    if (bill) {
      setBills((prev) =>
        prev.map((b) =>
          b.invoiceNo === invoiceNo
            ? { ...b, status: 'PAID', paymentDate: new Date().toISOString().split('T')[0] }
            : b
        )
      );
      setActivities((prev) => [
        {
          id: 'ACT-' + Date.now(),
          type: 'payment_received',
          text: `Payment received: ${bill.amount} (${invoiceNo}) from ${bill.school}`,
          time: 'Just now',
        },
        ...prev,
      ]);
      showFeedback('Payment Recorded', `Invoice ${invoiceNo} marked as PAID.`);
    }
  };

  // Save new invoice
  const handleSaveInvoice = (newBill) => {
    setBills((prev) => [newBill, ...prev]);
    showFeedback('Invoice Generated', `Invoice ${newBill.invoiceNo} for ${newBill.school} generated.`);
  };

  // Save subscription or plan
  const handleSaveSubOrPlan = (event) => {
    if (event.type === 'subscription') {
      setSubscriptions((prev) => {
        const existingIdx = prev.findIndex(
          (s) => s.schoolId === event.data.schoolId || s.id === event.data.id || s.school === event.data.school
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...event.data };
          return updated;
        }
        return [event.data, ...prev];
      });

      // Update the school's subscription in schools list
      setSchools((prev) =>
        prev.map((s) => {
          if (s.id === event.data.schoolId || s.schoolId === event.data.schoolId || s.name === event.data.school) {
            const planObj = plans.find((p) => p.name === event.data.plan);
            const maxStudents = planObj ? planObj.maxStudents : (s.studentsCount || 450);
            return {
              ...s,
              subscription: event.data.plan,
              studentsCount: s.studentsCount || Math.min(450, maxStudents),
              teachersCount: s.teachersCount || 24,
              parentsCount: s.parentsCount || 410,
            };
          }
          return s;
        })
      );

      // Generate invoice & payment record for billing
      const newInvoice = {
        invoiceNo: 'INV-2026-0' + Math.floor(10 + Math.random() * 90),
        schoolId: event.data.schoolId,
        school: event.data.school,
        plan: event.data.plan,
        amount: event.data.amount,
        dueDate: event.data.endDate,
        paymentDate: event.data.status === 'ACTIVE' ? new Date().toISOString().split('T')[0] : null,
        status: event.data.status === 'ACTIVE' ? 'PAID' : 'PENDING',
      };
      setBills((prev) => [newInvoice, ...prev]);

      setActivities((prev) => [
        {
          id: 'ACT-' + Date.now(),
          type: 'sub_activated',
          text: `${event.data.plan} activated for ${event.data.school}`,
          time: 'Just now',
        },
        ...prev,
      ]);

      // Persist in portal storage
      try {
        const store = getPortalData();
        if (!store.subscriptions) store.subscriptions = [];
        const subIdx = store.subscriptions.findIndex(
          (s) => s.schoolId === event.data.schoolId || s.id === event.data.id || s.school === event.data.school
        );
        if (subIdx >= 0) {
          store.subscriptions[subIdx] = { ...store.subscriptions[subIdx], ...event.data };
        } else {
          store.subscriptions.unshift(event.data);
        }

        if (store.schools) {
          store.schools = store.schools.map((s) =>
            s.id === event.data.schoolId || s.name === event.data.school
              ? { ...s, subscription: event.data.plan }
              : s
          );
        }
        if (!store.bills) store.bills = [];
        store.bills.unshift(newInvoice);
        savePortalData(store);
      } catch (e) {}

      showFeedback(
        'Subscription & Payment Activated',
        `Subscription ${event.data.id} (${event.data.plan} - ${event.data.amount}) successfully activated for ${event.data.school}.\nInvoice ${newInvoice.invoiceNo} generated.`
      );
    } else if (event.type === 'plan') {
      if (event.isEdit) {
        setPlans((prev) => prev.map((p) => (p.id === event.data.id ? event.data : p)));
        showFeedback('Plan Updated', `Plan ${event.data.name} updated.`);
      } else {
        setPlans((prev) => [...prev, event.data]);
        showFeedback('Plan Created', `New plan tier ${event.data.name} added.`);
      }
    }
  };

  // Save onboarding school
  const handleSchoolOnboarded = (newSchool) => {
    setIsWizardOpen(false);

    // 1) Add school to Schools list
    setSchools((prev) => [newSchool, ...prev]);

    // 2) Create Administrator and add to Admin Management
    const adminEmail = newSchool.admin || newSchool.email || `admin@${(newSchool.code || 'school').toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`;
    const adminUsername = newSchool.username || `admin_${(newSchool.code || 'school').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)}`;
    const adminName = newSchool.adminName || `Admin ${newSchool.name}`;

    const createdAdmin = {
      id: 'USR0' + (users.length + 10) + Math.floor(10 + Math.random() * 89),
      name: adminName,
      email: adminEmail,
      phone: newSchool.phone || '+91 94400 00000',
      username: adminUsername,
      role: 'SCHOOL_ADMIN',
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [createdAdmin, ...prev]);

    // 3) Create Pending Subscription record so school immediately shows in Subscriptions
    const pendingSub = {
      id: 'SUB-' + (newSchool.code || newSchool.id).replace(/[^A-Z0-9]/gi, '').toUpperCase() + '-01',
      schoolId: newSchool.id,
      school: newSchool.name,
      plan: 'Pending Activation',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '—',
      amount: 'Pending',
      status: 'PENDING',
    };
    setSubscriptions((prev) => [pendingSub, ...prev]);

    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now(),
        type: 'school_registered',
        text: `New School Campus Onboarded: ${newSchool.name} (${newSchool.code})`,
        time: 'Just now',
      },
      ...prev,
    ]);

    // Persist all in portal local storage
    try {
      const store = getPortalData();
      if (!store.schools) store.schools = [];
      if (!store.users) store.users = [];
      if (!store.subscriptions) store.subscriptions = [];
      store.schools.unshift(newSchool);
      store.users.unshift(createdAdmin);
      store.subscriptions.unshift(pendingSub);
      savePortalData(store);
    } catch (e) {}

    showFeedback(
      'School Onboarded Successfully',
      `1. School "${newSchool.name}" registered in Schools Management.\n2. Administrator "${adminName}" created in Admin Management.\n3. School enrolled in Subscriptions as "Pending Activation" — you can activate their SaaS plan anytime!`
    );
  };

  // =========================================================================
  // Security & Governance Suite Handlers
  // =========================================================================
  // Filtered array calculations
  const filteredSchools = schools.filter((s) => {
    if (schoolFilter !== 'All' && s.status !== schoolFilter) return false;
    if (schoolSearch && !s.name.toLowerCase().includes(schoolSearch.toLowerCase()) && !(s.code || '').toLowerCase().includes(schoolSearch.toLowerCase()) && !(s.adminName || s.admin || '').toLowerCase().includes(schoolSearch.toLowerCase())) return false;
    return true;
  });

  const filteredAdmins = users.filter((u) => u.role === 'SCHOOL_ADMIN').filter((a) => {
    if (adminFilter !== 'All' && a.status !== adminFilter) return false;
    if (adminSearch && !a.name.toLowerCase().includes(adminSearch.toLowerCase()) && !a.email.toLowerCase().includes(adminSearch.toLowerCase())) return false;
    return true;
  });

  const filteredServices = services.filter((s) => {
    if (serviceFilter !== 'All' && s.category !== serviceFilter) return false;
    return true;
  });

  const filteredSubs = subscriptions.filter((s) => {
    if (subStatusFilter !== 'All' && s.status !== subStatusFilter) return false;
    return true;
  });

  const filteredBills = bills.filter((b) => {
    if (billFilter !== 'All' && b.status !== billFilter) return false;
    return true;
  });

  return (
    <div>
      {/* ===================================================================== */}
      {/* 1. SUPER ADMIN: DASHBOARD (sa-dashboard) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-dashboard' && (
        <div>
          {/* Header Bar */}
          <div className="content-header">
            <h2 id="section-title">Super Admin Dashboard</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            {/* Top 12 Summary SaaS Cards */}
            <div className="grid-4" style={{ marginBottom: '25px' }}>
              {/* 1. Total Schools */}
              <div className="portal-card" style={{ borderLeftColor: '#2563eb' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Schools</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e3a8a', margin: '4px 0' }}>{totalSchools}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Platform Multi-Tenant</span>
              </div>

              {/* 2. Active Schools */}
              <div className="portal-card" style={{ borderLeftColor: '#10b981' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Active Schools</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#047857', margin: '4px 0' }}>{activeSchools}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Operational</span>
              </div>

              {/* 3. InActive Schools */}
              <div className="portal-card" style={{ borderLeftColor: '#ef4444' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>InActive Schools</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b91c1c', margin: '4px 0' }}>{inactiveSchools}</p>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Suspended / Expired</span>
              </div>

              {/* 4. Total School Admins */}
              <div className="portal-card" style={{ borderLeftColor: '#f59e0b' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total School Admins</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b45309', margin: '4px 0' }}>{totalSchoolAdmins}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Assigned Admins</span>
              </div>

              {/* 5. Active Subscriptions */}
              <div className="portal-card" style={{ borderLeftColor: '#10b981' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Active Subscriptions</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#059669', margin: '4px 0' }}>{activeSubs}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Paid SaaS Tier</span>
              </div>

              {/* 6. Expiring / Expired */}
              <div className="portal-card" style={{ borderLeftColor: '#f97316' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Expiring / Expired</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c2410c', margin: '4px 0' }}>{expiringSubs}</p>
                <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600 }}>Action Required</span>
              </div>

              {/* 7. Pending Bills */}
              <div className="portal-card" style={{ borderLeftColor: '#ef4444' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Pending Bills</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#dc2626', margin: '4px 0' }}>{pendingBills}</p>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Invoices Unpaid</span>
              </div>

              {/* 8. Total Revenue */}
              <div className="portal-card" style={{ borderLeftColor: '#059669' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Revenue</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#047857', margin: '4px 0' }}>₹{totalRevenue.toLocaleString()}/-</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Lifetime Collections</span>
              </div>

              {/* 9. Total Students */}
              <div className="portal-card" style={{ borderLeftColor: '#3b82f6' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Students</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1d4ed8', margin: '4px 0' }}>{totalStudents.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Across All Campuses</span>
              </div>

              {/* 10. Total Teachers */}
              <div className="portal-card" style={{ borderLeftColor: '#8b5cf6' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Teachers</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6d28d9', margin: '4px 0' }}>{totalTeachers}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Faculty Members</span>
              </div>

              {/* 11. Total Parents */}
              <div className="portal-card" style={{ borderLeftColor: '#ec4899' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Parents</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#be185d', margin: '4px 0' }}>{totalParents.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Registered Portals</span>
              </div>

              {/* 12. Total Staff */}
              <div className="portal-card" style={{ borderLeftColor: '#6366f1' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Staff</div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4338ca', margin: '4px 0' }}>{totalStaff}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Admins & Teachers</span>
              </div>
            </div>

            {/* Recent Activities */}
            <div style={{ marginTop: '35px' }}>
              <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '12px' }}>Recent Platform Activities</h3>
              <div className="activity-timeline">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <span className="activity-icon-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(30,58,138,0.06)', flexShrink: 0 }}>
                      {renderActivityIcon(act.type)}
                    </span>
                    <div>
                      <strong>{act.text}</strong>
                    </div>
                    <span className="activity-time">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SUPER ADMIN: SCHOOLS (sa-schools) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-schools' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Schools Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            {/* Modern SaaS Schools Toolbar */}
            <div className="sa-schools-toolbar">
              <div className="sa-filter-segment">
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('All')}
                >
                  <span>All Schools</span>
                  <span className="sa-tab-badge" id="badge-all-schools">{schools.length}</span>
                </button>
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'Active' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('Active')}
                >
                  <span>Active</span>
                  <span className="sa-tab-badge badge-green" id="badge-active-schools">{activeSchools}</span>
                </button>
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('Inactive')}
                >
                  <span>Inactive</span>
                  <span className="sa-tab-badge badge-rose" id="badge-inactive-schools">{inactiveSchools}</span>
                </button>
              </div>

              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search schools by name, code, city, admin..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsWizardOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  + Add School
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
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
                    <th style={{ textAlign: 'center', minWidth: '280px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map((s) => (
                    <tr key={s.id} className="sa-school-row" data-status={s.status}>
                      <td data-label="School Name" className="school-meta-line">
                        <strong>{s.name}</strong><br /><small>{s.city || ''}</small>
                      </td>
                      <td data-label="School Code"><span className="badge badge-info">{s.code || ''}</span></td>
                      <td data-label="Admin" className="school-meta-line">
                        <strong>{s.adminName || s.admin || 'Unassigned'}</strong><br /><small>{s.admin || ''}</small>
                      </td>
                      <td data-label="Students">{s.studentsCount || 0}</td>
                      <td data-label="Teachers">{s.teachersCount || 0}</td>
                      <td data-label="Subscription">
                        <span
                          className={`badge ${s.subscription === 'Pending Activation' ? 'badge-warning' : 'badge-info'}`}
                          style={s.subscription === 'Pending Activation' ? { cursor: 'pointer' } : {}}
                          title={s.subscription === 'Pending Activation' ? 'Click to activate SaaS subscription' : ''}
                          onClick={() => {
                            if (s.subscription === 'Pending Activation') {
                              setSelectedPlanObj({ schoolId: s.id, schoolName: s.name });
                              setSubModalTab('subscription');
                              setIsSubModalOpen(true);
                            }
                          }}
                        >
                          {s.subscription || 'Pending Activation'}
                          {s.subscription === 'Pending Activation' ? ' ⚡' : ''}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td data-label="Created Date">{s.createdDate || '2026-01-01'}</td>
                      <td data-label="Actions" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell">
                          {s.subscription === 'Pending Activation' && (
                            <button
                              type="button"
                              className="sa-tbl-action"
                              style={{ color: '#047857', borderColor: '#10b981', background: '#ecfdf5', fontWeight: 600 }}
                              title="Activate SaaS Subscription"
                              onClick={() => {
                                setSelectedPlanObj({ schoolId: s.id, schoolName: s.name });
                                setSubModalTab('subscription');
                                setIsSubModalOpen(true);
                              }}
                            >
                              ⚡ Plan
                            </button>
                          )}
                          <button
                            type="button"
                            className="sa-tbl-action view"
                            title="View Campus Details"
                            onClick={() => { setSelectedSchool(s); setIsOverviewOpen(true); }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="sa-tbl-action edit"
                            title="Edit School Information"
                            onClick={() => { setSelectedSchool(s); setIsEditSchoolOpen(true); }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="sa-tbl-action admin"
                            title="View Campus Administrator"
                            onClick={() => {
                              const foundAdmin = users.find((u) => u.email === s.admin || u.schoolId === s.id);
                              setSelectedAdmin(foundAdmin || { name: s.adminName || 'Admin', email: s.admin, schoolName: s.name, schoolId: s.id, status: s.status });
                              setIsAdminProfileOpen(true);
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>View Admin</span>
                          </button>
                          {s.status === 'Active' ? (
                            <button
                              type="button"
                              className="sa-tbl-action danger"
                              title="Deactivate School"
                              onClick={() => handleToggleSchool(s.id, 'Inactive')}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                              </svg>
                              <span>Deactivate</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sa-tbl-action success"
                              title="Activate School"
                              onClick={() => handleToggleSchool(s.id, 'Active')}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              <span>Activate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SUPER ADMIN: ADMIN MANAGEMENT (sa-admin-management) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-admin-management' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Admin Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${adminFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('All')}
                >
                  All Admins <span className="sa-tab-badge">{schoolAdmins.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${adminFilter === 'Active' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('Active')}
                >
                  Active <span className="sa-tab-badge badge-green">{schoolAdmins.filter((a) => a.status === 'Active').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${adminFilter === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('Inactive')}
                >
                  Inactive <span className="sa-tab-badge badge-rose">{schoolAdmins.filter((a) => a.status !== 'Active').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search admins by name, email, campus..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => { setAssignInitialAdminId(null); setIsAssignAdminOpen(true); }}>
                  Assign Admin
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddAdminOpen(true)}>
                  + Add Admin
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '180px' }}>Admin Profile</th>
                    <th style={{ minWidth: '180px' }}>Official Email</th>
                    <th style={{ minWidth: '180px' }}>Assigned School</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '110px' }}>Created Date</th>
                    <th style={{ minWidth: '260px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((a) => (
                    <tr key={a.id} className="sa-admin-row" data-status={a.status}>
                      <td data-label="Admin Profile">
                        <div className="school-meta-line">
                          <strong>{a.name}</strong>
                          <small>Username: <code>{a.username}</code></small>
                        </div>
                      </td>
                      <td data-label="Official Email">{a.email}</td>
                      <td data-label="Assigned School">
                        <div className="school-meta-line">
                          <strong>{a.schoolName || 'Unassigned'}</strong>
                          <small>{a.schoolId || ''}</small>
                        </div>
                      </td>
                      <td data-label="Status" style={{ textAlign: 'center' }}>
                        <span className={`badge ${a.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                      </td>
                      <td data-label="Created Date">{a.createdDate || '2026-01-01'}</td>
                      <td data-label="Actions" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell">
                          <button
                            className="sa-tbl-action view"
                            onClick={() => { setSelectedAdmin(a); setIsAdminProfileOpen(true); }}
                            title="View Profile"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                          <button
                            className="sa-tbl-action edit"
                            onClick={() => { setAssignInitialAdminId(a.id); setIsAssignAdminOpen(true); }}
                            title="Reassign Campus"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
                            </svg>
                            Reassign
                          </button>
                          {a.status === 'Active' ? (
                            <button
                              className="sa-tbl-action danger"
                              onClick={() => handleToggleAdmin(a.id, 'Inactive')}
                              title="Deactivate Account"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="sa-tbl-action success"
                              onClick={() => handleToggleAdmin(a.id, 'Active')}
                              title="Activate Account"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            className="sa-tbl-action admin"
                            onClick={() => handleResetAdminPassword(a.id)}
                            title="Reset Password"
                          >
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SUPER ADMIN: SERVICES (sa-services) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-services' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Platform Services</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${serviceFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setServiceFilter('All')}
                >
                  Available Services <span className="sa-tab-badge">{services.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${serviceFilter === 'Active' ? 'active' : ''}`}
                  onClick={() => setServiceFilter('Active')}
                >
                  Active Services
                </button>
                <button
                  className={`sa-filter-tab ${serviceFilter === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setServiceFilter('Inactive')}
                >
                  Inactive
                </button>
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-outline btn-sm" onClick={() => showFeedback('Assign Service', 'Select school campus to assign service module.')}>
                  Assign Service to School
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => showFeedback('Create Service', 'Service definition module active.')}>
                  + Create Service
                </button>
              </div>
            </div>

            <div className="grid-2">
              {filteredServices.map((srv) => (
                <div key={srv.id} className="portal-card sa-service-card" data-status={srv.status}>
                  <div className="portal-card-header">
                    <span className="portal-card-title">{srv.name}</span>
                    <span className="badge badge-info">{srv.category}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', margin: '8px 0' }}>{srv.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{srv.cost}</span>
                    <span className={`badge ${srv.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{srv.status}</span>
                  </div>
                  <div className="sa-actions-cell" style={{ marginTop: '14px' }}>
                    <button className="sa-tbl-action edit" onClick={() => showFeedback('Edit Service', `Editing service ${srv.name}.`)}>
                      Edit Service
                    </button>
                    <button
                      className={`sa-tbl-action ${srv.status === 'Active' ? 'danger' : 'success'}`}
                      onClick={() => handleToggleService(srv.id)}
                    >
                      {srv.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="sa-tbl-action admin" onClick={() => showFeedback('Assign Service', `Assigning ${srv.name} to school campus.`)}>
                      Assign to School
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUPER ADMIN: SUBSCRIPTION (sa-subscriptions) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-subscriptions' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Subscriptions Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('All'); }}
                >
                  All Subscriptions <span className="sa-tab-badge">{subscriptions.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'plans' ? 'active' : ''}`}
                  onClick={() => setSubViewType('plans')}
                >
                  Subscription Plans
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'ACTIVE' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('ACTIVE'); }}
                >
                  Active <span className="sa-tab-badge badge-green">{subscriptions.filter((s) => s.status === 'ACTIVE').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'EXPIRED' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('EXPIRED'); }}
                >
                  Expired <span className="sa-tab-badge badge-rose">{subscriptions.filter((s) => s.status === 'EXPIRED').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('PENDING'); }}
                >
                  Pending <span className="sa-tab-badge badge-warning">{subscriptions.filter((s) => s.status === 'PENDING').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setSelectedPlanObj(null); setSubModalTab('subscription'); setIsSubModalOpen(true); }}
                >
                  + New Subscription
                </button>
              </div>
            </div>

            {/* Plans Grid View */}
            {subViewType === 'plans' && (
              <div id="sub-plans-pane" style={{ marginBottom: '25px' }}>
                <div className="grid-3">
                  {plans.map((p) => (
                    <div key={p.id} className="portal-card" style={{ borderLeftColor: 'var(--color-primary)' }}>
                      <div className="portal-card-header">
                        <span className="portal-card-title">{p.name}</span>
                        <span className="badge badge-info">Up to {p.maxStudents} Students</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '8px 0' }}>{p.price}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)' }}>{p.features}</p>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '14px', width: '100%' }}
                        onClick={() => { setSelectedPlanObj(p); setSubModalTab('plan'); setIsSubModalOpen(true); }}
                      >
                        Configure Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscriptions Table View */}
            {subViewType === 'subs' && (
              <div id="sub-table-pane" className="table-responsive">
                <table className="sa-schools-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '120px' }}>Subscription ID</th>
                      <th style={{ minWidth: '180px' }}>School Campus</th>
                      <th style={{ minWidth: '140px' }}>Plan Tier</th>
                      <th style={{ minWidth: '100px' }}>Start Date</th>
                      <th style={{ minWidth: '100px' }}>End Date</th>
                      <th style={{ minWidth: '100px' }}>Amount</th>
                      <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                      <th style={{ minWidth: '140px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map((sub) => (
                      <tr key={sub.id} className="sa-sub-row" data-status={sub.status}>
                        <td data-label="Subscription ID"><code>{sub.id}</code></td>
                        <td data-label="School">
                          <div className="school-meta-line">
                            <strong>{sub.school}</strong>
                            <small>{sub.schoolId || ''}</small>
                          </div>
                        </td>
                        <td data-label="Plan">
                          <span className={`badge ${sub.status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>
                            {sub.plan}
                          </span>
                        </td>
                        <td data-label="Start Date">{sub.startDate}</td>
                        <td data-label="End Date">{sub.endDate}</td>
                        <td data-label="Amount"><strong>{sub.amount}</strong></td>
                        <td data-label="Status" style={{ textAlign: 'center' }}>
                          <span className={`badge ${sub.status === 'ACTIVE' ? 'badge-success' : sub.status === 'EXPIRED' ? 'badge-danger' : 'badge-warning'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td data-label="Action" style={{ textAlign: 'center' }}>
                          <div className="sa-actions-cell">
                            {sub.status === 'PENDING' ? (
                              <button
                                className="sa-tbl-action"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  color: '#047857',
                                  background: '#ecfdf5',
                                  borderColor: '#a7f3d0',
                                  fontWeight: 600,
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                }}
                                onClick={() => {
                                  setSelectedPlanObj(sub);
                                  setSubModalTab('subscription');
                                  setIsSubModalOpen(true);
                                }}
                              >
                                ⚡ Activate Plan
                              </button>
                            ) : (
                              <button
                                className="sa-tbl-action edit"
                                onClick={() => {
                                  setSelectedPlanObj(sub);
                                  setSubModalTab('subscription');
                                  setIsSubModalOpen(true);
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Renew / Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. SUPER ADMIN: BILLS / BILLING (sa-billing) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-billing' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Bills & Billing Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${billFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setBillFilter('All')}
                >
                  All Bills <span className="sa-tab-badge">{bills.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'PAID' ? 'active' : ''}`}
                  onClick={() => setBillFilter('PAID')}
                >
                  Paid <span className="sa-tab-badge badge-green">{bills.filter((b) => b.status === 'PAID').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => setBillFilter('PENDING')}
                >
                  Pending <span className="sa-tab-badge">{bills.filter((b) => b.status === 'PENDING').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'OVERDUE' ? 'active' : ''}`}
                  onClick={() => setBillFilter('OVERDUE')}
                >
                  Overdue <span className="sa-tab-badge badge-rose">{bills.filter((b) => b.status === 'OVERDUE').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => setIsInvoiceModalOpen(true)}>
                  + Create Invoice
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '110px' }}>Invoice ID</th>
                    <th style={{ minWidth: '180px' }}>School Campus</th>
                    <th style={{ minWidth: '130px' }}>Plan Tier</th>
                    <th style={{ minWidth: '100px' }}>Amount</th>
                    <th style={{ minWidth: '100px' }}>Due Date</th>
                    <th style={{ minWidth: '100px' }}>Payment Date</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '160px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((b) => (
                    <tr key={b.invoiceNo} className="sa-bill-row" data-status={b.status}>
                      <td data-label="Invoice ID"><strong>{b.invoiceNo}</strong></td>
                      <td data-label="School"><strong>{b.school}</strong></td>
                      <td data-label="Plan"><span className="badge badge-info">{b.plan}</span></td>
                      <td data-label="Amount"><strong>{b.amount}</strong></td>
                      <td data-label="Due Date">{b.dueDate}</td>
                      <td data-label="Payment Date">{b.paymentDate || '—'}</td>
                      <td data-label="Status" style={{ textAlign: 'center' }}>
                        <span className={`badge ${b.status === 'PAID' ? 'badge-success' : b.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell">
                          <button
                            className="sa-tbl-action view"
                            onClick={() => showFeedback('Invoice PDF', `Generating official PDF receipt for ${b.invoiceNo} (${b.school}).`)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            Invoice
                          </button>
                          {b.status !== 'PAID' && (
                            <button
                              className="sa-tbl-action success"
                              onClick={() => handleMarkBillPaid(b.invoiceNo)}
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. SUPER ADMIN: SETTINGS (sa-settings) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-settings' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Platform Settings</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar" style={{ marginBottom: '20px' }}>
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${settingsSection === 'platform' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('platform')}
                >
                  Platform Settings
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'roles' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('roles')}
                >
                  Roles & Permissions
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'notifications' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('notifications')}
                >
                  Notifications
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'security' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('security')}
                >
                  High Security
                </button>

                <button
                  className={`sa-filter-tab ${settingsSection === 'profile' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('profile')}
                >
                  Profile
                </button>
              </div>
            </div>

            {settingsSection === 'security' ? (
              <div style={{ marginTop: '20px' }}>
                <SuperAdminSecurityView />
              </div>
            ) : (
              <div id="settings-content-pane" style={{ maxWidth: '760px', marginTop: '15px' }}>
                <div className="wizard-form-box" style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                  <div className="wizard-header-strip">
                    <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                    <div className="wizard-header-titles">
                      {settingsSection === 'platform' && (
                        <>
                          <h4>ZenSchool Platform Configuration</h4>
                          <p>Global multi-campus parameters, institutional branding, contact endpoints, and server state.</p>
                        </>
                      )}
                      {settingsSection !== 'platform' && (
                        <>
                          <h4>ZenSchool {settingsSection.toUpperCase()} Policy Settings</h4>
                          <p>Configure institutional standards, policy enforcement flags, and security controls.</p>
                        </>
                      )}
                    </div>
                  </div>

                  {settingsSection === 'platform' && (
                    <form onSubmit={(e) => { e.preventDefault(); showFeedback('Settings Saved', 'ZenSchool Platform configuration updated successfully.'); }}>
                      <div className="wizard-grid-2">
                        <div className="wizard-field">
                          <label>Platform Name <span className="req">*</span></label>
                          <input type="text" defaultValue="ZenSchool Multi-School Platform" required />
                        </div>
                        <div className="wizard-field">
                          <label>Super Admin Contact Email <span className="req">*</span></label>
                          <input type="email" defaultValue="superadmin@zenschool.com" required />
                        </div>
                        <div className="wizard-field">
                          <label>Default Currency <span className="req">*</span></label>
                          <input type="text" defaultValue="INR (₹)" required />
                        </div>
                        <div className="wizard-field">
                          <label>Platform Maintenance Mode <span className="req">*</span></label>
                          <select defaultValue="Disabled">
                            <option value="Disabled">Disabled (Platform Online)</option>
                            <option value="Enabled">Enabled (Maintenance Mode)</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Platform Settings ✓</button>
                      </div>
                    </form>
                  )}

                  {settingsSection !== 'platform' && (
                    <form onSubmit={(e) => { e.preventDefault(); showFeedback('Settings Saved', `${settingsSection.toUpperCase()} settings saved successfully.`); }}>
                      <div className="wizard-grid-2">
                        <div className="wizard-field span-2">
                          <label>Policy Header / Description <span className="req">*</span></label>
                          <input type="text" defaultValue={`Standard ${settingsSection} enterprise policy configuration`} required />
                        </div>
                        <div className="wizard-field">
                          <label>Enforcement Status <span className="req">*</span></label>
                          <select defaultValue="Active">
                            <option value="Active">Enforced Across All Campuses</option>
                            <option value="Disabled">Optional per Campus</option>
                          </select>
                        </div>
                        <div className="wizard-field">
                          <label>Audit Logging</label>
                          <select defaultValue="Enabled">
                            <option value="Enabled">Full Activity Logging</option>
                            <option value="Minimal">Basic Logging</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Update {settingsSection} Settings ✓</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ===================================================================== */}
      {/* ALL MODALS MOUNTED ACCORDING TO PORTAL.JS BEHAVIOR */}
      {/* ===================================================================== */}
      {/* 1. Onboarding Wizard Modal */}
      <NewSchoolWizardModal
        key={isWizardOpen ? 'wiz-open' : 'wiz-closed'}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSchoolCreated={handleSchoolOnboarded}
      />

      {/* 2. Campus Overview Modal */}
      <CampusOverviewModal
        isOpen={isOverviewOpen}
        school={selectedSchool}
        onClose={() => setIsOverviewOpen(false)}
        onEdit={(s) => { setSelectedSchool(s); setIsEditSchoolOpen(true); }}
      />

      {/* 3. Edit School Modal */}
      <EditSchoolModal
        isOpen={isEditSchoolOpen}
        school={selectedSchool}
        onClose={() => setIsEditSchoolOpen(false)}
        onSave={(updated) => {
          setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          showFeedback('Campus Updated', `Changes saved for ${updated.name}.`);
        }}
      />

      {/* 4. Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        admin={selectedAdmin}
        onClose={() => setIsAdminProfileOpen(false)}
      />

      {/* 5. Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddAdminOpen}
        schools={schools}
        onClose={() => setIsAddAdminOpen(false)}
        onSave={handleAddAdmin}
      />

      {/* 6. Assign Admin Modal */}
      <AssignAdminModal
        isOpen={isAssignAdminOpen}
        admins={schoolAdmins}
        schools={schools}
        initialAdminId={assignInitialAdminId}
        onClose={() => setIsAssignAdminOpen(false)}
        onSave={handleAssignAdmin}
      />

      {/* 7. Subscription / Plan Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        defaultTab={subModalTab}
        planObj={selectedPlanObj}
        schools={schools}
        plans={plans}
        onClose={() => setIsSubModalOpen(false)}
        onSave={handleSaveSubOrPlan}
      />

      {/* 8. Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        schools={schools}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
      />

      {/* 9. Feedback Confirmation Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
      />
    </div>
  );
}
