import apiClient from "../../../services/apiClient";
import { getSiteLanguage } from "../../../services/siteLanguage";

/**
 * Fetch list of courses with cursor pagination and translation support.
 *
 * @param {Object} options
 * @param {string|null} options.cursor - Cursor for pagination
 * @param {string|null} options.translation - Language code for translation (defaults to site language)
 * @param {string|null} options.search - Optional search keyword
 * @param {string|null} options.type - Optional course level filter (e.g. 'Beginner', 'Intermediate', 'Advanced')
 * @returns {Promise<{courses: Array, links: Object, meta: Object, nextCursor: string|null, prevCursor: string|null}>}
 */
export const getCourses = async ({
	cursor = null,
	translation = null,
	search = null,
	type = null,
} = {}) => {
	try {
		const lang = translation || getSiteLanguage();
		const params = {
			translation: lang,
		};
		if (cursor) {
			params.cursor = cursor;
		}
		if (search && search.trim()) {
			params.search = search.trim();
		}
		if (type && type !== "All") {
			params.type = type;
		}

		const response = await apiClient.get("/courses", { params });
		const resData = response.data;

		return {
			courses: Array.isArray(resData.data) ? resData.data : [],
			links: resData.links || {},
			meta: resData.meta || {},
			nextCursor: resData.meta?.next_cursor || null,
			prevCursor: resData.meta?.prev_cursor || null,
		};
	} catch (error) {
		console.error("Error fetching courses list:", error);
		throw error;
	}
};
