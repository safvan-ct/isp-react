// Structured mock database for Al-Athar Portal

export const quranChapters = [
  { id: 1, name: "Al-Fatihah", englishName: "The Opening", type: "Meccan", versesCount: 7, juz: 1, arabicName: "الفاتحة" },
  { id: 2, name: "Al-Baqarah", englishName: "The Cow", type: "Medinan", versesCount: 286, juz: 1, arabicName: "البقرة" },
  { id: 3, name: "Ali 'Imran", englishName: "Family of Imran", type: "Medinan", versesCount: 200, juz: 3, arabicName: "آل عمران" },
  { id: 18, name: "Al-Kahf", englishName: "The Cave", type: "Meccan", versesCount: 110, juz: 15, arabicName: "الكهف", description: "Protection from fitnah and light between two Fridays." },
  { id: 36, name: "Ya-Sin", englishName: "Ya Seen", type: "Meccan", versesCount: 83, juz: 22, arabicName: "يس" },
  { id: 55, name: "Ar-Rahman", englishName: "The Beneficent", type: "Medinan", versesCount: 78, juz: 27, arabicName: "الرحمن" },
  { id: 67, name: "Al-Mulk", englishName: "The Sovereignty", type: "Meccan", versesCount: 30, juz: 29, arabicName: "الملك" },
  { id: 78, name: "An-Naba", englishName: "The Tidings", type: "Meccan", versesCount: 40, juz: 30, arabicName: "النبأ" }
];

export const quranVerses = {
  18: [
    {
      verseKey: "18:1",
      juz: 15,
      page: 293,
      arabic: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ",
      transliteration: "Al-hamdu lillaahil ladheee anzala 'alaa 'abdihil kitaaba wa lam yaj'al lahoo 'iwajaa",
      translation: "[All] praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.",
      tafsir: "Praise be to Allah for revealing this magnificent Book to His Messenger Muhammad (ﷺ). The word 'Iwaj' means crookedness, deviation, or contradiction. Allah made this Quran upright, clear, and perfectly balanced, acting as a guidance for all of humanity."
    },
    {
      verseKey: "18:2",
      juz: 15,
      page: 293,
      arabic: "قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّـٰلِحَـٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا",
      transliteration: "Qayyimalliyundhira ba'san shadeedam mil ladunhu wa yubashshiral mu'mineenalladheena ya'maloonas saalihaati anna lahum ajran hasanaa",
      translation: "[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.",
      tafsir: "'Qayyimah' means straight, guiding towards the straight path. It is a warning to those who reject the truth of a severe punishment in this life and the hereafter, and a glad tiding of a beautiful reward (Paradise) for the believers."
    },
    {
      verseKey: "18:3",
      juz: 15,
      page: 293,
      arabic: "مَّـٰكِثِينَ فِيهِ أَبَدًا",
      transliteration: "Maakitheena feehi abadaa",
      translation: "In which they will remain forever.",
      tafsir: "They will dwell in their reward (Paradise) eternally, never desiring to leave it or seeking any change. Their joy will be continuous and infinite."
    },
    {
      verseKey: "18:4",
      juz: 15,
      page: 293,
      arabic: "وَيُنذِرَ ٱلَّذِينَ قَالُوا۟ ٱتَّخَذَ ٱللَّهُ وَلَدًا",
      transliteration: "Wa yundhiralladheena qaloottakhadhal laahu waladaa",
      translation: "And to warn those who say, \"Allah has taken a son.\"",
      tafsir: "This warning is specifically directed towards those pagans, Jews, and Christians who claimed Allah has offspring. This is a severe falsehood that goes against His absolute Oneness (Tawhid)."
    },
    {
      verseKey: "18:5",
      juz: 15,
      page: 293,
      arabic: "مَّا لَهُم بِهِۦ مِنْ عِلْمٍ وَلَا لِـَٔابَآئِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَٰهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا",
      transliteration: "Maa lahum bihee min 'ilminw wa laa li aabaaa'ihim; kaburat kalimatan takhruju min afwaahihim; iy yaqooloona illaa kadhibaa",
      translation: "They have no knowledge of it, nor had their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.",
      tafsir: "They make these statements out of sheer ignorance and blind following, with no proof or intellectual basis. To claim Allah has a child is an enormous sin, a massive blasphemy. They speak nothing but a fabrication."
    }
  ],
  1: [
    {
      verseKey: "1:1",
      juz: 1,
      page: 1,
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      transliteration: "Bismillaahir Rahmaanir Raheem",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      tafsir: "Bismillah is the opening statement of the Quran, starting in the name of Allah, the supreme deity worthy of worship, who is characterized by all-encompassing mercy."
    },
    {
      verseKey: "1:2",
      juz: 1,
      page: 1,
      arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      transliteration: "Alhamdu lillaahi Rabbil 'aalameen",
      translation: "[All] praise is [due] to Allah, Lord of the worlds -",
      tafsir: "All gratitude and praise belong exclusively to Allah, who nurtures, sustains, and guides all creation (the worlds of mankind, jinn, angels, and everything that exists)."
    }
  ]
};

