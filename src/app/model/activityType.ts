import { Activity } from "./activity";
import { Esn } from "./esn";

export class ActivityType {

  id: number;
  name: string;
  workDay: boolean;
  billDay: boolean;
  congeDay: boolean;
  formaDay: boolean;

  esn: Esn;
  esnId:number
  esnName:string 

  listActivity : Activity[];
}
