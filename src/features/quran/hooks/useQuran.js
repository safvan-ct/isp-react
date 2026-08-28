import { useState, useEffect } from 'react';
import { getChapters, getVerses } from '../services/quranApi';

export function useQuranChapters() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const data = await getChapters();
        if (active) {
          setChapters(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchChapters();
    return () => {
      active = false;
    };
  }, []);

  return { chapters, loading, error };
}

export function useQuranVerses(surahId) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!surahId) return;

    let active = true;
    const fetchVerses = async () => {
      try {
        setLoading(true);
        const data = await getVerses(surahId);
        if (active) {
          setVerses(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchVerses();
    return () => {
      active = false;
    };
  }, [surahId]);

  return { verses, loading, error };
}
