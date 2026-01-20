import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsultantService } from 'src/app/service/consultant.service';
import { UtilsService } from 'src/app/service/utils.service';
import { PasswordValidatorService } from 'src/app/service/password-validator.service';
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
  passwordErrors: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<UserConnectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private consultantService: ConsultantService

    , public utils: UtilsService
    , public dataSharingService: DataSharingService,
    private passwordValidator: PasswordValidatorService) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    super.ngOnInit()
    // this.setUserConnected(this.userConnected);
    ////////////console.log("UserConnectedComponent: data=", this.data)
  }

  close() {
    console.log("UserConnectedComponent close() called")
    this.dialogRef.close();
    console.log("UserConnectedComponent closed")
  }

  isLoggedIn() {
    return this.dataSharingService.isLoggedIn();
  }

  public logout(): void {
    this.dataSharingService.logout();
    this.setUserConnected(null);
  }

  validatePassword(password: string): void {
    const result = this.passwordValidator.validate(password);
    this.passwordErrors = result.errors;
  }

  changePassword(password) {
    this.userConnected.password = password;

    this.setUserConnected(this.userConnected)

    this.beforeCallServer("changePassword")
    this.consultantService.savePost(this.userConnected).subscribe(
      data => {
        this.afterCallServer("changePassword", data)
        console.log("changePassword this.isError() : ", this.isError())
        if (!this.isError()) this.addInfo("password changed.")
        // this.isLoading = false;
        this.close();
        this.dataSharingService.logout();
        this.dataSharingService.router.navigate(["/"]);

      },
      error => {
        console.log("ERROR changePassword : ", error)
        this.addErrorFromErrorOfServer("changePassword", error);
      }
    );
  }

}
