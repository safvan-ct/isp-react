import { fetchMockData } from '../../../services/apiClient';

/**
 * Service to retrieve Hadith (Maktaba) collections.
 */
export const getHadithBooks = async () => {
  try {
    const response = await fetchMockData('hadith/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching Hadith books:', error);
    throw error;
  }
};

export const getHadithChapters = async (bookId) => {
  try {
    const response = await fetchMockData('hadith/chapters', { bookId });
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookId}:`, error);
    throw error;
  }
};

export const getHadiths = async (bookId, chapterId) => {
  try {
    const response = await fetchMockData('hadith/list', { 
      bookId, 
      chapterId: parseInt(chapterId, 10) 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching hadiths for ${bookId} chapter ${chapterId}:`, error);
    throw error;
  }
};
