import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EsnService } from 'src/app/service/esn.service';
import { PermissionService } from 'src/app/service/permission.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { DataSharingService } from "../../service/data-sharing.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends MereComponent {

  // userConnected: Consultant 
  title = 'Esn360';
  dirImg = "assets/images/"
  menuImg = this.dirImg + "menu.png";

  constructor(public dataSharingService: DataSharingService, public utils: UtilsService,
    private router: Router
    , private esnService: EsnService
    , private permissionService: PermissionService
    , private utilsIhm : UtilsIhmService
  ) {
    super(utils, dataSharingService);
    this.userConnected = dataSharingService.userConnected
  }

  ngOnInit() {

    // this.userConnected = this.dataSharingService.userConnected

    // this.dataSharingService.isUserLoggedInFct.subscribe(value => {
    //   this.isUserLoggedIn = value;
    //   if(this.isUserLoggedIn) {
    //     this.isUserAdmin = this.userConnected?.admin;
    //     this.userConnected = this.dataSharingService.userConnected
    //   }else {
    //     this.isUserAdmin = false;
    //   }
    // });

    super.ngOnInit()

    console.log("**** menu isUserLoggedIn=", this.isUserLoggedIn)

  }

  getActivityName() {

    return this.isConsultant() ? "Absences" : "Activity";

  }

  addEsnDemo() {

    let mythis = this;
    mythis.utilsIhm.confirmYesNo("Voulez vous vraiment ajouter une Esn Demo", mythis
      , function () {
        ////////////////////
        let label = "addEsnDemo"
        mythis.beforeCallServer(label);
        mythis.esnService.addEsnDemo().subscribe(
          data => {
            mythis.afterCallServer(label, data)
            console.log(JSON.stringify(data))
    
            if (!mythis.isError()) {
              // mythis.addInfo("l'Esn Demo a bien ete ajoutee", false)
              mythis.utilsIhm.infoDialog("L'Esn Demo a bien été ajoutée", null);
            }
            mythis.router.navigate(["/esn_app"]);
    
          }, error => {
            mythis.afterCallServer(label, error);
            mythis.addErrorFromErrorOfServer(label, error);
            ////console.log(error);
            // this.addError(error)
          }
        );
        ////////////////
      }
      , null
    );

  }

  setDefaultPermissions() {
    this.beforeCallServer("setDefaultPermissions");
    this.permissionService.addDefaultPermissionsOnFeaturesToRoles().subscribe(
      data => {
        this.afterCallServer("setDefaultPermissions", data)
        // this.addInfo(JSON.stringify(data))
        this.router.navigate(["/permission"]);
      }, error => {
        this.addErrorFromErrorOfServer("setDefaultPermissions", error);
        ////console.log(error);
        // this.addError(error)
      }
    );
  }


}
