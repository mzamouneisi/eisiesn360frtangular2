import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions } from "mydatepicker";
import { Address } from 'src/app/model/address';
import { MyError } from 'src/app/resource/MyError';
import { EsnService } from 'src/app/service/esn.service';
import { MsgService } from 'src/app/service/msg.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
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
  btnSaveTitle: string;
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
  telPattern: string = UtilsService.TEL_PATTERN;
  confirmPassword: string;
  infoResetPassword: string;
  role: string;
  esnIdStr: string;
  esnId: number = 0;
  consultants: Consultant[];
  esnSavedName = ""

  constructor(private route: ActivatedRoute, private router: Router
    , private consultantService: ConsultantService
    , private esnService: EsnService
    , public utils: UtilsService
    , public utilsIhmService: UtilsIhmService
    , public dataSharingService: DataSharingService
    , private msgService: MsgService
  ) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    // le userCoonected est le manager du user manipul�
    this.manager = this.dataSharingService.userConnected;

    if (!this.dataSharingService.IsAddEsnAndResp) {
      this.loadRoles();
      this.loadEsns();
    }

    this.initByConsultant();
    //console.log('myObj', this.myObj)
  }

  initParams() {

    if (this.dataSharingService.IsAddEsnAndResp) {
      this.isAdd = "true"
    }

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.role == null) {
      this.role = this.route.snapshot.queryParamMap.get('role');
    }

    if (this.esnIdStr == null) {
      this.esnIdStr = this.route.snapshot.queryParamMap.get('esnIdStr');
      if (this.esnIdStr) {
        this.esnId = Number.parseInt(this.esnIdStr);
        // if(this.myObj != null) {
        //   this.myObj.idEsn = this.esnId 
        //   this.dataSharingService.addEsnInConsultant(this.myObj)
        // }
      }
    }

  }

  setTitle() {
    if (this.isAdd == 'true' || !this.myObj || !this.myObj.id) {
      this.isAdd = 'true'
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.utils.tr("New") + " " + this.typeUser();
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
      this.myObj.active = false 
      if(this.userConnected) {
        this.myObj.active = true;
      }

      this.myObj.address = new Address()

      if (this.dataSharingService.IsAddEsnAndResp) {
        this.myObj.role = Constants.RESPONSIBLE_ESN
      }

      this.setEsn();

    } else {
      let consultantP: Consultant = this.consultantService.getConsultant();

      if (consultantP != null) {
        this.myObj = consultantP;
      }
      else if (this.myObj == null) this.myObj = new Consultant();

    }

    if (this.myObj.address == null) {
      this.myObj.address = new Address();
    }

    this.majAdminConsultant();

  }

  majAdminConsultant() {
    this.consultantService.majAdminConsultant(this.myObj)
  }

  typeUser() {
    if (this.myObj && this.myObj.role) return this.myObj.role;
    else return this.utils.tr("User")
  }

  ////////////////////////////////////////
  getConsultants() {

    this.beforeCallServer("getConsultants");
    this.consultantService.findNotAdminConsultant().subscribe(
      data => {
        this.afterCallServer("getConsultants", data)
        if (data == undefined) {
          this.consultants = new Array();
        } else {
          this.consultants = data.body.result;
          // this.dataSharingService.addEsnInConsultantList(this.consultants)
        }

      }, error => {
        this.addErrorFromErrorOfServer("getConsultants", error);
      }
    );
  }

  onSelectConsultant(consultant: Consultant) {
    this.dataSharingService.adminConsultant[this.myObj.id] = consultant;
  }
  @ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;
  selectConsultant(consultant: Consultant) {
    this.compoSelectConsultant.selectedObj = consultant;
  }
  /////////////////////////////////////////


  setEsn() {

    if (this.role == "resp") {
      this.myObj.role = Constants.RESPONSIBLE_ESN;
    }

    if (this.myObj.role != Constants.RESPONSIBLE_ESN) {
      this.myObj.esn = this.userConnected.esn;
      this.myObj.esnId = this.userConnected.esnId;

      if (!this.myObj.esn) {
        this.myObj.esn = this.esnCurrent
        this.myObj.esnId = this.esnCurrent?.id
      }

      console.log("setEsn this.myObj.esn  : ", this.myObj.esn)
    } else {
      if (this.esnId > 0) {
        this.findEsnById(this.esnId)
      } else {
        this.onSelectEsn(this.myObj.esn);
      }
    }

    this.setTitle();

  }

  findEsnById(esnId: number) {
    let label = "find esn by id=" + esnId;
    this.esnService.findById(esnId).subscribe(
      data => {
        this.afterCallServer(label, data)
        if (!this.isError()) {
          this.myObj.esn = data.body.result;
          // this.myObj.idEsn = this.myObj.esn != null ? this.myObj.esn.id : -1;
          this.onSelectEsn(this.myObj.esn);
        }
      },
      error => {
        this.addErrorFromErrorOfServer(label, error);
      }
    );
  }

  onSelectEsn(esn: Esn) {

    if (esn) {
      this.myObj.esn = esn;
      this.myObj.username = this.myObj.email
      this.selectEsn(esn)
    } else {
      if (this.dataSharingService.IsAddEsnAndResp) {
        this.myObj.esn = this.dataSharingService.esnSaved;
        this.myObj.username = this.myObj.email
      }
    }

  }

  refreshEsnSaved() {
    if (this.dataSharingService.esnSaved) {
      this.myObj.esn = this.dataSharingService.esnSaved;
      this.esnSavedName = this.dataSharingService.esnSaved.name
    }
  }

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  gotoFirstName() {
    setTimeout(() => {
      this.firstNameInput.nativeElement.focus();
    }, 300);
  }


  @ViewChild('compoSelectEsn', { static: false }) compoSelectEsn: SelectComponent;
  selectEsn(esn: Esn) {
    this.myObj.esn = esn;
    // this.myObj.idEsn = this.myObj.esn != null ? this.myObj.esn.id : -1;
    if (this.compoSelectEsn != null) {
      this.compoSelectEsn.selectedObj = esn;
      if (esn != null) {
        this.compoSelectEsn.onChange00(esn.id);
      }
    }

  }

  public onSelectRole(role: string) {
    //////////console.log("onSelectRole:", this, this.myObj)
    this.myObj.role = role;
    this.myObj.admin = (this.myObj.role == Constants.MANAGER || this.myObj.role == Constants.RESPONSIBLE_ESN);
    if (this.myObj.role == Constants.MANAGER || this.myObj.role == Constants.CONSULTANT) {
      this.myObj.adminConsultant = this.manager
      this.myObj.adminConsultantId = this.manager?.id
    }
    this.setTitle()
  }

  @ViewChild('compoSelectRole', { static: false }) compoSelectRole: SelectComponent;
  selectRole(role: string) {

    var compoSelect: HTMLSelectElement = document.getElementById(this.compoSelectRole.selectId) as HTMLSelectElement;
    // console.log("selectRole compoSelect:", compoSelect)

    this.compoSelectRole.selectedObj = role;
    var id = this.roles != null ? this.roles.indexOf(role) : -1

    // id = 0 : est "Select Role"
    compoSelect.selectedIndex = id + 1;
  }

  resetPassword() {
    this.myObj.password = '$2a$10$E.LSKuP6fRizN7PZWaG0UOx7c4Md7qVXc8qNOKYlRxmc442kijNqG';  //Eisi2020
    this.infoResetPassword = 'Password is rested.';
  }

  onSubmit() {
    console.log("onSubmit : deb ")
    console.log("this.myObj.email ", this.myObj.email)
    console.log("this.myObj.username ", this.myObj.username)

    if (!this.myObj.username || !this.myObj.email) {
      this.utilsIhmService.infoDialog('email or username is null !!')
      return
    }

    this.myObj.username = this.myObj.email
    let pass = this.myObj.password
    this.dataSharingService.passRespEsnSaved = pass

    //todo check if email exist : a la saisie . invalider le form si exist via une variable isEmailExist.
    // todo : confirmer avec le user son email en lui rappelant : prenom, nom, soc 

    console.log("this.manager.role:", '.' + this.manager?.role + '.')
    console.log("this.myObj.adminConsultant : start ", this.myObj.adminConsultant)
    if (this.userConnected && this.userConnected.role + '' != 'ADMIN') {
      console.log('NOT ADMIN')
      this.dataSharingService.majAdminConsultantId(this.myObj, this.manager);

    }
    this.setEsn();
    console.log("onSubmit obj", this.myObj);
    let label = "onSubmit"
    this.beforeCallServer(label);
    console.log("this.myObj.adminConsultant : before save ", this.myObj.adminConsultant)
    this.consultantService.save(this.myObj, this.dataSharingService.IsAddEsnAndResp).subscribe(
      data => {
        this.afterCallServer(label, data)

        this.myObj = data.body.result

        console.log("after save this.myObj : ", this.myObj)
        console.log("this.myObj.adminConsultant : after save ", this.myObj.adminConsultant)

        if (this.dataSharingService.IsAddEsnAndResp) {
          this.dataSharingService.respEsnSaved = this.myObj
          console.log("after save respEsnSaved : ", this.dataSharingService.respEsnSaved)

          this.gotoFirstName()

          let esnSavedName = this.dataSharingService.esnSaved.name
          let respEsnSavedName = this.dataSharingService.respEsnSaved.fullName

          let msg = `Votre ESN "${esnSavedName}" et son Responsable "${respEsnSavedName}" ont été ajoutés :
          Voulez vous confirmer ? `;

          let label2 = "sendMail"
          this.utilsIhmService.confirmDialog(msg,
            () => {
              this.dataSharingService.sendMailToValidEmailInscription(
                (data2, to) => {
                  this.afterCallServer(label2, data2)
                  console.log(label2 + " isError : ", this.isError())
                  if (!this.isError()) {
                    this.utilsIhmService.infoDialog("Un email a bien été envoyé à " + to,
                      () => {
                        setTimeout(() => {
                          this.navigateTo("")
                        }, 100);
                      }
                    )
                  } else {
                    console.log(label2 + " Error : ", this.error)
                  }
                },
                (error) => {
                  this.addErrorFromErrorOfServer(label2, error);
                  this.utilsIhmService.infoDialog(label2 + " Erreur envoie email : " + JSON.stringify(error))
                }
              )
            }, () => {
              console.log("sendMailSimple " + " annuler tout en supprimant les deux objs. ")
              // annuler tout en supprimant les deux objs.
            }
          )



        } else {
          this.gotoConsultantList()
        }

      },
      error => {
        this.addErrorFromErrorOfServer(label, error);

      }
    );
  }


  gotoConsultantList() {
    console.log("gotoConsultantList")
    this.clearInfos();
    this.router.navigate(['/consultant_list']);
  }

  /***
   * This method aims to load all roles form back end side
   */
  private loadRoles() {

    if (this.roles == null) {

      let label = "loadRoles";
      this.beforeCallServer(label);
      this.consultantService.getRoles(this.dataSharingService.IsAddEsnAndResp).subscribe(data => {
        this.afterCallServer(label, data)
        if (data == undefined) this.roles = new Array();
        else {
          this.roles = data.body.result;
        }

        console.log("*** roles : ", this.roles)

      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  private loadEsns() {

    if (this.esns == null) {

      let label = "loadEsns";
      this.beforeCallServer(label);
      this.esnService.findAll().subscribe(data => {
        this.afterCallServer(label, data)
        if (!data) this.esns = new Array();
        else {
          this.esns = data.body.result;

          this.esns.sort(this.compareEsnLast);

          if (this.manager) {
            if (!this.manager.esn && this.manager.esnId) {
              for (let e of this.esns) {
                if (e.id == this.manager.esnId) {
                  this.manager.esn = e
                  if (!this.esnCurrent) {
                    this.esnCurrent = e
                  }
                  break;
                }
              }
            }
          }
        }

      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  compareEsnLast(a: Esn, b: Esn) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  emailFocus() {
    this.setEsn();
    console.log("emailFocus", this.myObj)
    console.log("emailFocus Email : ", this.myObj.email)
    if (!this.myObj.esn) {
      this.myObj.esn = this.esnCurrent
    }
    if (!this.myObj.esn) {
      this.myObj.esn = this.manager?.esn
    }

    let domaine = ""
    // du manager : 
    let emailManagar = this.manager?.email
    if (emailManagar) {
      const parts = emailManagar.split('@');
      if (parts.length > 1) {
        domaine = parts[1];
      }
    } else {
      domaine = (this.myObj.esn?.name + ".com").toLowerCase().replace(" ", "-");
    }
    console.log("emailFocus Esn : ", this.myObj.esn)
    if (this.utils.isEmpty(this.myObj.email)) {
      console.log("email NULL")
      if (!this.utils.isEmpty(this.myObj.firstName) && !this.utils.isEmpty(this.myObj.lastName) && !this.utils.isEmpty(this.myObj.esn?.name)) {
        this.myObj.email = (this.myObj.firstName + "." + this.myObj.lastName + "@" + domaine).toLowerCase();
        this.myObj.username = this.myObj.email
      }
    }
  }

  emailChange() {
    this.myObj.username = this.myObj.email
  }

  //////////////end meths

}
