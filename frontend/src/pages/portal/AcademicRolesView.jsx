import React, { useState, useEffect } from 'react';
import {
  getPortalData,
  savePortalData
} from '../../services/portalData';
import ChatBox from './ChatBox';

export default function AcademicRolesView({ role, user, activeTab }) {
  const [data, setData] = useState(getPortalData());
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [marksStudent, setMarksStudent] = useState(null);
  const [marksInputs, setMarksInputs] = useState({});
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    grade: 'Grade 10-A',
    due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    instructions: ''
  });
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    target: 'All',
    category: 'General',
    content: ''
  });

  // Roll call state for attendance management
  const [rollCall, setRollCall] = useState({
    S101: 'present',
    S102: 'present',
    S103: 'present',
    S104: 'present',
    S105: 'present'
  });

  // Feedback modal
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
      'attendance-reports': 'Attendance Reports',
      'academic-performance': 'Academic Performance',
      'school-announcements': 'School Announcements',
      'communication-teachers': 'Communication with Teachers',
      'school-reports': 'School Reports',
      'dashboard-analytics': 'Dashboard Analytics',
      'my-classes': 'My Classes',
      'student-list': 'Student List',
      'attendance-management': 'Attendance Management',
      'assignments': 'Homework & Assignments',
      'study-materials': 'Study Materials',
      'announcements': 'Announcements',
      'secure-messaging': 'Secure Messaging',
      'timetable': 'Timetable',
      'view-dashboard': 'View Dashboard',
      'check-attendance': 'Check Attendance',
      'view-timetable': 'View Timetable',
      'download-materials': 'Study Materials',
      'submit-assignments': 'Submit Homework & Assignments',
      'view-homework': 'View Homework',
      'receive-announcements': 'Announcements',
      'chat-teachers': 'Chat with Teachers',
      'track-exams': 'Track Upcoming Exams',
      'child-information': 'Child Information',
      'attendance-tracking': 'Attendance Tracking',
      'homework': 'Homework & Assignments',
      'exam-results': 'Exam Results',
      'fee-reminders': 'Fee Reminders',
      'messaging-teachers': 'Messaging with Teachers'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Marks modal handlers
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
    const studentIdx = current.students.findIndex((s) => s.roll === marksStudent.roll);
    if (studentIdx > -1) {
      current.students[studentIdx].marks = newMarks;
      current.students[studentIdx].performance = newPerformance;
      savePortalData(current);
      refreshData();
    }

    setMarksStudent(null);
    setFeedback({
      title: 'Marks Saved Successfully',
      body: `Updated Subject Marks & AB status for ${marksStudent.name} (${marksStudent.roll}).`
    });
  };

  // Homework submission & deletion
  const handleSaveHomework = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const newHw = {
      id: 'HW0' + (current.assignments.length + 1),
      title: homeworkForm.title,
      grade: homeworkForm.grade,
      due: homeworkForm.due,
      instructions: homeworkForm.instructions,
      subject: 'Mathematics',
      assignedBy: user?.name || 'Mrs. Priya Krishnan',
      schoolId: 'SCHOOL002',
      assignedDate: new Date().toISOString().split('T')[0]
    };
    current.assignments.unshift(newHw);
    savePortalData(current);
    refreshData();
    setIsHomeworkOpen(false);
    setHomeworkForm({
      title: '',
      grade: 'Grade 10-A',
      due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      instructions: ''
    });
    setFeedback({
      title: 'Homework Assigned',
      body: `"${newHw.title}" has been published to ${newHw.grade}.`
    });
  };

  const handleDeleteHomework = (hwId) => {
    if (window.confirm('Delete this homework assignment?')) {
      const current = getPortalData();
      current.assignments = current.assignments.filter((h) => h.id !== hwId);
      savePortalData(current);
      refreshData();
    }
  };

  // Announcement posting
  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const newAnn = {
      date: new Date().toISOString().split('T')[0],
      title: announcementForm.title,
      target: announcementForm.target,
      category: announcementForm.category,
      content: announcementForm.content,
      schoolId: 'SCHOOL002'
    };
    current.announcements.unshift(newAnn);
    savePortalData(current);
    refreshData();
    setIsAnnouncementOpen(false);
    setAnnouncementForm({
      title: '',
      target: 'All',
      category: 'General',
      content: ''
    });
    setFeedback({
      title: 'Notice Published',
      body: `"${newAnn.title}" circular has been broadcast to ${newAnn.target}.`
    });
  };

  // Shared Timetable Constants
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:15 - 11:15' },
    { period: 3, time: '11:30 - 12:30' },
    { period: 4, time: '01:30 - 02:30' },
    { period: 5, time: '02:45 - 03:45' }
  ];

  const teacherSlots = (data.classTimetables || []).filter(
    (t) => t.teacherName === 'Mrs. Priya Krishnan' || t.className === 'Grade 10-A'
  );

  return (
    <div>
      {/* Top Content Header matching portal.html lines 1357-1361 */}
      <div className="content-header">
        <h2 id="section-title">{getTabTitle()}</h2>
        <div id="section-actions">
          {activeTab === 'attendance-management' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setFeedback({
                  title: 'Attendance Recorded',
                  body: 'Daily attendance logs have been recorded and synced with campus register.'
                })
              }
            >
              Submit Attendance
            </button>
          )}
          {activeTab === 'assignments' && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsHomeworkOpen(true)}>
              + Give Homework
            </button>
          )}
          {(activeTab === 'school-announcements' || activeTab === 'announcements') && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAnnouncementOpen(true)}>
              + Post Announcement
            </button>
          )}
        </div>
      </div>

      <div id="portal-content">
        {/* =================================================================== */}
        {/* PRINCIPAL DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'principal' && activeTab === 'attendance-reports' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Daily Attendance Overview &mdash; Today ({new Date().toLocaleDateString()})
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Class / Section</th>
                    <th>Total Students</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grade 10-A</strong></td>
                    <td>38</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>36</span></td>
                    <td><span style={{ color: '#dc2626', fontWeight: 700 }}>2</span></td>
                    <td><span className="badge badge-success">94.7%</span></td>
                  </tr>
                  <tr>
                    <td><strong>Grade 11-B</strong></td>
                    <td>40</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>39</span></td>
                    <td><span style={{ color: '#dc2626', fontWeight: 700 }}>1</span></td>
                    <td><span className="badge badge-success">97.5%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'principal' && activeTab === 'academic-performance' && (
          <div>
            <div className="portal-card">
              <div className="portal-card-title">Secondary Board Exam Preparation</div>
              <p>Mock exams result average: <strong>89.4% passing rate</strong> with 32 students in Grade 10 achieving distinctions.</p>
            </div>
          </div>
        )}

        {role === 'principal' && activeTab === 'school-reports' && (
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

        {role === 'principal' && activeTab === 'dashboard-analytics' && (
          <div>
            <h3>Key Performance Indicators</h3>
            <div className="grid-3" style={{ marginTop: '20px' }}>
              <div className="portal-card">
                <h4>Total Teachers</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>34 Professional Staff</p>
              </div>
              <div className="portal-card">
                <h4>STEM Stream Ratio</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>68% of Students</p>
              </div>
              <div className="portal-card">
                <h4>Parent App Active</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-success)' }}>91.5% Active</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TEACHER DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'teacher' && activeTab === 'my-classes' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <span className="portal-card-title">Grade 10-A (Mathematics)</span>
              <span className="badge badge-success">Active</span>
            </div>
            <p>Class representative: <strong>Aishwarya Kumar</strong></p>
            <p>Class Room: A-102 | Timetable: Mon, Wed, Fri (9:30 AM - 10:30 AM)</p>
          </div>
        )}

        {role === 'teacher' && activeTab === 'student-list' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <button className="sa-filter-tab active">
                  Assigned: Grade 10-A
                  <span className="sa-filter-count">{data.students.filter((s) => s.class === 'Grade 10-A').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Filter class students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table" id="class-students-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Assigned Grade</th>
                    <th>Midterm Rating</th>
                    <th style={{ textAlign: 'right' }}>Marks Entry</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students
                    .filter(
                      (s) =>
                        s.class === 'Grade 10-A' &&
                        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((s) => (
                      <tr key={s.roll}>
                        <td><strong>{s.roll}</strong></td>
                        <td>{s.name}</td>
                        <td>{s.class}</td>
                        <td>
                          <span
                            className={`badge ${
                              s.performance === 'Outstanding' || s.performance === 'Very Good'
                                ? 'badge-success'
                                : s.performance === 'Good'
                                ? 'badge-primary'
                                : 'badge-warning'
                            }`}
                          >
                            {s.performance || 'Outstanding'}
                          </span>
                        </td>
                        <td className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="sa-tbl-action edit" onClick={() => handleOpenMarks(s)}>
                            Enter Marks
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'teacher' && activeTab === 'attendance-management' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Roll Call & Attendance Logging — Grade 10-A
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th style={{ textAlign: 'center' }}>Present</th>
                    <th style={{ textAlign: 'center' }}>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students
                    .filter((s) => s.class === 'Grade 10-A')
                    .map((s) => (
                      <tr key={s.roll}>
                        <td><strong>{s.name}</strong></td>
                        <td><code>{s.roll}</code></td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="radio"
                            name={`att-${s.roll}`}
                            checked={rollCall[s.roll] === 'present'}
                            onChange={() => setRollCall((prev) => ({ ...prev, [s.roll]: 'present' }))}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="radio"
                            name={`att-${s.roll}`}
                            checked={rollCall[s.roll] === 'absent'}
                            onChange={() => setRollCall((prev) => ({ ...prev, [s.roll]: 'absent' }))}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'teacher' && activeTab === 'assignments' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <button className="sa-filter-tab active">
                  All Assignments
                  <span className="sa-filter-count">{data.assignments.length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search homework..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table" id="assignments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Due Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignments
                    .filter(
                      (hw) =>
                        hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hw.grade.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((hw) => (
                      <tr key={hw.id}>
                        <td><strong>{hw.id}</strong></td>
                        <td>{hw.title}</td>
                        <td><span className="badge badge-info">{hw.grade}</span></td>
                        <td><span className="badge badge-warning">{hw.due}</span></td>
                        <td className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="sa-tbl-action danger" onClick={() => handleDeleteHomework(hw.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(role === 'teacher' || role === 'student') && (activeTab === 'study-materials' || activeTab === 'download-materials') && (
          <div className="portal-card">
            <div className="portal-card-header">
              <strong>Trigonometry Practice Sheet.pdf</strong>
              <span className="badge badge-info">PDF</span>
            </div>
            <p>Class resource uploaded by Mrs. Priya Krishnan.</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                setFeedback({
                  title: 'Download Study Material',
                  body: 'Downloading Trigonometry Practice Sheet.pdf (2.4 MB)...'
                })
              }
            >
              Download File ↓
            </button>
          </div>
        )}

        {role === 'teacher' && activeTab === 'timetable' && (
          <div>
            <div className="portal-card" style={{ marginBottom: '20px', borderLeftColor: 'var(--color-primary)', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ color: 'var(--color-primary)', margin: '0 0 4px 0' }}>Weekly Timetable — Mrs. Priya Krishnan</h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-light)' }}>
                    Primary Subject: <strong>Mathematics</strong> | Assigned Class: <strong>Grade 10-A</strong>
                  </p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>
                  Total Assigned Classes: {teacherSlots.length} Periods
                </span>
              </div>
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
                        const slot = teacherSlots.find((s) => s.day === day && parseInt(s.period) === p.period);
                        if (slot) {
                          return (
                            <td key={day} data-label={`${day} Period ${p.period}`} style={{ padding: '6px' }}>
                              <div style={{ background: '#dcfce7', borderLeft: '3px solid #10b981', padding: '8px 6px', borderRadius: '4px', textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, color: '#047857', fontSize: '0.82rem' }}>{slot.className}</div>
                                <div style={{ fontSize: '0.75rem', color: '#065f46' }}>{slot.subject}</div>
                              </div>
                            </td>
                          );
                        } else {
                          return (
                            <td key={day} data-label={`${day} Period ${p.period}`} style={{ padding: '6px' }}>
                              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)', padding: '8px 6px', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                                <em>Free Period</em>
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
        )}

        {/* =================================================================== */}
        {/* STUDENT DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'student' && activeTab === 'view-dashboard' && (
          <div className="grid-2">
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
              <h4>My Attendance Rate</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '10px 0' }}>96.2%</p>
              <p>Exceeds standard requirement.</p>
            </div>
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-success)' }}>
              <h4>Pending Assignments</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', margin: '10px 0' }}>2 Tasks</p>
              <p>Next due: Algebra Exercise</p>
            </div>
          </div>
        )}

        {(role === 'student' || role === 'parent') && (activeTab === 'check-attendance' || activeTab === 'attendance-tracking') && (
          <div className="portal-card">
            <div className="portal-card-title">Attendance Tracking Logs</div>
            <p>Total school days: 90 | Present days: 86.5 | Absent days: 3.5</p>
          </div>
        )}

        {role === 'student' && activeTab === 'view-timetable' && (
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
                      const slot = (data.classTimetables || []).find((s) => s.className === 'Grade 10-A' && s.day === day && parseInt(s.period) === p.period);
                      return (
                        <td key={day} style={{ padding: '6px' }}>
                          {slot ? (
                            <div style={{ background: 'rgba(37,99,235,0.08)', borderLeft: '3px solid var(--color-primary)', padding: '8px 6px', borderRadius: '4px', textAlign: 'left' }}>
                              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.82rem' }}>{slot.subject}</div>
                              <div style={{ fontSize: '0.75rem', color: '#475569' }}>{slot.teacherName}</div>
                            </div>
                          ) : (
                            <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)', padding: '8px 6px', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                              <em>Study Hall</em>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {role === 'student' && activeTab === 'submit-assignments' && (
          <div className="wizard-form-box" style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Submit Student Assignment</h4>
                <p>Upload completed exercise solutions, homework docs, or project files for grading.</p>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFeedback({
                  title: 'Assignment Submitted',
                  body: 'Your assignment solution file has been uploaded successfully!'
                });
              }}
            >
              <div className="wizard-grid-2">
                <div className="wizard-field span-2">
                  <label>Select Assignment / Subject <span className="req">*</span></label>
                  <select required>
                    <option value="Algebra Equations Exercise">Mathematics — Algebra Equations Exercise (Due: 2026-07-28)</option>
                    <option value="Newton Laws Lab Report">Physics — Newton Laws Experiment Report (Due: 2026-07-30)</option>
                    <option value="English Essay">English — Modern Poetry Analytical Essay (Due: 2026-08-02)</option>
                  </select>
                </div>
                <div className="wizard-field span-2">
                  <label>Upload Document / Solution File <span className="req">*</span></label>
                  <input type="file" required style={{ padding: '10px', border: '2px dashed #cbd5e1', background: '#f8fafc', borderRadius: '8px', width: '100%' }} />
                  <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>Accepted formats: PDF, DOCX, JPG, PNG (Max size: 15MB)</small>
                </div>
                <div className="wizard-field span-2">
                  <label>Student Notes / Comments (Optional)</label>
                  <textarea rows="3" placeholder="Provide any additional comments or context for your instructor..."></textarea>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '9px 24px' }}>
                  Upload & Submit Assignment ✓
                </button>
              </div>
            </form>
          </div>
        )}

        {(role === 'student' || role === 'parent') && (activeTab === 'view-homework' || activeTab === 'homework') && (
          <div className="portal-card">
            <h4>Algebra Equations Exercise</h4>
            <p>Due: 2026-07-28 | Subject: Mathematics</p>
            <p>Solve exercises 3.1 to 3.4 in notebook.</p>
          </div>
        )}

        {role === 'student' && activeTab === 'receive-announcements' && (
          <div className="portal-card">
            <h4>Independence Day Celebrations</h4>
            <p>Flag hoisting ceremony starts at 8:00 AM on August 15.</p>
          </div>
        )}

        {role === 'student' && activeTab === 'track-exams' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Upcoming Examinations Schedule
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Date</th>
                    <th>Max Marks</th>
                    <th>Pass Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Mathematics (Paper-I)</strong></td>
                    <td>2026-09-10</td>
                    <td>100</td>
                    <td>35</td>
                    <td><span className="badge badge-success">Scheduled</span></td>
                  </tr>
                  <tr>
                    <td><strong>Science & Experiments</strong></td>
                    <td>2026-09-12</td>
                    <td>100</td>
                    <td>35</td>
                    <td><span className="badge badge-success">Scheduled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PARENT DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'parent' && activeTab === 'child-information' && (
          <div className="portal-card">
            <div className="portal-card-title">Student Profile Summary</div>
            <p><strong>Name:</strong> Aishwarya Kumar</p>
            <p><strong>Class:</strong> Grade 10-A (Roll No: S101)</p>
            <p><strong>Emergency Contact:</strong> Ramesh Kumar (+91 98456 12301)</p>
          </div>
        )}

        {role === 'parent' && activeTab === 'exam-results' && (
          <div>
            <div className="portal-card" style={{ marginBottom: '20px' }}>
              <h4>Exam Results — Aishwarya Kumar (96.5% Distinction)</h4>
              <p>Mathematics: 98/100 (A+) | Physics: 92/100 (A+) | Chemistry: 86/100 (A)</p>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Max Marks</th>
                    <th>Scored Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.students[0]?.marks || []).map((m, idx) => (
                    <tr key={idx}>
                      <td><strong>{m.subject}</strong></td>
                      <td>{m.max}</td>
                      <td><strong>{m.scored}</strong></td>
                      <td><span className="badge badge-success">{m.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'parent' && activeTab === 'fee-reminders' && (
          <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
            <div className="portal-card-header">
              <strong>Term-II School Fee</strong>
              <span className="badge badge-warning">Due: 2026-08-10</span>
            </div>
            <p>Total Due: <strong>₹12,500/-</strong></p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setFeedback({
                  title: 'Fee Payment',
                  body: 'Receipt generated for ₹12,500/-. Official acknowledgement sent to registered phone.'
                })
              }
            >
              Pay Securely Online
            </button>
          </div>
        )}

        {/* SHARED ANNOUNCEMENTS TABS (Principal, Teacher, Parent) */}
        {(activeTab === 'school-announcements' || activeTab === 'announcements') && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                {['All', 'Academic', 'Sports', 'General'].map((cat) => (
                  <button
                    key={cat}
                    className={`sa-filter-tab ${filterCategory === cat ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat === 'All' ? 'All Notices' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div id="announcement-list">
              {data.announcements
                .filter((a) => filterCategory === 'All' || a.category === filterCategory)
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

        {/* SHARED CHAT MESSAGING TABS */}
        {(activeTab === 'communication-teachers' ||
          activeTab === 'chat-teachers' ||
          activeTab === 'messaging-teachers' ||
          activeTab === 'secure-messaging') && (
          <ChatBox />
        )}
      </div>

      {/* =================================================================== */}
      {/* MODALS */}
      {/* =================================================================== */}

      {/* 1. Academic Evaluation & Marks Entry Modal */}
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
                  Enter score (0-100) for each subject or click <strong>Mark AB</strong> if student was absent.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'].map((sub) => (
                    <div key={sub} className="wizard-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.88rem' }}>{sub}</label>
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

      {/* 2. Homework Form Modal */}
      {isHomeworkOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Give New Homework Assignment</h3>
              <button className="modal-close" onClick={() => setIsHomeworkOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveHomework}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Assign Homework & Tasks</h4>
                    <p>Publish homework assignment, instructions, and target submission deadline.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Assignment Headline / Topic <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Chapter 4 Trigonometry Problem Set (Q1 - Q15)"
                      required
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Target Classroom / Section <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      value={homeworkForm.grade}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, grade: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Submission Due Date <span className="req">*</span></label>
                    <input
                      type="date"
                      required
                      value={homeworkForm.due}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, due: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Instructions & Resource Guidelines <span className="req">*</span></label>
                    <textarea
                      rows="4"
                      placeholder="Detail the step-by-step instructions or chapters to study..."
                      required
                      value={homeworkForm.instructions}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, instructions: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsHomeworkOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Post Homework Assignment ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Post Announcement Modal */}
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
                      placeholder="e.g. Annual Sports Meet 2026 - Schedule Released"
                      required
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
                    <label>Notice Category</label>
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
                      placeholder="Enter the complete circular information text..."
                      required
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
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

      {/* 4. Feedback Modal */}
      {feedback && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '30px 24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{feedback.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px' }}>{feedback.body}</p>
            <button className="btn btn-primary" onClick={() => setFeedback(null)} style={{ padding: '8px 30px', borderRadius: '50px' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
