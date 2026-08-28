import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuranChapters } from '../hooks/useQuran';

export default function QuranPage() {
  const { chapters, loading, error } = useQuranChapters();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); // 'All', 'Meccan', 'Medinan'
  const [activeJuz, setActiveJuz] = useState('All'); // 'All', 1, 2, 3, 15, 22, 27, 29, 30

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset Juz filter when searching to give full search visibility
    if (e.target.value) {
      setActiveJuz('All');
    }
  };

  const selectJuz = (juzVal) => {
    setActiveJuz(juzVal);
    setSearchTerm(''); // Clear search term when filtering by Juz
  };

  // Filtering Logic
  const filteredChapters = chapters.filter((chapter) => {
    // 1. Search term match
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      chapter.name.toLowerCase().includes(term) ||
      chapter.englishName.toLowerCase().includes(term) ||
      chapter.id.toString().includes(term) ||
      chapter.arabicName.includes(term);

    // 2. Tab category match (Meccan vs Medinan)
    const matchesCategory = 
      activeCategory === 'All' || 
      chapter.type === activeCategory;

    // 3. Juz selection match
    const matchesJuz = 
      activeJuz === 'All' || 
      chapter.juz === activeJuz;

    return matchesSearch && matchesCategory && matchesJuz;
  });

  // Calculate counts for badges
  const meccanCount = chapters.filter(c => c.type === 'Meccan').length;
  const medinanCount = chapters.filter(c => c.type === 'Medinan').length;

  // Juz Pills configuration based on mockup
  const juzPills = [
    { label: 'Juz 1', value: 1 },
    { label: 'Juz 2', value: 2 },
    { label: 'Juz 3', value: 3 },
    { label: 'Juz 15', value: 15 },
    { label: 'Juz 22', value: 22 },
    { label: 'Juz 27', value: 27 },
    { label: 'Juz 29', value: 29 },
    { label: 'Juz 30 (\'Amma)', value: 30 }
  ];

  return (
    <div style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
      <main className="container py-4 text-start">
        {/* Header & Interactive Search Banner */}
        <section className="surah-header-banner mb-4 shadow-sm text-start">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                114 SURAHS • 30 JUZ
              </span>
              <h1 className="display-6 fw-bold mb-2">The Noble Quran (القرآن الكريم)</h1>
              <p className="mb-0 opacity-75 small">
                Read, listen to verse-by-verse recitations, and explore classical commentary.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
                <i className="bi bi-search text-muted ms-2 me-2"></i>
                <input
                  type="text"
                  className="form-control border-0 shadow-none bg-transparent"
                  placeholder="Search Surah by name, Arabic, or number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="btn btn-sm text-white px-3 fw-bold border-0"
                  style={{ backgroundColor: 'var(--desert-terracotta)', borderRadius: '10px' }}
                >
                  Find
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Filter & Juz Navigation */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 flex-wrap">
          {/* Tabs / Categories */}
          <div className="d-flex gap-2">
            <button
              className={`filter-btn ${activeCategory === 'All' && activeJuz === 'All' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('All');
                setActiveJuz('All');
              }}
            >
              All Surahs ({chapters.length})
            </button>
            <button
              className={`filter-btn ${activeCategory === 'Meccan' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('Meccan');
                setActiveJuz('All');
              }}
            >
              Meccan ({meccanCount || 86})
            </button>
            <button
              className={`filter-btn ${activeCategory === 'Medinan' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('Medinan');
                setActiveJuz('All');
              }}
            >
              Medinan ({medinanCount || 28})
            </button>
          </div>

          {/* Quick Juz Selector */}
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <span className="text-muted small fw-bold text-nowrap">
              <i className="bi bi-compass me-1"></i> Quick Juz:
            </span>
            <div className="juz-quick-scroll d-flex gap-1 py-1" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <button
                className={`juz-pill border-0 ${activeJuz === 'All' ? 'bg-warning text-dark' : ''}`}
                onClick={() => selectJuz('All')}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem', fontWeight: '600', borderRadius: '20px' }}
              >
                All
              </button>
              {juzPills.map((juz) => (
                <button
                  key={juz.value}
                  className={`juz-pill border-0 ${activeJuz === juz.value ? 'bg-warning text-dark' : ''}`}
                  onClick={() => selectJuz(juz.value)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem', fontWeight: '600', borderRadius: '20px' }}
                >
                  {juz.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Retrieving Surah index...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center max-w-md mx-auto" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Failed to retrieve Surah index. Please try again.
          </div>
        )}

        {/* Surah Cards Grid */}
        {!loading && !error && (
          <>
            {filteredChapters.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-journal-x fs-1 text-muted"></i>
                <p className="text-muted mt-3">No Surahs match your selection.</p>
              </div>
            ) : (
              <div className="row g-3 g-md-4" id="surahList">
                {filteredChapters.map((chapter) => {
                  // Format number to have leading zero (e.g. 01, 18)
                  const formattedNum = chapter.id.toString().padStart(2, '0');

                  return (
                    <div key={chapter.id} className="col-md-6 col-lg-4">
                      <Link to={`/quran/${chapter.id}`} className="surah-card text-decoration-none">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <div className="surah-number-badge">
                              <span>{formattedNum}</span>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0 text-dark">{chapter.name}</h6>
                              <small className="text-muted">"{chapter.englishName}"</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <div 
                              className="font-quranic fs-3 fw-bold mb-0" 
                              dir="rtl" 
                              style={{ lineHeight: 1 }}
                            >
                              {chapter.arabicName}
                            </div>
                            <div className="d-flex align-items-center justify-content-end gap-1 mt-1">
                              <span className={`revelation-tag revelation-${chapter.type.toLowerCase()}`}>
                                {chapter.type}
                              </span>
                              <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                                • {chapter.versesCount} Ayahs
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
