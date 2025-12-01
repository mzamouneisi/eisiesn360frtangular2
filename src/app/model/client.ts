import { Address } from "./address";
import { Esn } from "./esn";
import { Project } from "./project";

export class Client {
	  id: number;
    name: string;
    email: string;
    tel: string;
    metier: string;
    webSite: string;
    nameResp: string;
    telResp: string;
    emailResp: string;
    comment: string;
    
    address: Address;
    
    esn: Esn;
    esnId : number

    listProject : Project[]
    listProjectIds : number[]
}
