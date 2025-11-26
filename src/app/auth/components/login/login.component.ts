import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { SignupDialogComponent } from 'src/app/compo/_dialogs/signup-dialog/signup-dialog.component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Credentials } from '../../credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials('', '');
  info = "";
  error = "";

  constructor(private dataSharingService: DataSharingService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {

    let lastUserName = this.dataSharingService.getLastUserName()
    console.log("login ngOnInit deb lastUserName : ", lastUserName)
    if (this.dataSharingService.isLoggedIn()) {
      this.dataSharingService.gotoMyProfile()
      //  this.authService.gotoLogin()
    }
    if (!this.credentials.username) this.credentials.username = lastUserName;
    console.log("login ngOnInit fin : credentials : ", this.credentials)
  }

  /**
   * LOGIN function 
   */
  public login(): void {
    this.dataSharingService.login(this.credentials, this);
  }

  goToSignup() {
    this.dataSharingService.IsAddEsnAndResp = true
    // this.dataSharingService.navigateTo("inscription");
    this.router.navigate(["inscription"]);
  }

  goToSignup00() {
    this.dataSharingService.IsAddEsnAndResp = true
    this.dialog.open(SignupDialogComponent, {
      width: '900px',
      height: '700px',
      disableClose: true
    });
  }

}
