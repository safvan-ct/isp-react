import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHadithList, useHadithChapters } from "../hooks/useHadith";

export default function HadithDetailPage() {
	const { bookSlug, chapterSlug } = useParams();
	const navigate = useNavigate();

	// Fetch chapter list for navigation + header info
	const { book: navBook, chapters } = useHadithChapters(bookSlug);

	// Fetch hadiths (cursor-paginated) — also returns book/chapter meta
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

	// Display names
	const bookName =
		(apiBook ?? navBook)?.translations?.find((t) => t.lang === "en")?.name ||
		(apiBook ?? navBook)?.name ||
		bookSlug;

	const chapterName =
		activeChapter?.translations?.find((t) => t.lang === "en")?.name ||
		activeChapter?.name ||
		apiChapter?.translations?.find((t) => t.lang === "en")?.name ||
		apiChapter?.name ||
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
	/** English translation is `hadith.translations[].text` */
	const getTranslation = (h) =>
		h.translations?.find((t) => t.lang === "en")?.text || "";
	/** Arabic sub-heading (Bab) */
	const getArabicHeading = (h) => h.heading || "";
	/** English sub-heading */
	const getEnHeading = (h) =>
		h.translations?.find((t) => t.lang === "en")?.heading || "";
	/** Narrator */
	const getNarrator = (h) =>
		h.translations?.find((t) => t.lang === "en")?.narrator || "";
	/** Grade/status */
	const getGrade = (h) =>
		h.translations?.find((t) => t.lang === "en")?.status || h.status || "";
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
								<div className="settings-dropdown p-3 mt-1">
									<h6 className="fw-bold mb-3 small text-uppercase">
										Reader Options
									</h6>
									<div className="small text-muted mb-0">
										<i className="bi bi-info-circle me-1"></i>
										Display settings coming soon.
									</div>
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
				<section className="chapter-banner mb-4 shadow-sm text-start">
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
												{enHeading && (
													<h5 className="fw-bold mb-0 mt-1">{enHeading}</h5>
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

									{/* Arabic text */}
									{arabicText && (
										<div className="hadith-arabic-text mb-4">{arabicText}</div>
									)}

									{/* English translation */}
									<div className="hadith-translation fw-medium mb-2">
										{translation || (
											<span className="text-muted fst-italic">
												Translation not available.
											</span>
										)}
									</div>
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
