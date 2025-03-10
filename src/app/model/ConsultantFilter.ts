import { Address } from "./address";

export class ConsultantFilter {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  tel: string;
  profile: string;
  roleInBusiness: string;
  active: boolean;
  
  adminConsultantId: number;
  esnId: number;

}