import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuranChapters } from "../hooks/useQuran";

export default function QuranPage() {
	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState("All"); // 'All', 'Meccan', 'Medinan'

	// Debounce searchTerm changes to prevent excessive API requests while typing
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const {
		chapters,
		loading,
		loadingMore,
		error,
		nextCursor,
		loadMore,
		meccanCount,
		medinanCount,
	} = useQuranChapters(debouncedSearch, activeCategory);

	// Infinite scroll scrolling pagination
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
	}, [nextCursor, loading, loadingMore, loadMore]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Filtering Logic (Both search and category filters are fully offloaded to the backend API)
	const filteredChapters = chapters;

	return (
		<div style={{ backgroundColor: "var(--desert-sand)", minHeight: "80vh" }}>
			<main className="container py-4 text-start">
				{/* Header & Interactive Search Banner */}
				<section className="surah-header-banner mb-4 shadow-sm text-start">
					<div className="row align-items-center g-4">
						<div className="col-lg-7">
							<span
								className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold"
								style={{ fontSize: "0.75rem" }}
							>
								114 SURAHS • 30 JUZ
							</span>
							<h1 className="display-6 fw-bold mb-2">
								The Noble Quran (القرآن الكريم)
							</h1>
							<p className="mb-0 opacity-75 small">
								Read, listen to verse-by-verse recitations, and explore
								classical commentary.
							</p>
						</div>
						<div className="col-lg-5">
							<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
								<i className="bi bi-search text-muted ms-2 me-2"></i>
								<input
									type="text"
									className="form-control border-0 shadow-none bg-transparent"
									placeholder="Search Surah by name, Arabic, or number..."
									value={searchTerm}
									onChange={handleSearchChange}
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
				</section>

				{/* Quick Filter */}
				<div className=" d-flex align-items-center justify-content-between gap-3 mb-4 py-2 px-2 flex-nowrap">
					<div
						className="d-flex gap-2 overflow-auto no-scrollbar flex-nowrap flex-grow-1"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						<button
							className={`filter-btn ${activeCategory === "All" ? "active" : ""}`}
							style={{ whiteSpace: "nowrap" }}
							onClick={() => {
								setActiveCategory("All");
							}}
						>
							All ({meccanCount + medinanCount || 0})
						</button>
						<button
							className={`filter-btn ${activeCategory === "Meccan" ? "active" : ""}`}
							style={{ whiteSpace: "nowrap" }}
							onClick={() => {
								setActiveCategory("Meccan");
							}}
						>
							Meccan ({meccanCount || 0})
						</button>
						<button
							className={`filter-btn ${activeCategory === "Medinan" ? "active" : ""}`}
							style={{ whiteSpace: "nowrap" }}
							onClick={() => {
								setActiveCategory("Medinan");
							}}
						>
							Medinan ({medinanCount || 0})
						</button>
					</div>
				</div>

				{/* Loading / Error States */}
				{loading && (
					<div className="text-center py-5">
						<div className="spinner-border text-warning" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<p className="text-muted mt-2">Retrieving Surah index...</p>
					</div>
				)}

				{error && (
					<div
						className="alert alert-danger text-center max-w-md mx-auto"
						role="alert"
					>
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						Failed to retrieve Surah index. Please try again.
					</div>
				)}

				{/* Surah Cards Grid */}
				{!loading && !error && (
					<>
						{filteredChapters.length === 0 ? (
							<div className="text-center py-5">
								<i className="bi bi-journal-x fs-1 text-muted"></i>
								<p className="text-muted mt-3">
									No Surahs match your selection.
								</p>
							</div>
						) : (
							<div className="row g-3 g-md-4" id="surahList">
								{filteredChapters.map((chapter) => {
									// Format number to have leading zero (e.g. 01, 18)
									const formattedNum = chapter.id.toString().padStart(2, "0");

									return (
										<div key={chapter.id} className="col-md-6 col-lg-4">
											<Link
												to={`/quran/${chapter.slug}`}
												className="surah-card text-decoration-none"
											>
												<div className="d-flex align-items-center justify-content-between">
													<div className="d-flex align-items-center gap-3">
														<div className="surah-number-badge">
															<span>{formattedNum}</span>
														</div>
														<div>
															<h6 className="fw-bold mb-0 text-dark">
																{chapter.name}
															</h6>
															<small className="text-muted">
																"{chapter.englishName}"
															</small>
														</div>
													</div>
													<div className="text-end">
														<div
															className="font-quranic fs-3 fw-bold mb-0"
															dir="rtl"
															style={{ lineHeight: 1 }}
														>
															{chapter.arabicName}
														</div>
														<div className="d-flex align-items-center justify-content-end gap-1 mt-1">
															<span
																className={`revelation-tag revelation-${chapter.type.toLowerCase()}`}
															>
																{chapter.type}
															</span>
															<span
																className="text-muted small"
																style={{ fontSize: "0.72rem" }}
															>
																• {chapter.versesCount} Ayahs
															</span>
														</div>
													</div>
												</div>
											</Link>
										</div>
									);
								})}
							</div>
						)}
					</>
				)}

				{/* Infinite Scroll Loading More Spinner */}
				{loadingMore && (
					<div className="text-center py-4">
						<div
							className="spinner-border spinner-border-sm text-warning"
							role="status"
						>
							<span className="visually-hidden">Loading more...</span>
						</div>
						<p className="text-muted mt-1 small">Loading more chapters...</p>
					</div>
				)}
			</main>
		</div>
	);
}
