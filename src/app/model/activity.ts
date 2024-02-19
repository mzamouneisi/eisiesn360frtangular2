import {Consultant} from './consultant';
import {Project} from './project';
import {ActivityType} from './activityType';
import {ActivityOverTime} from "./activity-over-time";
import {FileUpload} from "./FileUpload";

export class Activity {
  id: number;
  name: string;
  description: string;
  dateDeb: Date;
  dateFin: Date;
  type: ActivityType;
  consultant: Consultant;
  createdByUsername: string;
  project: Project;
  tjm: number;
  valid: boolean;
  overTime: boolean;
  activityOverTimes: ActivityOverTime[] = new Array()
  files : FileUpload[];
}
