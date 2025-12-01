import { Activity } from "./activity";
import { Document } from "./document";

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
	documentId: number;

	activity : Activity
	activityId : number
}
