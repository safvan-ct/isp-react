import apiClient from '../../../services/apiClient';

/**
 * Service to retrieve Hadith (Maktaba) collections from the backend.
 */
export const getHadithBooks = async (cursor = null) => {
  try {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get('/hadith/books', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Hadith books:', error);
    throw error;
  }
};

export const getHadithChapters = async (bookSlug, cursor = null) => {
  try {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get(`/hadith/books/${bookSlug}/chapters`, { params });
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
  try {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get(`/hadith/books/${bookSlug}/chapters/${chapterSlug}/hadiths`, { params });
    const resData = response.data;
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
  try {
    const params = { chapter_name: chapterName };
    const response = await apiClient.get(`/hadith/books/${bookSlug}/chapters`, { params });
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
  try {
    const response = await apiClient.get(`/hadith/books/${bookSlug}/hadiths/${hadithNumber}`);
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
  try {
    const params = { all: 1, minimal: 1 };
    const response = await apiClient.get(`/hadith/books/${bookSlug}/chapters`, { params });
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
