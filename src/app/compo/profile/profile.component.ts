import {Component, Input, OnInit} from '@angular/core';
import {Consultant} from "../../model/consultant";
import {ActivatedRoute, Router} from "@angular/router";
import {ConsultantService} from "../../service/consultant.service";
import {UtilsService} from "../../service/utils.service";
import {DataSharingService} from "../../service/data-sharing.service";
import {AuthService} from "../../auth/services/auth.service";
import {IMyDateModel, IMyDpOptions} from "mydatepicker";
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
    , private consultantService: ConsultantService,
              private authService: AuthService
              , public utils: UtilsService
              , protected dataSharingService: DataSharingService  ) {
                super(utils, dataSharingService);

  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'])
    }
    this.myObj = DataSharingService.userConnected
  }

  onSubmit() {
    this.myObj.username = this.myObj.email;
    //////////console.log("*************" + JSON.stringify(this.myObj))
    this.beforeCallServer("onSubmit");
    this.consultantService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        DataSharingService.userConnected = this.myObj;
        this.authService.saveTokenUser(this.myObj)
        
        if (!this.isError()) {
          this.router.navigate(['/my-profile']);
        } 
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        
      }
    );
  }


}
