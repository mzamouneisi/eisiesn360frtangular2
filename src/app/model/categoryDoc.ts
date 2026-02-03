import { Feature } from "../authorization/authorization.types";
import { Document } from "./document";

export class CategoryDoc {
    id: number;
    name: string;
    management_name: Feature;
    createdDate: Date;
    lastModifiedDate: Date;
    showingDocumentList: boolean = false;
    documentList: Document[]=[];
    enabled_for_admin: boolean = true;
    enabled_for_consultant: boolean = false;
}