export const hadithBooks = [
  { 
    id: "bukhari", 
    name: "Sahih al-Bukhari", 
    arabicName: "صحيح البخاري", 
    totalHadith: 7563, 
    chaptersCount: "97 Chapters",
    description: "Compiled by Imam Muhammad al-Bukhari (194–256 AH). The most authentic book after the Quran, arranged by legal & theological topics.",
    emblem: "bi-journal-richtext",
    classification: "Sahih Collection",
    badgeClass: "badge-sahih",
    tags: ["kutub-sittah", "foundational-sahihs"]
  },
  { 
    id: "muslim", 
    name: "Sahih Muslim", 
    arabicName: "صحيح مسلم", 
    totalHadith: 7500, 
    chaptersCount: "56 Chapters",
    description: "Compiled by Imam Muslim ibn al-Hajjaj (204–261 AH). Renowned for its rigorous thematic organization and preservation of narration variants.",
    emblem: "bi-journal-richtext",
    classification: "Sahih Collection",
    badgeClass: "badge-sahih",
    tags: ["kutub-sittah", "foundational-sahihs"]
  },
  { 
    id: "nasai", 
    name: "Sunan an-Nasa'i", 
    arabicName: "سنن النسائي", 
    totalHadith: 5758, 
    chaptersCount: "57 Chapters",
    description: "Compiled by Imam an-Nasa'i (215–303 AH). Noted for its extremely strict rules for narrators and comprehensive coverage of daily Sunnah practices.",
    emblem: "bi-journal-richtext",
    classification: "Sunan Work",
    badgeClass: "badge-sunan",
    tags: ["kutub-sittah", "sunan-works"]
  },
  { 
    id: "abudawud", 
    name: "Sunan Abi Dawud", 
    arabicName: "سنن أبي داود", 
    totalHadith: 5274, 
    chaptersCount: "43 Chapters",
    description: "Compiled by Imam Abu Dawud (202–275 AH). Focuses primarily on traditions that form the basis of Islamic rulings and legal opinions (Fiqh).",
    emblem: "bi-journal-richtext",
    classification: "Sunan Work",
    badgeClass: "badge-sunan",
    tags: ["kutub-sittah", "sunan-works"]
  },
  { 
    id: "tirmidhi", 
    name: "Jami` at-Tirmidhi", 
    arabicName: "جامع الترمذي", 
    totalHadith: 3956, 
    chaptersCount: "49 Chapters",
    description: "Compiled by Imam at-Tirmidhi (209–279 AH). Famous for analyzing narration chains, categorizing grades, and stating opinions of early jurists.",
    emblem: "bi-journal-richtext",
    classification: "Sunan Work",
    badgeClass: "badge-sunan",
    tags: ["kutub-sittah", "sunan-works"]
  },
  { 
    id: "ibnmajah", 
    name: "Sunan Ibn Majah", 
    arabicName: "سنن ابن ماجه", 
    totalHadith: 4341, 
    chaptersCount: "37 Chapters",
    description: "Compiled by Imam Ibn Majah (209–273 AH). Completes the Six Canonical books, featuring well-organized chapters on legal decisions and trials.",
    emblem: "bi-journal-richtext",
    classification: "Sunan Work",
    badgeClass: "badge-sunan",
    tags: ["kutub-sittah", "sunan-works"]
  },
  { 
    id: "muwatta", 
    name: "Muwatta Malik", 
    arabicName: "مُوَطَّأُ مَالِك", 
    totalHadith: 1858, 
    chaptersCount: "61 Chapters",
    description: "Compiled by Imam Malik ibn Anas (93–179 AH). The earliest recorded legal manual and authentic Hadith collection reflecting Madinah's early practice.",
    emblem: "bi-bookmark-check",
    classification: "Early Classic",
    badgeClass: "badge-compilation",
    tags: ["adab-fiqh"]
  },
  { 
    id: "riyad", 
    name: "Riyad us-Saliheen", 
    arabicName: "رِيَاضُ الصَّالِحِين", 
    totalHadith: 1896, 
    chaptersCount: "19 Books",
    description: "Compiled by Imam Yahya ibn Sharaf al-Nawawi (631–676 AH). 'The Gardens of the Righteous' — a curated manual of spiritual purification and manners.",
    emblem: "bi-heart-pulse",
    classification: "Ethics & Adab",
    badgeClass: "badge-compilation",
    tags: ["adab-fiqh"]
  },
  { 
    id: "nawawi40", 
    name: "An-Nawawi's 40 Hadith", 
    arabicName: "الأَرْبَعُونَ النَّوَوِيَّة", 
    totalHadith: 42, 
    chaptersCount: "Foundational",
    description: "Imam al-Nawawi’s foundational anthology encapsulating the quintessential maxims and core principles of the Islamic faith.",
    emblem: "bi-stars",
    classification: "Core Primer",
    badgeClass: "badge-compilation",
    tags: ["adab-fiqh"]
  }
];

