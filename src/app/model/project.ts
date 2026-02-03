import { Activity } from './activity';
import { Client } from './client';

export class Project {
  createdDate: Date;
  id: number;
  name: string;
  description: string;
  teamNumber: number;
  teamDesc: string;
  method: string;
  env: string;
  dateDeb: Date;
  dateFin: Date;
  comment: string;
  
  client: Client;
  clientId : number;
  listActivity: Activity[];

}
