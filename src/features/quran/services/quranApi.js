import apiClient from "../../../services/apiClient";
import { getSiteLanguage } from "../../../services/siteLanguage";

/**
 * Service to retrieve Quran data.
 */
export const getChapters = async (
	cursor = "",
	chapterName = "",
	revelation = "",
) => {
	const lang = getSiteLanguage();
	try {
		const params = {};
		if (chapterName) params.chapter_name = chapterName;
		if (revelation && revelation !== "all")
			params.revelation = revelation.toLowerCase();
		if (cursor) params.cursor = cursor;

		const response = await apiClient.get("/quran/chapters", { params });
		const mappedChapters = (response.data.data || []).map((chapter) => {
			const translation =
				chapter.translations?.find((t) => t.lang === lang) ||
				chapter.translations?.[0] ||
				{};
			return {
				id: chapter.id,
				slug: chapter.slug,
				name: chapter.translation || translation.name || chapter.slug,
				englishName: chapter.title || translation.name_tr || "",
				type: chapter.revelation || "Meccan",
				versesCount: chapter.no_of_verses || 0,
				arabicName: chapter.name || "",
				juz: chapter.juz || 1,
			};
		});
		return {
			chapters: mappedChapters,
			nextCursor: response.data.meta?.next_cursor || null,
			meccanCount: response.data.meccan_count || 0,
			medinanCount: response.data.medinan_count || 0,
		};
	} catch (error) {
		console.error("Error fetching Quran chapters:", error);
		throw error;
	}
};

export const getVerses = async (chapterSlug, cursor = "") => {
	if (!chapterSlug) return { verses: [], chapter: null, nextCursor: null };
	const lang = getSiteLanguage();
	try {
		const params = cursor ? { cursor } : {};
		const response = await apiClient.get(
			`/quran/chapters/${chapterSlug}/verses`,
			{ params },
		);
		const backendChapter = response.data.chapter || {};
		const backendVerses = response.data.verses?.data || [];

		const translation =
			backendChapter.translations?.find((t) => t.lang === lang) ||
			backendChapter.translations?.[0] ||
			{};
		const mappedChapter = {
			id: backendChapter.id,
			slug: backendChapter.slug,
			name:
				backendChapter.translation || translation.name || backendChapter.slug,
			englishName: backendChapter.title || translation.name_tr || "",
			type: backendChapter.revelation || "Meccan",
			versesCount: backendChapter.no_of_verses || 0,
			arabicName: backendChapter.name || "",
			juz: backendChapter.juz || 1,
		};

		const mappedVerses = backendVerses.map((verse) => {
			const vTrans =
				verse.translations?.find((t) => t.lang === lang) ||
				verse.translations?.[0] ||
				{};
			return {
				verseKey: `${verse.quran_chapter_id}:${verse.number_in_chapter}`,
				number_in_chapter: verse.number_in_chapter || 1,
				juz: verse.juz || 1,
				page: verse.page || 1,
				arabic: verse.text || "",
				transliteration: vTrans.text_romanized || "",
				translation: vTrans.text || "",
				tafsir:
					verse.tafsir ||
					"Commentary and study notes for this verse are coming soon.",
			};
		});

		return {
			chapter: mappedChapter,
			verses: mappedVerses,
			nextCursor: response.data.verses?.meta?.next_cursor || null,
		};
	} catch (error) {
		console.error(`Error fetching verses for chapter ${chapterSlug}:`, error);
		throw error;
	}
};

export const getMinimalChapters = async () => {
	try {
		const params = { all: 1, minimal: 1 };
		const response = await apiClient.get("/quran/chapters", { params });
		return (response.data.data || []).map((chapter) => ({
			id: chapter.id,
			slug: chapter.slug,
			name: chapter.translation || chapter.slug,
			englishName: chapter.title || "",
			arabicName: chapter.name || "",
		}));
	} catch (error) {
		console.error("Error fetching minimal chapters:", error);
		throw error;
	}
};
