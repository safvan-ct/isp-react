import apiClient from '../../../services/apiClient';

/**
 * Service to retrieve Hadith (Maktaba) collections from the backend.
 */
export const getHadithBooks = async (cursor = null) => {
  try {
    const url = cursor ? `/hadith/books?cursor=${cursor}` : '/hadith/books';
    const response = await apiClient.get(url);
    return response.data; // Return the full envelope (data, links, meta)
  } catch (error) {
    console.error('Error fetching Hadith books:', error);
    throw error;
  }
};

export const getHadithChapters = async (bookSlug, cursor = null) => {
  try {
    const url = cursor 
      ? `/hadith/books/${bookSlug}/chapters?cursor=${cursor}`
      : `/hadith/books/${bookSlug}/chapters`;
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
  try {
    const url = cursor
      ? `/hadith/books/${bookSlug}/chapters/${chapterSlug}/hadiths?cursor=${cursor}`
      : `/hadith/books/${bookSlug}/chapters/${chapterSlug}/hadiths`;
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
