
export class FileUpload {
	id: number;
	name: string;
	content: string | ArrayBuffer;
	comment: string;
	dateUpload: Date;
	dateFile : Date;
	size: number;
	type: string;
	document: Document;
}
