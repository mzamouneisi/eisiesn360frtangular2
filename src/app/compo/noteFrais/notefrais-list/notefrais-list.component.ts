import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Notification } from 'src/app/model/notification';
import { ActivityService } from 'src/app/service/activity.service';
import { CategoryService } from 'src/app/service/category.service';
import { PayementModeService } from 'src/app/service/payement-mode.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Consultant } from "../../../model/consultant";
import { NoteFrais } from '../../../model/noteFrais';
import { ConsultantService } from "../../../service/consultant.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { NoteFraisService } from '../../../service/note-frais.service';
import { UtilsService } from '../../../service/utils.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { NotefraisFormComponent } from '../notefrais-form/notefrais-form.component';

@Component({
  selector: 'app-notefrais-list',
  templateUrl: './notefrais-list.component.html',
  styleUrls: ['./notefrais-list.component.css']
})
export class NotefraisListComponent extends MereComponent {

  consultants: Consultant[];
  consultantSelected : Consultant = this.userConnected;

  myList: NoteFrais[];
  myObj: NoteFrais = null;
  filterConsultant: number = 0;
  filtredNoteFrais: NoteFrais[];

  @ViewChild('myObjEditView', { static: false }) myObjEditView: NotefraisFormComponent;
  @ViewChild('dateView', { static: true }) dateView: TemplateRef<any>;
  feeForPayement: NoteFrais= new NoteFrais();

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  constructor(private noteFraisService: NoteFraisService
    , private router: Router
    , private route: ActivatedRoute
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService
    , private consultantService: ConsultantService
    , private categoryService : CategoryService
    , private activityService : ActivityService
    , private payModeService : PayementModeService
    , private modal: NgbModal
    , private SpinnerService: NgxSpinnerService) {
    super(utils, dataSharingService);
    // console.log("here 2");
    // this.loadingComponenet = true;

    this.colsSearch = ["title", "date", "category", "brand_name", "vat", "pretax_amount", "amount"]
  }

  ngOnInit(): void {
    super.ngOnInit()

    let consultantStr = this.route.snapshot.queryParamMap.get('consultantSelected');
    if(consultantStr) {
      this.consultantSelected = JSON.parse(consultantStr);
    }

    setTimeout(
      () => {
        this.getConsultants();
        this.findAll();
      }, 1000
    )
  }

  getConsultants() {
    this.beforeCallServer("getConsultants")
    this.consultantService.findAll().subscribe(
      data => {
        this.afterCallServer("getConsultants", data)
        this.consultants = data.body.result;
        if (data == undefined) {
          this.consultants = new Array();
        }
      }, error => {
        this.addErrorFromErrorOfServer("getConsultants", error);
      }
    );
  }

  isAdmin(): boolean {
    return this.userConnected.admin;
  }

  isConsultant(): boolean {
    if (this.userConnected.admin) {
      return false;
    } else {
      return true;
    }
  }

