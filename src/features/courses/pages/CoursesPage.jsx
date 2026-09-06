import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/coursesApi";
import { getSiteLanguage } from "../../../services/siteLanguage";

const TRANSLATION_LANGUAGES = [
	{ code: "en", label: "EN", name: "English" },
	{ code: "ml", label: "ML", name: "മലയാളം" },
	{ code: "hi", label: "HI", name: "हिन्दी" },
	{ code: "ar", label: "AR", name: "العربية" },
];

/** Split long text into manageable chunks */
const chunkText = (text, maxLength = 400) => {
	if (!text || text.length <= maxLength) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > maxLength) {
		let splitIndex = remaining.lastIndexOf(".", maxLength);
		if (splitIndex === -1 || splitIndex < maxLength * 0.4) {
			splitIndex = remaining.lastIndexOf(" ", maxLength);
		}
		if (splitIndex === -1) splitIndex = maxLength;
		chunks.push(remaining.slice(0, splitIndex + 1).trim());
		remaining = remaining.slice(splitIndex + 1).trim();
	}
	if (remaining.length > 0) chunks.push(remaining);
	return chunks;
};

/** Translate string via Google Translate free endpoint */
const translateText = async (text, targetLang, cacheRef) => {
	if (!text || targetLang === "en") return text;
	const cacheKey = `${targetLang}::${text.slice(0, 80)}`;
	if (cacheRef.current[cacheKey]) return cacheRef.current[cacheKey];
	try {
		const chunks = chunkText(text, 400);
		const translated = (
			await Promise.all(
				chunks.map(async (chunk) => {
					const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
					const res = await fetch(url);
					if (!res.ok) return chunk;
					const data = await res.json();
					return data[0]?.map((c) => c[0]).join("") || chunk;
				})
			)
		).join(" ");
		cacheRef.current[cacheKey] = translated;
		return translated;
	} catch {
		return text;
	}
};

