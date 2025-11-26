import { Activity } from "./activity";

/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 14/05/2020 01:30
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/
export class ActivityOverTime {
  id: number;
  target: string;
  price: number;
  percent: boolean;
  createdDate: Date;
  lastModifiedDate: Date

  activity: Activity
  activityId:number
}
