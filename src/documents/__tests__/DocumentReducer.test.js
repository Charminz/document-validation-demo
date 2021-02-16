import {
	LOAD_DOCUMENTS_BY_PAGE_FAIL,
	LOAD_DOCUMENTS_BY_PAGE_REQUEST,
	LOAD_DOCUMENTS_BY_PAGE_SUCCESS,
	START_DOCUMENT_VALIDATION,
	HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
	STOP_DOCUMENT_VALIDATION
} from "../DocumentActions";
import documentReducer from "../DocumentReducer";

const mockPagesMeta = {
	pagesCount: 20,
	page: 1,
	perPage: 50
};

const mockDocuments = [
	{
		id: "b019be14-8251-47d6-8269-1908d6fc1b45",
		filename: "et ultrices posuere.jpeg",
		author: "shauger0",
		created_at: "2019-01-25T14:22:10Z",
		hash: "cd0150585f245faeae9fd1efc8c7a661",
		size: 46648255
	},
	{
		id: "117e8549-3114-438b-8175-6ac12b892443",
		filename: "felis donec.mpeg",
		author: "moakey1",
		created_at: "2019-01-10T09:12:51Z",
		hash: "8197d531d651904aa6bc72c6629a7ee6",
		size: 20397345
	}
]

describe.only("Documents Reducer", () => {
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

	it("should return initial state", () => {
		expect(documentReducer(undefined, {}))
			.toEqual(initialState);
	});

	it("should begin fetching on load documents", () => {
		expect(documentReducer(undefined, {
			type: LOAD_DOCUMENTS_BY_PAGE_REQUEST
		})).toEqual({
			...initialState,
			fetching: true
		})
	});

	it("should stop fetching on load documents fail", () => {
		const stateAfterRequestAction = { ...initialState, fetching: true };
		expect(documentReducer(
			stateAfterRequestAction,
			{ type: LOAD_DOCUMENTS_BY_PAGE_FAIL }
		)).toEqual(initialState)
	});

	it("should save loaded documents", () => {
		const stateAfterRequestAction = { ...initialState, fetching: true };

		expect(documentReducer(
			stateAfterRequestAction,
			{
				type: LOAD_DOCUMENTS_BY_PAGE_SUCCESS,
				documents: mockDocuments,
				pageData: mockPagesMeta
			}
		)).toEqual({
			...stateAfterRequestAction,
			fetching: false,
			documents: mockDocuments,
			paging: mockPagesMeta
		})
	});

	it("should handle START_DOCUMENT_VALIDATION", () => {
		expect(documentReducer(initialState, {
			type: START_DOCUMENT_VALIDATION,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45"
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: false,
					schemaValid: false,
					signatureValid: false
				}
			}
		})
	});

	it("should handle HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE after checksum validation", () => {
		const stateDuringDocValidation = {
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: false,
					schemaValid: false,
					signatureValid: false
				}
			}
		};

		expect(documentReducer(stateDuringDocValidation, {
			type: HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45",
			step: "checksumValid",
			value: true
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: false,
					signatureValid: false
				}
			}
		})
	});

	it("should handle HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE after schema validation", () => {
		const stateDuringDocValidation = {
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: false,
					signatureValid: false
				}
			}
		};

		expect(documentReducer(stateDuringDocValidation, {
			type: HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45",
			step: "schemaValid",
			value: true
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: true,
					signatureValid: false
				}
			}
		})
	});

	it("should handle HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE after signature validation", () => {
		const stateDuringDocValidation = {
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: true,
					signatureValid: false
				}
			}
		};

		expect(documentReducer(stateDuringDocValidation, {
			type: HANDLE_DOCUMENT_VALIDATION_STATUS_CHANGE,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45",
			step: "signatureValid",
			value: true
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: true,
					signatureValid: true
				}
			}
		})
	});

	it("should handle document validation stopping on success (all validations are true)", () => {
		const stateDuringDocValidation = {
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: true,
					signatureValid: true
				}
			}
		};

		expect(documentReducer(stateDuringDocValidation, {
			type: STOP_DOCUMENT_VALIDATION,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45"
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: false,
					checksumValid: true,
					schemaValid: true,
					signatureValid: true
				}
			}
		})
	});

	it("should handle document validation stopping on fail (some validation is false)", () => {
		const stateDuringDocValidation = {
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: true,
					checksumValid: true,
					schemaValid: true,
					signatureValid: false
				}
			}
		};

		expect(documentReducer(stateDuringDocValidation, {
			type: STOP_DOCUMENT_VALIDATION,
			documentId: "b019be14-8251-47d6-8269-1908d6fc1b45"
		})).toEqual({
			...initialState,
			validity: {
				"b019be14-8251-47d6-8269-1908d6fc1b45": {
					validationInProgress: false,
					checksumValid: true,
					schemaValid: true,
					signatureValid: false
				}
			}
		})
	});
});