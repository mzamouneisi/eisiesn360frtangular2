import { Activity } from './activity';
import { Address } from "./address";
import { Esn } from './esn';

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
    role: string;
    esn: Esn;
    adminConsultantUsername: string;
    adminConsultant: Consultant;
    username: string;
    password: string;
    active: boolean;
    activities: Activity[];
    admin: boolean;
    level : BigInteger;

    //call : obj.toString
    get toString(): string {
        return this.fullName + ' ' + this.role;
    }

    // obj.fullName
    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

}