export const hadithChapters = {
  "bukhari": [
    { id: 1, name: "Revelation (Wahy)", arabicName: "كتاب بدء الوحى", count: 7 },
    { id: 2, name: "Belief (Iman)", arabicName: "كتاب الإيمان", count: 35 },
    { id: 3, name: "Knowledge ('Ilm)", arabicName: "كتاب العلم", count: 50 },
    { id: 4, name: "Ablution (Wudu)", arabicName: "كتاب الوضوء", count: 80 }
  ]
};

export const hadithList = {
  "bukhari_1": [
    {
      id: 1,
      narrator: "Umar bin Al-Khattab",
      arabic: "سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ \"‏ إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ ‏\"‏‏.‏",
      translation: "I heard Allah's Messenger (ﷺ) saying, 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.'",
      grade: "Sahih",
      reference: "Sahih al-Bukhari 1 (Book 1, Hadith 1)",
      explanation: "This Hadith is a foundational principle of Islamic jurisprudence. It highlights that actions are judged solely based on sincerity and intentions behind them. Even noble acts are rendered useless if done for worldly praise."
    },
    {
      id: 2,
      narrator: "Aisha (Mother of the Believers)",
      arabic: "أَنَّ حَارِثَ بْنَ هِشَامٍ سَأَلَ رَسُولَ اللَّهِ صلى الله عليه وسلم كَيْفَ يَأْتِيكَ الْوَحْىُ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ \"‏ أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ ـ وَهُوَ أَشَدُّهُ عَلَىَّ ـ فَيُفْصَمُ عَنِّي وَقَدْ وَعَيْتُ عَنْهُ مَا قَالَ، وَأَحْيَانًا يَتَمَثَّلُ لِيَ الْمَلَكُ رَجُلاً فَيُكَلِّمُنِي فَأَعِي مَا يَقُولُ ‏\"‏‏.‏",
      translation: "Harith bin Hisham asked Allah's Messenger (ﷺ) 'O Allah's Messenger (ﷺ)! How is the Divine Inspiration revealed to you?' Allah's Messenger (ﷺ) replied, 'Sometimes it is revealed like the ringing of a bell, this form is the hardest of all and then this state passes off after I have grasped what is inspired. Sometimes the Angel comes in the form of a man and talks to me and I grasp whatever he says.'",
      grade: "Sahih",
      reference: "Sahih al-Bukhari 2 (Book 1, Hadith 2)",
      explanation: "This Hadith explains the physical modes of receiving revelation. The Prophet experienced intense physical pressure when the words were cast directly into his heart."
    }
  ]
};

