import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions } from "mydatepicker";
import { MyError } from 'src/app/resource/MyError';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Constants } from "../../../model/constants/constants";
import { Consultant } from '../../../model/consultant';
import { Esn } from '../../../model/esn';
import { ConsultantService } from '../../../service/consultant.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-consultant-form',
  templateUrl: './consultant-form.component.html',
  styleUrls: ['./consultant-form.component.css']
})
export class ConsultantFormComponent extends MereComponent {

  title: string;
  btnSaveTitle:string;
  isAdd: string;

  @Input()
  myObj: Consultant;
  error: MyError;

  myDatePickerOptions: IMyDpOptions = UtilsService.myDatePickerOptions;

  esn: Esn; // v'est l'esn de son manager : sinon null
  roles: string[];
  esns: Esn[];

  // filter by manager
  manager: Consultant = null;
  emailPattern: string = UtilsService.EMAIL_PATTERN;
  telPattern: string =   UtilsService.TEL_PATTERN;
  confirmPassword:string;
  infoResetPassword:string;
  role: string;
  esnIdStr: string;
  esnId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router
    , private consultantService: ConsultantService
    , private esnService: EsnService
    , public utils: UtilsService
    , protected dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    // le userCoonected est le manager du user manipulé
    this.manager = DataSharingService.userConnected;

    this.loadRoles();
    this.loadEsns();
    this.initByConsultant();
    //console.log('myObj', this.myObj)
  }

  initParams() {

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.role == null) {
      this.role = this.route.snapshot.queryParamMap.get('role');
    }

    if (this.esnIdStr == null) {
      this.esnIdStr = this.route.snapshot.queryParamMap.get('esnIdStr');
      if(this.esnIdStr) {
        this.esnId = Number.parseInt(this.esnIdStr);
      }
    }    

  }

  setTitle() {
    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.utils.tr("New") + " " + this.typeUser() ;
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.utils.tr("Edit") + " " + this.typeUser();
    }
  }

  initByConsultant() {

    this.initParams();

    this.setTitle();

    if (this.isAdd == 'true') {
      this.myObj = new Consultant();
      //par defaut active
      this.myObj.active = true;

      this.setEsn();
    } else {
      let consultantP: Consultant = this.consultantService.getConsultant();

      if (consultantP != null) {
        this.myObj = consultantP;
      }
      else if (this.myObj == null) this.myObj = new Consultant();
    }
  }
  
  typeUser() {
    if(this.myObj && this.myObj.role) return this.myObj.role;
    else return this.utils.tr("User")
  }

  setEsn() {
    
    if(this.role == "resp"){
      this.myObj.role = Constants.RESPONSIBLE_ESN;
    }

    if(this.myObj.role != Constants.RESPONSIBLE_ESN) {
      this.myObj.esn = this.myObj.adminConsultant?.esn;
    }else {
      if(this.esnId > 0) {
        this.findEsnById(this.esnId)
      }else {
        this.onSelectEsn(this.myObj.esn);
      }
    }

    this.setTitle();

  }

  findEsnById(esnId: number) {
    let label = "find esn by id="+esnId;
    this.esnService.findById(esnId).subscribe(
      data => {
        this.afterCallServer(label, data)
        if (!this.isError()) {
          this.myObj.esn = data.body.result;
          this.onSelectEsn(this.myObj.esn);
        }
      },
      error => {
        this.addErrorFromErrorOfServer(label, error);
      }
    );
  }

  onSelectEsn(esn: Esn) {

    if(esn) {
     this.myObj.esn = esn;
     this.myObj.email = esn.responsableUsername;
     this.myObj.username = this.myObj.email    
     this.selectEsn(esn)
    }

  }

  @ViewChild('compoSelectEsn', {static:false}) compoSelectEsn:SelectComponent ;
  selectEsn(esn:Esn){
    this.myObj.esn = esn;
    if(this.compoSelectEsn != null) {
      this.compoSelectEsn.selectedObj = esn;
      if(esn != null) {
        this.compoSelectEsn.onChange00(esn.id);
      }
    }
    
  } 
  
  public onSelectRole(role: string) {
    //////////console.log("onSelectRole:", this, this.myObj)
    this.myObj.role = role;
    this.myObj.admin = (this.myObj.role == Constants.MANAGER || this.myObj.role == Constants.RESPONSIBLE_ESN);
    this.setTitle()
  }

  @ViewChild('compoSelectRole', {static:false}) compoSelectRole:SelectComponent ;
  selectRole(role:string){

    var compoSelect: HTMLSelectElement = document.getElementById(this.compoSelectRole.selectId) as HTMLSelectElement;
      // console.log("selectRole compoSelect:", compoSelect)

      this.compoSelectRole.selectedObj = role;
      var id = this.roles != null ? this.roles.indexOf(role) : -1

      // id = 0 : est "Select Role"
      compoSelect.selectedIndex = id+1;
  }  

  resetPassword() {
    this.myObj.password = '$2a$10$E.LSKuP6fRizN7PZWaG0UOx7c4Md7qVXc8qNOKYlRxmc442kijNqG';  //Eisi2020
    this.infoResetPassword = 'Password is rested.';
  }

  onSubmit() {
    this.myObj.username = this.myObj.email;
    this.myObj.adminConsultantUsername = this.manager.username;
    this.setEsn();
    console.log("onSubmit obj", this.myObj);
    let label = "onSubmit"
    this.beforeCallServer(label);
    this.consultantService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer(label, data)

        if (!this.isError()) {
          this.gotoConsultantList()
        }
      },
      error => {
        this.addErrorFromErrorOfServer(label, error);

      }
    );
  }


  gotoConsultantList() {
    this.clearInfos();
    this.router.navigate(['/consultant_list']);
  }

  /***
   * This method aims to load all roles form back end side
   */
  private loadRoles() {

    if(this.roles == null ) {

      let label = "loadRoles";
      this.beforeCallServer(label);
      this.consultantService.getRoles().subscribe(data => {
        this.afterCallServer(label, data)
        if (data == undefined) this.roles = new Array();
        else {
          this.roles = data.body.result;
        }
  
      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  private loadEsns() {

    if(this.esns == null) {

      let label = "loadEsns";
      this.beforeCallServer(label);
      this.esnService.findAll().subscribe(data => {
        this.afterCallServer(label, data)
        if (!data) this.esns = new Array();
        else {
          this.esns = data.body.result;
  
          this.esns.sort(this.compareEsnLast);
        }
  
      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  compareEsnLast( a:Esn, b:Esn ) {
    if ( a.id > b.id ){
      return -1;
    }
    if ( a.id < b.id ){
      return 1;
    }
    return 0;
  }

  //////////////end meths

}
