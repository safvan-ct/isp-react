import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHadithChapters, useHadithBooks } from '../hooks/useHadith';

export default function HadithChaptersPage() {
  const { bookId } = useParams();
  const { books } = useHadithBooks();
  const { chapters, loading, error } = useHadithChapters(bookId);

  const [searchTerm, setSearchTerm] = useState('');

  const activeBook = books.find(b => b.id === bookId);

  // Search Logic
  const filteredChapters = chapters.filter((chapter) => {
    const term = searchTerm.toLowerCase();
    return (
      chapter.name.toLowerCase().includes(term) ||
      chapter.arabicName.includes(term) ||
      chapter.id.toString().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-5" style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
        <div className="spinner-border text-warning mt-5" role="status">
          <span className="visually-hidden">Loading chapters...</span>
        </div>
        <p className="text-muted mt-2">Loading index list...</p>
      </div>
    );
  }

  if (error || !activeBook) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger max-w-md mx-auto" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Hadith book details not found or failed to load.
        </div>
        <Link to="/hadith" className="btn btn-desert-primary mt-3">Back to Library</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
      <main className="container py-4 text-start">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small m-0">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/hadith" className="text-decoration-none">Hadith Library</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{activeBook.name}</li>
          </ol>
        </nav>

        {/* Book Showcase Banner */}
        <section className="book-header-banner mb-4 shadow-sm text-start">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1">
                  {activeBook.tags && activeBook.tags.includes('kutub-sittah') ? 'KUTUB AL-SITTAH' : 'HADITH COLLECTION'}
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {activeBook.compilerEra || 'Classical Compilation'}
                </span>
              </div>
              <h1 className="display-6 fw-bold mb-2">{activeBook.name}</h1>
              <p className="mb-3 opacity-75 small">
                {activeBook.description}
              </p>

              <div className="d-flex flex-wrap gap-3">
                <div className="stat-pill d-flex align-items-center gap-1">
                  <i className="bi bi-journal-bookmark text-warning"></i>
                  <span className="small"><strong>{activeBook.chaptersCount.split(' ')[0]}</strong> Chapters (Kutub)</span>
                </div>
                <div className="stat-pill d-flex align-items-center gap-1">
                  <i className="bi bi-chat-square-quote text-warning"></i>
                  <span className="small"><strong>{activeBook.totalHadith.toLocaleString()}</strong> Total Ahadith</span>
                </div>
                <div className="stat-pill d-flex align-items-center gap-1">
                  <i className="bi bi-check-circle text-warning"></i>
                  <span className="small"><strong>{activeBook.classification}</strong></span>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end text-start mt-3 mt-lg-0">
              <div 
                className="font-quranic display-4 fw-bold text-warning mb-1" 
                dir="rtl"
                style={{ fontFamily: 'var(--font-quranic)' }}
              >
                {activeBook.arabicName}
              </div>
              <p className="small text-white-50 mb-3">Authentic Chain Transmission</p>
              <Link to={`/hadith/${bookId}/1`} className="btn btn-sm btn-outline-warning rounded-pill px-4">
                <i className="bi bi-play-circle me-1"></i> Start from Hadith 1
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Topic Filter */}
        <div className="row align-items-center g-3 mb-4">
          <div className="col-lg-6">
            <div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
              <i className="bi bi-search text-muted ms-2 me-2"></i>
              <input 
                type="text" 
                className="form-control border-0 shadow-none bg-transparent"
                placeholder="Search chapter by English name, Arabic, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn btn-sm text-white px-3 fw-bold border-0"
                style={{ backgroundColor: 'var(--desert-terracotta)', borderRadius: '10px' }}
              >
                Find
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex gap-2 overflow-auto pb-1 justify-content-lg-end">
              <button className="filter-pill-btn active">All ({chapters.length})</button>
              <button className="filter-pill-btn">Faith & Revelation</button>
              <button className="filter-pill-btn">Worship & Purification</button>
              <button className="filter-pill-btn">Transactions</button>
              <button className="filter-pill-btn">Adab & Heart Softeners</button>
            </div>
          </div>
        </div>

        {/* Chapter Section Header */}
        <div className="section-category-header mb-3">
          <i className="bi bi-brightness-high"></i> Section I: Chapters Index (الفهرس)
        </div>

        {/* Chapters Grid */}
        {filteredChapters.length === 0 ? (
          <div className="alert alert-info py-4 text-center" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            No chapters match your search query.
          </div>
        ) : (
          <div className="row g-3 g-md-4 mb-5" id="chapterList">
            {filteredChapters.map((chapter) => {
              const formattedNum = chapter.id.toString().padStart(2, '0');

              return (
                <div key={chapter.id} className="col-md-6 col-lg-4">
                  <Link to={`/hadith/${bookId}/${chapter.id}`} className="chapter-card shadow-sm text-decoration-none">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="chapter-number-badge">
                          <span>{formattedNum}</span>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{chapter.name}</h6>
                          <small className="text-muted">
                            {chapter.id === 1 ? "Bad' al-Wahy" : `Chapter ${chapter.id}`}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div 
                          className="font-quranic fs-3 fw-bold mb-1" 
                          dir="rtl"
                        >
                          {chapter.arabicName}
                        </div>
                        <span className="hadith-range-tag">
                          {chapter.count} Ahadith
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
