/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 18/04/2020 19:37
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/
import {Cra} from "../../model/cra";
import {CalendarEvent} from "calendar-utils";

export class CraContext {
  cra: Cra;
  add: string;
  viewDate: Date;
  events: CalendarEvent[]

}
