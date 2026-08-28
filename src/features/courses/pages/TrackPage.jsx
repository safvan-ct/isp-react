import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { academyTracks } from '../../../services/mockData';

export default function TrackPage() {
  const { trackId } = useParams();
  const track = academyTracks.find(t => t.id === trackId);

  // States
  const [expandedModules, setExpandedModules] = useState({ m1: true });

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (!track) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger max-w-md mx-auto" role="alert">
          Track details not found.
        </div>
        <Link to="/courses" className="btn btn-desert-primary mt-3">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
      <div className="container text-start">
        {/* Navigation */}
        <div className="mb-4">
          <Link to="/courses" className="btn btn-sm btn-desert-outline px-3 d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
            <i className="bi bi-arrow-left"></i> All Study Tracks
          </Link>
        </div>

        <div className="row g-4">
          {/* Main Course Info */}
          <div className="col-lg-8">
            <h1 className="fw-bold display-5 mb-2 text-dark">{track.title}</h1>
            <p className="lead text-muted mb-4">{track.description}</p>

            <h3 className="fw-bold mb-4 mt-5 text-dark">Track Curriculum</h3>

            {/* Curriculum Accordion */}
            {track.curriculum && track.curriculum.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {track.curriculum.map((module) => {
                  const isOpen = expandedModules[module.id] || false;

                  return (
                    <div 
                      key={module.id} 
                      className="border border-light rounded-3 bg-white shadow-sm overflow-hidden"
                      style={{ border: '1px solid var(--desert-dune) !important' }}
                    >
                      {/* Accordion Trigger */}
                      <button 
                        className="w-100 p-4 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                        onClick={() => toggleModule(module.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div>
                          <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>{module.title}</h5>
                          <p className="mb-0 text-muted small">{module.description}</p>
                        </div>
                        <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} fs-5 text-muted`}></i>
                      </button>

                      {/* Accordion Content */}
                      <div className={`collapse ${isOpen ? 'show' : ''}`} style={{ transition: 'all 0.2s ease' }}>
                        <div className="px-4 pb-4 border-top border-light">
                          <ul className="list-unstyled mb-0 d-flex flex-column gap-3 pt-3">
                            {module.lessons.map((lesson, idx) => (
                              <li 
                                key={lesson.id}
                                className="d-flex justify-content-between align-items-center p-3 rounded-2"
                                style={{ backgroundColor: 'var(--desert-sand)' }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <i className="bi bi-play-circle text-warning fs-5"></i>
                                  <div>
                                    <span className="fw-semibold text-dark small d-block">Lesson {idx + 1}: {lesson.title}</span>
                                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Duration: {lesson.duration}</span>
                                  </div>
                                </div>
                                <span className="badge bg-outline-secondary border text-muted small px-2 py-1">Standard Lecture</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-info py-4" role="alert">
                Curriculum outline is being finalized.
              </div>
            )}
          </div>

          {/* Right Sidebar - Enrollment */}
          <div className="col-lg-4">
            <div className="p-4 rounded-3 bg-white border border-light shadow-sm text-center" style={{ border: '1px solid var(--desert-dune) !important' }}>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                style={{ width: '60px', height: '60px', backgroundColor: 'rgba(163, 88, 57, 0.1)', color: 'var(--desert-terracotta)', fontSize: '1.5rem' }}
              >
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <h5 className="fw-bold mb-3 text-dark">Enroll in Track</h5>
              <p className="text-muted small mb-4">
                Gain unlimited access to study materials, self-paced learning paths, and interactive quizzes.
              </p>

              {/* Course Meta Info */}
              <div className="d-flex flex-column gap-2 mb-4 pt-3 border-top border-light text-start">
                <div className="d-flex justify-content-between align-items-center small">
                  <span className="text-muted"><i className="bi bi-bar-chart me-2"></i> Difficulty:</span>
                  <span className="fw-semibold text-dark">{track.stats.level}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center small">
                  <span className="text-muted"><i className="bi bi-calendar-check me-2"></i> Duration:</span>
                  <span className="fw-semibold text-dark">{track.stats.duration}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center small">
                  <span className="text-muted"><i className="bi bi-chat-left-dots me-2"></i> Lectures:</span>
                  <span className="fw-semibold text-dark">{track.stats.lectures}</span>
                </div>
              </div>

              <Link to={`/courses/view/${track.id}`} className="btn btn-desert-primary w-100 py-2 fw-bold mb-2">
                Start Learning
              </Link>
              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                Self-Paced • Free Enrollment
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
