import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesCatalog, courseModules } from '../../../services/mockData';

export default function LearningPage() {
  const { courseId } = useParams();
  
  const courseInfo = coursesCatalog.find(c => c.slug === courseId);
  const curriculum = courseModules[0][courseId] || [];
  
  const track = courseInfo ? {
    id: courseInfo.slug,
    title: courseInfo.title,
    curriculum: curriculum
  } : null;

  // Get first lesson as default
  const defaultLesson = track?.curriculum?.[0]?.lessons?.[0];

  // States
  const [activeLesson, setActiveLesson] = useState(defaultLesson);
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({});

  if (!track || !defaultLesson) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger max-w-md mx-auto" role="alert">
          Course content not loaded or track does not exist.
        </div>
        <Link to="/courses" className="btn btn-desert-primary mt-3">Back to Courses</Link>
      </div>
    );
  }

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes(prev => [
      ...prev,
      { id: Date.now(), lessonTitle: activeLesson.title, text: userNote }
    ]);
    setUserNote('');
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const toggleLessonCompletion = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Calculate overall progress
  const totalLessons = track.curriculum.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const completedCount = Object.keys(completedLessons).filter(k => completedLessons[k]).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--desert-sand)', minHeight: '90vh' }}>
      <div className="container-fluid px-md-5 text-start">
        {/* Navigation / Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-3 border-bottom" style={{ borderColor: 'var(--desert-dune) !important' }}>
          <div>
            <Link to={`/courses/${track.id}`} className="text-decoration-none text-muted small d-block mb-1">
              <i className="bi bi-chevron-left"></i> Back to Track Curriculum
            </Link>
            <h4 className="fw-bold mb-0 text-dark">{track.title} Classroom</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <span className="small text-muted d-block">Overall Progression</span>
              <span className="small fw-bold text-dark">{completedCount} of {totalLessons} completed ({progressPercent}%)</span>
            </div>
            <div className="progress" style={{ width: '120px', height: '10px', backgroundColor: 'var(--desert-dune)' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--desert-terracotta)' }}
                aria-valuenow={progressPercent} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="row g-4">
          
          {/* Left Panel: Course Index Sidebar */}
          <div className="col-lg-3">
            <div className="p-3 bg-white rounded-3 border border-light shadow-sm" style={{ border: '1px solid var(--desert-dune) !important' }}>
              <h6 className="fw-bold mb-3 pb-2 border-bottom text-dark">Course Curriculum</h6>
              
              <div className="d-flex flex-column gap-3">
                {track.curriculum.map((module) => (
                  <div key={module.slug || module.key}>
                    <span 
                      className="text-uppercase fw-bold text-muted d-block mb-2"
                      style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
                    >
                      {module.title}
                    </span>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                      {module.lessons.map((lesson) => {
                        const isActive = activeLesson.slug === lesson.slug;
                        const isDone = completedLessons[lesson.slug] || false;

                        return (
                          <li key={lesson.slug}>
                            <button
                              className="w-100 p-2 text-start border-0 bg-transparent rounded-2 d-flex justify-content-between align-items-center"
                              onClick={() => setActiveLesson(lesson)}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: isActive ? 'var(--desert-sand)' : 'transparent',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center gap-2 text-truncate">
                                <i className={`bi ${isDone ? 'bi-check-circle-fill text-success' : 'bi-play-circle text-muted'} flex-shrink-0`}></i>
                                <span className={`small text-truncate ${isActive ? 'fw-bold text-dark' : 'text-muted'}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="small text-muted flex-shrink-0" style={{ fontSize: '0.7rem' }}>{lesson.duration || "10:00"}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel: Active Lesson Content & Video player placeholder */}
          <div className="col-lg-6">
            <div className="p-4 bg-white rounded-3 border border-light shadow-sm mb-4" style={{ border: '1px solid var(--desert-dune) !important' }}>
              
              {/* Media Player Box Placeholder */}
              <div 
                className="w-100 rounded-3 mb-4 d-flex flex-column align-items-center justify-content-center text-center text-white"
                style={{
                  height: '320px',
                  background: 'linear-gradient(135deg, #2A241E 0%, #17130F 100%)',
                  border: '1px solid rgba(194, 150, 83, 0.2)',
                  position: 'relative'
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid var(--desert-gold)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = 'var(--desert-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <i className="bi bi-play-fill fs-1 text-white ms-1"></i>
                </div>
                <h6 className="fw-semibold mb-0" style={{ color: 'var(--desert-gold)' }}>Lecture Stream: {activeLesson.title}</h6>
                <small className="text-white-50 mt-1">Reciter/Lecturer: Sheikh Mahmoud Al-Asri</small>
              </div>

              {/* Lesson details */}
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="fw-bold mb-1 text-dark">{activeLesson.title}</h4>
                  <span className="small text-muted"><i className="bi bi-clock me-1"></i> Video Duration: {activeLesson.duration || "10:00"}</span>
                </div>
                
                <button 
                  className={`btn btn-sm ${completedLessons[activeLesson.slug] ? 'btn-success' : 'btn-desert-outline'} px-3 fw-bold`}
                  onClick={() => toggleLessonCompletion(activeLesson.slug)}
                >
                  <i className={`bi ${completedLessons[activeLesson.slug] ? 'bi-check-lg' : 'bi-check'}`}></i>
                  {completedLessons[activeLesson.slug] ? ' Completed' : ' Mark Completed'}
                </button>
              </div>

              {/* Lesson summary text */}
              <div className="pt-3 border-top border-light text-muted small" style={{ lineHeight: '1.6' }}>
                <p className="mb-3">
                  Welcome to the session covering <strong>{activeLesson.title}</strong>. This lecture provides a comprehensive review of classical rules, phonetic articulation points (makharij), and how to pronounce Arabic letters properly to match standard Quranic recitation metrics.
                </p>
                <p className="mb-0">
                  Please review the supplementary notes on the right to reference classical texts. Utilize the notepad utility to write study notes, and click 'Save Notes' to persist them for revision.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Notepad & Supplementary Resources */}
          <div className="col-lg-3">
            
            {/* Notepad */}
            <div className="p-3 bg-white rounded-3 border border-light shadow-sm mb-4 text-start" style={{ border: '1px solid var(--desert-dune) !important' }}>
              <h6 className="fw-bold mb-3 pb-2 border-bottom text-dark">
                <i className="bi bi-pencil-square me-1"></i> Study Notes
              </h6>
              
              <div className="mb-3">
                <textarea 
                  className="form-control text-start shadow-none" 
                  rows="5"
                  placeholder={`Write your study notes for ${activeLesson.title} here...`}
                  style={{ fontSize: '0.85rem', borderColor: 'var(--desert-dune)' }}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                ></textarea>
              </div>

              {showSavedMsg && (
                <div className="alert alert-success py-2 px-3 small mb-3" role="alert">
                  <i className="bi bi-check-circle-fill me-1"></i> Note saved successfully!
                </div>
              )}

              <button 
                className="btn btn-sm btn-desert-primary w-100 fw-bold"
                onClick={handleSaveNote}
              >
                Save Notes
              </button>

              {/* Saved Notes list */}
              {savedNotes.length > 0 && (
                <div className="mt-4 pt-3 border-top border-light">
                  <span className="small fw-bold text-dark d-block mb-2">Saved Notes Summary</span>
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {savedNotes.map((note) => (
                      <div 
                        key={note.id} 
                        className="p-2 rounded bg-light"
                        style={{ fontSize: '0.75rem', borderLeft: '2px solid var(--desert-gold)' }}
                      >
                        <strong className="d-block text-dark mb-1">{note.lessonTitle}</strong>
                        <span className="text-muted d-block">{note.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources list */}
            <div className="p-3 bg-white rounded-3 border border-light shadow-sm text-start" style={{ border: '1px solid var(--desert-dune) !important' }}>
              <h6 className="fw-bold mb-3 pb-2 border-bottom text-dark">Resources</h6>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                <li>
                  <a href="#notes" className="text-decoration-none text-muted d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                    <span>Download Session PDF Outline</span>
                  </a>
                </li>
                <li>
                  <a href="#recitation" className="text-decoration-none text-muted d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-music-fill text-warning fs-5"></i>
                    <span>Auxiliary Audio Recitation</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
