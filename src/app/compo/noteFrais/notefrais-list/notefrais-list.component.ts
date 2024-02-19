import { Component, ComponentFactoryResolver, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NoteFrais } from '../../../model/noteFrais';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../service/utils.service';
import { NoteFraisService } from '../../../service/note-frais.service';
import { NotefraisFormComponent } from '../notefrais-form/notefrais-form.component';
import { Consultant } from "../../../model/consultant";
import { DataSharingService } from "../../../service/data-sharing.service";
import { ConsultantService } from "../../../service/consultant.service";
import { MereComponent } from '../../_utils/mere-component';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from 'src/app/model/notification';
import { DashboardService } from 'src/app/service/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notefrais-list',
  templateUrl: './notefrais-list.component.html',
  styleUrls: ['./notefrais-list.component.css']
})
export class NotefraisListComponent extends MereComponent {

  title: string = 'List Note Frais'
  consultants: Consultant[];
  myList: NoteFrais[];
  myObj: NoteFrais = null;
  userConnected: Consultant = DataSharingService.userConnected
  filterConsultant: number = 0;
  filtredNoteFrais: NoteFrais[];

  @ViewChild('myObjEditView', { static: false }) myObjEditView: NotefraisFormComponent;
  @ViewChild('dateView', { static: true }) dateView: TemplateRef<any>;
  feeForPayement: NoteFrais= new NoteFrais();

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  showForm(myObj: NoteFrais) {
    this.myObj = new NoteFrais();
    this.myObj = myObj;
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = this.myObj
      this.myObjEditView.isAdd = 'false';
      this.myObjEditView.ngOnInit();
    }
  }

  constructor(private noteFraisService: NoteFraisService
    , private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , protected dataSharingService: DataSharingService
    , private consultantService: ConsultantService
    , private modal: NgbModal
    , private dashboardService: DashboardService
    , private SpinnerService: NgxSpinnerService) {
    super(utils, dataSharingService);
    // console.log("here 2");
    // this.loadingComponenet = true;
  }

  ngOnInit(): void {
    this.getConsultants();
    this.findAll();
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

  findAll() {
    this.SpinnerService.show(); 
    if (this.userConnected.admin) {
      this.beforeCallServer("findAll")
      this.noteFraisService.findAll().subscribe(
        data => {
          this.afterCallServer("findAll", data)
          this.myList = data.body.result;
          this.myList = this.myList.filter(lf => lf.consultant.adminConsultantUsername == this.userConnected.username);
          this.myList00 = this.myList;
          this.loadingComponenet = false;
        }, error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    } else {
      this.beforeCallServer("findAll")
      this.noteFraisService.findAllByConsultant(this.userConnected.id).subscribe(
        data => {
          this.afterCallServer("findAll", data)
          this.myList = data.body.result;
          this.loadingComponenet = false; 
        }, error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    }

  }

  onSelectConsultant(consultant: Consultant) {
    //this.myObj.consultant = consultant;
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
    this.noteFraisService.findAllByConsultant(this.filterConsultant).subscribe(
      data => {
        this.afterCallServer("getFilteredConsultant", data)
        this.filtredNoteFrais = data.body.result;
      }, error => {
        this.addErrorFromErrorOfServer("getFilteredConsultant", error);
      }
    );
  }

  edit(noteFrais: NoteFrais) {
    this.clearInfos();
    this.noteFraisService.setNoteFrais(noteFrais);
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
    let currentUser = DataSharingService.userConnected;

    let notification : Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.currentFee = this.feeForPayement;

    notification.fromUsername = currentUser.username;
    notification.toUsername = this.feeForPayement.consultant.username;
    this.beforeCallServer("sendNotification")
    this.dashboardService.addNotificationServer(notification).subscribe((data) => {
      this.afterCallServer("sendNotification", data)
      let result = data.body.result;
      this.dashboardService.getNotifications();
      
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
