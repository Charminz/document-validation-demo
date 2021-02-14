import moment from "moment";

export const documentsTableColumns = [
	{
		prop: "filename",
		label: "Document name"
	},
	{
		prop: "author",
		label: "Author"
	},
	{
		prop: "created_at",
		label: "Document date",
		format: (date: string): string => moment(date).format("DD.MM.YYYY HH:mm:ss")
	},
	{
		prop: "size",
		label: "Size",
		format: (fileSize: number): string => fileSize.toString()
	}
]