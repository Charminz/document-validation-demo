import { makeRequest } from "../util/makeRequest";

export const LOAD_DOCUMENTS_BY_PAGE_REQUEST = "Documents/LOAD_DOCUMENTS_BY_PAGE_REQUEST";
export const LOAD_DOCUMENTS_BY_PAGE_SUCCESS = "Documents/LOAD_DOCUMENTS_BY_PAGE_SUCCESS";
export const LOAD_DOCUMENTS_BY_PAGE_FAIL = "Documents/LOAD_DOCUMENTS_BY_PAGE_FAIL";

export const loadDocumentsByPage = (pageNo: number) => (dispatch: any): void => {
	dispatch({ type: LOAD_DOCUMENTS_BY_PAGE_REQUEST, pageNo });

	makeRequest({
		url: "documents",
		method: "GET",
		data: {
			page: pageNo,
			perPage: 50
		}
	}).then(response => {
		console.log(response);
		dispatch({
			type: LOAD_DOCUMENTS_BY_PAGE_SUCCESS,
			documents: response.data.data,
			pageData: response.data.meta
		})
	}).catch((err: any) => {
		console.log(err);
		dispatch({ type: LOAD_DOCUMENTS_BY_PAGE_FAIL });
	})
}