/***
 ** @Author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 ** @Date 02/10/2019
 ** @Time 16:30
 **
 ***/
import { Cra } from "./cra";
import { CraDayActivity } from "./cra-day-activity";

export class CraDay {
  id: number;
  day: Date;
  type: string;
  isDayWorked: boolean;
  dayBill: boolean;
  dayAbs: boolean;
  comment: string;
  createdAt: Date;
  updateAt: Date;
  
  cra: Cra;
  craId: number;
  
  craDayActivities: CraDayActivity[] = []
}
