import { Consultant } from "./consultant";
import { CraDay } from "./cra-day";
import { Notification } from "./notification";

export class Cra {
  id: number;
  month: Date;
  monthStr: string;
  taskRealized: string;
  comment: string;
  status: string;
  nbDayWorked: number;
  validByConsultant: boolean;
  validByManager: boolean;
  dateValidationConsultant: Date;
  dateValidationManager: Date;
  createdDate: Date;
  lastModifiedDate: Date;
  attachment: string | ArrayBuffer;
  type:string = 'CRA'; //CRA, CONGE

  consultant : Consultant;
  consultantId : number;
  manager: Consultant;
  managerId: number;
  
  craDays: CraDay[] = [];
  listNotification: Notification[] = [];
}
