import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Esn } from 'src/app/model/esn';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { ActivityType } from '../../../model/activityType';
import { ActivityTypeService } from '../../../service/activityType.service';
import { MereComponent } from '../../_utils/mere-component';
import { ActivityTypeFormComponent } from '../activityType-form/activityType-form.component';


@Component({
  selector: 'app-activityType-list',
  templateUrl: './activityType-list.component.html',
  styleUrls: ['./activityType-list.component.css']
})
export class ActivityTypeListComponent extends MereComponent {

  title: string;

  myList: ActivityType[];
  myObj: ActivityType;
  @ViewChild('activityTypeDetail', {static: false}) activityTypeDetail: ActivityTypeFormComponent;

  esnList: Esn[] = []
  esnCurrent: Esn = null

  constructor(private activityTypeService: ActivityTypeService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService
    , private esnService: EsnService
    ) {
    super(utils, dataSharingService);

    this.colsSearch = ["name", "workDay", "billDay", "congeDay", "formaDay", "esn"]

  }

  ngOnInit() {
    this.findAll();
    this.findAllEsn();
  }

  getTitle() {
    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    let t = this.utils.tr("ListActivitesType") + " (" + nbElement + ")"
    return t
  }

  findAll() {
    let label = "findAll"
    this.beforeCallServer(label);

    this.activityTypeService.findAll(this.getEsnId()).subscribe(
      data => {
        this.afterCallServer(label, data)
        this.myList = data.body.result;
        this.myList00 = this.myList;
        // this.filterByEsnCurrent();
      }, error => {
        this.addErrorFromErrorOfServer(label, error);
        //console.log(error);
      }
    );
  }
  filterByEsnCurrent() {
    let list = []
    this.myList = this.myList00;

    if(this.esnCurrent && this.myList) {
      for(let atp of this.myList) {
        if(atp.esn &&  atp.esn.id == this.esnCurrent.id) {
          list.push(atp)
        }
      }
      this.myList = list;
    }
  }

  setMyList(myList : any[]) {
		this.myList = myList;
	}

  findAllEsn() {
    let label = "findAllEsn";
		this.beforeCallServer(label)
		this.esnService.findAll().subscribe(
			data => {
				this.afterCallServer(label, data)
				this.esnList = data.body.result;
			}, error => {
	      this.addErrorFromErrorOfServer(label, error);
			 	////console.log(error);
		 	}
		 );
	}

  onSelectEsn(esn: Esn) {
    this.esnCurrent = esn;
    this.filterByEsnCurrent();
  }

  edit(activityType: ActivityType) {
    this.clearInfos();
    this.activityTypeService.setActivityType(activityType);
    this.router.navigate(['/activityType_form']);
  }

	delete(myObj) {
    let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, this
			, ()=> {
        mythis.beforeCallServer("delete")
        mythis.activityTypeService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
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

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  showForm(activityType: ActivityType) {
    ////////////console.log("showForm:", activityType)
    this.myObj = activityType;
    if (this.activityTypeDetail != null) {
      this.activityTypeDetail.myObj = this.myObj
      this.activityTypeDetail.isAdd = 'false';
      this.activityTypeDetail.ngOnInit()
    }
  }
}
