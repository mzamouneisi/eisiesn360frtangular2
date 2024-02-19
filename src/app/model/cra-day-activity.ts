/***
 ** @Author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 ** @Date 02/10/2019
 ** @Time 16:33
 **
 ***/
import {Activity} from "./activity";
import {CraDay} from "./cra-day";

export class CraDayActivity {
  id: number;
  activity: Activity;
  startHour: string;
  endHour: string;
  isOverTime: boolean;
  nbDay: number;    // 0, 0.5, 1
  craDay: CraDay;
}
