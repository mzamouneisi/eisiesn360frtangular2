import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsultantService } from 'src/app/service/consultant.service';
import { UtilsService } from 'src/app/service/utils.service';
import { DataSharingService } from "../../service/data-sharing.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-user-connected',
  templateUrl: './user-connected.component.html',
  styleUrls: ['./user-connected.component.css']
})
export class UserConnectedComponent extends MereComponent {

  // userConnected: Consultant;
  // info: string;

  constructor(
    public dialogRef: MatDialogRef<UserConnectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private consultantService: ConsultantService

    , public utils: UtilsService
    , public dataSharingService: DataSharingService) {
      super(utils, dataSharingService);

  }

  ngOnInit() {
    super.ngOnInit()
    // this.setUserConnected(this.userConnected);
    ////////////console.log("UserConnectedComponent: data=", this.data)
  }

  close() {
    this.dialogRef.close();
  }

  isLoggedIn() {
    return this.dataSharingService.isLoggedIn();
  }

  public logout(): void {
    this.dataSharingService.logout();
    this.setUserConnected(null);
  }

  changePassword(password) {
    this.userConnected.password = password;

    this.setUserConnected(this.userConnected)
    
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
