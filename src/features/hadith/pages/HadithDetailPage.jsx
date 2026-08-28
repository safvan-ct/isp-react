import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHadithList, useHadithChaptersMinimal } from "../hooks/useHadith";
import { getSiteLanguage } from "../../../services/siteLanguage";

export default function HadithDetailPage() {
	const { bookSlug, chapterSlug } = useParams();
	const navigate = useNavigate();

	// Fetch minimal chapter list (all=1&minimal=1) for filter bar dropdown & header info
	const { book: navBook, chapters } = useHadithChaptersMinimal(bookSlug);

	// Chapter Hadith list hook (when URL is /hadith/:bookSlug/:chapterSlug)
	const {
		hadiths,
		book: apiBook,
		chapter: apiChapter,
		loading,
		loadingMore,
		nextCursor,
		loadMore,
		error,
	} = useHadithList(bookSlug, chapterSlug);



	// UI states
	const [expandedHeadings, setExpandedHeadings] = useState({});
	const [bookmarks, setBookmarks] = useState({});
	const [copiedHadith, setCopiedHadith] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [arabicFontSize, setArabicFontSize] = useState(22);
	const [translationFontSize, setTranslationFontSize] = useState(14);
	const [showTranslation, setShowTranslation] = useState(true);
	const [isSideBySide, setIsSideBySide] = useState(false);

	// Translation states
	const [selectedLang, setSelectedLang] = useState("en"); // 'en' | 'ml' | 'hi'
	const [translations, setTranslations] = useState({}); // { [hadithId_field]: string }
	const [translating, setTranslating] = useState({}); // { [hadithId]: boolean }
	const translationCache = useRef({});

	const LANGUAGES = [
		{ code: "en", label: "EN", name: "English" },
		{ code: "ml", label: "ML", name: "മലയാളം" },
		{ code: "hi", label: "HI", name: "हिन्दी" },
	];

	/** Split text into chunks of at most `maxLen` chars, breaking at sentence boundaries */
	const chunkText = (text, maxLen = 400) => {
		if (text.length <= maxLen) return [text];
		const chunks = [];
		let remaining = text;
		while (remaining.length > maxLen) {
			// Try to break at a sentence boundary (". ") within the allowed length
			let cut = remaining.lastIndexOf(". ", maxLen);
			if (cut <= 0) {
				// Fallback: break at last space within maxLen
				cut = remaining.lastIndexOf(" ", maxLen);
			}
			if (cut <= 0) cut = maxLen; // Hard cut if no space found
			chunks.push(remaining.slice(0, cut + 1).trim());
			remaining = remaining.slice(cut + 1).trim();
		}
		if (remaining.length > 0) chunks.push(remaining);
		return chunks;
	};

	/** Translate a single chunk via Google Translate free endpoint */
	const translateChunk = async (text, targetLang) => {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return data[0]?.map((c) => c[0]).join("") || text;
	};

	/** Translate a full (possibly long) string, chunking as needed */
	const translateText = async (text, targetLang) => {
		if (!text || targetLang === "en") return text;
		const cacheKey = `${targetLang}::${text.slice(0, 80)}`;
		if (translationCache.current[cacheKey])
			return translationCache.current[cacheKey];
		try {
			const chunks = chunkText(text, 400);
			const translated = (
				await Promise.all(chunks.map((c) => translateChunk(c, targetLang)))
			).join(" ");
			translationCache.current[cacheKey] = translated;
			return translated;
		} catch {
			return text; // fallback to original on error
		}
	};

	/** Translate all loaded hadiths to the chosen language */
	const translateAll = async (lang) => {
		if (lang === "en") {
			setTranslations({});
			return;
		}
		const pending = {};
		hadiths.forEach((h) => {
			pending[h.id] = true;
		});
		setTranslating(pending);

		const results = {};
		await Promise.all(
			hadiths.map(async (h) => {
				const heading = getEnHeading(h);
				const body = getTranslation(h);
				const [tHeading, tBody] = await Promise.all([
					heading ? translateText(heading, lang) : Promise.resolve(""),
					body ? translateText(body, lang) : Promise.resolve(""),
				]);
				results[`${h.id}_heading`] = tHeading;
				results[`${h.id}_body`] = tBody;
			}),
		);

		setTranslations(results);
		setTranslating({});
	};

	/** When language changes, trigger translation */
	const handleLangChange = (lang) => {
		setSelectedLang(lang);
		translateAll(lang);
	};

	/** When new hadiths load and a non-EN lang is active, translate new ones */
	useEffect(() => {
		if (selectedLang !== "en" && hadiths.length > 0) {
			translateAll(selectedLang);
		}
	}, [hadiths.length]);

	// Infinite scroll – load more when user reaches the bottom
	const bottomRef = useRef(null);
	useEffect(() => {
		if (!nextCursor) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ threshold: 0.1 },
		);
		if (bottomRef.current) observer.observe(bottomRef.current);
		return () => observer.disconnect();
	}, [nextCursor, loadMore]);

	// Resolve active chapter from chapters list (for prev/next nav)
	const currentChapterIndex = chapters.findIndex(
		(c) => String(c.slug || c.id) === String(chapterSlug),
	);
	const activeChapter = chapters[currentChapterIndex] ?? apiChapter;

	// Helper to extract translation name or title from chapter
	const getChapterName = (chap) => {
		if (!chap) return "";
		const siteLang = getSiteLanguage();
		const transObj =
			chap.translations?.find((t) => t.lang === siteLang) ||
			chap.translations?.find((t) => t.lang === "en") ||
			chap.translations?.[0];
		return (
			chap.translation ||
			chap.title ||
			transObj?.name ||
			chap.name ||
			""
		);
	};

	// Display names
	const siteLang = getSiteLanguage();
	const targetBook = apiBook ?? navBook;
	const bookTransObj =
		targetBook?.translations?.find((t) => t.lang === siteLang) ||
		targetBook?.translations?.find((t) => t.lang === "en") ||
		targetBook?.translations?.[0];
	const bookName =
		targetBook?.translation ||
		targetBook?.title ||
		bookTransObj?.name ||
		targetBook?.name ||
		bookSlug;

	const chapterName =
		getChapterName(activeChapter) ||
		getChapterName(apiChapter) ||
		chapterSlug;

	// Navigation helpers
	const isPrevDisabled = currentChapterIndex <= 0 && chapters.length > 0;
	const isNextDisabled =
		chapters.length > 0 && currentChapterIndex >= chapters.length - 1;

	const goToPrevChapter = () => {
		if (currentChapterIndex > 0) {
			const prev = chapters[currentChapterIndex - 1];
			navigate(`/hadith/${bookSlug}/${prev.slug || prev.id}`);
		}
	};

	const goToNextChapter = () => {
		if (currentChapterIndex < chapters.length - 1) {
			const next = chapters[currentChapterIndex + 1];
			navigate(`/hadith/${bookSlug}/${next.slug || next.id}`);
		}
	};

	// ── Hadith field extractors (matching real API shape) ─────────────
	/** Arabic text is `hadith.text` */
	const getArabic = (h) => h.text || "";
	/** Translation is `hadith.translations[].text` */
	const getTranslation = (h) => {
		const lang = getSiteLanguage();
		return (
			h.translations?.find((t) => t.lang === lang)?.text ||
			h.translations?.find((t) => t.lang === "en")?.text ||
			h.translations?.[0]?.text ||
			""
		);
	};
	/** Arabic sub-heading (Bab) */
	const getArabicHeading = (h) => h.heading || "";
	/** Sub-heading translation */
	const getEnHeading = (h) => {
		const lang = getSiteLanguage();
		return (
			h.translations?.find((t) => t.lang === lang)?.heading ||
			h.translations?.find((t) => t.lang === "en")?.heading ||
			h.translations?.[0]?.heading ||
			""
		);
	};
	/** Narrator */
	const getNarrator = (h) => {
		const lang = getSiteLanguage();
		return (
			h.translations?.find((t) => t.lang === lang)?.narrator ||
			h.translations?.find((t) => t.lang === "en")?.narrator ||
			h.translations?.[0]?.narrator ||
			""
		);
	};
	/** Grade/status */
	const getGrade = (h) => {
		const lang = getSiteLanguage();
		return (
			h.translations?.find((t) => t.lang === lang)?.status ||
			h.translations?.find((t) => t.lang === "en")?.status ||
			h.status ||
			""
		);
	};
	/** Display number */
	const getHadithNum = (h) => h.hadith_number ?? h.id;

	// ── Handlers ──────────────────────────────────────────────────────
	const toggleHeading = (id) =>
		setExpandedHeadings((prev) => ({ ...prev, [id]: !prev[id] }));
	const toggleBookmark = (id) =>
		setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
	const handleCopy = (h) => {
		const narrator = getNarrator(h);
		const translation = getTranslation(h);
		navigator.clipboard.writeText(
			`${narrator ? `Narrator: ${narrator}\n` : ""}${translation}`,
		);
		setCopiedHadith(h.id);
		setTimeout(() => setCopiedHadith(null), 2000);
	};

	// ── Loading / Error ───────────────────────────────────────────────
	if (loading) {
		return (
			<div
				className="text-center py-5"
				style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}
			>
				<div className="spinner-border text-warning mt-5" role="status">
					<span className="visually-hidden">Loading…</span>
				</div>
				<p className="text-muted mt-2">Loading Prophetic traditions…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
				<div className="alert alert-danger mx-auto" role="alert">
					<i className="bi bi-exclamation-triangle-fill me-2"></i>
					Failed to load hadiths. Please try again.
				</div>
				<Link
					to={`/hadith/${bookSlug}`}
					className="btn btn-desert-primary mt-3"
				>
					Back to Book Index
				</Link>
			</div>
		);
	}

	const hadithCount =
		activeChapter?.hadith_count ?? apiChapter?.hadith_count ?? hadiths.length;

	return (
		<div style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}>
			{/* ── Sticky Reader Bar (SurahPage style) ─────────────────── */}
			<div className="sticky-reader-bar py-2">
				<div className="container d-flex align-items-center justify-content-between flex-nowrap gap-2">
					{/* Left: Prev / Chapter Dropdown / Next */}
					<div className="d-flex align-items-center gap-2 position-relative">
						<button
							className="reader-btn"
							onClick={goToPrevChapter}
							disabled={isPrevDisabled}
							style={{
								opacity: isPrevDisabled ? 0.5 : 1,
								cursor: isPrevDisabled ? "not-allowed" : "pointer",
							}}
						>
							<i className="bi bi-chevron-left"></i>{" "}
							<span className="d-none d-sm-inline">Prev</span>
						</button>

						{/* Custom Chapter Dropdown */}
						<div className="position-relative" style={{ zIndex: 1050 }}>
							{isDropdownOpen && (
								<div
									className="position-fixed top-0 start-0 w-100 h-100"
									style={{ zIndex: -1, background: "transparent" }}
									onClick={() => setIsDropdownOpen(false)}
								/>
							)}
							<button
								className="btn btn-sm border-secondary-subtle fw-bold d-flex align-items-center justify-content-between gap-2 px-3"
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								style={{
									backgroundColor: "var(--desert-sand)",
									borderRadius: "8px",
									minWidth: "120px",
									flexGrow: 1,
									maxWidth: "240px",
									fontSize: "0.85rem",
									color: "var(--desert-night)",
									border: "1px solid var(--desert-dune)",
									transition: "all 0.2s ease",
								}}
							>
								<span className="text-truncate">
									{chapterName || "Select Chapter"}
								</span>
								<i
									className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"} small text-muted`}
								></i>
							</button>

							{/* Dropdown overlay list */}
							{isDropdownOpen && (
								<div className="surah-select-dropdown py-1 mt-1 overflow-auto">
									{chapters.map((c) => {
										const slug = c.slug || c.id;
										const name =
											c.translation ||
											c.title ||
											c.translations?.find((t) => t.lang === "en")?.name ||
											c.name;
										const isSelected = String(slug) === String(chapterSlug);
										return (
											<button
												key={c.id}
												onClick={() => {
													navigate(`/hadith/${bookSlug}/${slug}`);
													setIsDropdownOpen(false);
												}}
												className="dropdown-item d-flex align-items-center justify-content-between px-3 py-2 border-0 bg-transparent text-start w-100"
												style={{
													fontSize: "0.85rem",
													fontWeight: isSelected ? "700" : "500",
													color: isSelected
														? "var(--desert-terracotta)"
														: "var(--desert-night)",
													backgroundColor: isSelected
														? "var(--desert-sand)"
														: "transparent",
													cursor: "pointer",
													transition: "all 0.15s ease",
												}}
												onMouseEnter={(e) => {
													if (!isSelected)
														e.currentTarget.style.backgroundColor =
															"rgba(247, 243, 235, 0.5)";
												}}
												onMouseLeave={(e) => {
													if (!isSelected)
														e.currentTarget.style.backgroundColor =
															"transparent";
												}}
											>
												<span className="text-truncate me-2">
													{c.chapter_number || c.id}. {name}
												</span>
												<span
													className="font-quranic text-muted small"
													dir="rtl"
												>
													{c.name}
												</span>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<button
							className="reader-btn"
							onClick={goToNextChapter}
							disabled={isNextDisabled}
							style={{
								opacity: isNextDisabled ? 0.5 : 1,
								cursor: isNextDisabled ? "not-allowed" : "pointer",
							}}
						>
							<span className="d-none d-sm-inline">Next</span>{" "}
							<i className="bi bi-chevron-right"></i>
						</button>
					</div>

					{/* Right: Reader View Settings */}
					<div className="d-flex align-items-center gap-2">
						<div className="position-relative" style={{ zIndex: 1050 }}>
							{isSettingsOpen && (
								<div
									className="position-fixed top-0 start-0 w-100 h-100"
									style={{ zIndex: -1, background: "transparent" }}
									onClick={() => setIsSettingsOpen(false)}
								/>
							)}
							<button
								className="reader-btn"
								onClick={() => setIsSettingsOpen(!isSettingsOpen)}
							>
								<i className="bi bi-gear-fill me-1"></i>{" "}
								<span className="d-none d-md-inline">Reader View</span>
							</button>

							{/* Settings dropdown panel */}
							{isSettingsOpen && (
								<div
									className="settings-dropdown p-3 mt-1"
									style={{ minWidth: "220px" }}
								>
									{/* Toggle Translation switch */}
									<div className="form-check form-switch mb-2">
										<input
											className="form-check-input"
											type="checkbox"
											id="toggleHadithTranslation"
											checked={showTranslation}
											onChange={() => setShowTranslation(!showTranslation)}
										/>
										<label
											className="form-check-label small fw-semibold"
											htmlFor="toggleHadithTranslation"
										>
											Translation
										</label>
									</div>

									{/* Toggle Side-by-Side View switch */}
									<div className="form-check form-switch mb-3">
										<input
											className="form-check-input"
											type="checkbox"
											id="toggleTwoSideView"
											checked={isSideBySide}
											onChange={() => setIsSideBySide(!isSideBySide)}
										/>
										<label
											className="form-check-label small fw-semibold"
											htmlFor="toggleTwoSideView"
										>
											Side-by-Side View
										</label>
									</div>

									{showTranslation && (
										<>
											<h6 className="fw-bold mb-2 small text-uppercase">
												Language
											</h6>
											<div className="d-flex gap-1 flex-wrap">
												{LANGUAGES.map((lang) => (
													<button
														key={lang.code}
														onClick={() => handleLangChange(lang.code)}
														className="btn btn-sm fw-semibold px-3 py-1"
														style={{
															backgroundColor:
																selectedLang === lang.code
																	? "var(--desert-terracotta)"
																	: "var(--desert-sand-card, #f0ebe0)",
															color:
																selectedLang === lang.code
																	? "#fff"
																	: "var(--desert-night)",
															border:
																selectedLang === lang.code
																	? "1px solid var(--desert-terracotta)"
																	: "1px solid var(--desert-dune)",
															borderRadius: "20px",
															fontSize: "0.78rem",
															transition: "all 0.2s ease",
														}}
													>
														{lang.label}
														{/* <span className="ms-1 opacity-75" style={{ fontSize: "0.72rem" }}>
															{lang.name}
														</span> */}
													</button>
												))}
											</div>
											{Object.keys(translating).length > 0 && (
												<span className="d-flex align-items-center gap-1 text-muted small mt-2">
													<span
														className="spinner-border spinner-border-sm"
														role="status"
													></span>
													Translating…
												</span>
											)}
										</>
									)}

									<hr
										className="my-3"
										style={{ borderColor: "var(--desert-dune)" }}
									/>

									{/* Arabic font size */}
									<div className="mb-3">
										<label className="small text-muted mb-1 d-flex justify-content-between">
											<span>
												<i className="bi bi-type me-1"></i>Arabic Size
											</span>
											<span
												className="fw-bold"
												style={{ color: "var(--desert-terracotta)" }}
											>
												{arabicFontSize}px
											</span>
										</label>
										<input
											type="range"
											className="form-range"
											min="20"
											max="48"
											step="2"
											value={arabicFontSize}
											onChange={(e) =>
												setArabicFontSize(parseInt(e.target.value))
											}
										/>
									</div>

									{/* Translation font size */}
									{showTranslation && (
										<div>
											<label className="small text-muted mb-1 d-flex justify-content-between">
												<span>
													<i className="bi bi-fonts me-1"></i>Translation Size
												</span>
												<span
													className="fw-bold"
													style={{ color: "var(--desert-terracotta)" }}
												>
													{translationFontSize}px
												</span>
											</label>
											<input
												type="range"
												className="form-range"
												min="12"
												max="24"
												step="1"
												value={translationFontSize}
												onChange={(e) =>
													setTranslationFontSize(parseInt(e.target.value))
												}
											/>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* ── Main Content ─────────────────────────────────────────── */}
			<main className="container py-4 text-start">
				{/* Breadcrumbs */}
				<nav aria-label="breadcrumb" className="mb-3">
					<ol className="breadcrumb small m-0">
						<li className="breadcrumb-item">
							<Link to="/" className="text-decoration-none">
								Home
							</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to="/hadith" className="text-decoration-none">
								Hadith Library
							</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to={`/hadith/${bookSlug}`} className="text-decoration-none">
								{bookName}
							</Link>
						</li>
						<li className="breadcrumb-item active" aria-current="page">
							{chapterName}
						</li>
					</ol>
				</nav>

				{/* Chapter Banner */}
				<section
					className="chapter-banner mb-4 shadow-sm text-start"
					data-arabic-name={activeChapter?.name || apiChapter?.name || ""}
				>
					<div className="row align-items-center g-3">
						<div className="col-md-7">
							<div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
								{currentChapterIndex >= 0 && chapters.length > 0 && (
									<span className="badge bg-warning text-dark px-3 py-1 fw-bold">
										CHAPTER {currentChapterIndex + 1} OF {chapters.length}
									</span>
								)}
								<span className="badge bg-outline-light border text-light px-2 py-1 text-uppercase">
									{bookName}
								</span>
								<span className="badge bg-outline-light border text-light px-2 py-1">
									{hadithCount} AHADITH
								</span>
							</div>
							<h1 className="fw-bold display-6 mb-1 text-white">
								{chapterName}
							</h1>
						</div>
						<div className="col-md-5 text-md-end text-start mt-3 mt-md-0">
							<div
								className="font-quranic display-4 fw-bold text-warning mb-0"
								dir="rtl"
								style={{ fontFamily: "var(--font-quranic)" }}
							>
								{activeChapter?.name || apiChapter?.name || ""}
							</div>
						</div>
					</div>
				</section>

				{/* Hadith List */}
				{hadiths.length === 0 ? (
					<div className="alert alert-info py-4 text-center" role="alert">
						<i className="bi bi-info-circle-fill me-2"></i>
						No hadiths found for this chapter.
					</div>
				) : (
					hadiths.map((hadith, index) => {
						const arabicText = getArabic(hadith);
						const translation = getTranslation(hadith);
						const arabicHeading = getArabicHeading(hadith);
						const enHeading = getEnHeading(hadith);
						const narrator = getNarrator(hadith);
						const grade = getGrade(hadith);
						const hadithNum = getHadithNum(hadith);
						const isBookmarked = bookmarks[hadith.id] || false;
						const isCopied = copiedHadith === hadith.id;
						const hasHeading = arabicHeading || enHeading;
						const isExpanded = expandedHeadings[hadith.id] ?? false;

						return (
							<div key={hadith.id} className="text-start">
								{/* Sub-chapter / Bab heading (shown when present) */}
								{hasHeading && (
									<div className="bab-header-card shadow-sm">
										<div className="">
											{arabicHeading && (
												<div
													className="font-quranic fs-4 fw-bold text-end"
													dir="rtl"
													style={{
														color: "var(--desert-night)",
														fontFamily: "var(--font-quranic)",
													}}
												>
													{arabicHeading}
												</div>
											)}
											<div>
												{showTranslation &&
													(translations[`${hadith.id}_heading`] ||
														enHeading) && (
														<h5 className="fw-bold mb-0 mt-1">
															{translating[hadith.id] ? (
																<span className="placeholder-glow d-block">
																	<span className="placeholder col-8"></span>
																</span>
															) : (
																translations[`${hadith.id}_heading`] ||
																enHeading
															)}
														</h5>
													)}
											</div>
										</div>
									</div>
								)}

								{/* Hadith Card */}
								<div
									id={`h${hadith.id}`}
									className={`hadith-card shadow-sm ${index === 0 ? "highlighted" : ""}`}
								>
									{/* Header row */}
									<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 flex-wrap gap-2">
										<div className="d-flex align-items-center gap-3">
											<div className="hadith-number-badge">
												<span>{hadithNum}</span>
											</div>
											<div className="d-flex flex-wrap gap-1 align-items-center">
												{grade && (
													<span className="grade-badge-sahih me-1 text-capitalize">
														{grade}
													</span>
												)}
												<span className="badge bg-light text-dark border">
													{chapterName}, Hadith {hadithNum}
												</span>
												{hadith.chapter_number && (
													<span className="badge bg-light text-dark border d-none d-sm-inline-block">
														Vol. {hadith.volume} · Ch. {hadith.chapter_number}
													</span>
												)}
											</div>
										</div>

										{/* Action toolbar */}
										<div className="d-flex align-items-center gap-1">
											<button
												className={`hadith-action-btn border-0 bg-transparent ${isBookmarked ? "text-warning" : "text-muted"}`}
												title="Bookmark"
												onClick={() => toggleBookmark(hadith.id)}
											>
												<i
													className={`bi ${isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`}
												></i>
											</button>
											<button
												className="hadith-action-btn border-0 bg-transparent"
												title="Copy Text"
												onClick={() => handleCopy(hadith)}
											>
												<i
													className={`bi ${isCopied ? "bi-check2 text-success" : "bi-copy"}`}
												></i>
											</button>
										</div>
									</div>

									{/* Narrator pill */}
									{narrator && (
										<div className="mb-3">
											<span className="isnad-pill">
												<i className="bi bi-diagram-3-fill"></i>
												<span>
													Narrator: <strong>{narrator}</strong>
												</span>
											</span>
										</div>
									)}

									{/* Card Body: Side-by-Side or Stacked */}
									{isSideBySide && showTranslation && (translations[`${hadith.id}_body`] || translation || translating[hadith.id]) ? (
										<div className="row g-4 align-items-start">
											{/* Left Column: Translation */}
											<div className="col-md-6 order-2 order-md-1">
												<div
													className="hadith-translation fw-medium mb-2"
													style={{
														fontSize: `${translationFontSize}px`,
														textAlign: "justify",
													}}
												>
													{translating[hadith.id] ? (
														<span className="placeholder-glow d-block">
															<span className="placeholder col-12 mb-1"></span>
															<span className="placeholder col-10 mb-1"></span>
															<span className="placeholder col-8"></span>
														</span>
													) : (
														translations[`${hadith.id}_body`] || translation
													)}
												</div>
											</div>

											{/* Right Column: Arabic Text */}
											<div className="col-md-6 order-1 order-md-2 border-start-md">
												{arabicText && (
													<div
														className="hadith-arabic-text mb-2"
														style={{
															fontSize: `${arabicFontSize}px`,
															lineHeight: 1.8,
															textAlign: "justify",
														}}
													>
														{arabicText}
													</div>
												)}
											</div>
										</div>
									) : (
										<>
											{/* Arabic text */}
											{arabicText && (
												<div
													className="hadith-arabic-text mb-4"
													style={{
														fontSize: `${arabicFontSize}px`,
														lineHeight: 1.8,
														textAlign: "justify",
													}}
												>
													{arabicText}
												</div>
											)}

											{/* Translation */}
											{showTranslation && (translations[`${hadith.id}_body`] || translation || translating[hadith.id]) ? (
												<div
													className="hadith-translation fw-medium mb-2"
													style={{
														fontSize: `${translationFontSize}px`,
														textAlign: "justify",
													}}
												>
													{translating[hadith.id] ? (
														<span className="placeholder-glow d-block">
															<span className="placeholder col-12 mb-1"></span>
															<span className="placeholder col-10 mb-1"></span>
															<span className="placeholder col-8"></span>
														</span>
													) : (
														translations[`${hadith.id}_body`] || translation
													)}
												</div>
											) : null}
										</>
									)}
								</div>
							</div>
						);
					})
				)}

				{/* Infinite scroll sentinel */}
				<div ref={bottomRef} />

				{/* Load-more spinner */}
				{loadingMore && (
					<div className="text-center py-4">
						<div
							className="spinner-border spinner-border-sm text-warning"
							role="status"
						>
							<span className="visually-hidden">Loading more…</span>
						</div>
						<p className="text-muted mt-1 small">Retrieving more hadiths…</p>
					</div>
				)}

				{/* All loaded indicator */}
				{!nextCursor && hadiths.length > 0 && (
					<p className="text-center text-muted small mt-3">
						<i className="bi bi-check-circle me-1 text-success"></i>
						All {hadithCount} hadiths loaded.
					</p>
				)}
			</main>
		</div>
	);
}
