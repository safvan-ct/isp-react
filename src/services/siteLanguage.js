export const SITE_LANGUAGES = [
	{ code: "en", label: "EN", name: "English" },
	// { code: 'ar', label: 'AR', name: 'العربية' },
	{ code: "ml", label: "ML", name: "മലയാളം" },
	{ code: "hi", label: "HI", name: "हिन्दी" },
];

export const getSiteLanguage = () => {
	return localStorage.getItem("site_language") || "en";
};

export const setSiteLanguage = (langCode) => {
	localStorage.setItem("site_language", langCode);
	window.dispatchEvent(new Event("siteLanguageChange"));
	window.location.reload();
};
