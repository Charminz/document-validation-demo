
export type Document = {
	[key: string]: string | number, // ts won't let to map document by column props otherwise ...
	id: string,
	filename: string,
	author: string,
	created_at: string,
	hash: string,
	size: number
}

export type DocumentsValidity = {
	[documentId: string]: {
		validationInProgress: boolean,
		checksumValid: boolean,
		schemaValid: boolean,
		signatureValid: boolean
	}
}