import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuranVerses, useMinimalChapters } from "../hooks/useQuran";

export default function SurahPage() {
	const { surahSlug } = useParams();
	const navigate = useNavigate();
	const { chapters, loading: chaptersLoading } = useMinimalChapters();

	const {
		verses,
		chapter: apiChapter,
		loading: versesLoading,
		loadingMore,
		error,
		nextCursor,
		loadMore,
	} = useQuranVerses(surahSlug);

	// Find active chapter metadata by slug (prefer direct API detail, fallback to chapters list)
	const currentChapter =
		apiChapter || chapters.find((c) => c.slug === surahSlug);

	// States
	const [activePlayingVerse, setActivePlayingVerse] = useState(null);
	const [expandedTafsirs, setExpandedTafsirs] = useState({});
	const [bookmarks, setBookmarks] = useState({});
	const [copiedVerse, setCopiedVerse] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [showTranslation, setShowTranslation] = useState(true);
	const [showTransliteration, setShowTransliteration] = useState(true);
	const [arabicFontSize, setArabicFontSize] = useState(28);
	const [translationFontSize, setTranslationFontSize] = useState(16);
	const [isReadMode, setIsReadMode] = useState(false);

	// Handlers
	const toggleTafsir = (verseKey) => {
		setExpandedTafsirs((prev) => ({
			...prev,
			[verseKey]: !prev[verseKey],
		}));
	};

	const toggleBookmark = (verseKey) => {
		setBookmarks((prev) => ({
			...prev,
			[verseKey]: !prev[verseKey],
		}));
	};

	const handlePlayAudio = (verseKey) => {
		if (activePlayingVerse === verseKey) {
			setActivePlayingVerse(null); // Pause
		} else {
			setActivePlayingVerse(verseKey); // Play
		}
	};

	const handleCopyText = (text, verseKey) => {
		navigator.clipboard.writeText(text);
		setCopiedVerse(verseKey);
		setTimeout(() => setCopiedVerse(null), 2000);
	};

	// Find indexes for slug-based nav
	const currentIndex = chapters.findIndex((c) => c.slug === surahSlug);
	const isFirst = currentIndex <= 0;
	const isLast = currentIndex === -1 || currentIndex >= chapters.length - 1;

	const goToPrevSurah = () => {
		if (!isFirst) {
			navigate(`/quran/${chapters[currentIndex - 1].slug}`);
		}
	};

	const goToNextSurah = () => {
		if (!isLast) {
			navigate(`/quran/${chapters[currentIndex + 1].slug}`);
		}
	};

	// Infinite scroll scrolling pagination for verses
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 150
			) {
				if (nextCursor && !versesLoading && !loadingMore) {
					loadMore();
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [nextCursor, versesLoading, loadingMore, loadMore]);

	if (chaptersLoading || (currentChapter && versesLoading)) {
		return (
			<div
				className="text-center py-5"
				style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}
			>
				<div className="spinner-border text-warning mt-5" role="status">
					<span className="visually-hidden">Loading Quranic text...</span>
				</div>
				<p className="text-muted mt-2">Loading Quranic text...</p>
			</div>
		);
	}

	if (error || (!chaptersLoading && !currentChapter)) {
		return (
			<div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
				<div className="alert alert-danger max-w-md mx-auto" role="alert">
					<i className="bi bi-exclamation-triangle-fill me-2"></i>
					Surah details not found or failed to load.
				</div>
				<Link to="/quran" className="btn btn-desert-primary mt-3">
					Back to Surah List
				</Link>
			</div>
		);
	}

	return (
		<div
			style={{
				backgroundColor: "var(--desert-sand)",
				minHeight: "80vh",
				paddingBottom: activePlayingVerse ? "80px" : "0",
			}}
		>
			{/* Sticky Reader Navigation & Fast Controls */}
			<div className="sticky-reader-bar py-2">
				<div className="container d-flex align-items-center justify-content-between flex-nowrap gap-2">
					{/* Surah Jump Dropdowns */}
					<div className="d-flex align-items-center gap-2 position-relative">
						<button
							className="reader-btn"
							onClick={goToPrevSurah}
							disabled={isFirst}
							style={{
								opacity: isFirst ? 0.5 : 1,
								cursor: isFirst ? "not-allowed" : "pointer",
							}}
						>
							<i className="bi bi-chevron-left"></i>{" "}
							<span className="d-none d-sm-inline">Prev</span>
						</button>

						{/* Custom Dropdown Trigger */}
						<div className="position-relative" style={{ zIndex: 1050 }}>
							{isDropdownOpen && (
								<div
									className="position-fixed top-0 start-0 w-100 h-100"
									style={{ zIndex: -1, background: "transparent" }}
									onClick={() => setIsDropdownOpen(false)}
								/>
							)}
							<button
								className="btn btn-sm border-secondary-subtle fw-bold d-flex align-items-center justify-content-between gap-2 px-3 py-1.5"
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
									{currentChapter
										? `${currentChapter.id}. ${currentChapter.name}`
										: "Select Surah"}
								</span>
								<i
									className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"} small text-muted`}
								></i>
							</button>

							{/* Dropdown Menu Overlay */}
							{isDropdownOpen && (
								<div
									className="surah-select-dropdown py-1 mt-1 overflow-auto"
								>
									{chapters.map((c) => {
										const isSelected = c.id === currentChapter?.id;
										return (
											<button
												key={c.id}
												onClick={() => {
													navigate(`/quran/${c.slug}`);
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
													{c.id}. Surah {c.name}
												</span>
												<span
													className="font-quranic text-muted small"
													dir="rtl"
												>
													{c.arabicName}
												</span>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<button
							className="reader-btn"
							onClick={goToNextSurah}
							disabled={isLast}
							style={{
								opacity: isLast ? 0.5 : 1,
								cursor: isLast ? "not-allowed" : "pointer",
							}}
						>
							<span className="d-none d-sm-inline">Next</span>{" "}
							<i className="bi bi-chevron-right"></i>
						</button>
					</div>

					{/* Jump to Ayah & Settings Trigger */}
					<div className="d-flex align-items-center gap-2">
						{/* <div className="d-flex align-items-center gap-1">
							<span className="small text-muted d-none d-md-inline">Ayah:</span>
							<select
								className="form-select form-select-sm border-secondary-subtle shadow-none"
								style={{ width: "70px", backgroundColor: "var(--desert-sand)" }}
								onChange={(e) => {
									const targetElement = document.getElementById(
										`v${e.target.value}`,
									);
									if (targetElement) {
										targetElement.scrollIntoView({
											behavior: "smooth",
											block: "center",
										});
									}
								}}
							>
								{verses.map((v, i) => (
									<option key={v.verseKey} value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>
						</div> */}
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

							{/* Settings Dropdown menu */}
							{isSettingsOpen && (
								<div
									className="settings-dropdown p-3 mt-1"
								>
									<h6 className="fw-bold mb-3 small text-uppercase tracking-wider">
										Reader Options
									</h6>

									<div className="form-check form-switch mb-2">
										<input
											className="form-check-input"
											type="checkbox"
											id="toggleTranslation"
											disabled={isReadMode}
											checked={showTranslation}
											onChange={() => setShowTranslation(!showTranslation)}
										/>
										<label
											className="form-check-label small"
											htmlFor="toggleTranslation"
										>
											Translation
										</label>
									</div>

									<div className="form-check form-switch mb-3">
										<input
											className="form-check-input"
											type="checkbox"
											id="toggleReadMode"
											checked={isReadMode}
											onChange={() => setIsReadMode(!isReadMode)}
										/>
										<label
											className="form-check-label small"
											htmlFor="toggleReadMode"
										>
											Read Mode (Mushaf)
										</label>
									</div>

									<div className="mb-2">
										<label className="small text-muted mb-1 d-block">
											Arabic Text Size ({arabicFontSize}px)
										</label>
										<input
											type="range"
											className="form-range"
											min="20"
											max="44"
											step="2"
											value={arabicFontSize}
											onChange={(e) =>
												setArabicFontSize(parseInt(e.target.value))
											}
										/>
									</div>

									{!isReadMode && (
										<div>
											<label className="small text-muted mb-1 d-block">
												Translation Size ({translationFontSize}px)
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

			{/* Main Surah Container */}
			<main className="container py-4">
				{/* Surah Title Header Banner */}
				<div
					className="surah-banner mb-4 shadow-sm text-start"
					data-arabic-name={currentChapter?.arabicName || ""}
				>
					<div className="row align-items-center g-3">
						<div className="col-md-7">
							<div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
								<span className="badge bg-warning text-dark px-3 py-1 fw-bold">
									SURAH {currentChapter.id}
								</span>
								<span className="badge bg-outline-light border text-light px-2 py-1 text-uppercase">
									{currentChapter.type} •{" "}
									{currentChapter.versesCount || verses.length} Ayahs
								</span>
								<span className="badge bg-outline-light border text-light px-2 py-1">
									JUZ {currentChapter.juz || verses[0]?.juz || 1}
								</span>
							</div>
							<h1 className="fw-bold display-6 mb-1">
								Surah {currentChapter.name}
							</h1>
							<p className="mb-0 text-white-50 small">
								"{currentChapter.englishName}" —{" "}
								{currentChapter.description ||
									"Sacred Revelation and Divine Guidance."}
							</p>
						</div>

						<div className="col-md-5 text-md-end text-start mt-3 mt-md-0">
							<div
								className="font-quranic display-4 fw-bold text-warning mb-0"
								dir="rtl"
								style={{ fontFamily: "var(--font-quranic)" }}
							>
								{currentChapter.arabicName}
							</div>
							{/* <div className="small text-white-50 mt-1">
								<i className="bi bi-headphones me-1"></i> Reciter:{" "}
								<strong>Mishary Rashid Alafasy</strong>
							</div> */}
						</div>
					</div>
				</div>

				{/* Bismillah Frame */}
				{currentChapter.id !== 9 && (
					<div className="bismillah-card text-center mb-5 shadow-sm">
						<div
							className="font-quranic fs-1 text-dark"
							dir="rtl"
							style={{ fontFamily: "var(--font-quranic)" }}
						>
							بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
						</div>
						<small className="text-muted fst-italic d-block mt-2">
							In the name of Allah, the Entirely Merciful, the Especially
							Merciful.
						</small>
					</div>
				)}

				{/* Verses Container */}
				{isReadMode ? (
					<div
						className="card shadow-sm p-4 mb-4 text-end"
						dir="rtl"
						style={{
							backgroundColor: "var(--desert-sand-card)",
							border: "1px solid var(--desert-dune)",
							borderRadius: "16px",
						}}
					>
						<div
							className="quran-arabic-text mb-0"
							style={{
								fontSize: `${arabicFontSize}px`,
								lineHeight: 2.3,
								fontFamily: "var(--font-quranic)",
								textAlign: "justify",
								wordSpacing: "2px",
							}}
						>
							{verses.map((verse, index) => (
								<span key={verse.verseKey} className="d-inline-wrap">
									{verse.arabic}
									<span
										className="badge bg-warning text-dark mx-2 rounded-circle d-inline-flex align-items-center justify-content-center"
										style={{
											width: "2.2rem",
											height: "2.2rem",
											fontSize: `${Math.max(12, arabicFontSize * 0.45)}px`,
											verticalAlign: "middle",
											border: "1px solid var(--desert-gold)",
											fontFamily: "sans-serif",
										}}
									>
										{index + 1}
									</span>
								</span>
							))}
						</div>
					</div>
				) : (
					verses.map((verse, index) => {
						const isPlaying = activePlayingVerse === verse.verseKey;
						const isExpanded = expandedTafsirs[verse.verseKey] || false;
						const isBookmarked = bookmarks[verse.verseKey] || false;
						const isCopied = copiedVerse === verse.verseKey;

						return (
							<div
								key={verse.verseKey}
								id={`v${index + 1}`}
								className={`verse-card shadow-sm ${isPlaying ? "playing" : ""}`}
							>
								{/* Verse Header Actions */}
								<div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 flex-wrap gap-2">
									<div className="d-flex align-items-center gap-3">
										<div className="verse-number-badge">
											<span>{verse.verseKey}</span>
										</div>
										<div>
											<span className="badge bg-light text-dark border me-1">
												Juz {verse.juz}
											</span>
											<span className="badge bg-light text-dark border">
												Page {verse.page}
											</span>
										</div>
									</div>

									{/* Action Toolbar */}
									<div className="d-flex align-items-center gap-1">
										<button
											className="verse-action-btn"
											title={
												isPlaying ? "Pause Verse Audio" : "Play Verse Audio"
											}
											onClick={() => handlePlayAudio(verse.verseKey)}
										>
											<i
												className={`bi ${isPlaying ? "bi-pause-circle-fill text-danger" : "bi-play-circle-fill text-warning"} fs-5`}
											></i>
										</button>
										<button
											className={`verse-action-btn ${isBookmarked ? "text-warning" : ""}`}
											title="Bookmark Verse"
											onClick={() => toggleBookmark(verse.verseKey)}
										>
											<i
												className={`bi ${isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`}
											></i>
										</button>
										<button
											className="verse-action-btn"
											title="Copy Verse"
											onClick={() =>
												handleCopyText(
													`${verse.arabic}\n${verse.translation} (${verse.verseKey})`,
													verse.verseKey,
												)
											}
										>
											<i
												className={`bi ${isCopied ? "bi-check2 text-success" : "bi-copy"}`}
											></i>
										</button>
										{/* <button 
                      className={`verse-action-btn ${isExpanded ? 'text-primary' : ''}`}
                      title="Tafsir & Commentary"
                      onClick={() => toggleTafsir(verse.verseKey)}
                    >
                      <i className="bi bi-journal-bookmark-fill"></i>
                    </button> */}
									</div>
								</div>

								{/* Arabic Quranic Text */}
								<div
									className="quran-arabic-text mb-4"
									style={{ fontSize: `${arabicFontSize}px`, lineHeight: 1.8 }}
								>
									{verse.arabic}
								</div>

								{/* Transliteration */}
								{showTransliteration && (
									<div className="verse-transliteration mb-2">
										{verse.transliteration}
									</div>
								)}

								{/* English Translation */}
								{showTranslation && (
									<div
										className="verse-translation fw-medium"
										style={{ fontSize: `${translationFontSize}px` }}
									>
										{verse.translation}
									</div>
								)}

								{/* Expandable Tafsir Panel */}
								<div className={`collapse ${isExpanded ? "show" : ""} mt-3`}>
									<div className="tafsir-box">
										<h6 className="fw-bold mb-2 text-dark d-flex align-items-center gap-1">
											<i
												className="bi bi-book me-1"
												style={{ color: "var(--desert-terracotta)" }}
											></i>
											Tafsir Ibn Kathir (Excerpt)
										</h6>
										<p className="mb-0">{verse.tafsir}</p>
									</div>
								</div>
							</div>
						);
					})
				)}

				{/* Infinite Scroll Loading More Verses Spinner */}
				{loadingMore && (
					<div className="text-center py-4">
						<div
							className="spinner-border spinner-border-sm text-warning"
							role="status"
						>
							<span className="visually-hidden">Loading more verses...</span>
						</div>
						<p className="text-muted mt-1 small">Loading more verses...</p>
					</div>
				)}

				{/* Bottom Pagination / Surah Navigation */}
				<div
					className="d-flex justify-content-between align-items-center my-5 pt-3 border-top flex-wrap gap-2"
					style={{ borderColor: "var(--desert-dune) !important" }}
				>
					<button
						className="btn btn-desert-outline rounded-pill px-4"
						onClick={goToPrevSurah}
						disabled={isFirst}
						style={{
							opacity: isFirst ? 0.5 : 1,
							cursor: isFirst ? "not-allowed" : "pointer",
						}}
					>
						<i className="bi bi-arrow-left me-1"></i> Previous Surah
					</button>
					<button
						className="btn btn-desert-primary rounded-pill px-4"
						onClick={goToNextSurah}
						disabled={isLast}
						style={{
							opacity: isLast ? 0.5 : 1,
							cursor: isLast ? "not-allowed" : "pointer",
						}}
					>
						Next Surah <i className="bi bi-arrow-right ms-1"></i>
					</button>
				</div>
			</main>

			{/* Sticky Bottom Audio Player Bar */}
			{activePlayingVerse && (
				<div className="audio-player-bar text-start">
					<div className="container d-flex align-items-center justify-content-between gap-3">
						{/* Currently Playing Info */}
						<div className="d-flex align-items-center gap-3">
							<button
								className="btn-play-main border-0"
								onClick={() => setActivePlayingVerse(null)}
							>
								<i className="bi bi-pause-fill"></i>
							</button>
							<div>
								<div className="fw-bold text-white small mb-0">
									Surah {currentChapter.name} • Verse {activePlayingVerse}
								</div>
								<small
									className="text-white-50"
									style={{ fontSize: "0.75rem" }}
								>
									Mishary Rashid Alafasy
								</small>
							</div>
						</div>

						{/* Playback Progress Bar (Hidden on small screens) */}
						<div
							className="d-none d-md-flex align-items-center gap-2 flex-grow-1 mx-4"
							style={{ maxWidth: "400px" }}
						>
							<span
								className="small text-white-50"
								style={{ fontSize: "0.75rem" }}
							>
								0:12
							</span>
							<div
								className="progress flex-grow-1"
								style={{
									height: "6px",
									backgroundColor: "rgba(255,255,255,0.15)",
								}}
							>
								<div
									className="progress-bar"
									role="progressbar"
									style={{
										width: "30%",
										backgroundColor: "var(--desert-gold)",
									}}
									aria-valuenow="30"
									aria-valuemin="0"
									aria-valuemax="100"
								></div>
							</div>
							<span
								className="small text-white-50"
								style={{ fontSize: "0.75rem" }}
							>
								0:45
							</span>
						</div>

						{/* Quick Audio Controls */}
						<div className="d-flex align-items-center gap-2 text-white">
							<button
								className="btn btn-sm text-white-50 p-1 border-0 bg-transparent"
								title="Speed"
							>
								<span className="badge bg-secondary">1.0x</span>
							</button>
							<button
								className="btn btn-sm text-white-50 p-1 border-0 bg-transparent"
								title="Repeat"
							>
								<i className="bi bi-repeat fs-5 text-white"></i>
							</button>
							<button
								className="btn btn-sm text-white-50 p-1 d-none d-sm-inline border-0 bg-transparent"
								title="Volume"
							>
								<i className="bi bi-volume-up fs-5 text-white"></i>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
