import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {Project} from '../../../model/project';
import { ProjetFormComponent } from '../projet-form/projet-form.component';
import {ProjetService} from '../../../service/projet.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
  selector: 'app-projet-list',
  templateUrl: './projet-list.component.html',
  styleUrls: ['./projet-list.component.css']
})
export class ProjetListComponent extends MereComponent {

  title: string;

  myList: Project[];
  myObj: Project;
  @ViewChild('myObjEditView', {static:false}) myObjEditView:ProjetFormComponent ;

  constructor(private projetService: ProjetService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , protected dataSharingService: DataSharingService) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.findAll();
  }

  getTitle() {
    let nbElement = 0
    if(this.myList != null) nbElement = this.myList.length
    let t = this.title = this.utils.tr("List") + " " + this.utils.tr("Project") ; + " (" + nbElement + ")"
    return t
  }

  getIdOfCurentObj() {
      return this.myObj != null ? this.myObj.id : -1;
  }
  showForm(myObj: Project) {
      this.myObj = myObj;
      if(this.myObjEditView != null) {
              this.myObjEditView.myObj = this.myObj
              this.myObjEditView.isAdd = 'false';
              this.myObjEditView.ngOnInit()
      }
  }


  findAll() {
    this.beforeCallServer("findAll")
    this.projetService.findAll().subscribe(
      data => {
        this.afterCallServer("findAll", data)
        this.myList = data.body.result;
        this.myList00 = this.myList;
        ////console.log(data);
      }, error => {
        this.addErrorFromErrorOfServer("findAll", error);
        ////console.log(error);
      }
    );
  }

  setMyList(myList : any[]) {
		this.myList = myList;
	}

  edit(projet: Project) {
    this.clearInfos();
    this.projetService.setProjet(projet);
    this.router.navigate(['/projet_form']);
  }

  delete(myObj) {
    let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
		, ()=> {
      mythis.beforeCallServer("delete")
      mythis.projetService.deleteById(myObj.id)
        .subscribe(
          data => {
            mythis.afterCallServer("delete", data)
            if(!mythis.isError()) {
              mythis.findAll();
              mythis.myObj = null;
            }
          }, error => {
            mythis.addErrorFromErrorOfServer("delete", error);
            ////console.log(error);
          }
        );
		}
		, null 
		);

  }
}
