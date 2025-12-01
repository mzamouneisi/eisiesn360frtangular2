import { Activity } from './activity';
import { Address } from "./address";
import { Cra } from './cra';
import { Document } from './document';
import { Esn } from './esn';
import { Msg } from './msg';
import { NoteFrais } from './noteFrais';

export class Consultant {
    id: number;
    //------------person----------------
    firstName: string;
    lastName: string;
    tel: string;
    email: string;
    birthDay: Date;
    address: Address = new Address();
    //-----------specific------------------*
    admin: boolean;
    role: string;
    level: number;
    username: string;
    password: string;
    active: boolean;
    
    esnId : number 
    esnName : string 
    esn: Esn;
    // idEsn:number;

    adminConsultant: Consultant;
    adminConsultantId: number;

    listConsultantIds: number[]
    listConsultant: Consultant[]

    listActivityIds: number[]
    listActivity: Activity[];

    listCra: Cra[];
    listNoteFrais: NoteFrais[]
    listMsgFrom: Msg[]
    listMsgTo: Msg[]
    listDocument: Document[]

    // adminConsultant: Consultant;
    get adminConsultantUsernameFct(): string {
        // return adminConsultant?.usarname ;
        return this.adminConsultant.username
    }

    //call : obj.toString
    get toString(): string {
        return this.fullName + ' ' + this.role;
    }

    // obj.fullName
    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }


}




