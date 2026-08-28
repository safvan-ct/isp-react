import { fetchMockData } from '../../../services/apiClient';

/**
 * Service to retrieve Quran data. Falls back to mock client under local testing.
 */
export const getChapters = async () => {
  try {
    // If backend existed: const response = await apiClient.get('/quran/chapters'); return response.data;
    const response = await fetchMockData('quran/chapters');
    return response.data;
  } catch (error) {
    console.error('Error fetching Quran chapters:', error);
    throw error;
  }
};

export const getVerses = async (surahId) => {
  try {
    // If backend existed: const response = await apiClient.get(`/quran/verses?surahId=${surahId}`); return response.data;
    const response = await fetchMockData('quran/verses', { surahId: parseInt(surahId, 10) });
    return response.data;
  } catch (error) {
    console.error(`Error fetching verses for Surah ${surahId}:`, error);
    throw error;
  }
};
