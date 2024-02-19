import {Consultant} from "./consultant";
import {CraDay} from "./cra-day";

export class Cra {
  id: number;
  month: Date;
  taskRealized: string;
  comment: string;
  status: string;
  nbDayWorked: number;
  validByConsultant: boolean;
  validByManager: boolean;
  dateValidationConsultant: Date;
  dateValidationManager: Date;
  craDays: CraDay[] = [];
  consultantUsername: string;
  managerUsername: string;
  createdDate: Date;
  lastModifiedDate: Date;
  attachment: string | ArrayBuffer;
  type:string = 'CRA'; //CRA, CONGE
}
