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

export const courseModules = [
	{
		"fundamentals-of-islam": [
			{
				key: "introduction-to-islam",
				slug: "introduction-to-islam",
				title: "Introduction to Islam",
				sort_order: 1,
				lessons: [
					{
						slug: "meaning-of-islam",
						title: "Meaning of Islam",
					},
					{
						slug: "definition-of-islam",
						title: "Definition of Islam",
					},
					{
						slug: "islam-iman-and-ihsan",
						title: "Islam, Iman and Ihsan",
					},
					{
						slug: "sources-of-islam",
						title: "Sources of Islam",
					},
					{
						slug: "importance-of-seeking-knowledge",
						title: "Importance of Seeking Knowledge",
					},
				],
			},
			{
				key: "iman",
				slug: "iman",
				title: "Iman",
				sort_order: 2,
				lessons: [
					{
						slug: "meaning-of-iman",
						title: "Meaning of Iman",
					},
					{
						slug: "belief-in-allah",
						title: "Belief in Allah",
					},
					{
						slug: "belief-in-the-angels",
						title: "Belief in the Angels",
					},
					{
						slug: "belief-in-the-books",
						title: "Belief in the Books",
					},
					{
						slug: "belief-in-the-messengers",
						title: "Belief in the Messengers",
					},
					{
						slug: "belief-in-the-last-day",
						title: "Belief in the Last Day",
					},
					{
						slug: "belief-in-qadar",
						title: "Belief in Qadar",
					},
				],
			},
			{
				key: "five-pillars-of-islam",
				slug: "five-pillars-of-islam",
				title: "Five Pillars of Islam",
				sort_order: 3,
				lessons: [
					{
						slug: "shahadah",
						title: "Shahadah",
					},
					{
						slug: "salah",
						title: "Salah",
					},
					{
						slug: "zakah",
						title: "Zakah",
					},
					{
						slug: "sawm",
						title: "Sawm",
					},
					{
						slug: "hajj",
						title: "Hajj",
					},
				],
			},
			{
				key: "tawheed",
				slug: "tawheed",
				title: "Tawheed",
				sort_order: 4,
				lessons: [
					{
						slug: "meaning-of-tawheed",
						title: "Meaning of Tawheed",
					},
					{
						slug: "tawheed-al-rububiyyah",
						title: "Tawheed al-Rububiyyah",
					},
					{
						slug: "tawheed-al-uluhiyyah",
						title: "Tawheed al-Uluhiyyah",
					},
					{
						slug: "tawheed-al-asma-wa-al-sifat",
						title: "Tawheed al-Asma wa al-Sifat",
					},
					{
						slug: "shirk-and-its-types",
						title: "Shirk and Its Types",
					},
					{
						slug: "importance-of-tawheed",
						title: "Importance of Tawheed",
					},
				],
			},
			{
				key: "prophets-and-messengers",
				slug: "prophets-and-messengers",
				title: "Prophets and Messengers",
				sort_order: 5,
				lessons: [
					{
						slug: "why-allah-sent-messengers",
						title: "Why Allah Sent Messengers",
					},
					{
						slug: "characteristics-of-prophets",
						title: "Characteristics of Prophets",
					},
					{
						slug: "major-prophets",
						title: "Major Prophets",
					},
					{
						slug: "prophet-muhammad",
						title: "Prophet Muhammad ﷺ",
					},
					{
						slug: "finality-of-prophethood",
						title: "Finality of Prophethood",
					},
				],
			},
		],

		fiqh: [
			{
				key: "introduction-to-fiqh",
				slug: "introduction-to-fiqh",
				title: "Introduction to Fiqh",
				sort_order: 1,
				lessons: [
					{
						slug: "meaning-of-fiqh",
						title: "Meaning of Fiqh",
					},
					{
						slug: "sources-of-islamic-law",
						title: "Sources of Islamic Law",
					},
					{
						slug: "fard-wajib-sunnah-and-mustahabb",
						title: "Fard, Wajib, Sunnah and Mustahabb",
					},
					{
						slug: "haram-and-makruh",
						title: "Haram and Makruh",
					},
					{
						slug: "importance-of-fiqh",
						title: "Importance of Fiqh",
					},
				],
			},
			{
				key: "taharah",
				slug: "taharah",
				title: "Taharah",
				sort_order: 2,
				lessons: [
					{
						slug: "meaning-of-taharah",
						title: "Meaning of Taharah",
					},
					{
						slug: "types-of-water",
						title: "Types of Water",
					},
					{
						slug: "najasah",
						title: "Najasah",
					},
					{
						slug: "istinja",
						title: "Istinja",
					},
					{
						slug: "wudu",
						title: "Wudu",
					},
					{
						slug: "nullifiers-of-wudu",
						title: "Nullifiers of Wudu",
					},
					{
						slug: "ghusl",
						title: "Ghusl",
					},
					{
						slug: "tayammum",
						title: "Tayammum",
					},
				],
			},
			{
				key: "salah",
				slug: "salah",
				title: "Salah",
				sort_order: 3,
				lessons: [
					{
						slug: "importance-of-salah",
						title: "Importance of Salah",
					},
					{
						slug: "conditions-of-salah",
						title: "Conditions of Salah",
					},
					{
						slug: "times-of-salah",
						title: "Times of Salah",
					},
					{
						slug: "adhan-and-iqamah",
						title: "Adhan and Iqamah",
					},
					{
						slug: "how-to-perform-salah",
						title: "How to Perform Salah",
					},
					{
						slug: "pillars-of-salah",
						title: "Pillars of Salah",
					},
					{
						slug: "obligatory-acts-of-salah",
						title: "Obligatory Acts of Salah",
					},
					{
						slug: "sunnahs-of-salah",
						title: "Sunnahs of Salah",
					},
					{
						slug: "things-that-invalidate-salah",
						title: "Things That Invalidate Salah",
					},
					{
						slug: "sujood-al-sahw",
						title: "Sujood al-Sahw",
					},
				],
			},
			{
				key: "fasting",
				slug: "fasting",
				title: "Fasting",
				sort_order: 4,
				lessons: [
					{
						slug: "meaning-and-importance-of-sawm",
						title: "Meaning and Importance of Sawm",
					},
					{
						slug: "conditions-of-fasting",
						title: "Conditions of Fasting",
					},
					{
						slug: "intention",
						title: "Intention",
					},
					{
						slug: "things-that-break-the-fast",
						title: "Things That Break the Fast",
					},
					{
						slug: "sunnahs-of-fasting",
						title: "Sunnahs of Fasting",
					},
					{
						slug: "excuses-for-breaking-the-fast",
						title: "Excuses for Breaking the Fast",
					},
					{
						slug: "qada-and-kaffarah",
						title: "Qada and Kaffarah",
					},
					{
						slug: "ramadan",
						title: "Ramadan",
					},
				],
			},
			{
				key: "zakah",
				slug: "zakah",
				title: "Zakah",
				sort_order: 5,
				lessons: [
					{
						slug: "meaning-of-zakah",
						title: "Meaning of Zakah",
					},
					{
						slug: "conditions-of-zakah",
						title: "Conditions of Zakah",
					},
					{
						slug: "nisab",
						title: "Nisab",
					},
					{
						slug: "zakah-on-wealth",
						title: "Zakah on Wealth",
					},
					{
						slug: "zakah-on-gold-and-silver",
						title: "Zakah on Gold and Silver",
					},
					{
						slug: "eligible-recipients",
						title: "Eligible Recipients",
					},
					{
						slug: "zakah-al-fitr",
						title: "Zakah al-Fitr",
					},
				],
			},
			{
				key: "hajj-and-umrah",
				slug: "hajj-and-umrah",
				title: "Hajj and Umrah",
				sort_order: 6,
				lessons: [
					{
						slug: "introduction-to-hajj",
						title: "Introduction to Hajj",
					},
					{
						slug: "conditions-of-hajj",
						title: "Conditions of Hajj",
					},
					{
						slug: "ihram",
						title: "Ihram",
					},
					{
						slug: "miqat",
						title: "Miqat",
					},
					{
						slug: "tawaf",
						title: "Tawaf",
					},
					{
						slug: "sai",
						title: "Sa'i",
					},
					{
						slug: "arafah",
						title: "Arafah",
					},
					{
						slug: "muzdalifah",
						title: "Muzdalifah",
					},
					{
						slug: "mina",
						title: "Mina",
					},
					{
						slug: "umrah",
						title: "Umrah",
					},
				],
			},
		],

		akhlaq: [
			{
				key: "introduction-to-akhlaq",
				slug: "introduction-to-akhlaq",
				title: "Introduction to Akhlaq",
				sort_order: 1,
				lessons: [
					{
						slug: "meaning-of-akhlaq",
						title: "Meaning of Akhlaq",
					},
					{
						slug: "importance-of-good-character",
						title: "Importance of Good Character",
					},
					{
						slug: "character-and-iman",
						title: "Character and Iman",
					},
					{
						slug: "character-of-prophet-muhammad",
						title: "Character of Prophet Muhammad ﷺ",
					},
				],
			},
			{
				key: "character-with-allah",
				slug: "character-with-allah",
				title: "Character with Allah",
				sort_order: 2,
				lessons: [
					{
						slug: "ikhlas",
						title: "Ikhlas",
					},
					{
						slug: "taqwa",
						title: "Taqwa",
					},
					{
						slug: "tawakkul",
						title: "Tawakkul",
					},
					{
						slug: "shukr",
						title: "Shukr",
					},
					{
						slug: "sabr",
						title: "Sabr",
					},
					{
						slug: "tawbah",
						title: "Tawbah",
					},
				],
			},
			{
				key: "character-with-parents",
				slug: "character-with-parents",
				title: "Character with Parents",
				sort_order: 3,
				lessons: [
					{
						slug: "rights-of-parents",
						title: "Rights of Parents",
					},
					{
						slug: "birr-al-walidayn",
						title: "Birr al-Walidayn",
					},
					{
						slug: "respecting-parents",
						title: "Respecting Parents",
					},
					{
						slug: "serving-parents",
						title: "Serving Parents",
					},
					{
						slug: "prohibited-behaviour-towards-parents",
						title: "Prohibited Behaviour Towards Parents",
					},
				],
			},
			{
				key: "character-with-people",
				slug: "character-with-people",
				title: "Character with People",
				sort_order: 4,
				lessons: [
					{
						slug: "truthfulness",
						title: "Truthfulness",
					},
					{
						slug: "trustworthiness",
						title: "Trustworthiness",
					},
					{
						slug: "justice",
						title: "Justice",
					},
					{
						slug: "mercy",
						title: "Mercy",
					},
					{
						slug: "forgiveness",
						title: "Forgiveness",
					},
					{
						slug: "humility",
						title: "Humility",
					},
					{
						slug: "keeping-promises",
						title: "Keeping Promises",
					},
					{
						slug: "good-speech",
						title: "Good Speech",
					},
				],
			},
			{
				key: "bad-character",
				slug: "bad-character",
				title: "Bad Character",
				sort_order: 5,
				lessons: [
					{
						slug: "lying",
						title: "Lying",
					},
					{
						slug: "backbiting",
						title: "Backbiting",
					},
					{
						slug: "slander",
						title: "Slander",
					},
					{
						slug: "envy",
						title: "Envy",
					},
					{
						slug: "arrogance",
						title: "Arrogance",
					},
					{
						slug: "anger",
						title: "Anger",
					},
					{
						slug: "suspicion",
						title: "Suspicion",
					},
					{
						slug: "mockery",
						title: "Mockery",
					},
				],
			},
			{
				key: "social-etiquette",
				slug: "social-etiquette",
				title: "Social Etiquette",
				sort_order: 6,
				lessons: [
					{
						slug: "rights-of-neighbours",
						title: "Rights of Neighbours",
					},
					{
						slug: "rights-of-relatives",
						title: "Rights of Relatives",
					},
					{
						slug: "visiting-the-sick",
						title: "Visiting the Sick",
					},
					{
						slug: "greeting-others",
						title: "Greeting Others",
					},
					{
						slug: "eating-etiquette",
						title: "Eating Etiquette",
					},
					{
						slug: "speaking-etiquette",
						title: "Speaking Etiquette",
					},
					{
						slug: "meeting-and-sitting-etiquette",
						title: "Meeting and Sitting Etiquette",
					},
				],
			},
		],

		thareeq: [
			{
				key: "arabia-before-islam",
				slug: "arabia-before-islam",
				title: "Arabia Before Islam",
				sort_order: 1,
				lessons: [
					{
						slug: "arabian-peninsula",
						title: "Arabian Peninsula",
					},
					{
						slug: "society-before-islam",
						title: "Society Before Islam",
					},
					{
						slug: "religious-conditions",
						title: "Religious Conditions",
					},
					{
						slug: "social-conditions",
						title: "Social Conditions",
					},
					{
						slug: "economic-conditions",
						title: "Economic Conditions",
					},
				],
			},
			{
				key: "life-of-prophet-muhammad",
				slug: "life-of-prophet-muhammad",
				title: "Life of Prophet Muhammad ﷺ",
				sort_order: 2,
				lessons: [
					{
						slug: "birth-and-family",
						title: "Birth and Family",
					},
					{
						slug: "childhood",
						title: "Childhood",
					},
					{
						slug: "youth",
						title: "Youth",
					},
					{
						slug: "marriage-to-khadijah",
						title: "Marriage to Khadijah رضي الله عنها",
					},
					{
						slug: "beginning-of-prophethood",
						title: "Beginning of Prophethood",
					},
					{
						slug: "first-revelation",
						title: "First Revelation",
					},
				],
			},
			{
				key: "makkan-period",
				slug: "makkan-period",
				title: "Makkan Period",
				sort_order: 3,
				lessons: [
					{
						slug: "early-dawah",
						title: "Early Da'wah",
					},
					{
						slug: "secret-dawah",
						title: "Secret Da'wah",
					},
					{
						slug: "public-dawah",
						title: "Public Da'wah",
					},
					{
						slug: "persecution",
						title: "Persecution",
					},
					{
						slug: "migration-to-abyssinia",
						title: "Migration to Abyssinia",
					},
					{
						slug: "boycott",
						title: "Boycott",
					},
					{
						slug: "year-of-grief",
						title: "Year of Grief",
					},
					{
						slug: "isra-and-miraj",
						title: "Isra and Mi'raj",
					},
					{
						slug: "pledges-of-aqabah",
						title: "Pledges of Aqabah",
					},
				],
			},
			{
				key: "madanian-period",
				slug: "madinan-period",
				title: "Madinan Period",
				sort_order: 4,
				lessons: [
					{
						slug: "hijrah",
						title: "Hijrah",
					},
					{
						slug: "building-of-madinah",
						title: "Building of Madinah",
					},
					{
						slug: "brotherhood-between-muhajirun-and-ansar",
						title: "Brotherhood between Muhajirun and Ansar",
					},
					{
						slug: "constitution-of-madinah",
						title: "Constitution of Madinah",
					},
					{
						slug: "battle-of-badr",
						title: "Battle of Badr",
					},
					{
						slug: "battle-of-uhud",
						title: "Battle of Uhud",
					},
					{
						slug: "battle-of-khandaq",
						title: "Battle of Khandaq",
					},
					{
						slug: "treaty-of-hudaybiyyah",
						title: "Treaty of Hudaybiyyah",
					},
					{
						slug: "conquest-of-makkah",
						title: "Conquest of Makkah",
					},
					{
						slug: "farewell-hajj",
						title: "Farewell Hajj",
					},
					{
						slug: "death-of-prophet-muhammad",
						title: "Death of Prophet Muhammad ﷺ",
					},
				],
			},
			{
				key: "khulafa-al-rashidun",
				slug: "khulafa-al-rashidun",
				title: "Khulafa al-Rashidun",
				sort_order: 5,
				lessons: [
					{
						slug: "abu-bakr",
						title: "Abu Bakr رضي الله عنه",
					},
					{
						slug: "umar",
						title: "Umar رضي الله عنه",
					},
					{
						slug: "uthman",
						title: "Uthman رضي الله عنه",
					},
					{
						slug: "ali",
						title: "Ali رضي الله عنه",
					},
				],
			},
			{
				key: "islamic-civilization",
				slug: "islamic-civilization",
				title: "Islamic Civilization",
				sort_order: 6,
				lessons: [
					{
						slug: "spread-of-islam",
						title: "Spread of Islam",
					},
					{
						slug: "islamic-scholarship",
						title: "Islamic Scholarship",
					},
					{
						slug: "development-of-science",
						title: "Development of Science",
					},
					{
						slug: "islamic-literature",
						title: "Islamic Literature",
					},
					{
						slug: "major-muslim-scholars",
						title: "Major Muslim Scholars",
					},
				],
			},
		],

		thafseer: [
			{
				key: "introduction-to-tafsir",
				slug: "introduction-to-tafsir",
				title: "Introduction to Tafsir",
				sort_order: 1,
				lessons: [
					{
						slug: "meaning-of-tafsir",
						title: "Meaning of Tafsir",
					},
					{
						slug: "importance-of-tafsir",
						title: "Importance of Tafsir",
					},
					{
						slug: "sources-of-tafsir",
						title: "Sources of Tafsir",
					},
					{
						slug: "quran-and-sunnah",
						title: "Quran and Sunnah",
					},
					{
						slug: "tafsir-by-quran",
						title: "Tafsir by Quran",
					},
					{
						slug: "tafsir-by-hadith",
						title: "Tafsir by Hadith",
					},
					{
						slug: "role-of-arabic-language",
						title: "Role of Arabic Language",
					},
				],
			},
			{
				key: "surah-al-fatihah",
				slug: "surah-al-fatihah",
				title: "Surah Al-Fatihah",
				sort_order: 2,
				lessons: [
					{
						slug: "introduction-to-surah-al-fatihah",
						title: "Introduction to Surah Al-Fatihah",
					},
					{
						slug: "bismillah",
						title: "Bismillah",
					},
					{
						slug: "al-hamdulillahi-rabbil-alamin",
						title: "Al-Hamdulillahi Rabbil Alamin",
					},
					{
						slug: "ar-rahmanir-raheem",
						title: "Ar-Rahmanir-Raheem",
					},
					{
						slug: "maliki-yawmid-deen",
						title: "Maliki Yawmid-Deen",
					},
					{
						slug: "iyyaka-nabudu",
						title: "Iyyaka Na'budu",
					},
					{
						slug: "ihdinas-sirat-al-mustaqim",
						title: "Ihdinas-Sirat al-Mustaqim",
					},
					{
						slug: "amin",
						title: "Amin",
					},
				],
			},
			{
				key: "short-surahs",
				slug: "short-surahs",
				title: "Short Surahs",
				sort_order: 3,
				lessons: [
					{
						slug: "surah-al-ikhlas",
						title: "Surah Al-Ikhlas",
					},
					{
						slug: "surah-al-falaq",
						title: "Surah Al-Falaq",
					},
					{
						slug: "surah-an-nas",
						title: "Surah An-Nas",
					},
					{
						slug: "surah-al-kawthar",
						title: "Surah Al-Kawthar",
					},
					{
						slug: "surah-al-asr",
						title: "Surah Al-Asr",
					},
					{
						slug: "surah-al-maun",
						title: "Surah Al-Ma'un",
					},
					{
						slug: "surah-al-kafirun",
						title: "Surah Al-Kafirun",
					},
					{
						slug: "surah-an-nasr",
						title: "Surah An-Nasr",
					},
				],
			},
			{
				key: "selected-makki-surahs",
				slug: "selected-makki-surahs",
				title: "Selected Makki Surahs",
				sort_order: 4,
				lessons: [
					{
						slug: "surah-ad-duha",
						title: "Surah Ad-Duha",
					},
					{
						slug: "surah-ash-sharh",
						title: "Surah Ash-Sharh",
					},
					{
						slug: "surah-at-tin",
						title: "Surah At-Tin",
					},
					{
						slug: "surah-al-alaq",
						title: "Surah Al-Alaq",
					},
					{
						slug: "surah-al-qadr",
						title: "Surah Al-Qadr",
					},
				],
			},
			{
				key: "selected-madani-surahs",
				slug: "selected-madani-surahs",
				title: "Selected Madani Surahs",
				sort_order: 5,
				lessons: [
					{
						slug: "surah-al-baqarah-introduction",
						title: "Surah Al-Baqarah — Introduction",
					},
					{
						slug: "ayat-al-kursi",
						title: "Ayat al-Kursi",
					},
					{
						slug: "selected-verses-from-al-baqarah",
						title: "Selected Verses from Al-Baqarah",
					},
					{
						slug: "surah-al-hujurat",
						title: "Surah Al-Hujurat",
					},
					{
						slug: "surah-al-hujurat-social-etiquette",
						title: "Surah Al-Hujurat — Social Etiquette",
					},
				],
			},
		],

		"judicial-laws": [
			{
				key: "introduction-to-islamic-law",
				slug: "introduction-to-islamic-law",
				title: "Introduction to Islamic Law",
				sort_order: 1,
				lessons: [
					{
						slug: "meaning-of-shariah",
						title: "Meaning of Shariah",
					},
					{
						slug: "meaning-of-fiqh",
						title: "Meaning of Fiqh",
					},
					{
						slug: "sources-of-islamic-law",
						title: "Sources of Islamic Law",
					},
					{
						slug: "quran-as-a-source-of-law",
						title: "Quran as a Source of Law",
					},
					{
						slug: "sunnah-as-a-source-of-law",
						title: "Sunnah as a Source of Law",
					},
					{
						slug: "ijma",
						title: "Ijma",
					},
					{
						slug: "qiyas",
						title: "Qiyas",
					},
					{
						slug: "maqasid-al-shariah",
						title: "Maqasid al-Shariah",
					},
				],
			},
			{
				key: "legal-principles",
				slug: "legal-principles",
				title: "Legal Principles",
				sort_order: 2,
				lessons: [
					{
						slug: "intention-and-legal-rulings",
						title: "Intention and Legal Rulings",
					},
					{
						slug: "certainty-and-doubt",
						title: "Certainty and Doubt",
					},
					{
						slug: "hardship-and-ease",
						title: "Hardship and Ease",
					},
					{
						slug: "harm-and-its-removal",
						title: "Harm and Its Removal",
					},
					{
						slug: "custom-in-islamic-law",
						title: "Custom in Islamic Law",
					},
					{
						slug: "public-interest",
						title: "Public Interest",
					},
				],
			},
			{
				key: "family-law",
				slug: "family-law",
				title: "Family Law",
				sort_order: 3,
				lessons: [
					{
						slug: "marriage",
						title: "Marriage",
					},
					{
						slug: "conditions-of-marriage",
						title: "Conditions of Marriage",
					},
					{
						slug: "rights-of-husband-and-wife",
						title: "Rights of Husband and Wife",
					},
					{
						slug: "mahr",
						title: "Mahr",
					},
					{
						slug: "divorce",
						title: "Divorce",
					},
					{
						slug: "khula",
						title: "Khula",
					},
					{
						slug: "iddah",
						title: "Iddah",
					},
					{
						slug: "child-custody",
						title: "Child Custody",
					},
					{
						slug: "maintenance",
						title: "Maintenance",
					},
				],
			},
			{
				key: "financial-law",
				slug: "financial-law",
				title: "Financial Law",
				sort_order: 4,
				lessons: [
					{
						slug: "ownership",
						title: "Ownership",
					},
					{
						slug: "contracts",
						title: "Contracts",
					},
					{
						slug: "buying-and-selling",
						title: "Buying and Selling",
					},
					{
						slug: "debt",
						title: "Debt",
					},
					{
						slug: "loan",
						title: "Loan",
					},
					{
						slug: "riba",
						title: "Riba",
					},
					{
						slug: "gharar",
						title: "Gharar",
					},
					{
						slug: "business-ethics",
						title: "Business Ethics",
					},
					{
						slug: "partnership",
						title: "Partnership",
					},
					{
						slug: "islamic-finance",
						title: "Islamic Finance",
					},
				],
			},
			{
				key: "criminal-law",
				slug: "criminal-law",
				title: "Criminal Law",
				sort_order: 5,
				lessons: [
					{
						slug: "introduction-to-islamic-criminal-law",
						title: "Introduction to Islamic Criminal Law",
					},
					{
						slug: "categories-of-crimes",
						title: "Categories of Crimes",
					},
					{
						slug: "hudud",
						title: "Hudud",
					},
					{
						slug: "qisas",
						title: "Qisas",
					},
					{
						slug: "diyah",
						title: "Diyah",
					},
					{
						slug: "tazir",
						title: "Ta'zir",
					},
					{
						slug: "evidence-and-proof",
						title: "Evidence and Proof",
					},
				],
			},
			{
				key: "judicial-system",
				slug: "judicial-system",
				title: "Judicial System",
				sort_order: 6,
				lessons: [
					{
						slug: "islamic-judiciary",
						title: "Islamic Judiciary",
					},
					{
						slug: "qualifications-of-a-judge",
						title: "Qualifications of a Judge",
					},
					{
						slug: "role-of-qadi",
						title: "Role of Qadi",
					},
					{
						slug: "witnesses",
						title: "Witnesses",
					},
					{
						slug: "evidence",
						title: "Evidence",
					},
					{
						slug: "testimony",
						title: "Testimony",
					},
					{
						slug: "dispute-resolution",
						title: "Dispute Resolution",
					},
					{
						slug: "reconciliation",
						title: "Reconciliation",
					},
					{
						slug: "judicial-ethics",
						title: "Judicial Ethics",
					},
				],
			},
		],
	},
];
