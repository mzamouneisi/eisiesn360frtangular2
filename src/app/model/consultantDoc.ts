import { Consultant } from "./consultant";
import { Document } from "./document";

export class ConsultantDoc{
    id: number;
    created_at: Date;
    last_modified_at: Date;
    consultant: Consultant;
    document: Document;
    consultant_id: number;
}