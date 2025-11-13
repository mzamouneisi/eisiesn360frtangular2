/***
 ** @Author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 ** @Date 02/10/2019
 ** @Time 16:33
 **
 ***/
import { Activity } from "./activity";
import { CraDay } from "./cra-day";

export class CraDayActivity {
  id: number;
  startHour: string;
  endHour: string;
  nbDay: number;    // 0, 0.5, 1
  isOverTime: boolean;

  activity : Activity;
  activityId:number 

  craDay: CraDay;
    craDayId: number ;
}
