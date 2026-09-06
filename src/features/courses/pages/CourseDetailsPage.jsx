import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseDetails } from "../services/coursesApi";
import { getSiteLanguage } from "../../../services/siteLanguage";

export default function CourseDetailsPage() {
	const { courseId } = useParams();
	const [course, setCourse] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openModuleIndex, setOpenModuleIndex] = useState(0);
	const [selectedDonation, setSelectedDonation] = useState(35);
	const [isWishlisted, setIsWishlisted] = useState(false);
	const [copied, setCopied] = useState(false);

	const fetchDetails = useCallback(async () => {
		if (!courseId) return;
		setIsLoading(true);
		setError(null);
		try {
			const lang = getSiteLanguage();
			const data = await getCourseDetails(courseId, lang);
			setCourse(data);
		} catch (err) {
			console.error("Failed to load course details:", err);
			setError(err.message || "Failed to load course details.");
		} finally {
			setIsLoading(false);
		}
	}, [courseId]);

	useEffect(() => {
		fetchDetails();

		const handleLangChange = () => {
			fetchDetails();
		};

		window.addEventListener("siteLanguageChange", handleLangChange);
		return () => {
			window.removeEventListener("siteLanguageChange", handleLangChange);
		};
	}, [fetchDetails]);

	const handleCopyLink = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	if (isLoading) {
		return (
			<div
				className="container py-5 text-center d-flex flex-column align-items-center justify-content-center"
				style={{ minHeight: "80vh" }}
			>
				<div
					className="spinner-border text-warning"
					role="status"
					style={{ width: "3rem", height: "3rem" }}
				>
					<span className="visually-hidden">Loading Course Details...</span>
				</div>
				<p className="text-muted mt-3 fw-semibold">Loading course details...</p>
			</div>
		);
	}

	if (error || !course) {
		return (
			<div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
				<div className="alert alert-danger max-w-md mx-auto" role="alert">
					<i className="bi bi-exclamation-triangle-fill me-2"></i>
					{error || "Course not found."}
				</div>
				<Link to="/courses" className="btn btn-desert-primary mt-3">
					Back to Courses
				</Link>
			</div>
		);
	}

	const translation = course.translation || {};
	const author = translation.author || {};
	const curriculum = course.modules || [];
	const totalLessons = curriculum.reduce(
		(acc, mod) => acc + (mod.lessons?.length || 0),
		0,
	);
	const durationWeeks = translation.duration || 12;
	const courseLevel = course.type || "Beginner";
	const isComingSoon = course.coming_soon === true;
	const keyPoints = Array.isArray(translation.key_points)
		? translation.key_points
		: [];

	const authorInitials =
		author.abbreviation ||
		author.name
			?.split(" ")
			.map((n) => n[0])
			.slice(0, 2)
			.join("")
			.toUpperCase() ||
		"AAA";

	return (
		<div className="pb-5 text-start">
			{/* Section Navigation Tabs */}
			<div className="sticky-course-nav">
				<div className="container d-flex align-items-center gap-1 overflow-auto">
					<a href="#overview" className="course-nav-link active">
						Overview
					</a>
					<a href="#outcomes" className="course-nav-link">
						What You'll Learn
					</a>
					<a href="#syllabus" className="course-nav-link">
						Syllabus ({totalLessons} Lessons)
					</a>
					<a href="#instructor" className="course-nav-link">
						Scholar Bio
					</a>
				</div>
			</div>

			{/* Page Body */}
			<main className="container py-4">
				{/* Breadcrumbs */}
				<nav aria-label="breadcrumb" className="mb-3">
					<ol className="breadcrumb small">
						<li className="breadcrumb-item">
							<Link to="/">Home</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to="/courses">Courses & Tracks</Link>
						</li>
						<li className="breadcrumb-item active" aria-current="page">
							{translation.title || course.slug}
						</li>
					</ol>
				</nav>

				{/* Hero Showcase Banner */}
				<section className="course-hero-banner mb-4 shadow-sm position-relative overflow-hidden">
					<div
						className="course-hero-watermark font-quranic"
						dir="rtl"
						aria-hidden="true"
					>
						{course.arabic_title || "العِلْم"}
					</div>
					<div
						className="row align-items-center g-4 position-relative"
						style={{ zIndex: 2 }}
					>
						<div className="col-lg-8">
							<div className="d-flex flex-wrap gap-2 mb-2">
								<span className="badge bg-warning text-dark fw-bold px-3 py-1 text-uppercase">
									{courseLevel} LEVEL
								</span>
								<span className="badge bg-dark border border-secondary text-light text-uppercase">
									{durationWeeks} WEEKS
								</span>
							</div>
							<h1 className="display-6 fw-bold mb-2">
								{translation.title || course.slug}
							</h1>
							{translation.desc && (
								<p className="mb-3 opacity-75 small leading-relaxed">
									{translation.desc}
								</p>
							)}

							<div className="d-flex flex-wrap align-items-center gap-4 small opacity-90">
								<span>
									<i className="bi bi-star-fill text-warning me-1"></i>{" "}
									<strong>4.95</strong> (420 Ratings)
								</span>
								<span>
									<i
										className="bi bi-people-fill me-1"
										style={{ color: "var(--desert-gold)" }}
									></i>{" "}
									<strong>1,280</strong> Students Enrolled
								</span>
								<span>
									<i
										className="bi bi-translate me-1"
										style={{ color: "var(--desert-gold)" }}
									></i>{" "}
									English & Arabic Terminology
								</span>
							</div>
						</div>

						<div className="col-lg-4 text-lg-end text-start">
							{course.arabic_title && (
								<div
									className="font-quranic display-4 fw-bold text-warning mb-1"
									dir="rtl"
								>
									{course.arabic_title}
								</div>
							)}
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
								<i
									className="bi bi-journal-text"
									style={{ color: "var(--desert-terracotta)" }}
								></i>{" "}
								Course Description & Objectives
							</h4>
							{translation.objectives ? (
								<div
									className="text-muted mb-3 course-objectives-content"
									style={{ lineHeight: "1.75" }}
									dangerouslySetInnerHTML={{ __html: translation.objectives }}
								/>
							) : (
								<></>
							)}
						</section>

						{/* What You Will Learn Section */}
						<section id="outcomes" className="detail-card shadow-sm">
							<h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
								<i
									className="bi bi-check2-circle"
									style={{ color: "var(--desert-terracotta)" }}
								></i>{" "}
								What You Will Master
							</h4>
							<div className="row g-3">
								{keyPoints.length > 0 ? (
									keyPoints.map((kp, idx) => (
										<div className="col-md-6" key={idx}>
											<div className="outcome-box">
												<div className="outcome-icon">
													<i className="bi bi-check-lg"></i>
												</div>
												<div>
													<h6 className="fw-bold mb-1">{kp.topic}</h6>
													<small className="text-muted">{kp.desc}</small>
												</div>
											</div>
										</div>
									))
								) : (
									<></>
								)}
							</div>
						</section>

						{/* Syllabus Accordion Section */}
						<section id="syllabus" className="detail-card shadow-sm">
							<div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
								<div>
									<h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
										<i
											className="bi bi-list-task"
											style={{ color: "var(--desert-terracotta)" }}
										></i>{" "}
										Course Curriculum
									</h4>
									<small className="text-muted">
										{curriculum.length} Modules • {totalLessons} Detailed
										Lessons
									</small>
								</div>
							</div>

							<div className="accordion" id="curriculumAccordion">
								{curriculum.map((module, mIndex) => {
									const isOpen = openModuleIndex === mIndex;
									return (
										<div
											className="accordion-item"
											key={module.id || module.slug || mIndex}
										>
											<h2 className="accordion-header" id={`heading${mIndex}`}>
												<button
													className={`accordion-button ${!isOpen ? "collapsed" : ""}`}
													type="button"
													onClick={() =>
														setOpenModuleIndex(isOpen ? -1 : mIndex)
													}
													aria-expanded={isOpen ? "true" : "false"}
												>
													<div className="d-flex justify-content-between align-items-center w-100 me-3">
														<span>
															Module {mIndex + 1}: {module.title}
														</span>
														<span className="badge bg-secondary-subtle text-dark border small fw-semibold">
															{module.lessons?.length || 0} Lessons
														</span>
													</div>
												</button>
											</h2>
											<div
												id={`collapse${mIndex}`}
												className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
												data-bs-parent="#curriculumAccordion"
											>
												<div className="accordion-body p-0">
													{module.lessons?.map((lesson, lIndex) => (
														<div
															className="lesson-row"
															key={lesson.id || lesson.slug || lIndex}
														>
															<div className="d-flex align-items-center gap-3">
																<i
																	className={`bi ${mIndex === 0 && lIndex === 0 ? "bi-play-circle-fill text-warning" : "bi-lock-fill text-muted"} fs-5`}
																></i>
																<div>
																	<span className="fw-bold d-block">
																		{mIndex + 1}.{lIndex + 1} {lesson.title}
																	</span>
																	{lesson.desc ? (
																		<small className="text-muted">
																			{lesson.desc}
																		</small>
																	) : (
																		<small className="text-muted">
																			Lesson {lIndex + 1} • 45 mins
																		</small>
																	)}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</section>

						{/* Instructor Scholar Section */}
						<section id="instructor" className="detail-card shadow-sm">
							<h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
								<i
									className="bi bi-person-badge"
									style={{ color: "var(--desert-terracotta)" }}
								></i>{" "}
								Lead Scholar & Instructor
							</h4>

							<div className="d-flex flex-column flex-sm-row align-items-start gap-4">
								<div className="scholar-avatar">{authorInitials}</div>
								<div>
									<div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
										<h5 className="fw-bold mb-0">
											{author.name || "Al-Athar Academy"}
										</h5>
									</div>
									<p className="small text-muted mb-2">
										{author.certification ||
											"Senior Faculty in Traditional Islamic Sciences"}
									</p>
									<p
										className="small text-muted mb-3"
										style={{ lineHeight: "1.6" }}
									>
										{author.desc ||
											"Dedicated to authentic, structured delivery of classical Islamic sciences through traditional scholarship."}
									</p>
									<div className="d-flex gap-3 small text-muted">
										<span>
											<i className="bi bi-book me-1"></i> Classical Curriculum
										</span>
										<span>
											<i className="bi bi-mortarboard me-1"></i> Verified
											Certification
										</span>
									</div>
								</div>
							</div>
						</section>
					</div>

					{/* Right Column: Sticky Enrollment & Donation Box */}
					<div className="col-lg-4">
						<div className="sticky-enroll-card">
							{/* Creative Sacred Knowledge Donation Header */}
							<div
								className="p-3 rounded-4 mb-3 position-relative overflow-hidden"
								style={{
									background:
										"linear-gradient(135deg, rgba(245, 238, 226, 0.95) 0%, rgba(237, 225, 206, 0.7) 100%)",
									border: "1px solid rgba(194, 150, 83, 0.35)",
									boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
								}}
							>
								{/* Subtle Arabic Watermark Accent */}
								<span
									className="font-quranic position-absolute text-warning"
									style={{
										fontSize: "5.5rem",
										opacity: 0.12,
										right: "-10px",
										bottom: "-20px",
										pointerEvents: "none",
										lineHeight: 1,
									}}
									dir="rtl"
								>
									صدقة
								</span>

								{/* Top Row: Icon + Continuous Reward Badge */}
								<div
									className="d-flex align-items-center justify-content-between mb-2 position-relative"
									style={{ zIndex: 1 }}
								>
									<div className="d-flex align-items-center gap-2">
										<span
											className="d-inline-flex align-items-center justify-content-center rounded-circle text-white shadow-xs"
											style={{
												width: "28px",
												height: "28px",
												background:
													"linear-gradient(135deg, var(--desert-terracotta), #8C3B29)",
											}}
										>
											<i
												className="bi bi-heart-fill animate-pulse-heart"
												style={{ fontSize: "0.72rem" }}
											></i>
										</span>
										<span
											className="badge bg-white text-dark border border-secondary-subtle px-2 py-1 rounded-pill fw-bold"
											style={{ fontSize: "0.68rem" }}
										>
											WAQF ENDOWMENT
										</span>
									</div>
									<span
										className="badge bg-warning text-dark border border-warning-subtle fw-bold px-2.5 py-1 rounded-pill shadow-xs"
										style={{ fontSize: "0.68rem" }}
									>
										<i className="bi bi-infinity me-1"></i> Continuous Reward
									</span>
								</div>

								{/* Middle: Title & Subtitle */}
								<div
									className="d-flex align-items-baseline justify-content-between position-relative mt-1"
									style={{ zIndex: 1 }}
								>
									<div>
										<h4 className="fw-bold mb-0 text-dark">Sadaqah Jariyah</h4>
										<small
											className="text-muted fw-semibold"
											style={{ fontSize: "0.75rem" }}
										>
											100% Free Tuition for Seekers of Knowledge
										</small>
									</div>
								</div>

								{/* Bottom Micro Trust Bar */}
								<div
									className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top position-relative"
									style={{
										borderColor: "rgba(194, 150, 83, 0.25)",
										zIndex: 1,
										fontSize: "0.72rem",
									}}
								>
									<span className="text-muted d-flex align-items-center gap-1">
										<i
											className="bi bi-people-fill"
											style={{ color: "var(--desert-terracotta)" }}
										></i>
										<strong>1,280+</strong> Persons Funded
									</span>
									<span className="text-success fw-bold d-flex align-items-center gap-1">
										<i className="bi bi-patch-check-fill"></i> 0% Admin Fee
									</span>
								</div>
							</div>

							{/* Quick Donation Preset Selector */}
							<div className="d-flex gap-1.5 mb-3">
								{[15, 35, 75, 150].map((amt) => (
									<button
										key={amt}
										type="button"
										className={`btn btn-sm flex-grow-1 rounded-pill fw-bold border ${
											selectedDonation === amt
												? "btn-desert-primary text-white shadow-xs"
												: "bg-white text-dark border-secondary-subtle"
										}`}
										style={{
											fontSize: "0.8rem",
											padding: "0.35rem 0.5rem",
											transition: "all 0.15s ease",
										}}
										onClick={() => setSelectedDonation(amt)}
									>
										${amt}
									</button>
								))}
							</div>

							{/* Primary CTA Button: Sponsor/Donate */}
							<Link
								to={`/donate?amount=${selectedDonation}&course=${course.slug}`}
								className="btn btn-desert-primary w-100 py-3 mb-2 fw-bold text-center d-flex align-items-center justify-content-center gap-2 shadow-sm"
								style={{ borderRadius: "12px" }}
							>
								<i className="bi bi-heart-fill text-white animate-pulse-heart"></i>
								<span>Donate (${selectedDonation})</span>
							</Link>

							{/* Secondary Button: Free Learning Enrollment */}
							{isComingSoon ? (
								<button
									className="btn btn-desert-outline w-100 py-2 mb-4 text-center disabled"
									disabled
									style={{ opacity: 0.65, borderRadius: "12px" }}
								>
									<i className="bi bi-clock me-1"></i> Course Coming Soon
								</button>
							) : (
								<Link
									to={`/learn/${course.slug}`}
									className="btn btn-desert-outline w-100 py-2 mb-4 text-center d-flex align-items-center justify-content-center gap-1.5"
									style={{ borderRadius: "12px" }}
								>
									<i className="bi bi-journal-check me-1"></i>
									<span>Start Learning Free</span>
									<i className="bi bi-arrow-right small ms-1"></i>
								</Link>
							)}

							{/* What Your Contribution Supports List */}
							<h6
								className="fw-bold mb-3 small text-uppercase"
								style={{
									letterSpacing: "0.5px",
									color: "var(--desert-night)",
								}}
							>
								Your Contribution Supports:
							</h6>
							<div className="d-flex flex-column gap-2.5 mb-4 small text-muted">
								<div className="d-flex align-items-center gap-2">
									<i
										className="bi bi-people-fill fs-6"
										style={{ color: "var(--desert-terracotta)" }}
									></i>
									<span>100% Free Tuition for Global Students</span>
								</div>
								<div className="d-flex align-items-center gap-2">
									<i
										className="bi bi-translate fs-6"
										style={{ color: "var(--desert-terracotta)" }}
									></i>
									<span>Multi-Language Translation & Subtitles</span>
								</div>
								<div className="d-flex align-items-center gap-2">
									<i
										className="bi bi-file-earmark-pdf fs-6"
										style={{ color: "var(--desert-terracotta)" }}
									></i>
									<span>Classical Manuscript Digitization & Notes</span>
								</div>
								<div className="d-flex align-items-center gap-2">
									<i
										className="bi bi-person-video3 fs-6"
										style={{ color: "var(--desert-terracotta)" }}
									></i>
									<span>Weekly Live Scholar Q&A & Research</span>
								</div>
								<div className="d-flex align-items-center gap-2">
									<i
										className="bi bi-award-fill fs-6"
										style={{ color: "var(--desert-terracotta)" }}
									></i>
									<span>Ongoing Sadaqah Jariyah in Your Scale</span>
								</div>
							</div>

							{/* Share Links */}
							<div
								className="pt-3 border-top text-center"
								style={{ borderColor: "var(--desert-dune) !important" }}
							>
								<span className="small text-muted d-block mb-2">
									Share this cause with fellow seekers:
								</span>
								<div className="d-flex justify-content-center gap-2">
									<a
										href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
											`Support Sacred Islamic Education: Study or Sponsor ${translation.title || course.slug} on Al-Athar: ${window.location.href}`,
										)}`}
										target="_blank"
										rel="noreferrer"
										className="btn btn-sm btn-outline-secondary rounded-circle"
										style={{
											width: "34px",
											height: "34px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
										}}
										title="Share on WhatsApp"
									>
										<i className="bi bi-whatsapp"></i>
									</a>
									<a
										href={`https://t.me/share/url?url=${encodeURIComponent(
											window.location.href,
										)}&text=${encodeURIComponent(`Support Sacred Islamic Education: ${translation.title || course.slug}`)}`}
										target="_blank"
										rel="noreferrer"
										className="btn btn-sm btn-outline-secondary rounded-circle"
										style={{
											width: "34px",
											height: "34px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
										}}
										title="Share on Telegram"
									>
										<i className="bi bi-telegram"></i>
									</a>
									<a
										href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
											window.location.href,
										)}&text=${encodeURIComponent(`Support Sacred Islamic Education: ${translation.title || course.slug}`)}`}
										target="_blank"
										rel="noreferrer"
										className="btn btn-sm btn-outline-secondary rounded-circle"
										style={{
											width: "34px",
											height: "34px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
										}}
										title="Share on X"
									>
										<i className="bi bi-twitter-x"></i>
									</a>
									<button
										type="button"
										onClick={handleCopyLink}
										className="btn btn-sm btn-outline-secondary rounded-circle"
										style={{
											width: "34px",
											height: "34px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
										}}
										title={copied ? "Link Copied!" : "Copy link"}
									>
										<i
											className={`bi ${copied ? "bi-check2 text-success" : "bi-link-45deg"}`}
										></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
