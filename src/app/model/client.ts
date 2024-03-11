import { Address } from "./address";
import { Esn } from "./esn";

export class Client {
	  id: number;
    name: string;
    email: string;
    tel: string;
    address: Address;
    metier: string;
    webSite: string;
    nameResp: string;
    telResp: string;
    emailResp: string;
    comment: string;
    esn: Esn;
}
