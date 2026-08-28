import { useState, useEffect, useCallback } from "react";
import { getChapters, getVerses, getMinimalChapters } from "../services/quranApi";

export function useQuranChapters(chapterName = "", revelation = "") {
	const [chapters, setChapters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);
	const [nextCursor, setNextCursor] = useState(null);
	const [meccanCount, setMeccanCount] = useState(0);
	const [medinanCount, setMedinanCount] = useState(0);

	const fetchChaptersList = useCallback(async (cursor = "", term = "", rev = "") => {
		try {
			if (cursor) {
				setLoadingMore(true);
			} else {
				setLoading(true);
			}
			const { chapters: newChapters, nextCursor: cursorToken, meccanCount: mecC, medinanCount: medC } =
				await getChapters(cursor, term, rev);
			setChapters((prev) => (cursor ? [...prev, ...newChapters] : newChapters));
			setNextCursor(cursorToken);
			if (mecC !== undefined) setMeccanCount(mecC);
			if (medC !== undefined) setMedinanCount(medC);
			setError(null);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}, []);

	useEffect(() => {
		fetchChaptersList("", chapterName, revelation);
	}, [chapterName, revelation, fetchChaptersList]);

	const loadMore = useCallback(() => {
		if (nextCursor && !loadingMore) {
			fetchChaptersList(nextCursor, chapterName, revelation);
		}
	}, [nextCursor, loadingMore, chapterName, revelation, fetchChaptersList]);

	return { chapters, loading, loadingMore, error, nextCursor, loadMore, meccanCount, medinanCount };
}

export function useQuranVerses(surahSlug) {
	const [verses, setVerses] = useState([]);
	const [chapter, setChapter] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);
	const [nextCursor, setNextCursor] = useState(null);

	const fetchVersesList = useCallback(async (slug, cursor = "") => {
		try {
			if (cursor) {
				setLoadingMore(true);
			} else {
				setLoading(true);
			}
			const { verses: newVerses, chapter: chapterData, nextCursor: cursorToken } =
				await getVerses(slug, cursor);
			setVerses((prev) => (cursor ? [...prev, ...newVerses] : newVerses));
			if (chapterData) {
				setChapter(chapterData);
			}
			setNextCursor(cursorToken);
			setError(null);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}, []);

	useEffect(() => {
		if (!surahSlug) return;
		setVerses([]);
		setChapter(null);
		fetchVersesList(surahSlug, "");
	}, [surahSlug, fetchVersesList]);

	const loadMore = useCallback(() => {
		if (nextCursor && !loadingMore && surahSlug) {
			fetchVersesList(surahSlug, nextCursor);
		}
	}, [nextCursor, loadingMore, surahSlug, fetchVersesList]);

	return { verses, chapter, loading, loadingMore, error, nextCursor, loadMore };
}

export function useMinimalChapters() {
	const [chapters, setChapters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let active = true;
		const fetchMinimal = async () => {
			try {
				setLoading(true);
				const data = await getMinimalChapters();
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

		fetchMinimal();
		return () => {
			active = false;
		};
	}, []);

	return { chapters, loading, error };
}
