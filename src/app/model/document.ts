import { Category } from "./category";
import { CategoryDoc } from "./categoryDoc";
import { Consultant } from "./consultant";
import { ConsultantDoc } from "./consultantDoc";
import { DocumentFile } from "./documentFile";
import { FileUpload } from "./FileUpload";
import { Notification } from "./notification";

export class Document{
    id: number;
    title: string;
    category_name: string;
    expired_date: Date;
    stauts: boolean;
    for_all_users: boolean;
    created_date: Date;
    last_modified_date: Date;
    created_by: Consultant;
    category: CategoryDoc;
    consultants_docs: ConsultantDoc[] = [];
    documents_files: FileUpload[] = [];
    notifications: Notification[] = [];
}