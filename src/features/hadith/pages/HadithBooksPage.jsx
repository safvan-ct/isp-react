import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHadithBooks } from "../hooks/useHadith";

export default function HadithBooksPage() {
	const { books, loading, loadingMore, nextCursor, loadMore, error } =
		useHadithBooks();

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	// Categories configurations matching v2 filters
	const categories = [
		{ label: "All Collections", value: "All" },
		{ label: "Kutub al-Sittah", value: "kutub-sittah" },
		{ label: "Foundational Sahihs", value: "foundational-sahihs" },
		{ label: "Sunan Works", value: "sunan-works" },
		{ label: "Selected Adab & Fiqh", value: "adab-fiqh" },
	];

	// Infinite scroll pagination for books list
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

	// Helpers for styling & details formatting based on API status / slug attributes
	const getEmblem = (slug) => {
		switch (slug) {
			case "sahih-bukhari":
				return "bi-journal-richtext text-success";
			case "sahih-muslim":
				return "bi-journal-richtext text-primary";
			case "al-tirmidhi":
				return "bi-journal-richtext text-warning";
			case "abu-dawood":
				return "bi-journal-richtext text-danger";
			case "ibn-e-majah":
				return "bi-journal-richtext text-info";
			case "sunan-nasai":
				return "bi-journal-richtext text-secondary";
			case "mishkat":
				return "bi-journal-bookmark text-dark";
			case "muwatta-malik":
				return "bi-bookmark-check text-warning";
			case "musnad-ahmad-ibn-hanbal":
				return "bi-journal-text text-danger";
			case "sunan-al-darimi":
				return "bi-journal text-info";
			default:
				return "bi-book";
		}
	};

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

	const getBadgeClass = (status) => {
		switch (status) {
			case "sahih":
				return "badge-sahih";
			case "jami":
			case "sunan":
				return "badge-sunan";
			default:
				return "badge-compilation";
		}
	};

	const getCategoryCount = (catValue) => {
		if (catValue === "All") return books.length;
		return books.filter((book) => {
			const bookGroup = book.group?.toLowerCase() || "";
			if (catValue === "kutub-sittah") return bookGroup === "kutub al-sittah";
			if (catValue === "foundational-sahihs") return book.status === "sahih";
			if (catValue === "sunan-works") return book.status === "sunan";
			if (catValue === "adab-fiqh")
				return book.status === "muwatta" || book.status === "collection";
			return false;
		}).length;
	};

	// Filtering Logic
	const filteredBooks = books.filter((book) => {
		const englishTrans = book.translations?.find((t) => t.lang === "en");
		const enName = englishTrans?.name || "";
		const enWriter = englishTrans?.writer || "";
		const enDesc = englishTrans?.description || "";
		const statusText = getClassification(book.status);

		const term = searchTerm.toLowerCase();
		const matchesSearch =
			book.name.toLowerCase().includes(term) || // Arabic name
			enName.toLowerCase().includes(term) ||
			enWriter.toLowerCase().includes(term) ||
			enDesc.toLowerCase().includes(term) ||
			statusText.toLowerCase().includes(term);

		const bookGroup = book.group?.toLowerCase() || "";
		const matchesCategory =
			activeCategory === "All" ||
			(activeCategory === "kutub-sittah" && bookGroup === "kutub al-sittah") ||
			(activeCategory === "foundational-sahihs" && book.status === "sahih") ||
			(activeCategory === "sunan-works" && book.status === "sunan") ||
			(activeCategory === "adab-fiqh" &&
				(book.status === "muwatta" || book.status === "collection"));

		return matchesSearch && matchesCategory;
	});

	return (
		<div style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}>
			<main className="container py-4 text-start">
				{/* Header & Interactive Search Banner */}
				<section className="hadith-header-banner mb-4 shadow-sm text-start">
					<div className="row align-items-center g-4">
						<div className="col-lg-7">
							<span
								className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold"
								style={{ fontSize: "0.75rem" }}
							>
								AUTHENTIC TRADITIONS
							</span>
							<h1 className="display-6 fw-bold mb-2">
								Canonical Hadith Collections
							</h1>
							<p className="mb-0 opacity-75 small">
								Explore the Prophetic sunnah through the Kutub al-Sittah,
								verified commentaries, and topical compilations with complete
								Isnad chains.
							</p>
						</div>
						<div className="col-lg-5">
							<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
								<i className="bi bi-search text-muted ms-2 me-2"></i>
								<input
									type="text"
									className="form-control border-0 shadow-none bg-transparent"
									placeholder="Search book name..."
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
									Search
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Collection Category Filter Tabs */}
				<div className="sticky-filter-bar d-flex align-items-center justify-content-between gap-3 mb-4 py-2 px-2 flex-nowrap">
					<div
						className="d-flex align-items-center gap-2 overflow-auto no-scrollbar flex-nowrap py-1 flex-grow-1"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{categories.map((cat) => (
							<button
								key={cat.value}
								className={`filter-btn ${activeCategory === cat.value ? "active" : ""}`}
								onClick={() => setActiveCategory(cat.value)}
								style={{ whiteSpace: "nowrap" }}
							>
								{cat.label} ({getCategoryCount(cat.value)})
							</button>
						))}
					</div>
				</div>

				{/* Loading / Error States */}
				{loading && books.length === 0 && (
					<div className="text-center py-5">
						<div className="spinner-border text-warning" role="status">
							<span className="visually-hidden">
								Loading Hadith Collections...
							</span>
						</div>
						<p className="text-muted mt-2">Opening library archives...</p>
					</div>
				)}

				{error && (
					<div
						className="alert alert-danger text-center max-w-md mx-auto"
						role="alert"
					>
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						Failed to load Hadith library collections.
					</div>
				)}

				{/* Hadith Books Grid */}
				{books.length > 0 && (
					<>
						{filteredBooks.length === 0 ? (
							<div className="text-center py-5">
								<i className="bi bi-journal-x fs-1 text-muted"></i>
								<p className="text-muted mt-3">
									No collections match your search filter.
								</p>
							</div>
						) : (
							<div className="row g-4" id="hadithBookList">
								{filteredBooks.map((book) => {
									const englishTrans = book.translations?.find(
										(t) => t.lang === "en",
									);
									const bookName = englishTrans?.name || book.name;
									const bookDesc = englishTrans?.description || "";
									const chapterText = book.chapter_count
										? `${book.chapter_count} Chapters`
										: "Foundational";

									return (
										<div key={book.id} className="col-md-6 col-lg-4">
											<div className="book-card shadow-sm text-start">
												<div className="d-flex justify-content-between align-items-start mb-3">
													<div className="book-emblem">
														<i className={`bi ${getEmblem(book.slug)}`}></i>
													</div>
													<span
														className={`classification-badge ${getBadgeClass(book.status)}`}
													>
														{getClassification(book.status)}
													</span>
												</div>

												<div className="d-flex justify-content-between align-items-baseline mb-2 flex-wrap gap-1">
													<h5 className="fw-bold mb-0">{bookName}</h5>
													<span
														className="font-quranic fs-4 fw-bold"
														dir="rtl"
														style={{ fontFamily: "var(--font-quranic)" }}
													>
														{book.name}
													</span>
												</div>

												<p className="small text-muted mb-3 flex-grow-1">
													{bookDesc}
												</p>

												<div
													className="pt-3 border-top d-flex justify-content-between align-items-center"
													style={{
														borderColor: "var(--desert-dune) !important",
													}}
												>
													<div>
														<span className="d-block fw-bold small">
															{(book.hadith_count || 0).toLocaleString()}{" "}
															Ahadith
														</span>
														<span
															className="text-muted"
															style={{ fontSize: "0.75rem" }}
														>
															{chapterText}
														</span>
													</div>
													<Link
														to={`/hadith/${book.slug}`}
														className="btn btn-desert-outline btn-sm"
													>
														Explore Book
													</Link>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</>
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
						<p className="text-muted mt-1 small">Retrieving more volumes...</p>
					</div>
				)}
			</main>
		</div>
	);
}
