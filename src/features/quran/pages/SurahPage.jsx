import { useState, useEffect, useRef } from "react";
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
	const audioRef = useRef(null);
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
	const [audioTime, setAudioTime] = useState(0);
	const [audioDuration, setAudioDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const [isRepeat, setIsRepeat] = useState(false);
	const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
	const isPlayingFullSurahRef = useRef(false);
	const pendingNextVerseRef = useRef(null);

	// Synchronize ref with state
	useEffect(() => {
		isPlayingFullSurahRef.current = isPlayingFullSurah;
	}, [isPlayingFullSurah]);

	const stopAudio = () => {
		if (audioRef.current) {
			try {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				audioRef.current.src = "";
			} catch (err) {
				console.error("Audio pause error:", err);
			}
			audioRef.current = null;
		}
		setActivePlayingVerse(null);
		setIsAudioPlaying(false);
		setIsPlayingFullSurah(false);
		isPlayingFullSurahRef.current = false;
		pendingNextVerseRef.current = null;
		setAudioTime(0);
		setAudioDuration(0);
	};

	// Cleanup and stop audio when surah slug changes or on unmount
	useEffect(() => {
		stopAudio();
		return () => {
			stopAudio();
		};
	}, [surahSlug]);

	// Continuous autoplay handler when loading more verses
	useEffect(() => {
		if (pendingNextVerseRef.current && !versesLoading && !loadingMore) {
			const nextKey = pendingNextVerseRef.current;
			const found = verses.some((v) => v.verseKey === nextKey);
			if (found) {
				pendingNextVerseRef.current = null;
				handlePlayAudio(nextKey);
			}
		}
	}, [verses, versesLoading, loadingMore]);

	// Auto-scroll active playing verse card into view
	useEffect(() => {
		if (activePlayingVerse) {
			const idx = verses.findIndex((v) => v.verseKey === activePlayingVerse);
			if (idx !== -1) {
				const el = document.getElementById(`v${idx + 1}`);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "nearest" });
				}
			}
		}
	}, [activePlayingVerse, verses]);

	// Word-by-word active audio text color highlighter
	const renderArabicWithWordHighlight = (
		arabicText,
		isPlaying,
		isAudioPlaying,
		audioTime,
		audioDuration,
	) => {
		if (!arabicText) return null;
		const tokens = arabicText.split(/(\s+)/);
		if (!isPlaying || !isAudioPlaying || !audioDuration || audioDuration <= 0) {
			return (
				<span
					style={{
						color: isPlaying ? "var(--desert-terracotta)" : "inherit",
						transition: "color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				>
					{arabicText}
				</span>
			);
		}

		const wordsOnly = tokens.filter((t) => t.trim().length > 0);
		const activeWordIdx = Math.min(
			wordsOnly.length - 1,
			Math.floor((audioTime / audioDuration) * wordsOnly.length),
		);

		let wordCounter = 0;
		return tokens.map((token, i) => {
			if (token.trim().length === 0) {
				return <span key={i}>{token}</span>;
			}
			const isCurrentWord = wordCounter === activeWordIdx;
			wordCounter++;
			return (
				<span
					key={i}
					style={{
						color: isCurrentWord
							? "var(--desert-terracotta)"
							: isPlaying
								? "var(--desert-gold-hover, #9e7534)"
								: "var(--desert-night)",
						textShadow: isCurrentWord
							? "0 0 12px rgba(163, 88, 57, 0.25)"
							: "none",
						transition:
							"color 0.35s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
						display: "inline-block",
					}}
				>
					{token}
				</span>
			);
		});
	};

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
			if (audioRef.current) {
				audioRef.current.pause();
			}
			setActivePlayingVerse(null);
			setIsAudioPlaying(false);
			setIsPlayingFullSurah(false);
			isPlayingFullSurahRef.current = false;
			pendingNextVerseRef.current = null;
			return;
		}

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}

		setIsPlayingFullSurah(true);
		isPlayingFullSurahRef.current = true;
		pendingNextVerseRef.current = null;

		// Split "1:1" to chapter 1, ayah 1
		const [chapterId, verseNumber] = verseKey.split(":");
		const audioUrl = `https://the-quran-project.github.io/Quran-Audio/Data/1/${chapterId}_${verseNumber}.mp3`;

		const audio = new Audio(audioUrl);
		audio.playbackRate = playbackRate;
		audio.loop = isRepeat;
		audioRef.current = audio;
		setActivePlayingVerse(verseKey);
		setIsAudioPlaying(true);

		audio.play().catch((err) => {
			console.error("Audio playback failed:", err);
			setActivePlayingVerse(null);
			setIsAudioPlaying(false);
			setIsPlayingFullSurah(false);
			isPlayingFullSurahRef.current = false;
		});

		// Attach Audio Listeners
		audio.ontimeupdate = () => {
			setAudioTime(audio.currentTime);
		};
		audio.onloadedmetadata = () => {
			setAudioDuration(audio.duration || 0);
		};
		audio.onplay = () => {
			setIsAudioPlaying(true);
		};
		audio.onpause = () => {
			setIsAudioPlaying(false);
		};
		audio.onended = () => {
			setIsAudioPlaying(false);

			if (isPlayingFullSurahRef.current) {
				const currentIndex = verses.findIndex((v) => v.verseKey === verseKey);
				if (currentIndex !== -1 && currentIndex < verses.length - 1) {
					const nextVerse = verses[currentIndex + 1];
					handlePlayAudio(nextVerse.verseKey);
					setTimeout(() => {
						const nextEl = document.getElementById(`v${currentIndex + 2}`);
						if (nextEl) {
							nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
						}
					}, 300);
					return;
				}

				if (nextCursor) {
					const [chapId, vNum] = verseKey.split(":");
					const nextVerseNumber = parseInt(vNum) + 1;
					pendingNextVerseRef.current = `${chapId}:${nextVerseNumber}`;
					loadMore();
					return;
				}

				setIsPlayingFullSurah(false);
				isPlayingFullSurahRef.current = false;
				setActivePlayingVerse(null);
				audioRef.current = null;
				return;
			}

			setActivePlayingVerse(null);
			audioRef.current = null;
		};
	};

	const togglePlayFullSurah = () => {
		if (isPlayingFullSurah) {
			if (audioRef.current && isAudioPlaying) {
				audioRef.current.pause();
			} else if (audioRef.current) {
				audioRef.current
					.play()
					.catch((err) => console.error("Audio playback failed:", err));
			}
		} else {
			if (verses && verses.length > 0) {
				setIsPlayingFullSurah(true);
				handlePlayAudio(verses[0].verseKey);

				setTimeout(() => {
					const firstEl = document.getElementById("v1");
					if (firstEl) {
						firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 300);
			}
		}
	};

	const handleMainPlayPause = () => {
		if (!audioRef.current) return;
		if (isAudioPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current
				.play()
				.catch((err) => console.error("Play failed:", err));
		}
	};

	const toggleSpeed = () => {
		const rates = [1.0, 1.25, 1.5, 2.0];
		const currentIndex = rates.indexOf(playbackRate);
		const nextRate = rates[(currentIndex + 1) % rates.length];
		setPlaybackRate(nextRate);
		if (audioRef.current) {
			audioRef.current.playbackRate = nextRate;
		}
	};

	const toggleRepeat = () => {
		const nextRepeat = !isRepeat;
		setIsRepeat(nextRepeat);
		if (audioRef.current) {
			audioRef.current.loop = nextRepeat;
		}
	};

	const formatTime = (secs) => {
		if (isNaN(secs)) return "0:00";
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	const formatArabicNumber = (number) =>
		String(number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]);

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
			stopAudio();
			navigate(`/quran/${chapters[currentIndex - 1].slug}`);
		}
	};

	const goToNextSurah = () => {
		if (!isLast) {
			stopAudio();
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
								<div className="surah-select-dropdown py-1 mt-1 overflow-auto">
									{chapters.map((c) => {
										const isSelected = c.id === currentChapter?.id;
										return (
											<button
												key={c.id}
												onClick={() => {
													stopAudio();
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
						<button
							className="reader-btn"
							onClick={togglePlayFullSurah}
							title={
								isPlayingFullSurah && isAudioPlaying
									? "Pause Full Surah"
									: "Play Full Surah"
							}
						>
							<i
								className={`bi ${isPlayingFullSurah && isAudioPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
							></i>{" "}
							<span className="d-none d-md-inline">
								{isPlayingFullSurah && isAudioPlaying
									? "Playing Surah"
									: "Play Full Surah"}
							</span>
						</button>
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
								<div className="settings-dropdown p-3 mt-1">
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
									JUZ {verses[0]?.juz || 1}
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

						<div className="col-md-5 text-end mt-3 mt-md-0 d-flex flex-column align-items-end gap-2 justify-content-center">
							<div
								className="mt-md-4 font-quranic display-4 fw-bold text-warning mb-0"
								dir="rtl"
								style={{ fontFamily: "var(--font-quranic)" }}
							>
								{currentChapter.arabicName}
							</div>
						</div>
					</div>
				</div>

				{/* Bismillah Frame */}
				{currentChapter.id !== 9 && (
					<div className="bismillah-card text-center mb-3 shadow-sm">
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
							{verses.map((verse, index) => {
								const isPlaying = activePlayingVerse === verse.verseKey;
								return (
									<span
										key={verse.verseKey}
										className="d-inline-wrap"
										style={{ backgroundColor: "transparent" }}
									>
										{renderArabicWithWordHighlight(
											verse.arabic,
											isPlaying,
											isAudioPlaying,
											audioTime,
											audioDuration,
										)}
										<span
											className={`ayah-end-marker ${isPlaying ? "is-playing" : ""}`}
											style={{
												fontSize: `${Math.max(12, arabicFontSize * 0.42)}px`,
											}}
											aria-label={`Ayah ${index + 1}`}
										>
											<span>{formatArabicNumber(index + 1)}</span>
										</span>
									</span>
								);
							})}
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
											<span>{verse.number_in_chapter}</span>
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
												isPlaying && isAudioPlaying
													? "Pause Verse Audio"
													: "Play Verse Audio"
											}
											onClick={() => handlePlayAudio(verse.verseKey)}
										>
											<i
												className={`bi ${isPlaying && isAudioPlaying ? "bi-pause-circle-fill text-danger" : "bi-play-circle-fill text-warning"} fs-5`}
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
									{renderArabicWithWordHighlight(
										verse.arabic,
										isPlaying,
										isAudioPlaying,
										audioTime,
										audioDuration,
									)}
									<span
										className={`ayah-end-marker ${isPlaying ? "is-playing" : ""}`}
										style={{
											fontSize: `${Math.max(12, arabicFontSize * 0.42)}px`,
										}}
										aria-label={`Ayah ${index + 1}`}
									>
										<span>{formatArabicNumber(index + 1)}</span>
									</span>
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
				{/* <div
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
				</div> */}
			</main>

			{/* Sticky Bottom Audio Player Bar */}
			{activePlayingVerse && (
				<div className="audio-player-bar text-start">
					<div className="container d-flex align-items-center justify-content-between gap-3">
						{/* Currently Playing Info */}
						<div className="d-flex align-items-center gap-3">
							<button
								className="btn-play-main border-0"
								onClick={handleMainPlayPause}
								style={{ cursor: "pointer" }}
							>
								<i
									className={`bi ${isAudioPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
								></i>
							</button>
							<div>
								<div className="fw-bold text-white small mb-0">
									{currentChapter.name} • Verse{" "}
									{activePlayingVerse.split(":")[1] || activePlayingVerse}
								</div>
								{/* <small
									className="text-white-50"
									style={{ fontSize: "0.75rem" }}
								>
									Mishary Rashid Alafasy
								</small> */}
							</div>
						</div>

						{/* Playback Progress Bar (Hidden on small screens) */}
						<div
							className="d-none d-md-flex align-items-center gap-2 flex-grow-1 mx-4"
							style={{ maxWidth: "400px" }}
						>
							<span
								className="small text-white-50"
								style={{ fontSize: "0.75rem", minWidth: "30px" }}
							>
								{formatTime(audioTime)}
							</span>
							<input
								type="range"
								className="form-range progress-slider flex-grow-1"
								min="0"
								max={audioDuration || 100}
								value={audioTime}
								onChange={(e) => {
									const time = parseFloat(e.target.value);
									setAudioTime(time);
									if (audioRef.current) {
										audioRef.current.currentTime = time;
									}
								}}
								style={{
									height: "6px",
									cursor: "pointer",
									accentColor: "var(--desert-gold)",
									backgroundColor: "rgba(255,255,255,0.15)",
									borderRadius: "3px",
								}}
							/>
							<span
								className="small text-white-50"
								style={{ fontSize: "0.75rem", minWidth: "30px" }}
							>
								{formatTime(audioDuration)}
							</span>
						</div>

						{/* Quick Audio Controls */}
						<div className="d-flex align-items-center gap-2 text-white">
							<button
								className="btn btn-sm text-white-50 p-1 border-0 bg-transparent"
								title="Playback Speed"
								onClick={toggleSpeed}
								style={{ cursor: "pointer" }}
							>
								<span className="badge bg-secondary">
									{playbackRate.toFixed(2)}x
								</span>
							</button>
							<button
								className="btn btn-sm text-white-50 p-1 border-0 bg-transparent"
								title="Repeat Toggle"
								onClick={toggleRepeat}
								style={{ cursor: "pointer" }}
							>
								<i
									className={`bi bi-repeat fs-5 ${isRepeat ? "text-warning" : "text-white-50"}`}
								></i>
							</button>
							<button
								className="btn btn-sm text-white-50 p-1 border-0 bg-transparent"
								title="Close Player"
								onClick={() => {
									if (audioRef.current) {
										audioRef.current.pause();
										audioRef.current = null;
									}
									setActivePlayingVerse(null);
									setIsAudioPlaying(false);
								}}
								style={{ cursor: "pointer" }}
							>
								<i className="bi bi-x-lg fs-5 text-white"></i>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
