import {
	HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
	LOAD_DOCUMENTS_BY_PAGE_FAIL,
	LOAD_DOCUMENTS_BY_PAGE_REQUEST,
	LOAD_DOCUMENTS_BY_PAGE_SUCCESS,
	START_DOCUMENT_VALIDATION,
	STOP_DOCUMENT_VALIDATION
} from "./DocumentActions";
import { mergeRight } from 'ramda';
import type { Document, DocumentsValidity } from "../util/types";

type DocumentsState = {
	fetching: boolean,
	documents: Array<Document>,
	paging: {
		page: number,
		pagesCount: number,
		perPage: number
	},
	validity: DocumentsValidity
}

const initialState = {
	fetching: false,
	documents: [],
	paging: {
		page: 1,
		pagesCount: 1,
		perPage: 50
	},
	validity: {}
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
		case START_DOCUMENT_VALIDATION:
			return mergeRight(state, {
				validity: mergeRight(state.validity, {
					[action.documentId]: {
						validationInProgress: true,
						checksumValid: false,
						schemaValid: false,
						signatureValid: false
					}
				})
			});
		case HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE:
			return mergeRight(state, {
				validity: mergeRight(state.validity, {
					[action.documentId]: mergeRight(state.validity[action.documentId], {
						[action.step]: action.value
					})
				})
			});
		case STOP_DOCUMENT_VALIDATION:
			return mergeRight(state, {
				validity: mergeRight(state.validity, {
					[action.documentId]: mergeRight(state.validity[action.documentId], {
						validationInProgress: false
					})
				})
			});
		default:
			return state;
	}
}

export default documentsReducer;