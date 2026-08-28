import { useState, useEffect } from 'react';
import { getHadithBooks, getHadithChapters, getHadiths, getHadithByNumber, getHadithChaptersMinimal } from '../services/hadithApi';
import { getSiteLanguage } from '../../../services/siteLanguage';

function useSiteLang() {
  const [lang, setLang] = useState(getSiteLanguage());
  useEffect(() => {
    const handleLangChange = () => setLang(getSiteLanguage());
    window.addEventListener('siteLanguageChange', handleLangChange);
    return () => window.removeEventListener('siteLanguageChange', handleLangChange);
  }, []);
  return lang;
}

export function useHadithBooks() {
  const siteLang = useSiteLang();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState(null);

  const fetchBooks = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await getHadithBooks(cursor);
      
      setBooks((prev) => {
        if (!cursor) return response.data || [];
        const existingIds = new Set(prev.map((b) => b.id));
        const newBooks = (response.data || []).filter((b) => !existingIds.has(b.id));
        return [...prev, ...newBooks];
      });
      setNextCursor(response.meta?.next_cursor || null);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setBooks([]);
    fetchBooks();
  }, [siteLang]);

  const loadMore = () => {
    if (nextCursor && !loading && !loadingMore) {
      fetchBooks(nextCursor);
    }
  };

  return { books, loading, loadingMore, nextCursor, loadMore, error };
}

export function useHadithChapters(bookSlug) {
  const siteLang = useSiteLang();
  const [chapters, setChapters] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState(null);

  const fetchChapters = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await getHadithChapters(bookSlug, cursor);
      
      if (response.book) {
        setBook(response.book);
      }
      setChapters((prev) => {
        if (!cursor) return response.chapters || [];
        const existingIds = new Set(prev.map((c) => c.id));
        const newChapters = (response.chapters || []).filter((c) => !existingIds.has(c.id));
        return [...prev, ...newChapters];
      });
      setNextCursor(response.nextCursor || null);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!bookSlug) return;
    setChapters([]);
    setBook(null);
    setNextCursor(null);
    fetchChapters(null);
  }, [bookSlug, siteLang]);

  const loadMore = () => {
    if (nextCursor && !loading && !loadingMore) {
      fetchChapters(nextCursor);
    }
  };

  return { book, chapters, loading, loadingMore, nextCursor, loadMore, error };
}

export function useHadithList(bookSlug, chapterSlug) {
  const siteLang = useSiteLang();
  const [hadiths, setHadiths] = useState([]);
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState(null);

  const fetchHadiths = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const result = await getHadiths(bookSlug, chapterSlug, cursor);
      setHadiths((prev) => {
        const existingIds = new Set(prev.map((h) => h.id));
        const newItems = (result.hadiths || []).filter((h) => !existingIds.has(h.id));
        return cursor ? [...prev, ...newItems] : result.hadiths || [];
      });
      setNextCursor(result.nextCursor || null);
      if (result.book) setBook(result.book);
      if (result.chapter) setChapter(result.chapter);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!bookSlug || !chapterSlug) return;
    setHadiths([]);
    setBook(null);
    setChapter(null);
    setNextCursor(null);
    fetchHadiths(null);
  }, [bookSlug, chapterSlug, siteLang]);

  const loadMore = () => {
    if (nextCursor && !loading && !loadingMore) {
      fetchHadiths(nextCursor);
    }
  };

  return { hadiths, book, chapter, loading, loadingMore, nextCursor, loadMore, error };
}

export function useHadithSingle(bookSlug, hadithNumber) {
  const siteLang = useSiteLang();
  const [hadith, setHadith] = useState(null);
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookSlug || !hadithNumber) return;
    const fetchSingle = async () => {
      try {
        setLoading(true);
        const result = await getHadithByNumber(bookSlug, hadithNumber);
        setHadith(result.hadith);
        if (result.book) setBook(result.book);
        if (result.chapter) setChapter(result.chapter);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSingle();
  }, [bookSlug, hadithNumber, siteLang]);

  return { hadith, book, chapter, loading, error };
}

export function useHadithChaptersMinimal(bookSlug) {
  const siteLang = useSiteLang();
  const [chapters, setChapters] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookSlug) return;
    const fetchMinimal = async () => {
      try {
        setLoading(true);
        const res = await getHadithChaptersMinimal(bookSlug);
        setChapters(res.chapters);
        if (res.book) setBook(res.book);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMinimal();
  }, [bookSlug, siteLang]);

  return { book, chapters, loading, error };
}
