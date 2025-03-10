import { FileUpload } from "./FileUpload";
import { ActivityOverTime } from "./activity-over-time";
import { ActivityType } from './activityType';
import { Consultant } from './consultant';
import { NoteFrais } from "./noteFrais";
import { Project } from './project';

export class Activity {
  id: number;
  name: string;
  description: string;
  dateDeb: Date;
  dateFin: Date;
  createdByUsername: string;
  tjm: number;
  valid: boolean;
  overTime: boolean;

  type: ActivityType;
  typeId: number
  typeName: string

  consultant: Consultant;
  consultantId:number
  consultantFullName:String

  project: Project;
  projectId:number
  projectName:string

  clientId:number
  clientName:string

  activityOverTimes: ActivityOverTime[] = new Array()
  files : FileUpload[];

  // listCraDayActivity: CraDayActivity[]
  
  listNoteFrais: NoteFrais[]
  dateDebFr: string;
  dateFinFr: string;
}
