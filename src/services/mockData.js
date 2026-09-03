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
		slug: "fundamentals-of-islam",
		title: "Fundamentals of Islam",
		description:
			"Learn the foundations of Islam, including Islam, Iman, Tawheed, the five pillars, prophets, and the essential beliefs and principles every Muslim should know.",
		duration_weeks: 12,
		modules_count: 5,
		level: "Beginner",
		instructor: "By Admin",
		is_coming_soon: false,
		arabicTag: "العَقِيدَةُ",
		icon: "bi-compass",
	},
	{
		slug: "fiqh",
		title: "Fiqh",
		description:
			"Study the practical rulings of Islam, including purification, Salah, fasting, Zakah, Hajj, and other essential matters of Islamic jurisprudence.",
		duration_weeks: 16,
		modules_count: 6,
		level: "Beginner",
		instructor: "By Admin",
		is_coming_soon: false,
	},
	{
		slug: "akhlaq",
		title: "Akhlaq",
		description:
			"Learn Islamic manners and character development, including sincerity, patience, truthfulness, respect for parents, social etiquette, and avoiding bad character.",
		duration_weeks: 10,
		modules_count: 6,
		level: "Beginner",
		instructor: "By Admin",
		is_coming_soon: false,
	},
	{
		slug: "thareeq",
		title: "Thareeq",
		description:
			"Explore Islamic history and the Seerah of Prophet Muhammad ﷺ, from pre-Islamic Arabia through the Makkan and Madinan periods and the era of the Khulafa al-Rashidun.",
		duration_weeks: 14,
		modules_count: 6,
		level: "Intermediate",
		instructor: "By Admin",
		is_coming_soon: false,
	},
	{
		slug: "thafseer",
		title: "Thafseer",
		description:
			"Study the meanings and explanations of selected Quranic passages while learning the fundamentals, sources, and principles of Tafsir.",
		duration_weeks: 16,
		modules_count: 5,
		level: "Intermediate",
		instructor: "By Admin",
		is_coming_soon: false,
	},
	{
		slug: "judicial-laws",
		title: "Judicial Laws",
		description:
			"An advanced study of Islamic law covering Shariah, legal principles, family law, financial law, criminal law, evidence, and the Islamic judicial system.",
		duration_weeks: 20,
		modules_count: 6,
		level: "Advanced",
		instructor: "By Admin",
		is_coming_soon: true,
	},
];
