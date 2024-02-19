import {Injectable} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';

import {Cra} from '../model/cra';
import {Project} from '../model/project';
import {Consultant} from '../model/consultant';
import {environment} from '../../environments/environment';
import {Activity} from '../model/activity';

@Injectable({
  providedIn: 'root'
})
export class CraFormsService {

  constructor() {
  }

  /**
   *
   * @param tab tableau d'objets
   * @param objetId
   */
  getObjetIndexById(tab: any, objetId): number {
    ////////////console.log("getObjetIndexById objetId:" + objetId)
    let res = -1;
    ////console.log(tab)
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].id == objetId) {
        res = i;
        break;
      }
    }
    ////////////console.log("getObjetIndexById res:" + res);
    return res;
  }

  selectProjet(fb: FormBuilder, projets: Project[], myObj: Activity): FormGroup {
    ////////////console.log("selectProjet:")
    let projetForm: FormGroup;
    if (myObj.project != undefined) {
      let indexSelected = this.getObjetIndexById(projets, myObj.project.id);
      ////console.log(indexSelected)
      projetForm = fb.group(
        {
          ["projectControl"]: [indexSelected]
        }
      );
    }
    ////////////console.log("selectProjet:END")
    return projetForm;
  }

  //////////////////////////////////////////////////////////

  selectConsultant(fb: FormBuilder, consultants: Consultant[], myObj: Activity): FormGroup {
    ////////////console.log("selectConsultant:")
    let consultantForm: FormGroup;
    if (myObj.consultant != undefined) {
      let indexSelected = this.getObjetIndexById(consultants, myObj.consultant.id);
      ////console.log(indexSelected)

      consultantForm = fb.group(
        {
          consultantControl: [indexSelected]
        }
      );
    }
    ////////////console.log("selectConsultant:END")
    return consultantForm;
  }

  //////////////////////////////////////////////////////////

}
