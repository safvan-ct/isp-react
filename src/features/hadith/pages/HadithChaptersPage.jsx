import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHadithChapters } from "../hooks/useHadith";
import { searchHadithChapters, getHadithByNumber } from "../services/hadithApi";

export default function HadithChaptersPage() {
	const { bookId } = useParams(); // Holds the book slug, e.g. "sahih-bukhari"
	const navigate = useNavigate();
	const { book, chapters, loading, loadingMore, nextCursor, loadMore, error } =
		useHadithChapters(bookId);

	const [searchTerm, setSearchTerm] = useState("");
	const [searchedChapters, setSearchedChapters] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState(null);

	// Single Hadith Modal States
	const [singleHadithData, setSingleHadithData] = useState(null);
	const [selectedLang, setSelectedLang] = useState("en");
	const [modalTranslation, setModalTranslation] = useState("");
	const [isTranslatingModal, setIsTranslatingModal] = useState(false);
	const [isCopiedModal, setIsCopiedModal] = useState(false);
	const [isBookmarkedModal, setIsBookmarkedModal] = useState(false);

	const translationCache = useRef({});

	const LANGUAGES = [
		{ code: "en", label: "EN", name: "English" },
		{ code: "ml", label: "ML", name: "മലയാളം" },
		{ code: "hi", label: "HI", name: "हिन्दी" },
	];

	/** Split text into chunks of at most maxLen chars */
	const chunkText = (text, maxLen = 400) => {
		if (text.length <= maxLen) return [text];
		const chunks = [];
		let remaining = text;
		while (remaining.length > maxLen) {
			let cut = remaining.lastIndexOf(". ", maxLen);
			if (cut <= 0) cut = remaining.lastIndexOf(" ", maxLen);
			if (cut <= 0) cut = maxLen;
			chunks.push(remaining.slice(0, cut + 1).trim());
			remaining = remaining.slice(cut + 1).trim();
		}
		if (remaining.length > 0) chunks.push(remaining);
		return chunks;
	};

	/** Translate string via Google Translate free endpoint */
	const translateText = async (text, targetLang) => {
		if (!text || targetLang === "en") return text;
		const cacheKey = `${targetLang}::${text.slice(0, 80)}`;
		if (translationCache.current[cacheKey])
			return translationCache.current[cacheKey];
		try {
			const chunks = chunkText(text, 400);
			const translated = (
				await Promise.all(
					chunks.map(async (chunk) => {
						const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
						const res = await fetch(url);
						if (!res.ok) return chunk;
						const data = await res.json();
						return data[0]?.map((c) => c[0]).join("") || chunk;
					}),
				)
			).join(" ");
			translationCache.current[cacheKey] = translated;
			return translated;
		} catch {
			return text;
		}
	};

	const getArabic = (h) => h?.text || "";
	const getTranslation = (h) =>
		h?.translations?.find((t) => t.lang === "en")?.text || "";
	const getNarrator = (h) =>
		h?.translations?.find((t) => t.lang === "en")?.narrator || "";
	const getGrade = (h) =>
		h?.translations?.find((t) => t.lang === "en")?.status || h?.status || "";
	const getHadithNum = (h) => h?.hadith_number ?? h?.id;

	const handleModalLangChange = async (lang) => {
		setSelectedLang(lang);
		if (lang === "en") {
			setModalTranslation("");
			return;
		}
		if (!singleHadithData?.hadith) return;
		const bodyText = getTranslation(singleHadithData.hadith);
		if (bodyText) {
			setIsTranslatingModal(true);
			const translated = await translateText(bodyText, lang);
			setModalTranslation(translated);
			setIsTranslatingModal(false);
		}
	};

	const handleCopyModal = (h) => {
		const narrator = getNarrator(h);
		const translation = getTranslation(h);
		navigator.clipboard.writeText(
			`${narrator ? `Narrator: ${narrator}\n` : ""}${translation}`,
		);
		setIsCopiedModal(true);
		setTimeout(() => setIsCopiedModal(false), 2000);
	};

	// Infinite scroll pagination for chapters list
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 150
			) {
				if (nextCursor && !loading && !loadingMore) {
					loadMore();
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [nextCursor, loading, loadingMore]);

	// Helpers to format class properties
	const getClassification = (status) => {
		switch (status) {
			case "sahih":
				return "Sahih Collection";
			case "jami":
				return "Jami Work";
			case "sunan":
				return "Sunan Work";
			case "muwatta":
				return "Muwatta Classic";
			case "musnad":
				return "Musnad Comp.";
			default:
				return "Hadith Comp.";
		}
	};

	// Search Handler — triggered ONLY when clicking "Find" or pressing Enter
	const handleFind = async (e) => {
		if (e) e.preventDefault();
		const term = searchTerm.trim();
		setSearchError(null);

		if (!term) {
			setSearchedChapters(null);
			return;
		}

		const isOnlyNumbers = /^\d+$/.test(term);

		if (isOnlyNumbers) {
			// Call API /hadith/books/{book_slug}/hadiths/{hadees_number} and open Modal UI
			try {
				setIsSearching(true);
				const result = await getHadithByNumber(bookId, term);
				if (result && result.hadith) {
					setSingleHadithData(result);
					setSelectedLang("en");
					setModalTranslation("");
				} else {
					setSearchError(`Hadith #${term} was not found in this collection.`);
				}
			} catch (err) {
				console.error("Hadith fetch error:", err);
				setSearchError(`Hadith #${term} was not found in this collection.`);
			} finally {
				setIsSearching(false);
			}
			return;
		}

		try {
			setIsSearching(true);
			// Text with alphabets -> Call API /hadith/books/{HADITH_BOOK}/chapters?chapter_name=...
			const res = await searchHadithChapters(bookId, term);
			const foundList = res.chapters || [];
			setSearchedChapters(foundList);
			if (foundList.length === 0) {
				setSearchError(`No chapters found matching "${term}".`);
			}
		} catch (err) {
			console.error("Search error:", err);
			setSearchError(`Error searching chapters for "${term}".`);
		} finally {
			setIsSearching(false);
		}
	};

	const displayedChapters =
		searchedChapters !== null ? searchedChapters : chapters;

	if (loading && chapters.length === 0) {
		return (
			<div
				className="text-center py-5"
				style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}
			>
				<div className="spinner-border text-warning mt-5" role="status">
					<span className="visually-hidden">Loading chapters...</span>
				</div>
				<p className="text-muted mt-2">Loading index list...</p>
			</div>
		);
	}

	if (error || !book) {
		return (
			<div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
				<div className="alert alert-danger max-w-md mx-auto" role="alert">
					<i className="bi bi-exclamation-triangle-fill me-2"></i>
					Hadith book details not found or failed to load.
				</div>
				<Link to="/hadith" className="btn btn-desert-primary mt-3">
					Back to Library
				</Link>
			</div>
		);
	}

	const englishBookTrans = book.translations?.find((t) => t.lang === "en");
	const bookName = englishBookTrans?.name || book.name;
	const bookDesc = englishBookTrans?.description || "";
	const bookWriter = englishBookTrans?.writer || book.writer;

	return (
		<div style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}>
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
						<li className="breadcrumb-item active" aria-current="page">
							{bookName}
						</li>
					</ol>
				</nav>

				{/* Book Showcase Banner */}
				<section
					className="book-header-banner mb-4 shadow-sm text-start"
					data-arabic-name={book.name || ""}
				>
					<div className="row align-items-center g-4">
						<div className="col-lg-8">
							<div className="d-flex flex-wrap gap-2 mb-2">
								<span className="badge bg-warning text-dark fw-bold px-3 py-1">
									{book.group?.toUpperCase() || "HADITH COLLECTION"}
								</span>
								<span className="badge bg-dark border border-secondary text-light">
									{bookWriter} • {book.life_span}
								</span>
							</div>
							<h1 className="display-6 fw-bold mb-2">{bookName}</h1>
							<p className="mb-3 opacity-75 small">{bookDesc}</p>

							<div className="d-flex flex-wrap gap-3">
								<div className="stat-pill d-flex align-items-center gap-1">
									<i className="bi bi-journal-bookmark text-warning"></i>
									<span className="small">
										<strong>{book.chapter_count || 0}</strong> Chapters (Kutub)
									</span>
								</div>
								<div className="stat-pill d-flex align-items-center gap-1">
									<i className="bi bi-chat-square-quote text-warning"></i>
									<span className="small">
										<strong>{(book.hadith_count || 0).toLocaleString()}</strong>{" "}
										Total Ahadith
									</span>
								</div>
								<div className="stat-pill d-flex align-items-center gap-1">
									<i className="bi bi-check-circle text-warning"></i>
									<span className="small">
										<strong>{getClassification(book.status)}</strong>
									</span>
								</div>
							</div>
						</div>

						<div className="col-lg-4 text-lg-end text-start mt-3 mt-lg-0">
							<div
								className="font-quranic display-4 fw-bold text-warning mb-1"
								dir="rtl"
								style={{ fontFamily: "var(--font-quranic)" }}
							>
								{book.name}
							</div>
						</div>
					</div>
				</section>

				{/* Search & Topic Filter Form */}
				<form onSubmit={handleFind} className="row align-items-center g-3 mb-4">
					<div className="col-lg-6 offset-lg-3">
						<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light shadow-sm">
							<i className="bi bi-search text-muted ms-2 me-2"></i>
							<input
								type="text"
								className="form-control border-0 shadow-none bg-transparent"
								placeholder="Search chapter name or Hadith number..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								type="submit"
								className="btn btn-sm text-white px-3 fw-bold border-0 d-flex align-items-center gap-1"
								style={{
									backgroundColor: "var(--desert-terracotta)",
									borderRadius: "10px",
								}}
								disabled={isSearching}
							>
								{isSearching ? (
									<>
										<span
											className="spinner-border spinner-border-sm"
											role="status"
										></span>
										<span>Finding…</span>
									</>
								) : (
									"Find"
								)}
							</button>
						</div>
						{searchError && (
							<div
								className="alert alert-warning py-2 px-3 mt-2 mb-0 small rounded-3"
								role="alert"
							>
								<i className="bi bi-exclamation-triangle-fill me-1"></i>
								{searchError}
							</div>
						)}
					</div>
				</form>

				{/* Chapter Section Header */}
				<div className="section-category-header mb-3">
					<i className="bi bi-brightness-high"></i> Chapters Index
				</div>

				{/* Chapters Grid */}
				{displayedChapters.length === 0 ? (
					<div className="alert alert-info py-4 text-center" role="alert">
						<i className="bi bi-info-circle-fill me-2"></i>
						No chapters match your search query.
					</div>
				) : (
					<div className="row g-3 g-md-4 mb-5" id="chapterList">
						{displayedChapters.map((chapter) => {
							const chapterNum = chapter.chapter_number || chapter.id;
							const formattedNum = chapterNum.toString().padStart(2, "0");
							const chapterName =
								chapter.translation ||
								chapter.title ||
								chapter.translations?.find((t) => t.lang === "en")?.name ||
								chapter.name;

							return (
								<div
									key={chapter.id}
									className="col-md-6 col-lg-4 d-flex align-items-stretch"
								>
									<Link
										to={`/hadith/${bookId}/${chapter.slug || chapter.id}`}
										className="chapter-card shadow-sm text-decoration-none w-100"
									>
										{/* Upper Body */}
										<div className="d-flex align-items-start justify-content-between gap-3 mb-3">
											{/* Left: Badge + English Name */}
											<div
												className="d-flex align-items-start gap-2"
												style={{ minWidth: 0 }}
											>
												<div className="chapter-number-badge flex-shrink-0 me-1">
													<span>{formattedNum}</span>
												</div>
												<div style={{ minWidth: 0 }}>
													<h6
														className="fw-bold mb-1 text-dark line-clamp-2"
														style={{ fontSize: "0.92rem", lineHeight: 1.35 }}
													>
														{chapterName}
													</h6>
												</div>
											</div>

											{/* Right: Arabic Title */}
											<div
												className="text-end flex-shrink-0"
												style={{ maxWidth: "45%" }}
											>
												<div
													className="font-quranic fw-bold text-dark line-clamp-2"
													dir="rtl"
													style={{ fontSize: "1.15rem", lineHeight: 1.4 }}
												>
													{chapter.name}
												</div>
											</div>
										</div>

										{/* Footer Row */}
										<div className="d-flex align-items-center justify-content-between pt-2.5 mt-auto border-top border-light-subtle">
											<span
												className="small text-muted"
												style={{ fontSize: "0.75rem" }}
											>
												Chapter {chapterNum}
											</span>
											<span className="hadith-range-tag">
												{chapter.hadith_count || 0} Ahadith
											</span>
										</div>
									</Link>
								</div>
							);
						})}
					</div>
				)}

				{/* Loading More Spinner */}
				{loadingMore && (
					<div className="text-center py-4">
						<div
							className="spinner-border spinner-border-sm text-warning"
							role="status"
						>
							<span className="visually-hidden">Loading more...</span>
						</div>
						<p className="text-muted mt-1 small">Retrieving next chapters...</p>
					</div>
				)}
			</main>

			{/* Single Hadith Result Modal UI */}
			{singleHadithData && singleHadithData.hadith && (
				<div
					className="modal show d-block fade-in"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", zIndex: 1060 }}
					onClick={() => setSingleHadithData(null)}
				>
					<div
						className="modal-dialog modal-lg modal-dialog-centered px-2"
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className="modal-content shadow-lg border-0"
							style={{
								backgroundColor: "var(--desert-sand-card)",
								borderRadius: "24px",
								overflow: "hidden",
							}}
						>
							{/* Modal Header */}
							<div
								className="modal-header border-bottom px-4 py-3 align-items-center justify-content-between text-start"
								style={{ backgroundColor: "var(--desert-sand)" }}
							>
								<div className="d-flex align-items-center gap-2 flex-wrap">
									<span
										className="hadith-number-badge me-1"
										style={{
											width: "36px",
											height: "36px",
											fontSize: "0.85rem",
										}}
									>
										<span>{getHadithNum(singleHadithData.hadith)}</span>
									</span>
									<div>
										<h6 className="fw-bold mb-0 text-dark">
											{singleHadithData.book?.translations?.find(
												(t) => t.lang === "en",
											)?.name ||
												singleHadithData.book?.name ||
												bookName}{" "}
											— Hadith #{getHadithNum(singleHadithData.hadith)}
										</h6>
										<small className="text-muted">
											{singleHadithData.chapter?.translations?.find(
												(t) => t.lang === "en",
											)?.name ||
												singleHadithData.chapter?.name ||
												`Chapter ${singleHadithData.chapter?.chapter_number || ""}`}
										</small>
									</div>
								</div>
								<button
									type="button"
									className="btn-close shadow-none"
									aria-label="Close"
									onClick={() => setSingleHadithData(null)}
								></button>
							</div>

							{/* Modal Body */}
							<div className="modal-body p-4 text-start">
								{/* Language Selector & Grade */}
								<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
									<div className="d-flex align-items-center gap-1">
										<i className="bi bi-translate text-muted me-1"></i>
										<span className="small text-muted me-2 fw-semibold">:</span>
										{LANGUAGES.map((lang) => (
											<button
												key={lang.code}
												onClick={() => handleModalLangChange(lang.code)}
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
											</button>
										))}
									</div>
									{getGrade(singleHadithData.hadith) && (
										<span className="grade-badge-sahih text-capitalize">
											{getGrade(singleHadithData.hadith)}
										</span>
									)}
								</div>

								{/* Narrator Pill */}
								{getNarrator(singleHadithData.hadith) && (
									<div className="mb-3">
										<span className="isnad-pill">
											<i className="bi bi-diagram-3-fill"></i>
											<span>
												Narrator:{" "}
												<strong>{getNarrator(singleHadithData.hadith)}</strong>
											</span>
										</span>
									</div>
								)}

								{/* Arabic Text */}
								{getArabic(singleHadithData.hadith) && (
									<div
										className="hadith-arabic-text mb-4"
										style={{
											fontSize: "22px",
											lineHeight: 1.8,
											textAlign: "justify",
										}}
									>
										{getArabic(singleHadithData.hadith)}
									</div>
								)}

								{/* Translation */}
								<div
									className="hadith-translation fw-medium mb-3"
									style={{ fontSize: "14px", textAlign: "justify" }}
								>
									{isTranslatingModal ? (
										<span className="placeholder-glow d-block">
											<span className="placeholder col-12 mb-1"></span>
											<span className="placeholder col-10 mb-1"></span>
											<span className="placeholder col-8"></span>
										</span>
									) : (
										modalTranslation ||
										getTranslation(singleHadithData.hadith) || (
											<span className="text-muted fst-italic">
												Translation not available.
											</span>
										)
									)}
								</div>
							</div>

							{/* Modal Footer */}
							<div
								className="modal-footer border-top px-4 py-3 justify-content-between"
								style={{ backgroundColor: "var(--desert-sand)" }}
							>
								<div className="d-flex align-items-center gap-2">
									<button
										className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3"
										onClick={() => handleCopyModal(singleHadithData.hadith)}
									>
										<i
											className={`bi ${isCopiedModal ? "bi-check2 text-success" : "bi-copy"}`}
										></i>
										<span>{isCopiedModal ? "Copied" : "Copy"}</span>
									</button>
									<button
										className={`btn btn-sm d-flex align-items-center gap-1 rounded-pill px-3 ${isBookmarkedModal ? "btn-warning text-dark" : "btn-outline-secondary"}`}
										onClick={() => setIsBookmarkedModal(!isBookmarkedModal)}
									>
										<i
											className={`bi ${isBookmarkedModal ? "bi-bookmark-fill" : "bi-bookmark"}`}
										></i>
										<span>Bookmark</span>
									</button>
								</div>

								{/* Navigation to Full Chapter View */}
								{singleHadithData.chapter && (
									<button
										className="btn btn-sm btn-desert-primary rounded-pill px-3"
										onClick={() => {
											const cSlug =
												singleHadithData.chapter.slug ||
												singleHadithData.chapter.id;
											const hId = singleHadithData.hadith.id;
											setSingleHadithData(null);
											navigate(`/hadith/${bookId}/${cSlug}#h${hId}`);
										}}
									>
										View Full Chapter <i className="bi bi-arrow-right ms-1"></i>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
