/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 03/05/2020 01:58
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/

import { Consultant } from "./consultant";
import { Cra } from "./cra";
import { Document } from "./document";
import { NoteFrais } from "./noteFrais";

export class Notification {
  id: number;
  title: string;
  message: string;
  viewed: boolean;
  currentDocument: Document
  createdDate: Date;
  lastModifiedDate: Date;

  fromUser:Consultant;
  fromUsername : string 
  toUser:Consultant;
  toUsername : string 
  
  cra: Cra;
  craId:number 
  noteFrais: NoteFrais;
  noteFraisId:number
}