  getTitle() {
    let nbElement = 0
    if (this.myList != null) { nbElement = this.myList.length; }
    let t = this.utils.tr("List") + " " + this.utils.tr("Frais") + " (" + nbElement + ")"
    return t;
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  afterLoadAll(data : any ) {

    this.afterCallServer("findAll", data)
    this.myList = data.body.result;
    this.majCategories()
    this.majPayModes()
    this.majConsultants()
    this.majActivities()

    this.majMyList();
  }

  findAll() {
    this.SpinnerService.show(); 
    if (! this.consultantSelected) {
      this.beforeCallServer("findAll")
      this.noteFraisService.findAll().subscribe(
        data => {
          this.afterLoadAll(data)
          this.loadingComponenet = false;
        }, error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    } else {
      this.beforeCallServer("findAll")
      this.noteFraisService.findAllByConsultant(this.consultantSelected.id).subscribe(
        data => {
          this.afterLoadAll(data)
          this.loadingComponenet = false; 
        }, error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    }

  }

  private majMyList() {
    for (let lf of this.myList) {
      if (!lf.consultant) lf.consultant = this.consultantSelected;
      this.dataSharingService.adminConsultant[lf.consultant.id] == this.consultantSelected;
    }
    this.myList00 = this.myList;
  }

  majCategories() {
    for(let nf of this.myList) {
      if(nf.category == null) {
        this.categoryService.findById(nf.categoryId).subscribe(
          data => {
            nf.category = data.body.result
            // console.log("*** cat : " , nf.category)
          }
        )
      }
    }
  }

  majPayModes() {
    for(let nf of this.myList) {
      if(nf.payementMode == null) {
        this.payModeService.findById(nf.payementModeId).subscribe(
          data => {
            nf.payementMode = data.body.result
          }
        )
      }
    }
  }

  majActivities() {
    for(let nf of this.myList) {
      if(nf.activity == null) {
        this.activityService.findById(nf.activityId).subscribe(
          data => {
            nf.activity = data.body.result
            if(!nf.activity.consultant) nf.activity.consultant = this.consultantSelected
          }
        )
      }
    }
  }

  majConsultants() {
    for(let nf of this.myList) {
      if(nf.consultant == null) {
        this.consultantService.findById(nf.consultantId).subscribe(
          data => {
            nf.consultant = data.body.result
          }
        )
      }
    }
  }

  onSelectConsultant(consultant: Consultant) {
    this.consultantSelected = consultant;

    if(this.myObj) {
      this.myObj.consultant = consultant;
    }
    if (!consultant) {
      this.filterConsultant = -1;
      this.findAll();
    } else {
      this.beforeCallServer("onSelectConsultant")
      this.filterConsultant = consultant.id;
      this.noteFraisService.findAllByConsultant(consultant.id).subscribe(
        data => {
          this.afterCallServer("onSelectConsultant", data)
          this.myList = data.body.result;

          this.majMyList();

        }, error => {
          this.addErrorFromErrorOfServer("onSelectConsultant", error);
        }
      );
    }
  }

  @ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;
  selectConsultant(consultant: Consultant) {
    this.compoSelectConsultant.selectedObj = consultant;
  }

  getFilteredConsultant() {
    this.beforeCallServer("getFilteredConsultant")
    this.filterConsultant = this.consultantSelected ? this.consultantSelected.id : -1 ;
    this.noteFraisService.findAllByConsultant(this.filterConsultant).subscribe(
      data => {
        this.afterCallServer("getFilteredConsultant", data)
        this.filtredNoteFrais = data.body.result;
      }, error => {
        this.addErrorFromErrorOfServer("getFilteredConsultant", error);
      }
    );
  }

  addNew() {
    this.router.navigate(['/notefrais_form'], {
      queryParams: {
        isAdd: true,
        consultantSelected: JSON.stringify(this.consultantSelected)
      }
    });
  }

  showForm(noteFrais: NoteFrais) {
    // this.myObj = new NoteFrais();
    this.myObj = noteFrais
    this.myObj.textFilePdf = noteFrais.description

    console.log("*** edit noteFrais: ", noteFrais)

    this.noteFraisService.setNoteFrais(this.myObj);
    
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = this.myObj
      this.myObjEditView.isAdd = 'false';
      this.myObjEditView.ngOnInit();
    }
  }

  edit(noteFrais: NoteFrais) {
    this.clearInfos();
    this.myObj = noteFrais
    this.myObj.textFilePdf = noteFrais.description

    console.log("*** edit noteFrais: ", noteFrais)

    this.noteFraisService.setNoteFrais(this.myObj);
    this.router.navigate(['/notefrais_form']);
  }

  delete(myObj) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete")
        mythis.noteFraisService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
                this.myList = this.myList.filter(f => f.id != myObj.id);
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

  downloadAttachment(noteFrais: NoteFrais) {
    const linkSource = noteFrais.invoice_file.toString();
    let typeFile = linkSource.split('/', 2)[0];
    const downloadLink = document.createElement('a');
    let fileName = '';
    if (typeFile == 'data:image') {
      fileName = 'NoteFrais' + noteFrais.id + '.png';
    } else {
      fileName = 'NoteFrais' + noteFrais.id + '.pdf';
    }
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  acceptNoteFrais(noteFrais: NoteFrais) {
    noteFrais.state = "Accepted";
    this.beforeCallServer("acceptNoteFrais")
    this.noteFraisService.save(noteFrais).subscribe(
      data => {
        this.afterCallServer("acceptNoteFrais", data)
        if (!this.isError()) {
          this.myList.find(f => f.id == noteFrais.id).state = "Accepted";
        }
      },
      error => {
        this.addErrorFromErrorOfServer("acceptNoteFrais", error);
      }
    );
  }


  rejectNoteFrais(noteFrais: NoteFrais) {
    noteFrais.state = "Rejected";
    this.beforeCallServer("rejectNoteFrais")
    this.noteFraisService.save(noteFrais).subscribe(
      data => {
        this.afterCallServer("rejectNoteFrais", data)
        if (!this.isError()) {
          this.myList.find(f => f.id == noteFrais.id).state = "Rejected";
        }
      },
      error => {
        this.addErrorFromErrorOfServer("rejectNoteFrais", error);
      }
    );
  }

  selectPayementDate(noteFrais: NoteFrais) {
    this.feeForPayement = noteFrais;
    this.modal.open(this.dateView, { size: 'lg' });
  }

  payNoteFrais() {
    this.feeForPayement.state = "Payed";
    this.beforeCallServer("payNoteFrais");
    this.noteFraisService.save(this.feeForPayement).subscribe(
      data => {
        this.afterCallServer("payNoteFrais", data)
        if (!this.isError()) {
          this.myList.find(f => f.id == this.feeForPayement.id).state = "Payed";
          this.myList.find(f => f.id == this.feeForPayement.id).pay_date = this.feeForPayement.pay_date;
          this.modal.dismissAll(this.dateView);
          this.sendNotification("Note de Frais Payé","Votre note de frais N° "+this.feeForPayement.id+" à été payé, un montant de "+this.feeForPayement.amount+" € vous sera remboursé"
          +" dans les prochains jours");
        }
      },
      error => {
        this.addErrorFromErrorOfServer("payNoteFrais", error);
      }
    );
  }

  sendNotification(title, message) {
    console.log("sendNotification this.feeForPayement=", this.feeForPayement)

    // let isManager = this.hasRoleManagerValidate();
    let currentUser = this.dataSharingService.userConnected;

    let notification : Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.noteFrais = this.feeForPayement;

    notification.fromUser = currentUser;
    notification.toUser = this.feeForPayement.activity.consultant;
    this.beforeCallServer("sendNotification")
    this.dataSharingService.addNotificationServer(notification).subscribe((data) => {
      this.afterCallServer("sendNotification", data)
      let result = data.body.result;
      this.dataSharingService.getNotifications(null, null);
      
    }, error => {
      this.addErrorFromErrorOfServer("sendNotification", error);
      
    })
  }

  isAccepted(noteFrais: NoteFrais): boolean {
    return noteFrais.state == 'Accepted';
  }

  isRejected(noteFrais: NoteFrais): boolean {
    return noteFrais.state == 'Rejected';
  }

  isWaiting(noteFrais: NoteFrais): boolean {
    return noteFrais.state == 'Waiting';
  }

  isPayed(noteFrais: NoteFrais): boolean {
    return noteFrais.state == 'Payed';
  }

  onSelectPayementDate(date: any){
    let d = new Date(date).toISOString();
    this.feeForPayement.pay_date = this.formatDate(d);
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

}
