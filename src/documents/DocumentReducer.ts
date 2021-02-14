import {
	LOAD_DOCUMENTS_BY_PAGE_FAIL,
	LOAD_DOCUMENTS_BY_PAGE_REQUEST,
	LOAD_DOCUMENTS_BY_PAGE_SUCCESS
} from "./DocumentActions";
import { mergeRight } from 'ramda';

type DocumentsState = {
	fetching: boolean,
	documents: Array<any>,
	paging: {
		page: number,
		pagesCount: number,
		perPage: number
	}
}

const initialState = {
	fetching: false,
	documents: [],
	paging: {
		page: 1,
		pagesCount: 1,
		perPage: 50
	}
};

const documentsReducer = (state: DocumentsState = initialState, action: any) => {
	switch (action.type) {
		case LOAD_DOCUMENTS_BY_PAGE_REQUEST:
			return mergeRight(state, {
				fetching: true
			});
		case LOAD_DOCUMENTS_BY_PAGE_SUCCESS:
			return mergeRight(state, {
				fetching: false,
				documents: action.documents,
				paging: action.pageData
			});
		case LOAD_DOCUMENTS_BY_PAGE_FAIL:
			return mergeRight(state, {
				fetching: false
			});
		default:
			return state;
	}
}

export default documentsReducer;