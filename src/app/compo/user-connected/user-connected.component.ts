import {Component, OnInit, Inject} from '@angular/core';

import {Consultant} from 'src/app/model/consultant';
import {AuthService} from 'src/app/auth/services/auth.service';
import {ConsultantService} from 'src/app/service/consultant.service';
import {UtilsService} from 'src/app/service/utils.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DataSharingService} from "../../service/data-sharing.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-user-connected',
  templateUrl: './user-connected.component.html',
  styleUrls: ['./user-connected.component.css']
})
export class UserConnectedComponent extends MereComponent {

  userConnected: Consultant;
  info: string;

  constructor(
    public dialogRef: MatDialogRef<UserConnectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private authService: AuthService
    , private consultantService: ConsultantService
    , public utils: UtilsService
    , protected dataSharingService: DataSharingService) {
      super(utils, dataSharingService);

  }

  ngOnInit() {
    this.setUserConnected();
    ////////////console.log("UserConnectedComponent: data=", this.data)
  }

  close() {
    this.dialogRef.close();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public logout(): void {
    this.authService.logout();
    this.setUserConnected();
  }

  setUserConnected() {
    this.userConnected = DataSharingService.userConnected
  }

  changePassword(password) {
    this.userConnected.password = password;
    
    this.beforeCallServer("changePassword")
    this.consultantService.savePost(this.userConnected).subscribe(
      data => {
        this.afterCallServer("changePassword", data)
        if (!this.isError()) this.addInfo( "password changed.")

      },
      error => {
        this.addErrorFromErrorOfServer("changePassword", error);
        //console.log(error);
      }
    );
  }

}