export default function CoursesPage() {
	// Courses & pagination state
	const [courses, setCourses] = useState([]);
	const [nextCursor, setNextCursor] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [error, setError] = useState(null);

	// Filter & search state
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	// Google Translation state (only for course title & desc)
	const [selectedLang, setSelectedLang] = useState("en");
	const [translations, setTranslations] = useState({});
	const [isTranslating, setIsTranslating] = useState(false);
	const translationCache = useRef({});

	const categories = [
		{ label: "All Courses", value: "All" },
		{ label: "Beginner", value: "Beginner" },
		{ label: "Intermediate", value: "Intermediate" },
		{ label: "Advanced", value: "Advanced" },
	];

	// Helper for course icon based on slug/type
	const getCourseIcon = (slug, type) => {
		switch (slug) {
			case "fundamentals-of-islam":
				return "bi-stars";
			case "fiqh":
				return "bi-shield-check";
			case "akhlaq":
				return "bi-heart-half";
			case "thareeq":
				return "bi-hourglass-split";
			case "thafseer":
				return "bi-journal-bookmark-fill";
			case "judicial-laws":
				return "bi-bank";
			default:
				if (type?.toLowerCase() === "advanced") return "bi-mortarboard-fill";
				if (type?.toLowerCase() === "intermediate") return "bi-journal-text";
				return "bi-book-half";
		}
	};

	// Initial fetch
	const fetchInitialCourses = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const lang = getSiteLanguage();
			const res = await getCourses({ translation: lang });
			setCourses(res.courses);
			setNextCursor(res.nextCursor);
		} catch (err) {
			console.error("Failed to load courses:", err);
			setError(err.message || "Failed to load courses. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Translate only course title and desc with Google Translate
	const translateCoursesList = useCallback(
		async (coursesToTranslate, langCode) => {
			if (langCode === "en" || !coursesToTranslate?.length) return;
			setIsTranslating(true);
			try {
				const newTranslations = {};
				await Promise.all(
					coursesToTranslate.map(async (course) => {
						const idKey = course.id || course.slug;
						const origTitle =
							course.translation?.title || course.title || course.slug || "";
						const origDesc =
							course.translation?.desc || course.description || "";

						const [tTitle, tDesc] = await Promise.all([
							origTitle
								? translateText(origTitle, langCode, translationCache)
								: Promise.resolve(""),
							origDesc
								? translateText(origDesc, langCode, translationCache)
								: Promise.resolve(""),
						]);

						newTranslations[`${idKey}_title`] = tTitle;
						newTranslations[`${idKey}_desc`] = tDesc;
					})
				);
				setTranslations((prev) => ({ ...prev, ...newTranslations }));
			} catch (err) {
				console.error("Error translating courses:", err);
			} finally {
				setIsTranslating(false);
			}
		},
		[]
	);

	// Handle language selection change
	const handleLanguageChange = (langCode) => {
		setSelectedLang(langCode);
		if (langCode === "en") {
			setTranslations({});
			return;
		}
		translateCoursesList(courses, langCode);
	};

	// Handle Clear translation (Reset to EN)
	const handleClearTranslation = () => {
		setSelectedLang("en");
		setTranslations({});
	};

	// Initial load and language change listener
	useEffect(() => {
		fetchInitialCourses();

		const handleLangChange = () => {
			fetchInitialCourses();
		};

		window.addEventListener("siteLanguageChange", handleLangChange);
		return () => {
			window.removeEventListener("siteLanguageChange", handleLangChange);
		};
	}, [fetchInitialCourses]);

	// Automatically translate newly loaded courses when non-EN language is selected
	useEffect(() => {
		if (selectedLang !== "en" && courses.length > 0) {
			translateCoursesList(courses, selectedLang);
		}
	}, [courses.length, selectedLang, translateCoursesList]);

	// Load more (scroll pagination)
	const loadMore = useCallback(async () => {
		if (!nextCursor || isLoadingMore || isLoading) return;

		setIsLoadingMore(true);
		try {
			const lang = getSiteLanguage();
			const res = await getCourses({ cursor: nextCursor, translation: lang });
			setCourses((prev) => {
				const existingIds = new Set(prev.map((c) => c.id || c.slug));
				const newUnique = (res.courses || []).filter(
					(c) => !existingIds.has(c.id || c.slug),
				);
				return [...prev, ...newUnique];
			});
			setNextCursor(res.nextCursor);
		} catch (err) {
			console.error("Failed to load more courses:", err);
		} finally {
			setIsLoadingMore(false);
		}
	}, [nextCursor, isLoadingMore, isLoading]);

	// Infinite scroll observer
	const loadMoreRef = useRef(null);
	useEffect(() => {
		if (!nextCursor) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ threshold: 0.1, rootMargin: "120px" },
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) observer.unobserve(currentRef);
			observer.disconnect();
		};
	}, [nextCursor, loadMore]);

	// Filter courses client-side
	const filteredCourses = courses.filter((course) => {
		const matchesCategory =
			activeCategory === "All" ||
			course.type?.toLowerCase() === activeCategory.toLowerCase();

		const searchLower = searchTerm.toLowerCase().trim();
		if (!searchLower) return matchesCategory;

		const idKey = course.id || course.slug;
		const translatedTitle = translations[`${idKey}_title`];
		const translatedDesc = translations[`${idKey}_desc`];

		const title =
			translatedTitle ||
			course.translation?.title ||
			course.title ||
			course.slug ||
			"";
		const desc =
			translatedDesc ||
			course.translation?.desc ||
			course.description ||
			"";
		const author =
			course.translation?.author?.name ||
			course.translation?.author?.abbreviation ||
			course.instructor ||
			"";
		const arabicTitle = course.arabic_title || course.arabicTag || "";
		const slug = course.slug || "";

		const matchesSearch =
			title.toLowerCase().includes(searchLower) ||
			desc.toLowerCase().includes(searchLower) ||
			author.toLowerCase().includes(searchLower) ||
			arabicTitle.toLowerCase().includes(searchLower) ||
			slug.toLowerCase().includes(searchLower);

		return matchesCategory && matchesSearch;
	});

	return (
		<div style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}>
			<main className="container py-4 text-start">
				{/* Header Banner */}
				<section className="courses-header-banner mb-5 shadow-sm text-start">
					<div className="row align-items-center g-4">
						<div className="col-lg-7">
							<span
								className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold"
								style={{ fontSize: "0.75rem" }}
							>
								STRUCTURED CURRICULUMS • QUALIFIED SCHOLARS
							</span>
							<h1 className="display-6 fw-bold mb-3">
								Sacred Knowledge & Learning Tracks
							</h1>
							<p
								className="mb-0 opacity-75 lead"
								style={{ fontSize: "1.05rem" }}
							>
								From fundamental creed and Islamic history to prophetic
								character and legal jurisprudence, embark on a progressive
								journey guided by classical manuscripts and traditional
								scholarship.
							</p>
						</div>
						<div className="col-lg-5 text-lg-end text-start">
							<div className="d-flex flex-column gap-2 align-items-lg-end">
								<div
									className="d-flex align-items-center gap-3 bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary"
									style={{
										maxWidth: "320px",
										borderColor: "rgba(194, 150, 83, 0.3) !important",
									}}
								>
									<i className="bi bi-award-fill text-warning fs-2"></i>
									<div className="text-start">
										<h6 className="fw-bold mb-0">Ijazah & Certifications</h6>
										<small className="opacity-75">
											Verified completion tracks
										</small>
									</div>
								</div>
								<div
									className="d-flex align-items-center gap-3 bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary"
									style={{
										maxWidth: "320px",
										borderColor: "rgba(194, 150, 83, 0.3) !important",
									}}
								>
									<i className="bi bi-person-video3 text-warning fs-2"></i>
									<div className="text-start">
										<h6 className="fw-bold mb-0">Live Scholar Q&A</h6>
										<small className="opacity-75">
											Interactive weekly sessions
										</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Search & Discipline Filters (Sticky Bar) */}
				<div className="sticky-filter-bar mb-4 py-2">
					<div className="row align-items-center g-3">
						<div className="col-lg-4 col-xl-4">
							<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
								<i className="bi bi-search text-muted ms-2 me-2"></i>
								<input
									type="text"
									className="form-control border-0 shadow-none bg-transparent"
									placeholder="Search course by topic, title, or scholar..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								{searchTerm && (
									<button
										className="btn btn-sm btn-link text-muted me-1 p-0 text-decoration-none"
										onClick={() => setSearchTerm("")}
										title="Clear search"
									>
										<i className="bi bi-x-circle-fill"></i>
									</button>
								)}
								<button
									className="btn btn-sm text-white px-3 fw-bold border-0"
									style={{
										backgroundColor: "var(--desert-terracotta)",
										borderRadius: "10px",
									}}
								>
									Search
								</button>
							</div>
						</div>
						<div className="col-lg-8 col-xl-8">
							<div className="d-flex flex-wrap align-items-center gap-2 justify-content-lg-end">
								{/* Type / Level Filter Pills */}
								<div
									className="d-flex gap-2 overflow-auto pb-1 no-scrollbar flex-nowrap"
									style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
								>
									{categories.map((cat) => (
										<button
											key={cat.value}
											className={`filter-pill-btn border-0 ${activeCategory === cat.value ? "active" : ""}`}
											onClick={() => setActiveCategory(cat.value)}
										>
											{cat.label}
										</button>
									))}
								</div>

								{/* Google Translation Languages + Clear */}
								<div
									className="d-flex align-items-center gap-1 bg-white p-1 rounded-pill border border-light shadow-xs ms-lg-2"
									style={{ flexShrink: 0 }}
								>
									<span
										className="px-2 text-muted small d-flex align-items-center gap-1 fw-semibold"
										title="Google Translate (Title & Description)"
									>
										{isTranslating ? (
											<span
												className="spinner-border spinner-border-sm text-warning"
												role="status"
												style={{ width: "12px", height: "12px" }}
											></span>
										) : (
											<i
												className="bi bi-translate fs-6"
												style={{ color: "var(--desert-terracotta)" }}
											></i>
										)}
									</span>
									{TRANSLATION_LANGUAGES.map((lang) => {
										const isActive = selectedLang === lang.code;
										return (
											<button
												key={lang.code}
												type="button"
												className={`btn btn-sm py-1 px-2 border-0 rounded-pill fw-bold ${
													isActive ? "text-white" : "text-dark bg-transparent"
												}`}
												style={{
													fontSize: "0.75rem",
													backgroundColor: isActive
														? "var(--desert-terracotta)"
														: "transparent",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleLanguageChange(lang.code)}
												title={lang.name}
											>
												{lang.label}
											</button>
										);
									})}
									{selectedLang !== "en" && (
										<button
											type="button"
											className="btn btn-sm py-1 px-2 border-0 rounded-pill text-muted hover-dark"
											style={{ fontSize: "0.75rem" }}
											onClick={handleClearTranslation}
											title="Clear Translation (Reset to English)"
										>
											<i className="bi bi-x-circle me-1"></i>Clear
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Error State */}
				{error && (
					<div className="alert alert-danger d-flex align-items-center justify-content-between my-4">
						<div className="d-flex align-items-center gap-2">
							<i className="bi bi-exclamation-triangle-fill fs-5"></i>
							<span>{error}</span>
						</div>
						<button
							className="btn btn-sm btn-outline-danger"
							onClick={fetchInitialCourses}
						>
							Retry
						</button>
					</div>
				)}

				{/* Courses Grid */}
				<div className="row g-4" id="coursesList">
					{isLoading ? (
						// Skeleton loading state
						[1, 2, 3, 4, 5, 6].map((n) => (
							<div key={n} className="col-md-6 col-lg-4">
								<div
									className="course-card h-100 d-flex flex-column placeholder-glow"
									style={{ minHeight: "380px" }}
								>
									<div
										className="course-thumb-container placeholder"
										style={{ opacity: 0.2 }}
									></div>
									<div className="course-body d-flex flex-column flex-grow-1 p-4">
										<div className="placeholder col-6 mb-2"></div>
										<div className="placeholder col-9 mb-3 fs-5"></div>
										<div className="placeholder col-12 mb-1"></div>
										<div className="placeholder col-10 mb-4"></div>
										<div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
											<span className="placeholder col-4"></span>
											<span
												className="placeholder col-3"
												style={{ height: "30px", borderRadius: "8px" }}
											></span>
										</div>
									</div>
								</div>
							</div>
						))
					) : filteredCourses.length === 0 ? (
						<div className="col-12 text-center py-5">
							<i className="bi bi-search fs-1 text-muted"></i>
							<p className="text-muted mt-3">
								No courses match your query or selected level.
							</p>
							{(searchTerm || activeCategory !== "All" || selectedLang !== "en") && (
								<button
									className="btn btn-desert-outline btn-sm mt-2"
									onClick={() => {
										setSearchTerm("");
										setActiveCategory("All");
										handleClearTranslation();
									}}
								>
									Clear Filters
								</button>
							)}
						</div>
					) : (
						filteredCourses.map((course) => {
							const idKey = course.id || course.slug;
							const translation = course.translation || {};

							const translatedTitle =
								selectedLang !== "en" ? translations[`${idKey}_title`] : null;
							const translatedDesc =
								selectedLang !== "en" ? translations[`${idKey}_desc`] : null;

							const title =
								translatedTitle ||
								translation.title ||
								course.title ||
								course.slug ||
								"";
							const desc =
								translatedDesc ||
								translation.desc ||
								course.description ||
								"";
							const duration = translation.duration || course.duration_weeks;
							const chaptersCount =
								translation.chapters_count || course.modules_count;
							const authorName =
								translation.author?.name ||
								course.instructor ||
								"Al-Athar Academy";
							const authorAbbr =
								translation.author?.abbreviation || course.avatar || "AAA";
							const arabicTitle = course.arabic_title || course.arabicTag;
							const courseType = course.type || course.level || "Beginner";
							const iconClass = getCourseIcon(course.slug, courseType);
							const isComingSoon =
								course.coming_soon === true || course.is_coming_soon === true;

							return (
								<div
									key={course.id || course.slug}
									className="col-md-6 col-lg-4"
								>
									<div className="course-card h-100 d-flex flex-column">
										<div className="course-thumb-container">
											<span
												className={`level-badge badge-${courseType.toLowerCase().replace(/\s+/g, "-")}`}
											>
												{courseType}
											</span>
											<div className="course-thumb-icon">
												<i className={`bi ${iconClass}`}></i>
											</div>
											{arabicTitle && (
												<span className="course-arabic-tag" dir="rtl">
													{arabicTitle}
												</span>
											)}
										</div>
										<div className="course-body d-flex flex-column flex-grow-1">
											<div className="course-meta mb-2">
												{duration && (
													<span className="me-3">
														<i className="bi bi-clock me-1"></i>
														{duration} Weeks
													</span>
												)}
												{chaptersCount && (
													<span>
														<i className="bi bi-journal-text me-1"></i>
														{chaptersCount} Chapters
													</span>
												)}
											</div>
											<h5
												className="fw-bold mb-2"
												dir={selectedLang === "ar" ? "rtl" : "ltr"}
											>
												{title}
											</h5>
											<p
												className="small text-muted mb-4 flex-grow-1"
												dir={selectedLang === "ar" ? "rtl" : "ltr"}
											>
												{desc}
											</p>

											<div
												className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto"
												style={{ borderColor: "var(--desert-dune) !important" }}
											>
												<div className="d-flex align-items-center gap-2">
													<div className="instructor-avatar">{authorAbbr}</div>
													<small className="text-muted fw-semibold">
														{authorName}
													</small>
												</div>
												{isComingSoon ? (
													<button
														className="btn btn-desert-outline btn-sm"
														disabled
														style={{ opacity: 0.65 }}
													>
														Coming Soon
													</button>
												) : (
													<Link
														to={`/course/${course.slug}`}
														className="btn btn-desert-outline btn-sm"
													>
														View Details
													</Link>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Loading More Spinner */}
				{isLoadingMore && (
					<div className="text-center py-4">
						<div
							className="spinner-border spinner-border-sm text-warning me-2"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						<span className="text-muted small">Loading more courses...</span>
					</div>
				)}

				{/* Infinite scroll sentinel trigger */}
				<div ref={loadMoreRef} style={{ height: "20px", width: "100%" }} />
			</main>
		</div>
	);
}
