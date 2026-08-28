import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHadithBooks } from '../hooks/useHadith';

export default function HadithBooksPage() {
  const { books, loading, error } = useHadithBooks();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories configurations matching v2 filters
  const categories = [
    { label: 'All Collections', value: 'All' },
    { label: 'Kutub al-Sittah (The Six Books)', value: 'kutub-sittah' },
    { label: 'Foundational Sahihs', value: 'foundational-sahihs' },
    { label: 'Sunan Works', value: 'sunan-works' },
    { label: 'Selected Adab & Fiqh', value: 'adab-fiqh' }
  ];

  // Filtering Logic
  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      book.name.toLowerCase().includes(term) ||
      book.arabicName.includes(term) ||
      book.description.toLowerCase().includes(term) ||
      book.classification.toLowerCase().includes(term);

    const matchesCategory = 
      activeCategory === 'All' || 
      (book.tags && book.tags.includes(activeCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
      <main className="container py-4 text-start">
        {/* Header & Interactive Search Banner */}
        <section className="hadith-header-banner mb-4 shadow-sm text-start">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                AUTHENTIC TRADITIONS • KUTUB AL-HADITH
              </span>
              <h1 className="display-6 fw-bold mb-2">Canonical Hadith Collections (كُتُبُ الحَدِيثِ)</h1>
              <p className="mb-0 opacity-75 small">
                Explore the Prophetic sunnah through the Kutub al-Sittah, verified commentaries, 
                and topical compilations with complete Isnad chains.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
                <i className="bi bi-search text-muted ms-2 me-2"></i>
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none bg-transparent"
                  placeholder="Search book, compiler, or Hadith number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="btn btn-sm text-white px-3 fw-bold border-0"
                  style={{ backgroundColor: 'var(--desert-terracotta)', borderRadius: '10px' }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Hadith Spotlight Card */}
        <div className="hadith-spotlight-card mb-5 shadow-sm text-start">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge" style={{ backgroundColor: 'var(--desert-gold)', color: '#fff' }}>
                Hadith of the Day
              </span>
              <span className="small text-muted">Sahih al-Bukhari • Book 1, Hadith 1</span>
            </div>
            <button className="btn btn-sm btn-link text-decoration-none text-muted p-0" title="Share">
              <i className="bi bi-share"></i>
            </button>
          </div>

          <p className="font-quranic fs-3 text-end mb-3 lh-lg" dir="rtl" style={{ fontFamily: 'var(--font-quranic)' }}>
            إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
          </p>

          <blockquote className="blockquote fs-6 text-dark fst-italic mb-2">
            "Actions are judged by motives (intentions), so each man will have what he intended."
          </blockquote>

          <div 
            className="d-flex justify-content-between align-items-center pt-2 border-top"
            style={{ borderColor: 'var(--desert-dune) !important' }}
          >
            <small className="text-muted">Narrated by: 'Umar bin Al-Khattab (رضي الله عنه)</small>
            <Link 
              to="/hadith/bukhari/1" 
              className="btn btn-sm text-decoration-none fw-bold"
              style={{ color: 'var(--desert-terracotta)' }}
            >
              Read Full Hadith & Sharh <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Collection Category Filter Tabs */}
        <div className="d-flex align-items-center gap-2 mb-4 overflow-auto pb-2 flex-wrap">
          {categories.map((cat) => {
            // Calculate dynamic counts
            const count = cat.value === 'All' 
              ? books.length 
              : books.filter(b => b.tags && b.tags.includes(cat.value)).length;

            return (
              <button
                key={cat.value}
                className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading Hadith Collections...</span>
            </div>
            <p className="text-muted mt-2">Opening library archives...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center max-w-md mx-auto" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Failed to load Hadith library collections.
          </div>
        )}

        {/* Hadith Books Grid */}
        {!loading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-journal-x fs-1 text-muted"></i>
                <p className="text-muted mt-3">No collections match your search filter.</p>
              </div>
            ) : (
              <div className="row g-4" id="hadithBookList">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="col-md-6 col-lg-4">
                    <div className="book-card shadow-sm text-start">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="book-emblem">
                          <i className={`bi ${book.emblem}`}></i>
                        </div>
                        <span className={`classification-badge ${book.badgeClass}`}>
                          {book.classification}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-baseline mb-2 flex-wrap gap-1">
                        <h5 className="fw-bold mb-0">{book.name}</h5>
                        <span 
                          className="font-quranic fs-4 fw-bold" 
                          dir="rtl"
                          style={{ fontFamily: 'var(--font-quranic)' }}
                        >
                          {book.arabicName}
                        </span>
                      </div>

                      <p className="small text-muted mb-3 flex-grow-1">
                        {book.description}
                      </p>

                      <div 
                        className="pt-3 border-top d-flex justify-content-between align-items-center"
                        style={{ borderColor: 'var(--desert-dune) !important' }}
                      >
                        <div>
                          <span className="d-block fw-bold small">{book.totalHadith.toLocaleString()} Ahadith</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{book.chaptersCount}</span>
                        </div>
                        <Link to={`/hadith/${book.id}`} className="btn btn-desert-outline btn-sm">
                          Explore Book
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
