// ============================================================================
// ZenSchool Master Portal Data Store (Exact parity with js/portal.js)
// Multi-Tenant RBAC & Live Data Synchronization
// ============================================================================

const defaultData = {
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

  principals: [
    {
      id: 'PR001',
      name: 'Dr. Savithri Raman',
      qualification: 'Ph.D., M.Ed',
      experience: '18 Years',
      phone: '+91 98401 23450',
      email: 'principal@ssvschool.com',
      username: 'principal',
      status: 'Active',
      joinedDate: '2020-06-01',
      schoolId: 'SCHOOL002'
    }
  ],

  parents: [
    { id: 'PAR001', name: 'Ramesh Kumar', relationship: 'Father', phone: '+91 98401 99009', email: 'ramesh.k@gmail.com', studentName: 'Aishwarya Kumar', studentRoll: 'S101', schoolId: 'SCHOOL002' },
    { id: 'PAR002', name: 'Selvam Periasamy', relationship: 'Father', phone: '+91 98402 33445', email: 'selvam.p@gmail.com', studentName: 'Kavitha Selvam', studentRoll: 'S102', schoolId: 'SCHOOL002' }
  ],

  users: [
    { id: 'USR001', name: 'Dr. Savithri Raman', role: 'PRINCIPAL', phone: '+91 98401 23450', email: 'principal@ssvschool.com', username: 'principal', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR002', name: 'School Administrator (SSV)', role: 'SCHOOL_ADMIN', phone: '+91 98401 23456', email: 'admin@ssvschool.com', username: 'admin', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR003', name: 'Mrs. Priya Krishnan', role: 'TEACHER', phone: '+91 98401 23451', email: 'priya.k@ssvschool.com', username: 'priya', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR004', name: 'Dr. Anandhi Rajan', role: 'TEACHER', phone: '+91 98401 23452', email: 'anandhi.r@ssvschool.com', username: 'anandhi', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR005', name: 'Aishwarya Kumar', role: 'STUDENT', phone: '+91 98401 23453', email: 'aishwarya@ssvschool.com', username: 'aishwarya', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR006', name: 'Kavitha Selvam', role: 'STUDENT', phone: '+91 98401 23454', email: 'kavitha@ssvschool.com', username: 'kavitha', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR007', name: 'Ramesh Kumar', role: 'PARENT', phone: '+91 98401 99009', email: 'ramesh.k@gmail.com', username: 'parent', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002', studentName: 'Aishwarya Kumar', studentRoll: 'S101', relationship: 'Father' },
  ]
};

const STORAGE_KEY = 'ssv_demo_data';

export function getPortalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.principals || parsed.principals.length === 0) {
        parsed.principals = defaultData.principals;
      }
      return { ...defaultData, ...parsed };
    }
  } catch (err) {
    console.warn('Portal data parsing error:', err);
  }
  return defaultData;
}

export function savePortalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Portal data saving error:', err);
  }
}

export function getInitialPortalData() {
  const data = getPortalData();
  savePortalData(data);
  return data;
}
