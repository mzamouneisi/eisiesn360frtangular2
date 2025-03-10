import { CategoryDoc } from "./categoryDoc";
import { Consultant } from "./consultant";
import { FileUpload } from "./FileUpload";

export class Document{
    id: number;
    title: string;
    for_all_users: boolean = false;
    expired_date: Date;
    valid: boolean = true;
    createdBy: Consultant;

    category: CategoryDoc;
    categoryId: number;

    // consultantId: number;
    listConsultantIds : number[] = [];
    consultant: Consultant;
    listConsultant : Consultant[] = [];

    files: FileUpload[] = [];
    //listNotification: Notification[] = [];
    category_name: string;
    created_date: Date;
    last_modified_date: Date;

}
