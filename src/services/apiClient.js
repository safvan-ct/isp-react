import axios from 'axios';
import * as mockData from './mockData';

// Create Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.al-athar.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper to fetch local mock data simulating network latency.
 * Enables zero-code-change migrations to actual API endpoints in production.
 */
export const fetchMockData = async (endpoint, params = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 150)); // low latency simulation

  switch (endpoint) {
    case 'quran/chapters':
      return { data: mockData.quranChapters };
    case 'quran/verses': {
      const verses = mockData.quranVerses[params.surahId] || [];
      return { data: verses };
    }
    case 'hadith/books':
      return { data: mockData.hadithBooks };
    case 'hadith/chapters': {
      const chapters = mockData.hadithChapters[params.bookId] || [];
      return { data: chapters };
    }
    case 'hadith/list': {
      const key = `${params.bookId}_${params.chapterId}`;
      const list = mockData.hadithList[key] || [];
      return { data: list };
    }
    case 'courses/tracks':
      return { data: mockData.academyTracks };
    case 'courses/track': {
      const track = mockData.academyTracks.find((t) => t.id === params.trackId);
      return { data: track || null };
    }
    default:
      throw new Error(`Endpoint not mocked: ${endpoint}`);
  }
};

export default apiClient;
