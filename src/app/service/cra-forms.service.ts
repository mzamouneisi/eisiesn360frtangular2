import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Activity } from '../model/activity';
import { Consultant } from '../model/consultant';
import { Project } from '../model/project';

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

  selectProject(fb: FormBuilder, projects: Project[], myObj: Activity): FormGroup {
    ////////////console.log("selectProject:")
    let projectForm: FormGroup;
    if (myObj.project != undefined) {
      let indexSelected = this.getObjetIndexById(projects, myObj.project.id);
      ////console.log(indexSelected)
      projectForm = fb.group(
        {
          ["projectControl"]: [indexSelected]
        }
      );
    }
    ////////////console.log("selectProject:END")
    return projectForm;
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
