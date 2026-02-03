import { Activity } from './activity';
import { Category } from './category';
import { Consultant } from './consultant';
import { Notification } from './notification';
import { PayementMode } from './payementMode';

export class NoteFrais {
  createdDate: Date;
  id: number;
  amount: number;
  brand_name: string;
  country: string;
  dateNf: Date;
  pay_date: string;
  description: string;
  invoice_number: string;
  pretax_amount: number;
  title: string;
  vat: number;
  textFilePdf : string;
  invoice_file: string | ArrayBuffer;
  vat_rate: number;
  state: string;
  // consultant: Consultant;
  dateTest: Date;
  
  activity: Activity;
  activityId: number 
  category: Category;
  categoryId: number
  payementMode: PayementMode;
  payementModeId:number
  consultant : Consultant
  consultantId : number 

  listNotification : Notification[]

  constructor() {
    this.activity = new Activity();
    this.category = new Category();
    this.payementMode = new PayementMode();
   }

}
