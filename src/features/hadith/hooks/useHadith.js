import { useState, useEffect } from 'react';
import { getHadithBooks, getHadithChapters, getHadiths } from '../services/hadithApi';

export function useHadithBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getHadithBooks();
        if (active) {
          setBooks(data);
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

    fetchBooks();
    return () => {
      active = false;
    };
  }, []);

  return { books, loading, error };
}

export function useHadithChapters(bookId) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return;

    let active = true;
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const data = await getHadithChapters(bookId);
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
  }, [bookId]);

  return { chapters, loading, error };
}

export function useHadithList(bookId, chapterId) {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId || !chapterId) return;

    let active = true;
    const fetchHadiths = async () => {
      try {
        setLoading(true);
        const data = await getHadiths(bookId, chapterId);
        if (active) {
          setHadiths(data);
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

    fetchHadiths();
    return () => {
      active = false;
    };
  }, [bookId, chapterId]);

  return { hadiths, loading, error };
}
