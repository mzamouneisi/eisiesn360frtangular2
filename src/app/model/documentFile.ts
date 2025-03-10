import { Document } from "./document";
import { FileUpload } from "./FileUpload";

export class DocumentFile{
    id: number;
    created_at: Date;
    last_modified_at: Date;
    document: Document;
    fileUpload: FileUpload
}