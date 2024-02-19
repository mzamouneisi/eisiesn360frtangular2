import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UtilsService } from "../../../service/utils.service";
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';


@Component({
  selector: 'app-notefrais-dashboard',
  templateUrl: './notefrais-dashboard.component.html',
  styleUrls: ['./notefrais-dashboard.component.css']
})
export class NotefraisDashboardComponent extends MereComponent {

  constructor(private router: Router,
    public utils: UtilsService,
    protected dataSharingService: DataSharingService  ) {
      super(utils, dataSharingService);

  }



  ngOnInit(): void {
    
  }

}
