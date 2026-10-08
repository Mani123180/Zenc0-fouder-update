import React, { useState, useEffect } from 'react';
import {
  getPortalData,
  savePortalData
} from '../../services/portalData';
import ChatBox from './ChatBox';

export default function SchoolAdminView({ activeTab }) {
  const [data, setData] = useState(getPortalData());
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [principalSearch, setPrincipalSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('All');
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', role: 'TEACHER', phone: '', email: '' });

  const [isPrincipalModalOpen, setIsPrincipalModalOpen] = useState(false);
  const [editingPrincipal, setEditingPrincipal] = useState(null);
  const [principalForm, setPrincipalForm] = useState({ name: '', qualification: 'Ph.D., M.Ed', experience: '18 Years', phone: '', email: '', status: 'Active' });

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ name: '', subject: '', class: 'Grade 10-A' });

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', class: 'Grade 10-A' });

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classForm, setClassForm] = useState({ name: '', teacher: '', room: '', strength: 38 });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', grade: 'Grade 10', teacher: '' });

  const [isLinkParentOpen, setIsLinkParentOpen] = useState(false);
  const [linkParentForm, setLinkParentForm] = useState({ name: '', relationship: 'Father', phone: '', email: '', studentRoll: 'S101' });

  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', target: 'All', category: 'General', content: '' });

  const [marksStudent, setMarksStudent] = useState(null);
  const [marksInputs, setMarksInputs] = useState({});

  const [assignWorkSlot, setAssignWorkSlot] = useState(null);
  const [assignWorkForm, setAssignWorkForm] = useState({ subject: '', teacherName: '' });

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setData(getPortalData());
  }, [activeTab]);

  const refreshData = () => {
    setData(getPortalData());
  };

  // Helper for title header
  const getTabTitle = () => {
    const titles = {
      'school-admin-users': 'School User Management',
      'manage-principal': 'Manage Principal',
      'manage-teachers': 'Manage Teachers',
      'manage-students': 'Manage Students',
      'manage-parents': 'Manage Parents',
      'manage-classes': 'Manage Classes',
      'manage-subjects': 'Manage Subjects',
      'publish-announcements': 'School Announcements',
      'view-reports': 'Academic & Enrollment Reports',
      'secure-messaging': 'Secure Messaging'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Principal Handlers
  const handleOpenPrincipalModal = (principal = null) => {
    setEditingPrincipal(principal);
    if (principal) {
      setPrincipalForm({
        name: principal.name,
        qualification: principal.qualification || 'Ph.D., M.Ed',
        experience: principal.experience || '18 Years',
        phone: principal.phone || '',
        email: principal.email || '',
        status: principal.status || 'Active'
      });
    } else {
      setPrincipalForm({
        name: '',
        qualification: 'Ph.D., M.Ed',
        experience: '15 Years',
        phone: '+91 98401 23450',
        email: '',
        status: 'Active'
      });
    }
    setIsPrincipalModalOpen(true);
  };

  const handleSavePrincipal = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (!current.principals) current.principals = [];
    if (!current.users) current.users = [];

    if (editingPrincipal) {
      const idx = current.principals.findIndex((p) => p.id === editingPrincipal.id);
      if (idx > -1) {
        current.principals[idx] = {
          ...current.principals[idx],
          name: principalForm.name,
          qualification: principalForm.qualification,
          experience: principalForm.experience,
          phone: principalForm.phone,
          email: principalForm.email,
          status: principalForm.status
        };
      }
      const uIdx = current.users.findIndex(
        (u) => u.id === editingPrincipal.id || u.email === editingPrincipal.email || (u.role === 'PRINCIPAL' && u.name === editingPrincipal.name)
      );
      if (uIdx > -1) {
        current.users[uIdx].name = principalForm.name;
        current.users[uIdx].phone = principalForm.phone;
        current.users[uIdx].email = principalForm.email;
        current.users[uIdx].status = principalForm.status;
      }
    } else {
      const nextId = 'PR0' + (current.principals.length + 1);
      const newPr = {
        id: nextId,
        name: principalForm.name,
        qualification: principalForm.qualification,
        experience: principalForm.experience,
        phone: principalForm.phone,
        email: principalForm.email,
        username: principalForm.email.split('@')[0],
        status: principalForm.status,
        joinedDate: new Date().toISOString().split('T')[0],
        schoolId: 'SCHOOL002'
      };
      current.principals.push(newPr);
      current.users.push({
        id: 'USR0' + (current.users.length + 1),
        name: principalForm.name,
        role: 'PRINCIPAL',
        phone: principalForm.phone,
        email: principalForm.email,
        username: principalForm.email.split('@')[0],
        status: principalForm.status,
        createdDate: new Date().toISOString().split('T')[0],
        schoolId: 'SCHOOL002'
      });
    }
    savePortalData(current);
    refreshData();
    setIsPrincipalModalOpen(false);
    setFeedback({
      title: editingPrincipal ? 'Principal Profile Updated' : 'Principal Registered',
      body: `Principal profile for ${principalForm.name} ${editingPrincipal ? 'updated' : 'registered'} successfully.`
    });
  };

  // Reset User Password Handler
  const handleResetPassword = (name, email) => {
    const tempPass = 'Zen@' + Math.floor(10000 + Math.random() * 90000);
    setFeedback({
      title: 'Password Reset',
      body: `Temporary password for ${name} (${email}):\n\n${tempPass}`
    });
  };

  // Add User Handler
  const handleSaveUser = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const nextId = 'USR0' + (current.users.length + 1);
    current.users.push({
      id: nextId,
      name: userForm.name,
      role: userForm.role,
      phone: userForm.phone || '+91 98401 23456',
      email: userForm.email,
      username: userForm.email.split('@')[0],
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      schoolId: 'SCHOOL002'
    });
    savePortalData(current);
    refreshData();
    setIsAddUserOpen(false);
    setUserForm({ name: '', role: 'TEACHER', phone: '', email: '' });
    setFeedback({
      title: 'User Created',
      body: `User account for ${userForm.name} (${userForm.role}) created successfully!`
    });
  };

  // Teacher Handlers
  const handleOpenTeacherModal = (teacher = null) => {
    setEditingTeacher(teacher);
    if (teacher) {
      setTeacherForm({ name: teacher.name, subject: teacher.subject, class: teacher.class });
    } else {
      setTeacherForm({ name: '', subject: '', class: 'Grade 10-A' });
    }
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (editingTeacher) {
      const idx = current.teachers.findIndex((t) => t.id === editingTeacher.id);
      if (idx > -1) {
        current.teachers[idx].name = teacherForm.name;
        current.teachers[idx].subject = teacherForm.subject;
        current.teachers[idx].class = teacherForm.class;
      }
    } else {
      const nextId = 'T0' + (current.teachers.length + 1);
      current.teachers.push({
        id: nextId,
        name: teacherForm.name,
        subject: teacherForm.subject,
        class: teacherForm.class,
        schoolId: 'SCHOOL002',
        status: 'Active'
      });
    }
    savePortalData(current);
    refreshData();
    setIsTeacherModalOpen(false);
    setFeedback({
      title: editingTeacher ? 'Teacher Updated' : 'Teacher Registered',
      body: `Faculty member ${teacherForm.name} saved successfully!`
    });
  };

  // Student Handlers
  const handleOpenStudentModal = (student = null) => {
    setEditingStudent(student);
    if (student) {
      setStudentForm({ name: student.name, class: student.class });
    } else {
      setStudentForm({ name: '', class: 'Grade 10-A' });
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (editingStudent) {
      const idx = current.students.findIndex((s) => s.roll === editingStudent.roll);
      if (idx > -1) {
        current.students[idx].name = studentForm.name;
        current.students[idx].class = studentForm.class;
      }
    } else {
      const nextRoll = 'S' + (current.students.length + 101);
      current.students.push({
        roll: nextRoll,
        name: studentForm.name,
        class: studentForm.class,
        schoolId: 'SCHOOL002',
        attendance: '100%',
        performance: 'Outstanding'
      });
    }
    savePortalData(current);
    refreshData();
    setIsStudentModalOpen(false);
    setFeedback({
      title: editingStudent ? 'Student Updated' : 'Student Enrolled',
      body: `Student record for ${studentForm.name} saved successfully!`
    });
  };

  // Marks Modal Handlers
  const handleOpenMarks = (student) => {
    setMarksStudent(student);
    const initial = {};
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];
    subjects.forEach((sub) => {
      const existing = student.marks ? student.marks.find((m) => m.subject === sub) : null;
      initial[sub] = existing ? existing.scored : '';
    });
    setMarksInputs(initial);
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    if (!marksStudent) return;

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];
    const newMarks = [];
    let totalScore = 0;
    let validCount = 0;
    let hasFail = false;

    subjects.forEach((sub) => {
      const val = (marksInputs[sub] !== undefined ? String(marksInputs[sub]) : '').trim();
      if (val.toUpperCase() === 'AB' || val.toUpperCase() === 'ABSENT') {
        newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
        hasFail = true;
      } else if (val !== '') {
        const num = parseInt(val) || 0;
        let grade = 'F';
        if (num >= 90) grade = 'A+';
        else if (num >= 80) grade = 'A';
        else if (num >= 70) grade = 'B';
        else if (num >= 60) grade = 'C';
        else if (num >= 50) grade = 'D';

        if (num < 50) hasFail = true;
        newMarks.push({ subject: sub, max: 100, scored: num, grade });
        totalScore += num;
        validCount++;
      } else {
        newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
        hasFail = true;
      }
    });

    let newPerformance = 'Absent';
    if (validCount > 0) {
      const avg = totalScore / validCount;
      if (avg >= 90 && !hasFail) newPerformance = 'Outstanding';
      else if (avg >= 75 && !hasFail) newPerformance = 'Very Good';
      else if (avg >= 50) newPerformance = 'Good';
      else newPerformance = 'Needs Improvement';
    }

    const current = getPortalData();
    const idx = current.students.findIndex((s) => s.roll === marksStudent.roll);
    if (idx > -1) {
      current.students[idx].marks = newMarks;
      current.students[idx].performance = newPerformance;
      savePortalData(current);
      refreshData();
    }

    setMarksStudent(null);
    setFeedback({
      title: 'Marks Saved',
      body: `Updated Subject Marks & AB status for ${marksStudent.name} (${marksStudent.roll}).`
    });
  };

  // Class Handlers
  const handleOpenClassModal = (cls = null) => {
    setEditingClass(cls);
    if (cls) {
      setClassForm({ name: cls.name, teacher: cls.teacher, room: cls.room, strength: cls.strength });
    } else {
      setClassForm({ name: '', teacher: '', room: '', strength: 38 });
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (editingClass) {
      const idx = current.classes.findIndex((c) => c.name === editingClass.name);
      if (idx > -1) {
        current.classes[idx].teacher = classForm.teacher;
        current.classes[idx].room = classForm.room;
        current.classes[idx].strength = parseInt(classForm.strength) || 38;
      }
    } else {
      current.classes.push({
        name: classForm.name,
        teacher: classForm.teacher,
        room: classForm.room,
        strength: parseInt(classForm.strength) || 38,
        schoolId: 'SCHOOL002'
      });
    }
    savePortalData(current);
    refreshData();
    setIsClassModalOpen(false);
    setFeedback({
      title: editingClass ? 'Class Updated' : 'Class Created',
      body: `Classroom section ${classForm.name} saved successfully!`
    });
  };

  // Timetable Period Assignment Handlers
  const handleOpenAssignWork = (className, day, period) => {
    const existing = (data.classTimetables || []).find(
      (t) => t.className === className && t.day === day && parseInt(t.period) === period
    );
    setAssignWorkSlot({ className, day, period });
    setAssignWorkForm({
      subject: existing ? existing.subject : '',
      teacherName: existing ? existing.teacherName : (data.teachers[0] ? data.teachers[0].name : '')
    });
  };

  const handleSaveAssignWork = (e) => {
    e.preventDefault();
    if (!assignWorkSlot) return;

    const current = getPortalData();
    if (!current.classTimetables) current.classTimetables = [];

    // Filter out existing slot
    current.classTimetables = current.classTimetables.filter(
      (t) =>
        !(
          t.className === assignWorkSlot.className &&
          t.day === assignWorkSlot.day &&
          parseInt(t.period) === assignWorkSlot.period
        )
    );

    current.classTimetables.push({
      className: assignWorkSlot.className,
      day: assignWorkSlot.day,
      period: assignWorkSlot.period,
      subject: assignWorkForm.subject,
      teacherName: assignWorkForm.teacherName,
      schoolId: 'SCHOOL002'
    });

    savePortalData(current);
    refreshData();
    const slotDesc = `${assignWorkForm.subject} (${assignWorkForm.teacherName}) for ${assignWorkSlot.className} on ${assignWorkSlot.day} Period ${assignWorkSlot.period}`;
    setAssignWorkSlot(null);
    setFeedback({
      title: 'Work Assigned & Live Synced',
      body: `Assigned ${slotDesc}. Work is now live and visible in the Teacher Timetable.`
    });
  };

  const handleClearAssignWork = (className, day, period) => {
    const current = getPortalData();
    if (!current.classTimetables) return;
    current.classTimetables = current.classTimetables.filter(
      (t) => !(t.className === className && t.day === day && parseInt(t.period) === period)
    );
    savePortalData(current);
    refreshData();
    setAssignWorkSlot(null);
    setFeedback({
      title: 'Slot Cleared',
      body: `Period ${period} slot cleared for ${className} on ${day}.`
    });
  };

  // Subject Handlers
  const handleOpenSubjectModal = (sub = null) => {
    setEditingSubject(sub);
    if (sub) {
      setSubjectForm({ code: sub.code, name: sub.name, grade: sub.grade, teacher: sub.teacher });
    } else {
      setSubjectForm({ code: '', name: '', grade: 'Grade 10', teacher: '' });
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (editingSubject) {
      const idx = current.subjects.findIndex((s) => s.code === editingSubject.code);
      if (idx > -1) {
        current.subjects[idx].name = subjectForm.name;
        current.subjects[idx].grade = subjectForm.grade;
        current.subjects[idx].teacher = subjectForm.teacher;
      }
    } else {
      current.subjects.push({
        code: subjectForm.code,
        name: subjectForm.name,
        grade: subjectForm.grade,
        teacher: subjectForm.teacher,
        schoolId: 'SCHOOL002'
      });
    }
    savePortalData(current);
    refreshData();
    setIsSubjectModalOpen(false);
    setFeedback({
      title: editingSubject ? 'Subject Updated' : 'Subject Added',
      body: `Course curriculum ${subjectForm.name} (${subjectForm.code}) saved successfully!`
    });
  };

  // Link Parent Handlers
  const handleSaveLinkParent = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const nextId = 'PAR0' + (current.parents.length + 1);
    const ward = current.students.find((s) => s.roll === linkParentForm.studentRoll);

    current.parents.push({
      id: nextId,
      name: linkParentForm.name,
      relationship: linkParentForm.relationship,
      phone: linkParentForm.phone,
      email: linkParentForm.email,
      studentName: ward ? ward.name : 'Aishwarya Kumar',
      studentRoll: linkParentForm.studentRoll,
      schoolId: 'SCHOOL002'
    });

    savePortalData(current);
    refreshData();
    setIsLinkParentOpen(false);
    setLinkParentForm({ name: '', relationship: 'Father', phone: '', email: '', studentRoll: 'S101' });
    setFeedback({
      title: 'Parent Linked',
      body: `Parent account for ${linkParentForm.name} successfully linked to student ward.`
    });
  };

  // Announcement Handlers
  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    const current = getPortalData();
    current.announcements.unshift({
      date: new Date().toISOString().split('T')[0],
      title: announcementForm.title,
      target: announcementForm.target,
      category: announcementForm.category,
      content: announcementForm.content,
      schoolId: 'SCHOOL002'
    });
    savePortalData(current);
    refreshData();
    setIsAnnouncementOpen(false);
    setAnnouncementForm({ title: '', target: 'All', category: 'General', content: '' });
    setFeedback({
      title: 'Notice Published',
      body: `Announcement circular "${announcementForm.title}" published successfully.`
    });
  };

  // Timetable display constants
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:15 - 11:15' },
    { period: 3, time: '11:30 - 12:30' },
    { period: 4, time: '01:30 - 02:30' },
    { period: 5, time: '02:45 - 03:45' }
  ];

  const selectedClassObj =
    data.classes.find((c) => c.name === selectedClass) ||
    data.classes[0] || { name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', room: 'A-102', strength: 38 };

  const classSlots = (data.classTimetables || []).filter((t) => t.className === selectedClassObj.name);

  return (
    <div>
      {/* Content Header matching portal.html lines 1357-1361 */}
      <div className="content-header">
        <h2 id="section-title">{getTabTitle()}</h2>
        <div id="section-actions">

          {activeTab === 'manage-classes' && (
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenClassModal()}>
              + Add New Class
            </button>
          )}
          {activeTab === 'publish-announcements' && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAnnouncementOpen(true)}>
              + Post Announcement
            </button>
          )}
        </div>
      </div>

      <div id="portal-content">
        {/* =================================================================== */}
        {/* 1. SCHOOL USER MANAGEMENT (school-admin-users) */}
        {/* =================================================================== */}
        {activeTab === 'school-admin-users' && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('ALL')}
                >
                  All Users <span className="sa-tab-badge">{data.users.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('ADMIN')}
                >
                  Admins <span className="sa-tab-badge badge-indigo">{data.users.filter((u) => u.role === 'SCHOOL_ADMIN').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'PRINCIPAL' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('PRINCIPAL')}
                >
                  Principals <span className="sa-tab-badge badge-indigo">{data.users.filter((u) => u.role === 'PRINCIPAL').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'TEACHER' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('TEACHER')}
                >
                  Teachers <span className="sa-tab-badge badge-teal">{data.users.filter((u) => u.role === 'TEACHER').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'STUDENT' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('STUDENT')}
                >
                  Students <span className="sa-tab-badge badge-amber">{data.users.filter((u) => u.role === 'STUDENT').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${userRoleFilter === 'PARENT' ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter('PARENT')}
                >
                  Parents <span className="sa-tab-badge badge-purple">{data.users.filter((u) => u.role === 'PARENT').length}</span>
                </button>
              </div>

              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search by name, role, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddUserOpen(true)}>
                  + Add New User
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table" id="school-users-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '180px' }}>Full Name</th>
                    <th style={{ minWidth: '110px' }}>Role</th>
                    <th style={{ minWidth: '140px' }}>Phone Number</th>
                    <th style={{ minWidth: '190px' }}>Email / Username</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '110px' }}>Created Date</th>
                    <th style={{ minWidth: '140px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users
                    .filter((u) => {
                      let matchRole = true;
                      if (userRoleFilter === 'ADMIN') matchRole = u.role === 'SCHOOL_ADMIN';
                      else if (userRoleFilter === 'PRINCIPAL') matchRole = u.role === 'PRINCIPAL';
                      else if (userRoleFilter === 'TEACHER') matchRole = u.role === 'TEACHER';
                      else if (userRoleFilter === 'STUDENT') matchRole = u.role === 'STUDENT';
                      else if (userRoleFilter === 'PARENT') matchRole = u.role === 'PARENT';

                      const matchSearch =
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.phone && u.phone.includes(userSearch));
                      return matchRole && matchSearch;
                    })
                    .map((u) => {
                      let roleBadgeClass = 'badge-info';
                      if (u.role === 'SCHOOL_ADMIN') roleBadgeClass = 'badge-primary';
                      else if (u.role === 'PRINCIPAL') roleBadgeClass = 'badge-indigo';
                      else if (u.role === 'TEACHER') roleBadgeClass = 'badge-success';
                      else if (u.role === 'STUDENT') roleBadgeClass = 'badge-warning';
                      else if (u.role === 'PARENT') roleBadgeClass = 'badge-purple';

                      return (
                        <tr key={u.id} className="school-user-row">
                          <td data-label="Full Name"><strong>{u.name}</strong></td>
                          <td data-label="Role"><span className={`badge ${roleBadgeClass}`}>{u.role}</span></td>
                          <td data-label="Phone Number"><span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{u.phone || '+91 98401 23456'}</span></td>
                          <td data-label="Email / Username">{u.email || u.username}</td>
                          <td data-label="Status" style={{ textAlign: 'center' }}><span className="badge badge-success">{u.status || 'Active'}</span></td>
                          <td data-label="Created Date">{u.createdDate || '2026-02-15'}</td>
                          <td data-label="Actions" style={{ textAlign: 'right' }}>
                            <div className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                              <button className="sa-tbl-action admin" onClick={() => handleResetPassword(u.name, u.email)}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
                                Reset Password
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 1B. MANAGE PRINCIPAL (manage-principal) */}
        {/* =================================================================== */}
        {activeTab === 'manage-principal' && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search principal by name, email, or qualification..."
                  value={principalSearch}
                  onChange={(e) => setPrincipalSearch(e.target.value)}
                />
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenPrincipalModal()}>
                  + Add Principal
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '100px' }}>Principal ID</th>
                    <th style={{ minWidth: '180px' }}>Principal Name</th>
                    <th style={{ minWidth: '150px' }}>Qualification</th>
                    <th style={{ minWidth: '120px' }}>Experience</th>
                    <th style={{ minWidth: '140px' }}>Phone Number</th>
                    <th style={{ minWidth: '180px' }}>Official Email</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '160px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.principals || [])
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(principalSearch.toLowerCase()) ||
                        p.email.toLowerCase().includes(principalSearch.toLowerCase()) ||
                        (p.qualification && p.qualification.toLowerCase().includes(principalSearch.toLowerCase()))
                    )
                    .map((p) => (
                      <tr key={p.id}>
                        <td data-label="Principal ID"><code>{p.id}</code></td>
                        <td data-label="Principal Name"><strong>{p.name}</strong></td>
                        <td data-label="Qualification"><span className="badge badge-info">{p.qualification || 'Ph.D., M.Ed'}</span></td>
                        <td data-label="Experience">{p.experience || '18 Years'}</td>
                        <td data-label="Phone Number">{p.phone}</td>
                        <td data-label="Official Email">{p.email}</td>
                        <td data-label="Status" style={{ textAlign: 'center' }}>
                          <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                            {p.status || 'Active'}
                          </span>
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'center' }}>
                          <div className="sa-actions-cell" style={{ justifyContent: 'center', gap: '8px' }}>
                            <button className="sa-tbl-action edit" onClick={() => handleOpenPrincipalModal(p)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                              Edit
                            </button>
                            <button className="sa-tbl-action admin" onClick={() => handleResetPassword(p.name, p.email)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
                              Reset Pass
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. MANAGE TEACHERS (manage-teachers) */}
        {/* =================================================================== */}
        {activeTab === 'manage-teachers' && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search faculty by name, ID, or subject..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                />
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenTeacherModal()}>
                  + Add Teacher
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '90px' }}>Faculty ID</th>
                    <th style={{ minWidth: '180px' }}>Faculty Name</th>
                    <th style={{ minWidth: '160px' }}>Primary Subject</th>
                    <th style={{ minWidth: '130px' }}>Assigned Class</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teachers
                    .filter(
                      (t) =>
                        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                        t.id.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                        t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
                    )
                    .map((t) => (
                      <tr key={t.id}>
                        <td data-label="Faculty ID"><code>{t.id}</code></td>
                        <td data-label="Faculty Name"><strong>{t.name}</strong></td>
                        <td data-label="Primary Subject">{t.subject}</td>
                        <td data-label="Assigned Class"><span className="badge badge-info">{t.class}</span></td>
                        <td data-label="Status" style={{ textAlign: 'center' }}><span className="badge badge-success">{t.status || 'Active'}</span></td>
                        <td data-label="Actions" style={{ textAlign: 'center' }}>
                          <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                            <button className="sa-tbl-action edit" onClick={() => handleOpenTeacherModal(t)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. MANAGE STUDENTS (manage-students) */}
        {/* =================================================================== */}
        {activeTab === 'manage-students' && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search students by name, roll, or class..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenStudentModal()}>
                  + Add Student
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '100px' }}>Roll No</th>
                    <th style={{ minWidth: '180px' }}>Student Name</th>
                    <th style={{ minWidth: '110px' }}>Class</th>
                    <th style={{ minWidth: '100px' }}>Attendance</th>
                    <th style={{ minWidth: '130px', textAlign: 'center' }}>Performance</th>
                    <th style={{ minWidth: '160px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.roll.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.class.toLowerCase().includes(studentSearch.toLowerCase())
                    )
                    .map((s) => (
                      <tr key={s.roll}>
                        <td data-label="Roll No"><code>{s.roll}</code></td>
                        <td data-label="Student Name"><strong>{s.name}</strong></td>
                        <td data-label="Class"><span className="badge badge-info">{s.class}</span></td>
                        <td data-label="Attendance"><strong>{s.attendance}</strong></td>
                        <td data-label="Performance" style={{ textAlign: 'center' }}>
                          <span className={`badge ${s.performance === 'Outstanding' || s.performance === 'Very Good' ? 'badge-success' : 'badge-warning'}`}>
                            {s.performance || 'Good'}
                          </span>
                        </td>
                        <td data-label="Action" style={{ textAlign: 'center' }}>
                          <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                            <button className="sa-tbl-action edit" onClick={() => handleOpenStudentModal(s)}>
                              Edit
                            </button>
                            <button className="sa-tbl-action view" onClick={() => handleOpenMarks(s)}>
                              Marks
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. MANAGE PARENTS (manage-parents) */}
        {/* =================================================================== */}
        {activeTab === 'manage-parents' && (
          <div>
            <div className="sa-schools-header-bar">
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', flex: 1, minWidth: '280px' }}>
                Link student profiles to parent contact details and manage parent portal credentials.
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => setIsLinkParentOpen(true)}>
                  + Link Parent
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '180px' }}>Parent Name</th>
                    <th style={{ minWidth: '120px' }}>Relationship</th>
                    <th style={{ minWidth: '140px' }}>Phone Number</th>
                    <th style={{ minWidth: '180px' }}>Contact Email</th>
                    <th style={{ minWidth: '170px' }}>Linked Ward (Student)</th>
                    <th style={{ minWidth: '100px', textAlign: 'center' }}>Portal Access</th>
                    <th style={{ minWidth: '130px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.parents.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Parent Name"><strong>{p.name}</strong></td>
                      <td data-label="Relationship"><span className="badge badge-purple">{p.relationship || 'Guardian'}</span></td>
                      <td data-label="Phone Number"><span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{p.phone}</span></td>
                      <td data-label="Contact Email">{p.email}</td>
                      <td data-label="Linked Ward">
                        <div><strong>{p.studentName}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Roll: {p.studentRoll}</div>
                      </td>
                      <td data-label="Portal Access" style={{ textAlign: 'center' }}><span className="badge badge-success">Approved</span></td>
                      <td data-label="Actions" style={{ textAlign: 'right' }}>
                        <div className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="sa-tbl-action admin" onClick={() => handleResetPassword(p.name, p.email)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
                            Reset Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. MANAGE CLASSES (manage-classes with full period grid & work modal) */}
        {/* =================================================================== */}
        {activeTab === 'manage-classes' && (
          <div>
            <div className="sa-schools-header-bar">
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', flex: 1, minWidth: '280px' }}>
                Select any classroom card to view teacher assignments and edit weekly period timetables.
              </div>
            </div>

            {/* Class Cards Selection Grid */}
            <div className="grid-3" style={{ marginBottom: '25px' }}>
              {data.classes.map((c) => {
                const isSelected = c.name === selectedClassObj.name;
                return (
                  <div
                    key={c.name}
                    className="portal-card"
                    style={{
                      borderLeftColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      background: isSelected ? 'rgba(30,58,138,0.05)' : 'var(--color-bg-white)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedClass(c.name)}
                  >
                    <div className="portal-card-header">
                      <span className="portal-card-title" style={{ color: 'var(--color-primary)' }}>{c.name}</span>
                      <span className={`badge ${isSelected ? 'badge-info' : 'badge-success'}`}>Room {c.room}</span>
                    </div>
                    <p style={{ margin: '4px 0' }}>Class Teacher: <strong>{c.teacher}</strong></p>
                    <p style={{ margin: '4px 0' }}>Strength: <strong>{c.strength} Students</strong></p>
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
                        {isSelected ? 'Currently Selected' : 'Click to View Timetable'}
                      </span>
                      <button
                        className="sa-tbl-action edit"
                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClassModal(c);
                        }}
                      >
                        Edit Class
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Class Timetable Container */}
            <div style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '20px', border: '2px solid rgba(30,58,138,0.12)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                    Timetable & Work Assignments &mdash; {selectedClassObj.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>
                    <span><strong>Class Teacher:</strong> {selectedClassObj.teacher}</span>
                    <span><strong>Room No:</strong> {selectedClassObj.room}</span>
                    <span><strong>Strength:</strong> {selectedClassObj.strength} Students</span>
                  </div>
                </div>
                <small style={{ color: 'var(--color-text-light)' }}>Click any Period slot below to assign/edit Subject & Teacher</small>
              </div>

              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-light)', borderBottom: '2px solid rgba(30,58,138,0.15)' }}>
                      <th style={{ padding: '10px', minWidth: '120px', textAlign: 'left' }}>Time / Period</th>
                      {days.map((d) => (
                        <th key={d} style={{ padding: '10px', minWidth: '110px' }}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((p) => (
                      <tr key={p.period} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td data-label="Period" style={{ padding: '10px', textAlign: 'left', fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(30,58,138,0.02)' }}>
                          <div>Period {p.period}</div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 'normal', color: 'var(--color-text-light)' }}>{p.time}</div>
                        </td>
                        {days.map((day) => {
                          const slot = classSlots.find((s) => s.day === day && parseInt(s.period) === p.period);
                          if (slot) {
                            return (
                              <td key={day} style={{ padding: '6px' }}>
                                <div
                                  style={{ background: 'rgba(37,99,235,0.08)', borderLeft: '3px solid var(--color-primary)', padding: '8px 6px', borderRadius: '4px', textAlign: 'left', cursor: 'pointer' }}
                                  onClick={() => handleOpenAssignWork(selectedClassObj.name, day, p.period)}
                                  title="Click to Edit Work Assignment"
                                >
                                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.82rem' }}>{slot.subject}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>👩‍🏫 {slot.teacherName}</div>
                                </div>
                              </td>
                            );
                          } else {
                            return (
                              <td key={day} style={{ padding: '6px' }}>
                                <div
                                  style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.12)', padding: '8px 6px', borderRadius: '4px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}
                                  onClick={() => handleOpenAssignWork(selectedClassObj.name, day, p.period)}
                                  title="Click to Assign Work"
                                >
                                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+ Assign Work</span>
                                </div>
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. MANAGE SUBJECTS (manage-subjects) */}
        {/* =================================================================== */}
        {activeTab === 'manage-subjects' && (
          <div>
            <div className="sa-schools-header-bar">
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', flex: 1, minWidth: '280px' }}>
                Manage official courses, syllabus codes, and lead faculty instructors.
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenSubjectModal()}>
                  + Add Subject
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '100px' }}>Course Code</th>
                    <th style={{ minWidth: '180px' }}>Subject Title</th>
                    <th style={{ minWidth: '120px' }}>Grade Level</th>
                    <th style={{ minWidth: '180px' }}>Lead Faculty</th>
                    <th style={{ minWidth: '110px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjects.map((s) => (
                    <tr key={s.code}>
                      <td data-label="Course Code"><code>{s.code}</code></td>
                      <td data-label="Subject Title"><strong>{s.name}</strong></td>
                      <td data-label="Grade Level"><span className="badge badge-info">{s.grade}</span></td>
                      <td data-label="Lead Faculty">{s.teacher}</td>
                      <td data-label="Action" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                          <button className="sa-tbl-action edit" onClick={() => handleOpenSubjectModal(s)}>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. PUBLISH ANNOUNCEMENTS (publish-announcements) */}
        {/* =================================================================== */}
        {activeTab === 'publish-announcements' && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                {['All', 'Academic', 'Sports', 'General'].map((cat) => (
                  <button
                    key={cat}
                    className={`sa-filter-tab ${announcementCategory === cat ? 'active' : ''}`}
                    onClick={() => setAnnouncementCategory(cat)}
                  >
                    {cat === 'All' ? 'All Notices' : cat}
                  </button>
                ))}
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => setIsAnnouncementOpen(true)}>
                  + Post Announcement
                </button>
              </div>
            </div>

            <div id="announcement-list">
              {(data.announcements || [])
                .filter((a) => announcementCategory === 'All' || a.category === announcementCategory)
                .map((a, idx) => (
                  <div key={idx} className="portal-card announcement-card" data-category={a.category || 'General'}>
                    <div className="portal-card-header">
                      <span className="portal-card-title">{a.title}</span>
                      <div>
                        <span className="badge badge-info" style={{ marginRight: '6px' }}>{a.category || 'Notice'}</span>
                        <span className="badge badge-warning">{a.date}</span>
                      </div>
                    </div>
                    <p>{a.content}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '10px' }}>
                      Target Audience: <strong>{a.target}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 8. SCHOOL REPORTS (view-reports) */}
        {/* =================================================================== */}
        {activeTab === 'view-reports' && (
          <div className="grid-2">
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
              <div className="portal-card-title">Enrollment Statistics 2026-27</div>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0', color: 'var(--color-primary)' }}>482 Students</p>
              <p>Total applications processed: 110 (+15% YoY)</p>
            </div>
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-success)' }}>
              <div className="portal-card-title">Average Daily Attendance</div>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0', color: 'var(--color-success)' }}>94.8%</p>
              <p>Target: 95.0% | Peak attendance: Monday</p>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 9. SECURE MESSAGING (secure-messaging) */}
        {/* =================================================================== */}
        {activeTab === 'secure-messaging' && <ChatBox />}
      </div>

      {/* =================================================================== */}
      {/* MODALS */}
      {/* =================================================================== */}

      {/* 1. Add User Modal */}
      {isAddUserOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Register New School User</h3>
              <button className="modal-close" onClick={() => setIsAddUserOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Add User Profile</h4>
                    <p>Create credentials and role assignment for this campus.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Lakshmi Narayanan"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Role <span className="req">*</span></label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    >
                      <option value="TEACHER">Teacher</option>
                      <option value="STUDENT">Student</option>
                      <option value="PARENT">Parent</option>
                      <option value="SCHOOL_ADMIN">School Admin</option>
                      <option value="PRINCIPAL">Principal</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98401 23456"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Email Address <span className="req">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="user@ssvschool.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddUserOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save User ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add / Edit Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingTeacher ? 'Edit Faculty Member' : 'Register Faculty Member'}</h3>
              <button className="modal-close" onClick={() => setIsTeacherModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveTeacher}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>{editingTeacher ? 'Update Faculty Record' : 'Register New Faculty'}</h4>
                    <p>Maintain teacher identity, primary subject mastery, and classroom assignment.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Teacher Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Priya Krishnan"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Primary Teaching Subject <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics / Physics"
                      value={teacherForm.subject}
                      onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Assigned Classroom / Section <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grade 10-A"
                      value={teacherForm.class}
                      onChange={(e) => setTeacherForm({ ...teacherForm, class: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsTeacherModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
                  {editingTeacher ? 'Update Faculty Record ✓' : 'Add Faculty Member ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add / Edit Student Modal */}
      {isStudentModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student Record' : 'Enroll New Student'}</h3>
              <button className="modal-close" onClick={() => setIsStudentModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveStudent}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>{editingStudent ? 'Update Student Record' : 'Student Enrollment Profile'}</h4>
                    <p>Maintain academic registration, class section allocation, and student status.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Student Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aishwarya Kumar"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Grade / Class Section <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grade 10-A"
                      value={studentForm.class}
                      onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Roll / Admission No.</label>
                    <input
                      type="text"
                      disabled
                      value={editingStudent ? editingStudent.roll : 'Auto-generated upon save'}
                      style={{ background: '#f1f5f9', color: '#64748b' }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsStudentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
                  {editingStudent ? 'Update Student Record ✓' : 'Enroll Student ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Class Modal */}
      {isClassModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingClass ? 'Edit Class Section' : 'Create Class Section'}</h3>
              <button className="modal-close" onClick={() => setIsClassModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveClass}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>{editingClass ? 'Update Classroom Section' : 'Add Class Section'}</h4>
                    <p>Assign section name, class teacher in charge, and physical room number.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Class / Section Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grade 10-A"
                      disabled={!!editingClass}
                      value={classForm.name}
                      onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                      style={editingClass ? { background: '#f1f5f9', color: '#64748b' } : {}}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Assigned Class Teacher <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Priya Krishnan"
                      value={classForm.teacher}
                      onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Physical Room No. <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room 204"
                      value={classForm.room}
                      onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Maximum Student Capacity <span className="req">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={classForm.strength}
                      onChange={(e) => setClassForm({ ...classForm, strength: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsClassModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save Class Section ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Assign Work / Period Timetable Slot Modal */}
      {assignWorkSlot && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Assign Period Work &mdash; {assignWorkSlot.className}</h3>
              <button className="modal-close" onClick={() => setAssignWorkSlot(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveAssignWork}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Assign Timetable Period & Faculty</h4>
                    <p>Schedule subject class and designated teacher for the timetable schedule.</p>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.88rem', alignItems: 'center' }}>
                  <span>Class Standard: <strong style={{ color: 'var(--color-primary)' }}>{assignWorkSlot.className}</strong></span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span>Day: <strong>{assignWorkSlot.day}</strong></span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span>Time Slot: <span className="badge badge-info">Period {assignWorkSlot.period}</span></span>
                </div>

                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Subject Course Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics, Physics, Chemistry"
                      value={assignWorkForm.subject}
                      onChange={(e) => setAssignWorkForm({ ...assignWorkForm, subject: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Designated Faculty Instructor <span className="req">*</span></label>
                    <select
                      required
                      value={assignWorkForm.teacherName}
                      onChange={(e) => setAssignWorkForm({ ...assignWorkForm, teacherName: e.target.value })}
                    >
                      {data.teachers.map((t) => (
                        <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ color: '#dc2626', borderColor: '#dc2626' }}
                  onClick={() => handleClearAssignWork(assignWorkSlot.className, assignWorkSlot.day, assignWorkSlot.period)}
                >
                  Clear Slot
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setAssignWorkSlot(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save Assignment ✓</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Subject Modal */}
      {isSubjectModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingSubject ? 'Edit Curriculum Subject' : 'Add Curriculum Subject'}</h3>
              <button className="modal-close" onClick={() => setIsSubjectModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveSubject}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>{editingSubject ? 'Update Subject Syllabus' : 'Register Subject Curriculum'}</h4>
                    <p>Setup subject code, official course title, standard grade, and lead instructor.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Subject Code <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MAT101"
                      disabled={!!editingSubject}
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      style={editingSubject ? { background: '#f1f5f9', color: '#64748b' } : {}}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Subject Title <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advanced Mathematics"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Target Grade / Standard <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grade 10"
                      value={subjectForm.grade}
                      onChange={(e) => setSubjectForm({ ...subjectForm, grade: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Lead Instructor / Faculty <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Priya Krishnan"
                      value={subjectForm.teacher}
                      onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsSubjectModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save Subject Setup ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Link Parent Modal */}
      {isLinkParentOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Link Parent to Student Profile</h3>
              <button className="modal-close" onClick={() => setIsLinkParentOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveLinkParent}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Parent Relationship & Access</h4>
                    <p>Connect student ward record to authorized parent contact credentials.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field">
                    <label>Parent Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={linkParentForm.name}
                      onChange={(e) => setLinkParentForm({ ...linkParentForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Relationship <span className="req">*</span></label>
                    <select
                      value={linkParentForm.relationship}
                      onChange={(e) => setLinkParentForm({ ...linkParentForm, relationship: e.target.value })}
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Phone Number <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98401 99009"
                      value={linkParentForm.phone}
                      onChange={(e) => setLinkParentForm({ ...linkParentForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Contact Email <span className="req">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="parent@gmail.com"
                      value={linkParentForm.email}
                      onChange={(e) => setLinkParentForm({ ...linkParentForm, email: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Linked Student Ward <span className="req">*</span></label>
                    <select
                      value={linkParentForm.studentRoll}
                      onChange={(e) => setLinkParentForm({ ...linkParentForm, studentRoll: e.target.value })}
                    >
                      {data.students.map((s) => (
                        <option key={s.roll} value={s.roll}>{s.name} ({s.roll} - {s.class})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsLinkParentOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Link Parent Profile ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Marks Evaluation Modal */}
      {marksStudent && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Academic Marks &mdash; {marksStudent.name} ({marksStudent.roll})</h3>
              <button className="modal-close" onClick={() => setMarksStudent(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveMarks}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Academic Evaluation & Marks Entry</h4>
                    <p>Record exam marks or assign Absent (AB) designation for official evaluation.</p>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Student Name</span><strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>{marksStudent.name}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Roll Number</span><code style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 700 }}>{marksStudent.roll}</code></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Standard Class</span><span className="badge badge-info">{marksStudent.class}</span></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Current Standing</span><span className="badge badge-success">{marksStudent.performance || 'Good'}</span></div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', marginBottom: '14px' }}>
                  💡 Enter score (0-100) for each subject or click <strong>Mark AB</strong> if student was absent.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'].map((sub) => (
                    <div key={sub} className="wizard-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.88rem' }}>📚 {sub}</label>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, background: '#e2e8f0', padding: '2px 8px', borderRadius: '10px' }}>Max: 100</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="0-100 or AB"
                          value={marksInputs[sub] !== undefined ? marksInputs[sub] : ''}
                          onChange={(e) => setMarksInputs({ ...marksInputs, [sub]: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setMarksInputs({ ...marksInputs, [sub]: 'AB' })}
                          style={{ whiteSpace: 'nowrap', padding: '7px 12px', fontSize: '0.78rem', borderColor: '#ef4444', color: '#ef4444', fontWeight: 600 }}
                        >
                          Mark AB
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setMarksStudent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save All Subject Marks ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Post Announcement Modal */}
      {isAnnouncementOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Post Campus Announcement</h3>
              <button className="modal-close" onClick={() => setIsAnnouncementOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveAnnouncement}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Broadcast Circular / Notice</h4>
                    <p>Publish an official notice to students, teachers, or parents across this campus.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Notice Headline / Title <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual Sports Meet 2026 - Schedule Released"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Target Audience <span className="req">*</span></label>
                    <select
                      value={announcementForm.target}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                    >
                      <option value="All">All Campus Stakeholders</option>
                      <option value="Students">Students Only</option>
                      <option value="Teachers">Faculty & Staff</option>
                      <option value="Parents">Parents Only</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Notice Category <span className="req">*</span></label>
                    <select
                      value={announcementForm.category}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                    >
                      <option value="General">General Campus Notice</option>
                      <option value="Academic">Academic / Examinations</option>
                      <option value="Sports">Sports & Cultural Events</option>
                      <option value="Holidays">Official Holidays</option>
                    </select>
                  </div>
                  <div className="wizard-field span-2">
                    <label>Detailed Announcement Notice <span className="req">*</span></label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Enter the complete circular information text..."
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontFamily: 'inherit', fontSize: '0.9rem' }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAnnouncementOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Publish Announcement ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Add / Edit Principal Modal */}
      {isPrincipalModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingPrincipal ? 'Edit Principal Profile' : 'Register School Principal'}</h3>
              <button className="modal-close" onClick={() => setIsPrincipalModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSavePrincipal}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>{editingPrincipal ? 'Update Principal Details' : 'Register School Principal'}</h4>
                    <p>Maintain school leadership credentials, qualification, and contact details.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Principal Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Savithri Raman"
                      value={principalForm.name}
                      onChange={(e) => setPrincipalForm({ ...principalForm, name: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Academic Qualification <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ph.D., M.Ed, M.Sc"
                      value={principalForm.qualification}
                      onChange={(e) => setPrincipalForm({ ...principalForm, qualification: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Leadership Experience <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18 Years"
                      value={principalForm.experience}
                      onChange={(e) => setPrincipalForm({ ...principalForm, experience: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Official Contact Phone <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98401 23450"
                      value={principalForm.phone}
                      onChange={(e) => setPrincipalForm({ ...principalForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Official Email Address <span className="req">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="principal@ssvschool.com"
                      value={principalForm.email}
                      onChange={(e) => setPrincipalForm({ ...principalForm, email: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Account Status <span className="req">*</span></label>
                    <select
                      value={principalForm.status}
                      onChange={(e) => setPrincipalForm({ ...principalForm, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsPrincipalModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
                  {editingPrincipal ? 'Save Changes ✓' : 'Register Principal ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Feedback Modal */}
      {feedback && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '30px 24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{feedback.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px', whiteSpace: 'pre-line' }}>{feedback.body}</p>
            <button className="btn btn-primary" onClick={() => setFeedback(null)} style={{ padding: '8px 30px', borderRadius: '50px' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
