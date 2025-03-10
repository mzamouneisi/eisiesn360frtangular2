import { Component, Input } from '@angular/core';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent extends MereComponent {

  @Input() title: string = "Chargement...";

  constructor(public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private utilsIhm: UtilsIhmService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
  }

}
