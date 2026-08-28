import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHadithList, useHadithChapters, useHadithBooks } from '../hooks/useHadith';

export default function HadithDetailPage() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { books } = useHadithBooks();
  const { chapters } = useHadithChapters(bookId);
  const { hadiths, loading, error } = useHadithList(bookId, chapterId);

  // States
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [copiedHadith, setCopiedHadith] = useState(null);

  const activeBook = books.find(b => b.id === bookId);
  const activeChapter = chapters.find(c => c.id === parseInt(chapterId, 10));
  const currentChapterId = parseInt(chapterId, 10);

  // Handlers
  const toggleExplanation = (hadithId) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [hadithId]: !prev[hadithId]
    }));
  };

  const toggleBookmark = (hadithId) => {
    setBookmarks(prev => ({
      ...prev,
      [hadithId]: !prev[hadithId]
    }));
  };

  const handleCopyText = (text, hadithId) => {
    navigator.clipboard.writeText(text);
    setCopiedHadith(hadithId);
    setTimeout(() => setCopiedHadith(null), 2000);
  };

  const goToPrevChapter = () => {
    const prevId = currentChapterId - 1;
    if (prevId >= 1) {
      navigate(`/hadith/${bookId}/${prevId}`);
    }
  };

  const goToNextChapter = () => {
    const nextId = currentChapterId + 1;
    if (chapters && nextId <= chapters.length) {
      navigate(`/hadith/${bookId}/${nextId}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
        <div className="spinner-border text-warning mt-5" role="status">
          <span className="visually-hidden">Loading Hadith...</span>
        </div>
        <p className="text-muted mt-2">Loading Prophetic traditions...</p>
      </div>
    );
  }

  if (error || !activeBook || !activeChapter) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger max-w-md mx-auto" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Hadith list details not found or failed to load.
        </div>
        <Link to={`/hadith/${bookId}`} className="btn btn-desert-primary mt-3">Back to Book Index</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--desert-sand)', minHeight: '80vh' }}>
      
      {/* Sticky Reader Bar Controls */}
      <div className="sticky-reader-bar py-2">
        <div className="container d-flex align-items-center justify-content-between flex-wrap gap-2">
          {/* Chapter Jump */}
          <div className="d-flex align-items-center gap-2">
            <button 
              className="reader-btn"
              onClick={goToPrevChapter}
              disabled={currentChapterId <= 1}
              style={{ opacity: currentChapterId <= 1 ? 0.5 : 1, cursor: 'pointer' }}
            >
              <i className="bi bi-chevron-left"></i> <span className="d-none d-sm-inline">Prev Chapter</span>
            </button>

            <select 
              className="form-select form-select-sm border-secondary-subtle font-quranic fw-bold shadow-none"
              style={{ width: 'auto', backgroundColor: 'var(--desert-sand)' }}
              value={chapterId}
              onChange={(e) => navigate(`/hadith/${bookId}/${e.target.value}`)}
            >
              {chapters.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id}. {c.name}
                </option>
              ))}
            </select>

            <button 
              className="reader-btn"
              onClick={goToNextChapter}
              disabled={chapters && currentChapterId >= chapters.length}
              style={{ opacity: chapters && currentChapterId >= chapters.length ? 0.5 : 1, cursor: 'pointer' }}
            >
              <span className="d-none d-sm-inline">Next Chapter</span> <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* Quick Jump & View Options */}
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted d-none d-md-inline">Hadith #:</span>
              <select 
                className="form-select form-select-sm border-secondary-subtle shadow-none"
                style={{ width: '75px', backgroundColor: 'var(--desert-sand)' }}
                onChange={(e) => {
                  const targetElement = document.getElementById(`h${e.target.value}`);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                {hadiths.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.id}
                  </option>
                ))}
              </select>
            </div>
            <button className="reader-btn">
              <i className="bi bi-gear-fill me-1"></i> <span className="d-none d-md-inline">Display Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Main Content */}
      <main className="container py-4 text-start">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small m-0">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/hadith" className="text-decoration-none">Hadith Library</Link></li>
            <li className="breadcrumb-item"><Link to={`/hadith/${bookId}`} className="text-decoration-none">{activeBook.name}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Book {activeChapter.id}: {activeChapter.name}</li>
          </ol>
        </nav>

        {/* Chapter Header Showcase Banner */}
        <section className="chapter-banner mb-4 shadow-sm text-start">
          <div className="row align-items-center g-3">
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge bg-warning text-dark px-3 py-1 fw-bold">BOOK {activeChapter.id} OF {chapters.length}</span>
                <span className="badge bg-outline-light border text-light px-2 py-1 text-uppercase">{activeBook.name}</span>
                <span className="badge bg-outline-light border text-light px-2 py-1">{activeChapter.count || 2} AHADITH</span>
              </div>
              <h1 className="fw-bold display-6 mb-1 text-white">{activeChapter.name}</h1>
              <p className="mb-0 text-white-50 small">
                Defining the reality of faith, its pillars, branches, and its manifestation through word and righteous action.
              </p>
            </div>

            <div className="col-md-5 text-md-end text-start mt-3 mt-md-0">
              <div 
                className="font-quranic display-4 fw-bold text-warning mb-0" 
                dir="rtl"
                style={{ fontFamily: 'var(--font-quranic)' }}
              >
                {activeChapter.arabicName}
              </div>
              <div className="small text-white-50 mt-1">
                <i className="bi bi-journal-check me-1"></i> Reference range: <strong>Hadith 1 – {activeChapter.count || 2}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Hadith List */}
        {hadiths.map((hadith, index) => {
          const isExpanded = expandedExplanations[hadith.id] || false;
          const isBookmarked = bookmarks[hadith.id] || false;
          const isCopied = copiedHadith === hadith.id; // Using copy state helper

          return (
            <div key={hadith.id} className="text-start">
              
              {/* Sub-Chapter / Bab Heading */}
              <div className="bab-header-card shadow-sm">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <span 
                      className="text-uppercase fw-bold small"
                      style={{ color: 'var(--desert-terracotta)', letterSpacing: '0.5px' }}
                    >
                      Bab {hadith.id} • Chapter Theme
                    </span>
                    <h5 className="fw-bold mb-0">
                      Chapter: {hadith.id === 1 ? 'Actions are judged by motives (intentions)' : 'Modes of Divine Revelation to the Prophet'}
                    </h5>
                  </div>
                  <div 
                    className="font-quranic fs-3 fw-bold" 
                    dir="rtl" 
                    style={{ color: 'var(--desert-night)', fontFamily: 'var(--font-quranic)' }}
                  >
                    {hadith.id === 1 ? 'بَابُ كَيْفَ كَانَ بَدْءُ الْوَحْيِ' : 'بَابُ كَيْفَ كَانَ يَنْزِلُ الْوَحْيُ'}
                  </div>
                </div>
              </div>

              {/* Hadith Card */}
              <div 
                id={`h${hadith.id}`} 
                className={`hadith-card shadow-sm ${index === 0 ? 'highlighted' : ''}`}
              >
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 flex-wrap gap-2">
                  {/* Hadith Identification Badges */}
                  <div className="d-flex align-items-center gap-3">
                    <div className="hadith-number-badge">
                      <span>{hadith.id}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1 align-items-center">
                      <span className="grade-badge-sahih me-1">{hadith.grade}</span>
                      <span className="badge bg-light text-dark border">Book {chapterId}, Hadith {hadith.id}</span>
                      <span className="badge bg-light text-dark border d-none d-sm-inline-block">Reference: {hadith.reference}</span>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="d-flex align-items-center gap-1">
                    <button className="hadith-action-btn border-0 bg-transparent" title="Listen Audio">
                      <i className="bi bi-play-circle-fill text-warning fs-5"></i>
                    </button>
                    <button 
                      className={`hadith-action-btn border-0 bg-transparent ${isBookmarked ? 'text-warning' : 'text-muted'}`}
                      title="Bookmark"
                      onClick={() => toggleBookmark(hadith.id)}
                    >
                      <i className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                    </button>
                    <button 
                      className="hadith-action-btn border-0 bg-transparent" 
                      title="Copy Text"
                      onClick={() => handleCopyText(`Narrator: ${hadith.narrator}\n${hadith.translation}\n(${hadith.reference})`, hadith.id)}
                    >
                      <i className={`bi ${isCopied ? 'bi-check2 text-success' : 'bi-copy'}`}></i>
                    </button>
                    <button 
                      className={`hadith-action-btn border-0 bg-transparent ${isExpanded ? 'text-primary' : 'text-muted'}`}
                      title="Scholarly Commentary (Sharh)"
                      onClick={() => toggleExplanation(hadith.id)}
                    >
                      <i className="bi bi-journal-bookmark-fill"></i>
                    </button>
                  </div>
                </div>

                {/* Chain of Narrators (Isnad Pill) */}
                <div className="mb-3">
                  <span className="isnad-pill">
                    <i className="bi bi-diagram-3-fill"></i>
                    <span>
                      Isnad Chain: Al-Makki ibn Ibrahim ← Yazid ibn Abi 'Ubayd ← Salamah ibn al-Akwa' ← Narrator: <strong>{hadith.narrator}</strong>
                    </span>
                  </span>
                </div>

                {/* Arabic Hadith Text */}
                <div className="hadith-arabic-text mb-4">
                  {hadith.arabic}
                </div>

                {/* English Translation */}
                <div className="hadith-translation fw-medium mb-2">
                  {hadith.translation}
                </div>

                {/* Expandable Sharh Box */}
                <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                  <div className="sharh-box">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-journal-text fs-5" style={{ color: 'var(--desert-terracotta)' }}></i>
                      <h6 className="fw-bold mb-0">Sharh Fath al-Bari — Ibn Hajar al-'Asqalani (رحمه الله)</h6>
                    </div>
                    <p className="mb-0">
                      {hadith.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Pagination / Chapter Navigation */}
        <div 
          className="d-flex justify-content-between align-items-center my-5 pt-3 border-top flex-wrap gap-2"
          style={{ borderColor: 'var(--desert-dune) !important' }}
        >
          <button 
            className="btn btn-desert-outline rounded-pill px-4"
            onClick={goToPrevChapter}
            disabled={currentChapterId <= 1}
            style={{ opacity: currentChapterId <= 1 ? 0.5 : 1, cursor: 'pointer' }}
          >
            <i className="bi bi-arrow-left me-1"></i> Previous Chapter
          </button>
          <button 
            className="btn btn-desert-primary rounded-pill px-4"
            onClick={goToNextChapter}
            disabled={chapters && currentChapterId >= chapters.length}
            style={{ opacity: chapters && currentChapterId >= chapters.length ? 0.5 : 1, cursor: 'pointer' }}
          >
            Next Chapter <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </main>
    </div>
  );
}
