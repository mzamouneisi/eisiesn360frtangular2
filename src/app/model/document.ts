import { CategoryDoc } from "./categoryDoc";
import { Consultant } from "./consultant";
import { FileUpload } from "./FileUpload";

export class Document{
    createdDate: Date;
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
    categoryName: string;
    lastModifiedDate: Date;

}
