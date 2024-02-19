import {Client} from './client';

export class Project {
  id: number;
  name: string;
  description: string;
  teamNumber: number;
  teamDesc: string;
  method: string;
  env: string;
  client: Client;
  dateDeb: Date;
  dateFin: Date;
  comment: string;
}
