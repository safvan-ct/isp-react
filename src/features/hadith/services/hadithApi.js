import apiClient from '../../../services/apiClient';
import { getSiteLanguage } from '../../../services/siteLanguage';

/**
 * Service to retrieve Hadith (Maktaba) collections from the backend.
 */
export const getHadithBooks = async (cursor = null) => {
  const lang = getSiteLanguage();
  try {
    const url = cursor ? `/hadith/books?cursor=${cursor}&translation=${lang}` : `/hadith/books?translation=${lang}`;
    const response = await apiClient.get(url);
    return response.data; // Return the full envelope (data, links, meta)
  } catch (error) {
    console.error('Error fetching Hadith books:', error);
    throw error;
  }
};

export const getHadithChapters = async (bookSlug, cursor = null) => {
  const lang = getSiteLanguage();
  try {
    const url = cursor 
      ? `/hadith/books/${bookSlug}/chapters?cursor=${cursor}&translation=${lang}`
      : `/hadith/books/${bookSlug}/chapters?translation=${lang}`;
    const response = await apiClient.get(url);
    return {
      book: response.data.book,
      chapters: response.data.chapters?.data || [],
      nextCursor: response.data.chapters?.meta?.next_cursor || null
    };
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookSlug}:`, error);
    throw error;
  }
};

export const getHadiths = async (bookSlug, chapterSlug, cursor = null) => {
  const lang = getSiteLanguage();
  try {
    const url = cursor
      ? `/hadith/books/${bookSlug}/chapters/${chapterSlug}/hadiths?cursor=${cursor}&translation=${lang}`
      : `/hadith/books/${bookSlug}/chapters/${chapterSlug}/hadiths?translation=${lang}`;
    const response = await apiClient.get(url);
    const resData = response.data;
    // Real response shape: { book, chapter, verses: { data, links, meta } }
    const verses = resData.verses?.data ?? resData.data ?? resData ?? [];
    const nextCursor = resData.verses?.meta?.next_cursor ?? null;
    return {
      hadiths: Array.isArray(verses) ? verses : [],
      nextCursor,
      book: resData.book ?? null,
      chapter: resData.chapter ?? null,
    };
  } catch (error) {
    console.error(`Error fetching hadiths for ${bookSlug} chapter ${chapterSlug}:`, error);
    throw error;
  }
};

export const searchHadithChapters = async (bookSlug, chapterName) => {
  const lang = getSiteLanguage();
  try {
    const url = `/hadith/books/${bookSlug}/chapters?chapter_name=${encodeURIComponent(chapterName)}&translation=${lang}`;
    const response = await apiClient.get(url);
    const chapters = response.data.chapters?.data || response.data.chapters || response.data.data || [];
    return {
      book: response.data.book,
      chapters: Array.isArray(chapters) ? chapters : [],
      nextCursor: response.data.chapters?.meta?.next_cursor || null
    };
  } catch (error) {
    console.error(`Error searching chapters for book ${bookSlug}:`, error);
    throw error;
  }
};

export const getHadithByNumber = async (bookSlug, hadithNumber) => {
  const lang = getSiteLanguage();
  try {
    const url = `/hadith/books/${bookSlug}/hadiths/${hadithNumber}?translation=${lang}`;
    const response = await apiClient.get(url);
    const resData = response.data;
    const versesList = resData.verses?.data ?? resData.verses ?? resData.data;
    const hadithObj = Array.isArray(versesList)
      ? versesList[0]
      : (resData.hadith || (resData.id || resData.text ? resData : null));
    return {
      hadith: hadithObj || null,
      book: resData.book || hadithObj?.book || null,
      chapter: resData.chapter || hadithObj?.chapter || null,
    };
  } catch (error) {
    console.error(`Error fetching hadith #${hadithNumber} for ${bookSlug}:`, error);
    throw error;
  }
};

export const getHadithChaptersMinimal = async (bookSlug) => {
  const lang = getSiteLanguage();
  try {
    const url = `/hadith/books/${bookSlug}/chapters?all=1&minimal=1&translation=${lang}`;
    const response = await apiClient.get(url);
    const resData = response.data;
    const chaptersList = resData.chapters?.data || resData.chapters || resData.data || [];
    return {
      book: resData.book || null,
      chapters: Array.isArray(chaptersList) ? chaptersList : [],
    };
  } catch (error) {
    console.error(`Error fetching minimal chapters for book ${bookSlug}:`, error);
    throw error;
  }
};
