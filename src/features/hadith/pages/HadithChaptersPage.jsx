import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useHadithChapters } from "../hooks/useHadith";

export default function HadithChaptersPage() {
	const { bookId } = useParams(); // Holds the book slug, e.g. "sahih-bukhari"
	const { book, chapters, loading, loadingMore, nextCursor, loadMore, error } =
		useHadithChapters(bookId);

	const [searchTerm, setSearchTerm] = useState("");

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

	// Search Logic
	const filteredChapters = chapters.filter((chapter) => {
		const englishTrans = chapter.translations?.find((t) => t.lang === "en");
		const enName = englishTrans?.name || "";
		const term = searchTerm.toLowerCase();

		return (
			chapter.name.toLowerCase().includes(term) || // Arabic name
			enName.toLowerCase().includes(term) ||
			chapter.chapter_number?.toString().includes(term) ||
			chapter.id.toString().includes(term)
		);
	});

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
				<section className="book-header-banner mb-4 shadow-sm text-start">
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

				{/* Search & Topic Filter */}
				<div className="row align-items-center g-3 mb-4">
					<div className="col-lg-6 offset-lg-3">
						<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
							<i className="bi bi-search text-muted ms-2 me-2"></i>
							<input
								type="text"
								className="form-control border-0 shadow-none bg-transparent"
								placeholder="Search chapter by English name, Arabic..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								className="btn btn-sm text-white px-3 fw-bold border-0"
								style={{
									backgroundColor: "var(--desert-terracotta)",
									borderRadius: "10px",
								}}
							>
								Find
							</button>
						</div>
					</div>
				</div>

				{/* Chapter Section Header */}
				<div className="section-category-header mb-3">
					<i className="bi bi-brightness-high"></i> Chapters Index
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
							const chapterNum = chapter.chapter_number || chapter.id;
							const formattedNum = chapterNum.toString().padStart(2, "0");
							const englishChapterTrans = chapter.translations?.find(
								(t) => t.lang === "en",
							);
							const chapterName = englishChapterTrans?.name || chapter.name;

							return (
								<div key={chapter.id} className="col-md-6 col-lg-4">
									<Link
										to={`/hadith/${bookId}/${chapter.slug || chapter.id}`}
										className="chapter-card shadow-sm text-decoration-none"
									>
										<div className="d-flex align-items-center justify-content-between">
											<div className="d-flex align-items-center gap-3">
												<div className="chapter-number-badge">
													<span>{formattedNum}</span>
												</div>
												<div>
													<h6 className="fw-bold mb-0">{chapterName}</h6>
													<small className="text-muted">
														Chapter {chapterNum}
													</small>
												</div>
											</div>
											<div className="text-end">
												<div
													className="font-quranic fs-3 fw-bold mb-1"
													dir="rtl"
												>
													{chapter.name}
												</div>
												<span className="hadith-range-tag">
													{chapter.hadith_count || 0} Ahadith
												</span>
											</div>
										</div>
									</Link>
								</div>
							);
						})}
					</div>
				)}

				{/* Loading More Spinner (Scroll Pagination indicator) */}
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
		</div>
	);
}
