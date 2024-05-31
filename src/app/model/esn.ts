import { Address } from "./address";
import { Consultant } from "./consultant";

export class Esn {
  id: number;
  name: string;
  metier: string;
  address: Address = new Address();
  tel: string;
  webSite: string;
  email: string;
  listResp : Consultant[];
}
