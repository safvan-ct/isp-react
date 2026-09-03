import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesCatalog, courseModules } from '../../../services/mockData';

export default function CourseDetailsPage() {
    const { courseId } = useParams();
    const [openModuleIndex, setOpenModuleIndex] = useState(0);
    
    const course = coursesCatalog.find(c => c.slug === courseId);
    const curriculum = courseModules[0][courseId] || [];

    if (!course) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
                <div className="alert alert-danger max-w-md mx-auto" role="alert">
                Course not found.
                </div>
                <Link to="/courses" className="btn btn-desert-primary mt-3">Back to Courses</Link>
            </div>
        );
    }

    const totalLessons = curriculum.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);

    return (
        <div className="pb-5 text-start">
            {/* Section Navigation Tabs */}
            <div className="sticky-course-nav">
                <div className="container d-flex align-items-center gap-1 overflow-auto">
                    <a href="#overview" className="course-nav-link active">Overview</a>
                    <a href="#outcomes" className="course-nav-link">What You'll Learn</a>
                    <a href="#syllabus" className="course-nav-link">Syllabus ({totalLessons} Lessons)</a>
                    <a href="#instructor" className="course-nav-link">Scholar Bio</a>
                    <a href="#faq" className="course-nav-link">FAQs</a>
                </div>
            </div>

            {/* Page Body */}
            <main className="container py-4">
                
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/courses">Courses & Tracks</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                    </ol>
                </nav>

                {/* Hero Showcase Banner */}
                <section className="course-hero-banner mb-4 shadow-sm">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                <span className="badge bg-warning text-dark fw-bold px-3 py-1 text-uppercase">FEATURED DIPLOMA</span>
                                <span className="badge bg-dark border border-secondary text-light text-uppercase">{course.level} LEVEL</span>
                                <span className="badge bg-dark border border-secondary text-light text-uppercase">{course.duration_weeks} WEEKS</span>
                            </div>
                            <h1 className="display-6 fw-bold mb-2">{course.title}</h1>
                            <p className="mb-3 opacity-75 small leading-relaxed">
                                {course.description}
                            </p>

                            <div className="d-flex flex-wrap align-items-center gap-4 small opacity-90">
                                <span><i className="bi bi-star-fill text-warning me-1"></i> <strong>4.95</strong> (420 Ratings)</span>
                                <span><i className="bi bi-people-fill me-1" style={{color: "var(--desert-gold)"}}></i> <strong>1,280</strong> Students Enrolled</span>
                                <span><i className="bi bi-translate me-1" style={{color: "var(--desert-gold)"}}></i> English & Arabic Terminology</span>
                            </div>
                        </div>

                        <div className="col-lg-4 text-lg-end text-start">
                            <div className="font-quranic display-4 fw-bold text-warning mb-1" dir="rtl">{course.arabicTag || "أُصُولُ الفِقْهِ"}</div>
                            <p className="small text-white-50 mb-0">Text: Relevant Classical Material</p>
                        </div>
                    </div>
                </section>

                {/* Content Layout Grid */}
                <div className="row g-4">
                    
                    {/* Main Details Column */}
                    <div className="col-lg-8">
                        
                        {/* Course Overview Section */}
                        <section id="overview" className="detail-card shadow-sm">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <i className="bi bi-journal-text" style={{color: "var(--desert-terracotta)"}}></i> Course Description & Objectives
                            </h4>
                            <p className="text-muted mb-3" style={{lineHeight: "1.75"}}>
                                {course.description}
                            </p>
                            <p className="text-muted mb-0" style={{lineHeight: "1.75"}}>
                                In this {course.duration_weeks}-week program, students will explore the foundational principles and methods of this important discipline, equipping them with the right tools and mindset to understand traditional scholarship.
                            </p>
                        </section>

                        {/* What You Will Learn Section */}
                        <section id="outcomes" className="detail-card shadow-sm">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-check2-circle" style={{color: "var(--desert-terracotta)"}}></i> What You Will Master
                            </h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="outcome-box">
                                        <div className="outcome-icon"><i className="bi bi-check-lg"></i></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Foundational Understanding</h6>
                                            <small className="text-muted">Grasp the core concepts and methodologies related to the subject.</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="outcome-box">
                                        <div className="outcome-icon"><i className="bi bi-check-lg"></i></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Primary Evidences</h6>
                                            <small className="text-muted">Learn how primary sources are utilized and understood in this context.</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Syllabus Accordion Section */}
                        <section id="syllabus" className="detail-card shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                        <i className="bi bi-list-task" style={{color: "var(--desert-terracotta)"}}></i> Course Curriculum
                                    </h4>
                                    <small className="text-muted">{curriculum.length} Modules • {totalLessons} Detailed Lessons</small>
                                </div>
                                <button className="btn btn-sm btn-desert-outline" onClick={() => setOpenModuleIndex(-1)}>Collapse All</button>
                            </div>

                            <div className="accordion" id="curriculumAccordion">
                                {curriculum.map((module, mIndex) => {
                                    const isOpen = openModuleIndex === mIndex;
                                    return (
                                    <div className="accordion-item" key={module.slug || module.key}>
                                        <h2 className="accordion-header" id={`heading${mIndex}`}>
                                            <button 
                                                className={`accordion-button ${!isOpen ? 'collapsed' : ''}`} 
                                                type="button" 
                                                onClick={() => setOpenModuleIndex(isOpen ? -1 : mIndex)}
                                                aria-expanded={isOpen ? "true" : "false"}
                                            >
                                                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                                    <span>Module {mIndex + 1}: {module.title}</span>
                                                    <span className="badge bg-secondary-subtle text-dark border small fw-semibold">{module.lessons?.length || 0} Lessons</span>
                                                </div>
                                            </button>
                                        </h2>
                                        <div 
                                            id={`collapse${mIndex}`} 
                                            className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                            data-bs-parent="#curriculumAccordion"
                                        >
                                            <div className="accordion-body p-0">
                                                {module.lessons?.map((lesson, lIndex) => (
                                                    <div className="lesson-row" key={lesson.slug}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className={`bi ${mIndex === 0 && lIndex === 0 ? 'bi-play-circle-fill text-warning' : 'bi-lock-fill text-muted'} fs-5`}></i>
                                                            <div>
                                                                <span className="fw-bold d-block">{mIndex + 1}.{lIndex + 1} {lesson.title}</span>
                                                                <small className="text-muted">Video • {lesson.duration || "45 mins"}</small>
                                                            </div>
                                                        </div>
                                                        {mIndex === 0 && lIndex === 0 && (
                                                            <span className="badge bg-success-subtle text-success border">Preview Available</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </section>

                        {/* Instructor Scholar Section */}
                        <section id="instructor" className="detail-card shadow-sm">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-person-badge" style={{color: "var(--desert-terracotta)"}}></i> Lead Scholar & Instructor
                            </h4>

                            <div className="d-flex flex-column flex-sm-row align-items-start gap-4">
                                <div className="scholar-avatar d-flex align-items-center justify-content-center rounded-circle text-white shadow fw-bold" style={{
                                    width: "75px",
                                    height: "75px",
                                    minWidth: "75px",
                                    backgroundColor: "var(--desert-terracotta)",
                                    fontSize: "1.75rem",
                                    border: "4px solid var(--desert-sand)"
                                }}>
                                    {course.instructor.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
                                </div>
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <h5 className="fw-bold mb-0">{course.instructor}</h5>
                                        <span className="badge bg-warning text-dark"><i className="bi bi-check-seal-fill me-1"></i> Ijazah Certified</span>
                                    </div>
                                    <p className="small text-muted mb-2">Senior Faculty Member</p>
                                    <p className="small text-muted mb-3" style={{lineHeight: "1.6"}}>
                                        The instructor brings years of traditional learning and academic rigor, ensuring an authentic and structured delivery of classical Islamic sciences.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section id="faq" className="detail-card shadow-sm">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <i className="bi bi-question-circle" style={{color: "var(--desert-terracotta)"}}></i> Frequently Asked Questions
                            </h4>

                            <div className="accordion accordion-flush" id="faqAccordion">
                                <div className="accordion-item border-0 border-bottom">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-transparent shadow-none" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#faq1">
                                            Is prior knowledge required?
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body text-muted small">
                                            This course is designed to accommodate students of varying levels, though a basic understanding of Islamic terminology is beneficial.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Sticky Enrollment Box */}
                    <div className="col-lg-4">
                        <div className="sticky-enroll-card">

                            {/* Video Preview Frame */}
                            <div className="video-preview-frame">
                                <button className="btn-play-preview mb-2">
                                    <i className="bi bi-play-fill ms-1"></i>
                                </button>
                                <span className="small fw-semibold">Preview Course Trailer</span>
                            </div>

                            {/* Price & Access Tag */}
                            <div className="d-flex align-items-baseline justify-content-between mb-3">
                                <div>
                                    <span className="fs-2 fw-bold text-dark">Free Access</span>
                                </div>
                                <span className="badge bg-danger-subtle text-danger border fw-bold px-2 py-1">Open Enrollment</span>
                            </div>

                            {/* Primary CTA Button */}
                            <Link to={`/learn/${course.slug}`} className={`btn btn-desert-primary w-100 py-3 mb-3 fw-bold ${course.is_coming_soon ? 'disabled' : ''}`} style={{ pointerEvents: course.is_coming_soon ? 'none' : 'auto' }}>
                                <i className="bi bi-journal-check me-2"></i> {course.is_coming_soon ? 'Coming Soon' : 'Enroll In Track Now'}
                            </Link>

                            <button className="btn btn-desert-outline w-100 py-2 mb-4 text-center">
                                <i className="bi bi-bookmark me-1"></i> Save to Wishlist
                            </button>

                            {/* What's Included List */}
                            <h6 className="fw-bold mb-3 small text-uppercase" style={{letterSpacing: "0.5px", color: "var(--desert-night)"}}>This Program Includes:</h6>
                            <div className="d-flex flex-column gap-3 mb-4 small text-muted">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-film fs-6" style={{color: "var(--desert-terracotta)"}}></i>
                                    <span>On-Demand HD Video Lectures</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-file-earmark-pdf fs-6" style={{color: "var(--desert-terracotta)"}}></i>
                                    <span>Downloadable Classical Texts & Notes</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-person-video3 fs-6" style={{color: "var(--desert-terracotta)"}}></i>
                                    <span>Weekly Live Scholar Q&A Webinars</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-infinity fs-6" style={{color: "var(--desert-terracotta)"}}></i>
                                    <span>Lifetime Portal Access & Updates</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
