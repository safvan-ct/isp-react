import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const getActiveProps = (path) => {
    if (path === '/') {
      return pathname === '/' ? 'active' : '';
    }
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-desert sticky-top py-1 py-lg-2">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeNavbar}>
          <div className="brand-icon">
            <i className="bi bi-book-half"></i>
          </div>
          <div>
            <span className="fs-4 fw-bold tracking-wide" style={{ color: 'var(--desert-night)' }}>Al-Athar</span>
            <span 
              className="d-block text-muted small text-nowrap"
              style={{ fontSize: '0.65rem', letterSpacing: '1px', marginTop: '-3px', whiteSpace: 'nowrap' }}
            >
              ISLAMIC STUDY PORTAL
            </span>
          </div>
        </Link>

        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={toggleNavbar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} fs-2 text-dark`}></i>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${getActiveProps('/')}`}
                onClick={closeNavbar}
              >
                <i className="bi bi-house-door"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/courses" 
                className={`nav-link ${getActiveProps('/courses')}`}
                onClick={closeNavbar}
              >
                <i className="bi bi-mortarboard"></i>
                <span>Courses</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/quran" 
                className={`nav-link ${getActiveProps('/quran')}`}
                onClick={closeNavbar}
              >
                <i className="bi bi-book-half"></i>
                <span>Quran</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/hadith" 
                className={`nav-link ${getActiveProps('/hadith')}`}
                onClick={closeNavbar}
              >
                <i className="bi bi-chat-left-quote"></i>
                <span>Hadees</span>
              </Link>
            </li>
          </ul>
          <style>{`
            @keyframes heartPulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
            .animate-pulse-heart {
              display: inline-block;
              animation: heartPulse 1.4s infinite ease-in-out;
            }
            
            /* Creative Navbar link items */
            .navbar-nav .nav-link {
              position: relative;
              padding: 0.5rem 0.8rem !important;
              transition: all 0.3s ease;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 0.92rem;
              font-weight: 500;
              color: var(--desert-night) !important;
            }
            .navbar-nav .nav-link i {
              font-size: 1rem;
              color: var(--desert-muted);
              transition: transform 0.2s ease, color 0.2s ease;
            }
            .navbar-nav .nav-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 50%;
              transform: translateX(-50%) scaleX(0);
              width: 16px;
              height: 3px;
              border-radius: 2px;
              background-color: var(--desert-terracotta);
              transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            .navbar-nav .nav-link:hover {
              color: var(--desert-terracotta) !important;
            }
            .navbar-nav .nav-link:hover i {
              transform: translateY(-1px);
              color: var(--desert-terracotta);
            }
            .navbar-nav .nav-link.active {
              color: var(--desert-terracotta) !important;
              font-weight: 700;
            }
            .navbar-nav .nav-link.active i {
              color: var(--desert-terracotta);
            }
            .navbar-nav .nav-link.active::after {
              transform: translateX(-50%) scaleX(1);
            }
          `}</style>
          <div className="d-flex align-items-center">
            <Link 
              to="/donate" 
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm text-decoration-none"
              onClick={closeNavbar}
              style={{
                background: 'linear-gradient(135deg, var(--desert-terracotta) 0%, #A04A36 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                boxShadow: '0 4px 12px rgba(184, 84, 60, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(184, 84, 60, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 84, 60, 0.2)';
              }}
            >
              <span className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-20 rounded-circle" style={{ width: '22px', height: '22px' }}>
                <i className="bi bi-heart-fill text-white animate-pulse-heart" style={{ fontSize: '0.75rem' }}></i>
              </span>
              <span>Sadaqah & Donate</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