export const academyTracks = [
  {
    id: "tajweed",
    title: "Tajweed & Tilawah",
    description: "Master Quranic phonetics, makharij, and rules of recitation with live corrections.",
    icon: "bi-book",
    stats: { level: "Beginner to Advanced", duration: "12 Weeks", lectures: "24 Sessions" },
    curriculum: [
      {
        id: "m1",
        title: "Makharij & Sifat (Articulation & Characteristics)",
        description: "Focuses on the exit points of the Arabic letters and their phonetic features.",
        lessons: [
          { id: "l1", title: "Introduction to Articulation Points", duration: "45 mins" },
          { id: "l2", title: "Throat and Tongue Letters (Halq & Lisan)", duration: "60 mins" },
          { id: "l3", title: "The Lips and Nasal Cavity (Shafatayn & Khayshum)", duration: "50 mins" }
        ]
      },
      {
        id: "m2",
        title: "Rules of Noon Sakinah & Tanween",
        description: "Izhar, Idgham, Iqlob, and Ikhfa definitions and applications.",
        lessons: [
          { id: "l4", title: "Understanding Noon Sakinah & Tanween", duration: "40 mins" },
          { id: "l5", title: "The Clearness (Izhar) & Insertion (Idgham)", duration: "60 mins" }
        ]
      }
    ]
  },
  {
    id: "tafsir",
    title: "Classical Tafsir",
    description: "Historical contexts, linguistic depths, and practical reflections of each Surah.",
    icon: "bi-chat-square-quote",
    stats: { level: "Intermediate", duration: "16 Weeks", lectures: "32 Sessions" },
    curriculum: [
      {
        id: "m1",
        title: "Introduction to Quranic Exegesis",
        description: "The sciences of Tafsir, classical commentators, and rules of interpretation.",
        lessons: [
          { id: "l1", title: "What is Tafsir? (Tafsir vs Ta'wil)", duration: "55 mins" }
        ]
      }
    ]
  },
  {
    id: "arabic",
    title: "Quranic Arabic",
    description: "Grammar (Nahw) and morphology (Sarf) geared directly to comprehending the Revelation.",
    icon: "bi-translate",
    stats: { level: "Beginner", duration: "24 Weeks", lectures: "48 Sessions" },
    curriculum: []
  },
  {
    id: "hadith-seerah",
    title: "Seerah & Hadith",
    description: "Study the Prophetic character and authentic traditions (Nawawi 40, Riyad us-Saliheen).",
    icon: "bi-journal-text",
    stats: { level: "Beginner", duration: "10 Weeks", lectures: "20 Sessions" },
    curriculum: []
  }
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
    description: "Comprehensive study of the Pillars of Faith (Arkan al-Iman), classical Tahawiyyah principles, and core Islamic worldview essentials.",
    detailsLink: "/courses/tajweed"
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
    description: "Chronological survey of the Rightly Guided Caliphs, Umayyad & Abbasid eras, scientific breakthroughs, and the Golden Age of Andalusia.",
    detailsLink: "#"
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
    description: "Purification of the spiritual heart (Tazkiyat al-Nafs), interpersonal etiquette, humility, and practical ethics based on Imam al-Ghazali’s works.",
    detailsLink: "#"
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
    description: "Comparative study of classical court procedures (Qada'), evidence evaluation, contract law (Mu'amalat), and contemporary financial ethics.",
    detailsLink: "#"
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
    description: "Lessons from the Meccan and Medinan periods, strategic leadership, societal transformation, and character study (Shama'il).",
    detailsLink: "#"
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
    description: "History of Quranic compilation, Asbab al-Nuzul (revelation contexts), abrogation (Naskh), and comparing classical Tafsir schools.",
    detailsLink: "#"
  }
];

