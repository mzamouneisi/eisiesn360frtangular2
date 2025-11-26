/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 03/04/2020 20:58
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/
import {FeatureId} from "./feature-id";

export class Permission {
  featureId: FeatureId;
  view: Boolean;
  add: Boolean;
  update: Boolean;
  delete: Boolean;
  createdDate: Date;
  lastModifiedDate: Date
}


