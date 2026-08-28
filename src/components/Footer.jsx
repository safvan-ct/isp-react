import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	SITE_LANGUAGES,
	getSiteLanguage,
	setSiteLanguage,
} from "../services/siteLanguage";

export default function Footer() {
	const { pathname } = useLocation();
	const [langDropdownOpen, setLangDropdownOpen] = useState(false);
	const [currentLang, setCurrentLang] = useState(getSiteLanguage());

	useEffect(() => {
		const handleLangChange = () => setCurrentLang(getSiteLanguage());
		window.addEventListener("siteLanguageChange", handleLangChange);
		return () =>
			window.removeEventListener("siteLanguageChange", handleLangChange);
	}, []);

	const selectLanguage = (code) => {
		setSiteLanguage(code);
		setLangDropdownOpen(false);
	};

	const currentLangObj =
		SITE_LANGUAGES.find((l) => l.code === currentLang) || SITE_LANGUAGES[0];

	const renderFooterLanguageSelector = () => (
		<div className="dropdown position-relative d-inline-block">
			{langDropdownOpen && (
				<div
					className="position-fixed top-0 start-0 w-100 h-100"
					style={{ zIndex: 1040, background: "transparent" }}
					onClick={() => setLangDropdownOpen(false)}
				/>
			)}
			<button
				className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm"
				type="button"
				onClick={() => setLangDropdownOpen(!langDropdownOpen)}
				style={{
					fontSize: "0.82rem",
					backgroundColor: "transparent",
					color: "#ffffff",
					zIndex: 1045,
					position: "relative",
				}}
			>
				<i
					className="bi bi-globe2 me-1"
					style={{ color: "var(--desert-terracotta)" }}
				></i>
				<span>{currentLangObj.name}</span>
				<i
					className={`bi bi-chevron-${langDropdownOpen ? "up" : "down"} small opacity-75 ms-1`}
				></i>
			</button>

			{langDropdownOpen && (
				<div
					className="dropdown-menu dropdown-menu-dark show shadow-lg border-0 py-1 position-absolute mt-1"
					style={{
						borderRadius: "12px",
						minWidth: "165px",
						zIndex: 1050,
						bottom: "100%",
						marginBottom: "6px",
						backgroundColor: "var(--desert-night, #1F1B16)",
						border: "1px solid var(--desert-dune)",
					}}
				>
					<div
						className="px-3 py-1 text-muted border-bottom border-secondary mb-1 text-nowrap"
						style={{
							fontSize: "0.68rem",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
						}}
					>
						Site Language
					</div>
					{SITE_LANGUAGES.map((lang) => (
						<button
							key={lang.code}
							className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-2 border-0 w-100 ${currentLang === lang.code ? "fw-bold" : ""}`}
							onClick={() => selectLanguage(lang.code)}
							style={{
								fontSize: "0.83rem",
								backgroundColor:
									currentLang === lang.code
										? "rgba(163, 88, 57, 0.25)"
										: "transparent",
								color:
									currentLang === lang.code ? "var(--desert-gold)" : "#ffffff",
								cursor: "pointer",
								whiteSpace: "nowrap",
							}}
						>
							<span className="me-2">{lang.name}</span>
							<span
								className="badge ms-auto"
								style={{
									fontSize: "0.7rem",
									backgroundColor:
										currentLang === lang.code
											? "var(--desert-terracotta)"
											: "rgba(255,255,255,0.15)",
									color: "#ffffff",
								}}
							>
								{lang.label}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);

	// 1. Quran / Hadith / Courses Simple Page Footer (without language selector)
	if (
		pathname.startsWith("/quran") ||
		pathname.startsWith("/hadith") ||
		pathname.startsWith("/courses")
	) {
		return (
			<footer
				style={{
					padding: "1.75rem 0",
					borderTop: "1px solid var(--desert-dune)",
				}}
			>
				<div className="container text-center small opacity-90">
					<p className="fw-bold mb-1">Al-Athar Academy & Knowledge Portal</p>
					<p className="mb-0">
						Authentic curriculums, certified scholars, and traditional sacred
						knowledge tracks.
					</p>
				</div>
			</footer>
		);
	}

	// 2. HomePage Rich Footer (with language selector)
	return (
		<footer>
			<div className="container">
				<div className="row g-4 mb-4">
					<div className="col-lg-4 text-start">
						<div className="d-flex align-items-center gap-2 mb-3">
							<div
								className="brand-icon"
								style={{ background: "var(--desert-gold)" }}
							>
								<i className="bi bi-book-half"></i>
							</div>
							<span className="fs-4 fw-bold text-white">Al-Athar</span>
						</div>
						<p className="small opacity-75 text-start">
							A dedicated virtual sanctuary for students of Islamic knowledge,
							fostering authentic comprehension with clarity and tradition.
						</p>
					</div>
					<div className="col-6 col-lg-2 offset-lg-2 text-start">
						<h6 className="text-white fw-bold mb-3">Portals</h6>
						<ul className="list-unstyled small d-flex flex-column gap-2">
							<li>
								<Link
									to="/quran"
									className="text-white opacity-75 text-decoration-none"
								>
									Quran Reader
								</Link>
							</li>
							<li>
								<Link
									to="/hadith"
									className="text-white opacity-75 text-decoration-none"
								>
									Hadith Index
								</Link>
							</li>
							<li>
								<Link
									to="/courses"
									className="text-white opacity-75 text-decoration-none"
								>
									Academy Tracks
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-6 col-lg-2 text-start">
						<h6 className="text-white fw-bold mb-3">Community</h6>
						<ul className="list-unstyled small d-flex flex-column gap-2">
							<li>
								<a
									href="#"
									className="text-white opacity-75 text-decoration-none"
								>
									Discussion Forum
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-white opacity-75 text-decoration-none"
								>
									Live Halawat
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-white opacity-75 text-decoration-none"
								>
									Scholar Guidance
								</a>
							</li>
						</ul>
					</div>
					<div className="col-lg-2 text-start">
						<h6 className="text-white fw-bold mb-3">Site Language</h6>
						{renderFooterLanguageSelector()}
					</div>
				</div>

				<div className="border-top border-secondary pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small opacity-50">
					<p className="mb-0">© 2026 Al-Athar Portal. All rights reserved.</p>
					<div className="d-flex gap-3 mt-2 mt-sm-0">
						<a href="#" className="text-white">
							<i className="bi bi-twitter-x"></i>
						</a>
						<a href="#" className="text-white">
							<i className="bi bi-youtube"></i>
						</a>
						<a href="#" className="text-white">
							<i className="bi bi-instagram"></i>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
