import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { EsnService } from 'src/app/service/esn.service';
import { PermissionService } from 'src/app/service/permission.service';
import { UtilsService } from 'src/app/service/utils.service';
import {DataSharingService} from "../../service/data-sharing.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends MereComponent {

  // userConnected: Consultant;
  userConnected: Consultant = DataSharingService.userConnected;
  title = 'Esn360';
  public isUserLoggedIn: boolean;
  public isUserAdmin: boolean;
  dirImg = "assets/images/"
  menuImg = this.dirImg + "menu.png";

  constructor(protected dataSharingService: DataSharingService, public utils: UtilsService,
    private router: Router
    , private esnService: EsnService
    , private permissionService: PermissionService
    ) { super(utils, dataSharingService); }

  ngOnInit() {

    this.userConnected = DataSharingService.userConnected;

    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      if(this.isUserLoggedIn) {
        this.isUserAdmin = this.userConnected?.admin;
      }else {
        this.isUserAdmin = false;
      }
    });

  }
  
  getActivityName() {
	  
	  return this.dataSharingService.isConsultant() ? "Absences" : "Activity";

  }

  addEsnDemo() {
    this.beforeCallServer("addEsnDemo");
    this.esnService.addEsnDemo().subscribe(
      data => {
        this.afterCallServer("addEsnDemo", data)
        console.log(JSON.stringify(data))
        
        if (!this.isError()) {
          this.addInfo("l'Esn Demo a bien \u00e9t\u00e9 ajout\u00e9e", false)
        }
        this.router.navigate(["/esn_app"]);

      }, error => {
        this.addErrorFromErrorOfServer("getEsns", error);
        ////console.log(error);
        // this.addError(error)
      }
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

