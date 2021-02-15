import { makeRequest } from "../util/makeRequest";
import type { Document } from "../util/types";

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

export const START_DOCUMENT_VALIDATION = "Documents/START_DOCUMENT_VALIDATION";
export const STOP_DOCUMENT_VALIDATION = "Documents/STOP_DOCUMENT_VALIDATION";
export const HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE = "Documents/HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE";

const startDocumentValidation = (documentId: string) => ({ type: START_DOCUMENT_VALIDATION, documentId });
const stopDocumentValidation = (documentId: string) => ({ type: STOP_DOCUMENT_VALIDATION, documentId });

const handleValidationStatusChange = (
	documentId: string,
	step: "checksumValid" | "schemaValid" | "signatureValid",
	value: boolean
) => ({
	type: HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
	documentId,
	step,
	value
})

export const validateDocument = (documentId: string) => async (dispatch: any) => {
	dispatch(startDocumentValidation(documentId)); // reset the validation object

	try {
		// validate document's checksum, schema and signature.
		// if one of them fails, then whole document is considered as invalid
		await validateDocumentChecksum(documentId);
		dispatch(handleValidationStatusChange(documentId, "checksumValid", true));

		await validateDocumentSchema(documentId);
		dispatch(handleValidationStatusChange(documentId, "schemaValid", true));

		await validateDocumentSignature(documentId);
		dispatch(handleValidationStatusChange(documentId, "signatureValid", true));
		
		dispatch(stopDocumentValidation(documentId));
	} catch (err) {
		// document validation received an error or document was invalid in some part of the process
		console.log(err);
		dispatch(stopDocumentValidation(documentId));
	}
};

const validateDocumentChecksum = (documentId: string): Promise<boolean> => {
	return makeRequest({
		url: `documents/${documentId}/validateChecksum`,
		method: "POST"
	}).then(response => {
		if (response.data.valid) {
			return Promise.resolve(true);
		}
		 // since document is not valid, then fail the whole validation process in validateDocument()
		return Promise.reject();
	});
};

const validateDocumentSchema = (documentId: string): Promise<boolean> => {
	return makeRequest({
		url: `documents/${documentId}/validateSchema`,
		method: "POST"
	}).then(response => {
		if (response.data.valid) {
			return Promise.resolve(true);
		}
		// since document is not valid, then fail the whole validation process in validateDocument()
		return Promise.reject();
	});
};

const validateDocumentSignature = (documentId: string): Promise<boolean> => {
	return makeRequest({
		url: `documents/${documentId}/validateSignature`,
		method: "POST"
	}).then(response => {
		if (response.data.valid) {
			return Promise.resolve(true);
		}
		// since document is not valid, then fail the whole validation process in validateDocument()
		return Promise.reject();
	});
};

export const validateDocuments = (documents: Array<Document>) => (dispatch: any) => {
	documents.forEach(({ id }) => {
		dispatch(validateDocument(id));
	})
}