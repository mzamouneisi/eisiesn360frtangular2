import { Consultant } from './consultant';
import { Activity } from './activity';
import { Category } from './category';
import { PayementMode } from './payementMode';

export class NoteFrais {
  id: number;
  amount: number;
  brand_name: string;
  country: string;
  date: Date;
  pay_date: string;
  description: string;
  invoice_number: string;
  pretax_amount: number;
  title: string;
  vat: number;
  invoice_file: string | ArrayBuffer;
  vat_rate: number;
  state: string;
  category: Category;
  payement_mode: PayementMode;
  activity: Activity;
  consultant: Consultant;
  dateTest: Date;
}
