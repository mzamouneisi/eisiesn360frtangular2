import {Esn} from './esn';
import {Address} from "./address";
import { Activity } from './activity';
import { Consultant } from './consultant';

export class ConsultantFilter {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  tel: string;
  profile: string;
  esn: Esn;
  roleInBusiness: string;
  adminConsultantUsername: string;
  active: boolean;
}