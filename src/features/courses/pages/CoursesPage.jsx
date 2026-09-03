import { useState } from "react";
import { Link } from "react-router-dom";
import { coursesCatalog } from "../../../services/mockData";

export default function CoursesPage() {
	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	// Categories list based on mockup
	const categories = [
		{ label: "All Courses (12)", value: "All" },
		{ label: "Fundamentals & Aqeedah", value: "Fundamentals & Aqeedah" },
		{ label: "History (Tarikh)", value: "History (Tarikh)" },
		{ label: "Adab & Akhlaq", value: "Adab & Akhlaq" },
		{ label: "Judicial Laws (Fiqh)", value: "Judicial Laws (Fiqh)" },
	];

	// Search and Tab filtering logic
	const filteredCourses = coursesCatalog.filter((course) => {
		const matchesCategory =
			activeCategory === "All" || course.category === activeCategory;
		const matchesSearch =
			course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.category.toLowerCase().includes(searchTerm.toLowerCase());

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

				{/* Search & Discipline Filters */}
				<div className="row align-items-center g-3 mb-4">
					<div className="col-lg-5">
						<div className="search-input-group d-flex align-items-center p-1 bg-white rounded-3 border border-light">
							<i className="bi bi-search text-muted ms-2 me-2"></i>
							<input
								type="text"
								className="form-control border-0 shadow-none bg-transparent"
								placeholder="Search course by topic, text, or scholar..."
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
					<div className="col-lg-7">
						<div className="d-flex gap-2 overflow-auto pb-1 justify-content-lg-end">
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
					</div>
				</div>

				{/* Spotlight / Featured Intensive Course */}
				<div className="featured-program-card mb-5 shadow-sm d-none">
					<div className="row align-items-center g-4">
						<div className="col-lg-8">
							<div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
								<span
									className="badge"
									style={{
										backgroundColor: "var(--desert-terracotta)",
										color: "#fff",
									}}
								>
									Featured Diploma
								</span>
								<span className="badge bg-outline-dark border">
									Enrollment Closing Soon
								</span>
							</div>
							<h3 className="fw-bold mb-2">
								Usul al-Fiqh: Principles of Islamic Jurisprudence & Legal Maxims
							</h3>
							<p className="text-muted mb-3">
								An in-depth exploration of how classical jurists derived rulings
								from primary sources (Quran & Sunnah), examining consensus
								(Ijma'), analogical deduction (Qiyas), and legal maxims
								(Al-Qawa'id al-Fiqhiyyah).
							</p>
							<div className="d-flex flex-wrap align-items-center gap-4 text-muted small">
								<span>
									<i
										className="bi bi-person me-1"
										style={{ color: "var(--desert-terracotta)" }}
									></i>{" "}
									Instructor:
									<strong> Shaykh Dr. Tariq Al-Mansoor</strong>
								</span>
								<span>
									<i
										className="bi bi-calendar3 me-1"
										style={{ color: "var(--desert-terracotta)" }}
									></i>{" "}
									Duration:
									<strong> 12 Weeks</strong>
								</span>
								<span>
									<i
										className="bi bi-clock me-1"
										style={{ color: "var(--desert-terracotta)" }}
									></i>{" "}
									Effort:
									<strong> 3 hrs/week</strong>
								</span>
							</div>
						</div>
						<div className="col-lg-4 text-lg-end border-lg-start ps-lg-4 text-start">
							<div
								className="font-quranic fs-2 mb-1"
								dir="rtl"
								style={{ fontFamily: "var(--font-quranic)" }}
							>
								أُصُولُ الفِقْهِ وَالقَوَاعِدُ
							</div>
							<p className="small text-muted mb-3">
								Includes syllabus PDF & manuscript notes
							</p>
							<button
								className="btn btn-desert-primary w-100 py-2 d-block"
								disabled
							>
								<i className="bi bi-journal-plus me-1"></i> Coming Soon
							</button>
						</div>
					</div>
				</div>

				{/* Courses Grid */}
				<div className="row g-4" id="coursesList">
					{filteredCourses.length === 0 ? (
						<div className="col-12 text-center py-5">
							<i className="bi bi-search fs-1 text-muted"></i>
							<p className="text-muted mt-3">
								No courses match your query or selected discipline.
							</p>
						</div>
					) : (
						filteredCourses.map((course) => (
							<div key={course.id} className="col-md-6 col-lg-4">
								<div className="course-card h-100 d-flex flex-column">
									<div className="course-thumb-container">
										<span
											className={`level-badge badge-${course.level.toLowerCase().replace(" ", "-")}`}
										>
											{course.level}
										</span>
										<div className="course-thumb-icon">
											<i className={`bi ${course.icon || "bi-stars"}`}></i>
										</div>
										<span className="course-arabic-tag">
											{course.arabicTag || "العَقِيدَةُ"}
										</span>
									</div>
									<div className="course-body d-flex flex-column flex-grow-1">
										<div className="course-meta mb-2">
											<span className="me-3">
												<i className="bi bi-clock me-1"></i>{" "}
												{course.duration_weeks || ""} Weeks
											</span>
											<span>
												<i className="bi bi-journal-text me-1"></i>{" "}
												{course.modules_count || ""} Modules
											</span>
										</div>
										<h5 className="fw-bold mb-2">{course.title}</h5>
										<p className="small text-muted mb-4 flex-grow-1">
											{course.description}
										</p>

										<div
											className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto"
											style={{ borderColor: "var(--desert-dune) !important" }}
										>
											<div className="d-flex align-items-center gap-2">
												<div className="instructor-avatar">
													{course.avatar || "IS"}
												</div>
												<small className="text-muted fw-semibold">
													{course.instructor}
												</small>
											</div>
											{course.is_coming_soon ? (
												<button
													className="btn btn-desert-outline btn-sm"
													disabled
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
						))
					)}
				</div>
			</main>
		</div>
	);
}
