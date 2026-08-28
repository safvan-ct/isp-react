import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [isPlayingAyah, setIsPlayingAyah] = useState(false);

  const toggleAyahAudio = () => {
    setIsPlayingAyah(!isPlayingAyah);
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="hero-section text-start bg-desert">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge badge-desert mb-3">
                <i className="bi bi-stars me-1"></i> Authentic • Classical • Accessible
              </span>
              <h1 className="display-4 fw-bold lh-sm mb-3 text-dark">
                Illuminating Minds With The <span style={{ color: 'var(--desert-terracotta)' }}>Timeless Word</span>
              </h1>
              <p className="lead mb-4 text-muted" style={{ fontSize: '1.1rem' }}>
                Delve into Quranic sciences, authentic Hadith commentary, and classical Arabic guided by
                traditional scholarship in a modern digital space.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/courses" className="btn btn-desert-primary text-decoration-none">
                  <i className="bi bi-compass me-1"></i> Start Learning
                </Link>
                <Link to="/quran" className="btn btn-desert-outline text-decoration-none">
                  <i className="bi bi-play-circle me-1"></i> Read Quran Daily
                </Link>
              </div>

              {/* Quick Stat Counters */}
              <div className="row mt-5 pt-3 border-top g-3" style={{ borderColor: 'var(--desert-dune) !important' }}>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">114</h4>
                  <small className="text-muted">Surah Tafsirs</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">45+</h4>
                  <small className="text-muted">Guided Tracks</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">12k+</h4>
                  <small className="text-muted">Students</small>
                </div>
              </div>
            </div>

            {/* Featured Ayah Card */}
            <div className="col-lg-6">
              <div className="verse-card p-4 p-md-5 shadow-lg">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-warning small text-uppercase tracking-wider fw-bold">
                    <i className="bi bi-bookmark-star me-1"></i> Ayah of the Day
                  </span>
                  <span className="badge bg-dark border border-secondary text-secondary">Surah Taha: 114</span>
                </div>

                {/* Arabic Calligraphy Text */}
                <p 
                  className="font-quranic fs-2 text-end text-light lh-lg mb-4" 
                  dir="rtl"
                  style={{ fontFamily: 'var(--font-quranic)' }}
                >
                  رَّبِّ زِدْنِي عِلْمًا
                </p>

                <blockquote className="blockquote text-light fs-6 fst-italic mb-3 opacity-75">
                  "And say: 'My Lord, increase me in knowledge.'"
                </blockquote>

                <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                  <small className="text-muted">Recitation by Mishary Rashid</small>
                  <button 
                    className={`btn btn-sm ${isPlayingAyah ? 'btn-warning text-dark' : 'btn-outline-warning'} rounded-pill px-3`}
                    onClick={toggleAyahAudio}
                  >
                    <i className={`bi ${isPlayingAyah ? 'bi-pause-fill' : 'bi-volume-up-fill'} me-1`}></i> 
                    {isPlayingAyah ? 'Pause' : 'Listen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Core Study Tracks Preview */}
      <section className="py-5" id="courses">
        <div className="container">
          <div className="text-center max-w-lg mx-auto mb-5">
            <span 
              className="text-uppercase fw-bold small"
              style={{ color: 'var(--desert-terracotta)', letterSpacing: '1px' }}
            >
              Structured Paths
            </span>
            <h2 className="display-6 fw-bold mt-1 text-dark">Disciplines of Sacred Knowledge</h2>
            <p className="text-muted">Curated curriculums spanning foundational basics to advanced classical texts.</p>
          </div>

          <div className="row g-4">
            {/* Track 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="arch-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="arch-icon-wrap">
                    <i className="bi bi-book"></i>
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">Tajweed & Tilawah</h5>
                  <p className="text-muted small mb-4">Master Quranic phonetics, makharij, and rules of recitation with live corrections.</p>
                </div>
                <button className="btn btn-sm btn-desert-outline w-100" disabled>Coming Soon</button>
              </div>
            </div>

            {/* Track 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="arch-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="arch-icon-wrap">
                    <i className="bi bi-chat-square-quote"></i>
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">Classical Tafsir</h5>
                  <p className="text-muted small mb-4">Historical contexts, linguistic depths, and practical reflections of each Surah.</p>
                </div>
                <button className="btn btn-sm btn-desert-outline w-100" disabled>Coming Soon</button>
              </div>
            </div>

            {/* Track 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="arch-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="arch-icon-wrap">
                    <i className="bi bi-translate"></i>
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">Quranic Arabic</h5>
                  <p className="text-muted small mb-4">Grammar (Nahw) and morphology (Sarf) geared directly to comprehending the Revelation.</p>
                </div>
                <Link to="/courses/arabic" className="btn btn-sm btn-desert-outline w-100 text-decoration-none">Explore Track</Link>
              </div>
            </div>

            {/* Track 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="arch-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="arch-icon-wrap">
                    <i className="bi bi-journal-text"></i>
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">Seerah & Hadith</h5>
                  <p className="text-muted small mb-4">Study the Prophetic character and traditions (Nawawi 40, Riyad us-Saliheen).</p>
                </div>
                <Link to="/courses/hadith-seerah" className="btn btn-sm btn-desert-outline w-100 text-decoration-none">Explore Track</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Student Toolkit Section (Daily Companion) */}
      <section className="py-5 bg-desert" style={{ backgroundColor: 'var(--desert-dune)' }}>
        <div className="container">
          <div className="row g-4 align-items-center text-start">
            <div className="col-lg-5">
              <span className="badge bg-white text-dark mb-2">Daily Companion</span>
              <h3 className="fw-bold text-dark">Your Daily Spiritual Cadence</h3>
              <p className="text-muted">
                Integrate steady, manageable milestones into your daily routine. Consistent steps turn learning into lifelong habit.
              </p>
              <div className="d-flex flex-column gap-2 mt-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle fs-5" style={{ color: 'var(--desert-terracotta)' }}></i>
                  <span className="fw-medium text-dark">Audio recitation speed control and repeat loops</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle fs-5" style={{ color: 'var(--desert-terracotta)' }}></i>
                  <span className="fw-medium text-dark">Downloadable PDF summaries with vocabulary roots</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2-circle fs-5" style={{ color: 'var(--desert-terracotta)' }}></i>
                  <span className="fw-medium text-dark">Ad-free Quran reader with line-by-line notes</span>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="daily-tracker-card shadow-sm text-start" style={{ backgroundColor: 'var(--desert-sand-card)', border: '1px solid var(--desert-dune)', borderRadius: '16px', padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Daily Reflection Streak</h6>
                    <small className="text-muted">Track your reading & memorization progress</small>
                  </div>
                  <span className="badge bg-warning text-dark"><i className="bi bi-fire me-1"></i> 7 Days Active</span>
                </div>

                {/* Reading Module Mock */}
                <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--desert-sand)' }}>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Current Juz: <strong>Juz 30 ('Amma)</strong></span>
                    <span>78% Complete</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: '78%', backgroundColor: 'var(--desert-terracotta)' }} 
                      aria-valuenow="78" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="small text-muted"><i className="bi bi-clock me-1"></i> Next live session: Today, 8:00 PM</span>
                  <Link to="/quran" className="btn btn-sm btn-desert-primary">Open Reader</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
