import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English (US)');

  const languages = ['English', 'العربية (Arabic)', 'Bahasa Indonesia'];

  const selectLanguage = (lang) => {
    setCurrentLang(lang);
    setLangDropdownOpen(false);
  };

  // 1. Quran Pages Footer (Exact matching courses page footer)
  if (pathname.startsWith('/quran')) {
    return (
      <footer style={{ padding: '1.5rem 0' }}>
        <div className="container text-center small opacity-75">
          <p className="mb-1">Al-Athar Academy & Courses Portal</p>
          <p className="mb-0">Authentic curriculums, certified scholars, and traditional sacred knowledge tracks.</p>
        </div>
      </footer>
    );
  }

  // 2. Hadith Pages Footer (Exact matching courses page footer)
  if (pathname.startsWith('/hadith')) {
    return (
      <footer style={{ padding: '1.5rem 0' }}>
        <div className="container text-center small opacity-75">
          <p className="mb-1">Al-Athar Academy & Courses Portal</p>
          <p className="mb-0">Authentic curriculums, certified scholars, and traditional sacred knowledge tracks.</p>
        </div>
      </footer>
    );
  }

  // 3. Courses Pages Footer (Exact matching courses.html)
  if (pathname.startsWith('/courses')) {
    return (
      <footer style={{ padding: '1.5rem 0' }}>
        <div className="container text-center small opacity-75">
          <p className="mb-1">Al-Athar Academy & Courses Portal</p>
          <p className="mb-0">Authentic curriculums, certified scholars, and traditional sacred knowledge tracks.</p>
        </div>
      </footer>
    );
  }

  // 4. HomePage Rich Footer (Exact matching index.html)
  return (
    <footer>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 text-start">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon" style={{ background: 'var(--desert-gold)' }}>
                <i className="bi bi-book-half"></i>
              </div>
              <span className="fs-4 fw-bold text-white">Al-Athar</span>
            </div>
            <p className="small opacity-75 text-start">
              A dedicated virtual sanctuary for students of Islamic knowledge, fostering authentic
              comprehension with clarity and tradition.
            </p>
          </div>
          <div className="col-6 col-lg-2 offset-lg-2 text-start">
            <h6 className="text-white fw-bold mb-3">Portals</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/quran" className="text-white opacity-75 text-decoration-none">Quran Reader</Link></li>
              <li><Link to="/hadith" className="text-white opacity-75 text-decoration-none">Hadith Index</Link></li>
              <li><Link to="/courses" className="text-white opacity-75 text-decoration-none">Academy Tracks</Link></li>
              <li><a href="#" className="text-white opacity-75 text-decoration-none">Class Library</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2 text-start">
            <h6 className="text-white fw-bold mb-3">Community</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#" className="text-white opacity-75 text-decoration-none">Discussion Forum</a></li>
              <li><a href="#" className="text-white opacity-75 text-decoration-none">Live Halawat</a></li>
              <li><a href="#" className="text-white opacity-75 text-decoration-none">Scholar Guidance</a></li>
              <li><a href="#" className="text-white opacity-75 text-decoration-none">Mobile App</a></li>
            </ul>
          </div>
          <div className="col-lg-2 text-start">
            <h6 className="text-white fw-bold mb-3">Languages</h6>
            <div className="dropdown">
              <button 
                className="btn btn-sm btn-outline-light dropdown-toggle" 
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-expanded={langDropdownOpen}
              >
                {currentLang}
              </button>
              <ul className={`dropdown-menu dropdown-menu-dark ${langDropdownOpen ? 'show' : ''}`} style={{ margin: 0, position: 'absolute' }}>
                {languages.map((lang) => (
                  <li key={lang}>
                    <button 
                      className="dropdown-item" 
                      onClick={() => selectLanguage(lang)}
                    >
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small opacity-50">
          <p className="mb-0">© 2026 Al-Athar Portal. All rights reserved.</p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <a href="#" className="text-white"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="text-white"><i className="bi bi-youtube"></i></a>
            <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
