import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { IMyDpOptions } from "mydatepicker";
import { Address } from 'src/app/model/address';
import { Consultant } from "../../model/consultant";
import { ConsultantService } from "../../service/consultant.service";
import { DataSharingService } from "../../service/data-sharing.service";
import { UtilsService } from "../../service/utils.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends MereComponent {

  btnSaveTitle: string = "save"
  myObj: Consultant;
  myDatePickerOptions: IMyDpOptions = UtilsService.myDatePickerOptions;

  constructor(private router: Router
    , private consultantService: ConsultantService
    // , private esnService : EsnService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    if (!this.dataSharingService.isLoggedIn()) {
      // this.router.navigate(['/login'])
      if (!this.userConnected && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }

    }
    this.myObj = this.dataSharingService.userConnected

    if (this.myObj && this.myObj.address == null) {
      this.myObj.address = new Address();
    }
  }

  onSubmit() {
    console.log("profile onSubmit deb")
    this.myObj.username = this.myObj.email;
    //////////console.log("*************" + JSON.stringify(this.myObj))
    this.beforeCallServer("onSubmit");
    this.consultantService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        this.dataSharingService.userConnected = this.myObj;
        this.setUserConnected(this.userConnected)
        this.dataSharingService.saveTokenUser(this.myObj)

        if (!this.isError()) {
          this.dataSharingService.gotoMyProfile()
          console.log("profile onSubmit fin no error")
        }
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);

      }
    );
  }


}
