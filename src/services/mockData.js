// Structured mock database for Al-Athar Portal

export const academyTracks = [
	{
		id: "tajweed",
		title: "Tajweed & Tilawah",
		description:
			"Master Quranic phonetics, makharij, and rules of recitation with live corrections.",
		icon: "bi-book",
		stats: {
			level: "Beginner to Advanced",
			duration: "12 Weeks",
			lectures: "24 Sessions",
		},
		curriculum: [
			{
				id: "m1",
				title: "Makharij & Sifat (Articulation & Characteristics)",
				description:
					"Focuses on the exit points of the Arabic letters and their phonetic features.",
				lessons: [
					{
						id: "l1",
						title: "Introduction to Articulation Points",
						duration: "45 mins",
					},
					{
						id: "l2",
						title: "Throat and Tongue Letters (Halq & Lisan)",
						duration: "60 mins",
					},
					{
						id: "l3",
						title: "The Lips and Nasal Cavity (Shafatayn & Khayshum)",
						duration: "50 mins",
					},
				],
			},
			{
				id: "m2",
				title: "Rules of Noon Sakinah & Tanween",
				description:
					"Izhar, Idgham, Iqlob, and Ikhfa definitions and applications.",
				lessons: [
					{
						id: "l4",
						title: "Understanding Noon Sakinah & Tanween",
						duration: "40 mins",
					},
					{
						id: "l5",
						title: "The Clearness (Izhar) & Insertion (Idgham)",
						duration: "60 mins",
					},
				],
			},
		],
	},
	{
		id: "tafsir",
		title: "Classical Tafsir",
		description:
			"Historical contexts, linguistic depths, and practical reflections of each Surah.",
		icon: "bi-chat-square-quote",
		stats: {
			level: "Intermediate",
			duration: "16 Weeks",
			lectures: "32 Sessions",
		},
		curriculum: [
			{
				id: "m1",
				title: "Introduction to Quranic Exegesis",
				description:
					"The sciences of Tafsir, classical commentators, and rules of interpretation.",
				lessons: [
					{
						id: "l1",
						title: "What is Tafsir? (Tafsir vs Ta'wil)",
						duration: "55 mins",
					},
				],
			},
		],
	},
	{
		id: "arabic",
		title: "Quranic Arabic",
		description:
			"Grammar (Nahw) and morphology (Sarf) geared directly to comprehending the Revelation.",
		icon: "bi-translate",
		stats: { level: "Beginner", duration: "24 Weeks", lectures: "48 Sessions" },
		curriculum: [],
	},
	{
		id: "hadith-seerah",
		title: "Seerah & Hadith",
		description:
			"Study the Prophetic character and authentic traditions (Nawawi 40, Riyad us-Saliheen).",
		icon: "bi-journal-text",
		stats: { level: "Beginner", duration: "10 Weeks", lectures: "20 Sessions" },
		curriculum: [],
	},
];

export const coursesCatalog = [
	{
		id: 1,
		title: "Fundamentals of Islam & Essential Creed",
		level: "Beginner",
		duration: "8 Weeks",
		modules: "16 Modules",
		instructor: "Ustadha Amina",
		avatar: "AM",
		category: "Fundamentals & Aqeedah",
		arabicTag: "العَقِيدَةُ",
		icon: "bi-compass",
		description:
			"Comprehensive study of the Pillars of Faith (Arkan al-Iman), classical Tahawiyyah principles, and core Islamic worldview essentials.",
		detailsLink: "/courses/tajweed",
	},
	{
		id: 2,
		title: "History of Islamic Civilization: Madinah to Cordoba",
		level: "Intermediate",
		duration: "10 Weeks",
		modules: "20 Modules",
		instructor: "Dr. Hassan Said",
		avatar: "HS",
		category: "History (Tarikh)",
		arabicTag: "التَّارِيخُ",
		icon: "bi-hourglass-split",
		description:
			"Chronological survey of the Rightly Guided Caliphs, Umayyad & Abbasid eras, scientific breakthroughs, and the Golden Age of Andalusia.",
		detailsLink: "#",
	},
	{
		id: 3,
		title: "Adab & Akhlaq: Prophetic Ethics & Character",
		level: "All Levels",
		duration: "6 Weeks",
		modules: "12 Modules",
		instructor: "Shaykh Zayd Ali",
		avatar: "ZA",
		category: "Adab & Akhlaq",
		arabicTag: "الأَدَبُ وَالأَخْلَاقُ",
		icon: "bi-heart-pulse",
		description:
			"Purification of the spiritual heart (Tazkiyat al-Nafs), interpersonal etiquette, humility, and practical ethics based on Imam al-Ghazali’s works.",
		detailsLink: "#",
	},
	{
		id: 4,
		title: "Islamic Judicial System & Commercial Law",
		level: "Advanced",
		duration: "12 Weeks",
		modules: "24 Modules",
		instructor: "Dr. Tariq Mansoor",
		avatar: "TM",
		category: "Judicial Laws (Fiqh)",
		arabicTag: "الفِقْهُ وَالقَضَاءُ",
		icon: "bi-bank",
		description:
			"Comparative study of classical court procedures (Qada'), evidence evaluation, contract law (Mu'amalat), and contemporary financial ethics.",
		detailsLink: "#",
	},
	{
		id: 5,
		title: "Seerah: Analytical Study of the Life of the Prophet",
		level: "Beginner",
		duration: "8 Weeks",
		modules: "16 Modules",
		instructor: "Shaykh Farooq Khan",
		avatar: "FK",
		category: "History (Tarikh)",
		arabicTag: "السِّيرَةُ النَّبَوِيَّةُ",
		icon: "bi-stars",
		description:
			"Lessons from the Meccan and Medinan periods, strategic leadership, societal transformation, and character study (Shama'il).",
		detailsLink: "#",
	},
	{
		id: 6,
		title: "Ulum al-Quran: Methodology of Exegesis (Tafsir)",
		level: "Intermediate",
		duration: "9 Weeks",
		modules: "18 Modules",
		instructor: "Dr. Maryam Al-Attas",
		avatar: "MA",
		category: "Fundamentals & Aqeedah",
		arabicTag: "عُلُومُ القُرْآنِ",
		icon: "bi-book-half",
		description:
			"History of Quranic compilation, Asbab al-Nuzul (revelation contexts), abrogation (Naskh), and comparing classical Tafsir schools.",
		detailsLink: "#",
	},
];
