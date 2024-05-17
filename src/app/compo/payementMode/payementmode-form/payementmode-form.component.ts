import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { PayementMode } from "../../../model/payementMode";
import { PayementModeService } from "../../../service/payement-mode.service";
import { UtilsService } from "../../../service/utils.service";
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-payementmode-form',
  templateUrl: './payementmode-form.component.html',
  styleUrls: ['./payementmode-form.component.css']
})
export class PayementmodeFormComponent extends MereComponent {

  title = 'Payement Mode Form';
  btnSaveTitle = 'Add';
  isAdd: string;

  @Input()
  myObj: PayementMode;

  @ViewChild('nameHtml', {static: false}) nameHtml: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private payementModeService: PayementModeService
              , public utils: UtilsService
              , public dataSharingService: DataSharingService ) { 
                super(utils, dataSharingService);
              }

  ngOnInit() {
    this.initByPayementMode();
    this.setFocusName();
  }

  setFocusName(): void {
    if (this.nameHtml && this.nameHtml.nativeElement) {
      //console.log('focus');
      this.nameHtml.nativeElement.focus();
    }
  }

  initByPayementMode() {
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    if (this.isAdd == 'true') {
      this.btnSaveTitle = 'Add';
      this.title = 'Nouvelle Mode Payement';
      this.myObj = new PayementMode();
    } else {
      this.btnSaveTitle = 'Save';
      this.title = 'Edit Payement Mode';
      const payementModeP: PayementMode = this.payementModeService.getPayementMode();

      if (payementModeP != null) { this.myObj = payementModeP; } else if (this.myObj == null) { this.myObj = new PayementMode(); }
    }
  }

  onSubmit() {
    //console.log('onSubmit: myObj=', this.myObj);
    this.beforeCallServer("onSubmit");
    this.payementModeService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) { this.gotoPayementsModesList(); }
      },
      error => {
        //console.log('error:', error);
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }


  gotoPayementsModesList() {
    this.clearInfos();
    this.router.navigate(['/payementmode_list']);
  }

}
