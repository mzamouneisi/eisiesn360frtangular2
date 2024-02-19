import {Address} from "./address";

export class Esn {
  id: number;
  name: string;
  metier: string;
  address: Address = new Address();
  tel: string;
  webSite: string;
  email: string;
  responsableUsername: string;
}
